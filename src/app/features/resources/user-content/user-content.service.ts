import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { filter, publish, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CacheService } from '../../cache/cache.service';
import { UserSignInService } from '../../user/user-sign-in.service';
import { UserService } from '../../user/user.service';
import { Item } from '../items/items.model';
import { UserContent, UserContentEvent } from './user-content.model';

@Injectable({
  providedIn: 'root'
})
export class UserContentService {

  readonly STORAGE_KEY = 'mel-user-content';

  changes$ = new Subject<UserContentEvent>();
  content$: BehaviorSubject<UserContent>;

  content: UserContent | null;
  private hasChanged = false;

  constructor(
    private http: HttpClient,
    private userSignInService: UserSignInService,
    private userService: UserService,
    private cacheService: CacheService
  ) {
    const localContent = localStorage.getItem(this.STORAGE_KEY);
    const initialContent: UserContent = localContent ? JSON.parse(localContent) : null;
    this.content = initialContent;
    this.content$ = new BehaviorSubject<UserContent>(initialContent);

    this.userSignInService.signedIn$.subscribe(signedIn => {
      if (this.content !== null && this.userService.user && this.content.user !== this.userService.user.sub) {
        this.content = null;
      }
      if (signedIn) {
        this.getUserContentFromBackend().subscribe(userContent => {
          this.getHandler(userContent);
        });
      }
    });
    fromEvent(document, 'visibilitychange').pipe(filter(() => this.userSignInService.isSignedIn())).subscribe(() => {
      if (document.visibilityState === 'hidden' && this.hasChanged) {
        this.update().subscribe(() => {
          this.hasChanged = false;
        });
      }
      if (document.visibilityState === 'visible') {
        this.getUserContentFromBackend().subscribe(userContent => {
          this.getHandler(userContent);
        });
      }
    });
    this.changes$.subscribe((event) => {
      if (this.content) {
        this.content.modified = Date.now();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.content));
        this.hasChanged = true;
        if (event.type !== 'toggle-want-to-sell') {
          this.content$.next(this.content);
        }
        if (event.type === 'add' && event.id) {
          this.cacheService.put(event.id, event.item);
        }
        if (event.type === 'remove' && event.id) {
          this.cacheService.delete(event.id);
        }
      }
    });
  }

  getUserContentFromBackend(): Observable<UserContent> {
    return this.http.get<UserContent>(`${environment.domains.mel}/api/resources/user-contents/me`, {
      headers: new HttpHeaders({
        Authorization: 'auto'
      })
    });
  }

  update(): Observable<UserContent> {
    const obs = this.http.patch<UserContent>(`${environment.domains.mel}/api/resources/user-contents`, this.content, {
      headers: new HttpHeaders({
        Authorization: 'auto'
      })
    }).pipe(shareReplay(1));
    publish()(obs).connect();
    return obs;
  }

  isInCloset(item: Item): boolean {
    const variantId = this.buildVariantId(item);
    if (this.content) {
      return this.content.closet.findIndex(vi => vi.id === variantId) !== -1;
    }
    return false;
  }

  isInWishlist(item: Item): boolean {
    const variantId = this.buildVariantId(item);
    if (this.content) {
      return this.content.wishlist.findIndex(vi => vi.id === variantId) !== -1;
    }
    return false;
  }

  addToCloset(item: Item): void {
    const variantId = this.buildVariantId(item);
    if (this.content && !this.content.closet.find(vi => vi.id === variantId)) {
      this.content.closet.push({ id: variantId, wantToSell: false });
      this.content.wishlist = this.content.wishlist.filter(vi => vi.id !== variantId);
      this.changes$.next({ type: 'add', content: this.content, item, id: variantId });
    }
  }

  removeFromCloset(item: Item): void {
    const variantId = this.buildVariantId(item);
    if (this.content && this.content.closet.find(vi => vi.id === variantId)) {
      this.content.closet = this.content.closet.filter(vi => vi.id !== variantId);
      this.changes$.next({ type: 'remove', content: this.content, item, id: variantId });
    }
  }

  addToWishlist(item: Item): void {
    const variantId = this.buildVariantId(item);
    if (this.content && !this.content.wishlist.find(vi => vi.id === variantId)) {
      this.content.wishlist.push({ id: variantId });
      this.content.closet = this.content.closet.filter(vi => vi.id !== variantId);
      this.changes$.next({ type: 'add', content: this.content, item, id: variantId });
    }
  }

  removeFromWishlist(item: Item): void {
    const variantId = this.buildVariantId(item);
    if (this.content && this.content.wishlist.find(vi => vi.id === variantId)) {
      this.content.wishlist = this.content.wishlist.filter(vi => vi.id !== variantId);
      this.changes$.next({ type: 'remove', content: this.content, item, id: variantId });
    }
  }

  toggleWanToSellPropertyCloset(item: Item): boolean {
    const variantId = this.buildVariantId(item);
    if (this.content) {
      const variantItem = this.content.closet.find(vi => vi.id === variantId);
      if (variantItem) {
        variantItem.wantToSell = !variantItem.wantToSell;
        this.changes$.next({ type: 'toggle-want-to-sell', content: this.content, item, id: variantId });
        return variantItem.wantToSell;
      }
    }
    return false;
  }

  updateCoordinations(): void {
    if (this.content) {
      this.changes$.next({ type: 'update-coordinations', content: this.content });
    }
  }

  buildVariantId(item: Item): string {
    return `${item._id}:${item.variants[0].colors.map(c => c._id).join(',')}`;
  }

  private getHandler(userContent: UserContent): void {
    if (this.content !== null) {
      if (this.content.modified > userContent.modified) {
        this.update();
      } else if (this.content.modified < userContent.modified) {
        this.content = null;
      }
    }
    if (this.content === null) {
      this.content = userContent;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.content));
      this.content$.next(userContent);
    }
  }
}
