import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, fromEvent, iif, merge, Observable, of, Subject, zip } from 'rxjs';
import { filter, map, mergeMap, publish, reduce, shareReplay, switchMap, takeWhile, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CacheService } from '../../cache/cache.service';
import { UserSignInService } from '../../user/user-sign-in.service';
import { UserService } from '../../user/user.service';
import { Criterium, Item } from '../items/items.model';
import { ItemsService } from '../items/items.service';
import { UserContent, UserContentEvent } from './user-content.model';

@Injectable({
  providedIn: 'root'
})
export class UserContentService {

  readonly STORAGE_KEY = 'mel-user-content';

  changes$ = new Subject<UserContentEvent>();
  content$: BehaviorSubject<UserContent>;
  ready$: BehaviorSubject<boolean>;

  content: UserContent;
  private hasChanged = false;

  constructor(
    private http: HttpClient,
    private userSignInService: UserSignInService,
    private userService: UserService,
    private cacheService: CacheService,
    private itemsService: ItemsService
  ) {
    const localContent = localStorage.getItem(this.STORAGE_KEY);
    this.content = localContent ? JSON.parse(localContent) : this.defaultUserContentValue();
    this.content$ = new BehaviorSubject<UserContent>(this.content);
    this.ready$ = new BehaviorSubject<boolean>(false);

    // this.userSignInService.signedIn$.subscribe(signedIn => {
    //   if (this.userService.user && this.content.user !== this.userService.user.sub) {
    //     this.content = this.defaultUserContentValue();
    //   }
    //   if (signedIn) {
    //     this.getUserContentFromBackend().subscribe(userContent => {
    //       this.getHandler(userContent);
    //     });
    //   }
    // });
    // fromEvent(document, 'visibilitychange').pipe(filter(() => this.userSignInService.isSignedIn())).subscribe(() => {
    //   if (document.visibilityState === 'hidden' && this.hasChanged) {
    //     this.update().subscribe(() => {
    //       this.hasChanged = false;
    //     });
    //   }
    //   if (document.visibilityState === 'visible') {
    //     this.getUserContentFromBackend().subscribe(userContent => {
    //       this.getHandler(userContent);
    //     });
    //   }
    // });

    const visibile$ = fromEvent(document, 'visibilitychange').pipe(
      filter(() => this.userSignInService.isSignedIn()),
      map(() => document.visibilityState === 'visible')
    );
    // const signedIn$ = this.userSignInService.signedIn$.pipe(
    //   // tap(() => {
    //   //   console.log((this.userService.user && this.content.user !== this.userService.user.sub));
    //   //   // if (this.userService.user && this.content.user !== this.userService.user.sub) {
    //   //   //   this.content = this.defaultUserContentValue();
    //   //   // }
    //   // })
    // );
    const signedIn$ = this.userSignInService.signedIn$;

    merge(signedIn$, visibile$).pipe(
      switchMap((shouldGetDataFromBackend) => {
        if (shouldGetDataFromBackend) {
          return this.getUserContentFromBackend().pipe(
            switchMap(userContent => this.getHandler(userContent)),
            switchMap((changed) => this.retrieveItems().pipe(map(() => changed)))
          );
        }
        return of(false);
      }),
    ).subscribe({
      next: (changed) => {
        this.ready$.next(true);
        console.log('ready');
        if (changed) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.content));
          this.content$.next(this.content);
        }
      }
    });


    // On changes.
    this.changes$.subscribe({
      next: (event) => {
        this.content.modified = Date.now();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.content));
        this.hasChanged = true;
        if (!['silent'].includes(event.type)) {
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
    return this.content.closet.findIndex(vi => vi.id === variantId) !== -1;
  }

  isInWishlist(item: Item): boolean {
    const variantId = this.buildVariantId(item);
    return this.content.wishlist.findIndex(vi => vi.id === variantId) !== -1;
  }

  addToCloset(item: Item): void {
    const variantId = this.buildVariantId(item);
    if (!this.content.closet.find(vi => vi.id === variantId)) {
      this.content.closet.push({ id: variantId, wantToSell: false });
      this.content.wishlist = this.content.wishlist.filter(vi => vi.id !== variantId);
      this.changes$.next({ type: 'add', content: this.content, item, id: variantId });
    }
  }

  removeFromCloset(item: Item): void {
    const variantId = this.buildVariantId(item);
    if (this.content.closet.find(vi => vi.id === variantId)) {
      this.content.closet = this.content.closet.filter(vi => vi.id !== variantId);
      this.changes$.next({ type: 'remove', content: this.content, item, id: variantId });
    }
  }

  addToWishlist(item: Item): void {
    const variantId = this.buildVariantId(item);
    if (!this.content.wishlist.find(vi => vi.id === variantId)) {
      this.content.wishlist.push({ id: variantId });
      this.content.closet = this.content.closet.filter(vi => vi.id !== variantId);
      this.changes$.next({ type: 'add', content: this.content, item, id: variantId });
    }
  }

  removeFromWishlist(item: Item): void {
    const variantId = this.buildVariantId(item);
    if (this.content.wishlist.find(vi => vi.id === variantId)) {
      this.content.wishlist = this.content.wishlist.filter(vi => vi.id !== variantId);
      this.changes$.next({ type: 'remove', content: this.content, item, id: variantId });
    }
  }

  toggleWanToSellPropertyCloset(item: Item): boolean {
    const variantId = this.buildVariantId(item);
    const variantItem = this.content.closet.find(vi => vi.id === variantId);
    if (variantItem) {
      variantItem.wantToSell = !variantItem.wantToSell;
      this.changes$.next({ type: 'silent', content: this.content, item, id: variantId });
      return variantItem.wantToSell;
    }
    return false;
  }

  updateCoordinations(): void {
    this.changes$.next({ type: 'update-coordinations', content: this.content });
  }

  buildVariantId(item: Item): string {
    return `${item._id}:${item.variants[0].colors.map(c => c._id).join(',')}`;
  }

  markAsChanged(): void {
    this.hasChanged = true;
    this.changes$.next({ type: 'silent', content: this.content });
  }

  private getHandler(userContent: UserContent): Observable<boolean> {
    let changed = false;
    if (this.content.user === userContent.user) {
      if (this.content.modified > userContent.modified) {
        this.update();
      } else if (this.content.modified < userContent.modified) {
        this.content = userContent;
        changed = true;
      }
    } else {
      // Case: user play with the app without registration and now created an account.
      if (this.content.user === undefined) {
        this.content.user = userContent.user;
        this.content._id = userContent._id;
        this.markAsChanged();
      } else {
        // TODO: ask user to choose between locale and backend values.
        this.content = userContent;
        changed = true;
      }
    }
    return of(changed);
  }

  private defaultUserContentValue(): UserContent {
    return {
      coordinations: [],
      closet: [],
      wishlist: [],
      user: undefined,
      modified: Date.now()
    };
  }

  private retrieveItems(): Observable<boolean> {
    const variantItems = [
      ...this.content.closet,
      ...this.content.wishlist
    ];
    if (variantItems.length === 0) {
      return of(true);
    }

    return zip(...variantItems.map(variantItem => this.cacheService.match(variantItem.id).pipe(
      map(cacheResponse => {
        return cacheResponse ? undefined : variantItem;
      })
    ))).pipe(
      // Keep non cached items only.
      map(items => items.filter(i => i !== undefined && !i._wrongVariantId)),
      // Build criteria to run the findByCriteria method and get all new items.
      // Cache variantItems.
      switchMap(items => {
        // There is no new items.
        if (items.length === 0) {
          return of(true);
        }
        const criteria: Criterium[] = items.reduce((acc, item) => {
          if (item) {
            const itemId = item?.id.split(':')[0];
            if (!acc.includes(itemId)) {
              acc.push(itemId);
            }
          }
          return acc;
        }, [] as string[]).map(id => ({ type: 'id', value: id }));
        if (criteria.length === 0) {
          return of(true);
        }
        return this.itemsService.findByCriteria(criteria, 0, 500).pipe(map(results => {
          for (const resultItem of results) {
            const variantItemIds = resultItem.variants.map(v => `${resultItem._id}:${v.colors.map(c => c._id).join(',')}`);
            for (const resultVariant of resultItem.variants) {
              const variantId = `${resultItem._id}:${resultVariant.colors.map(c => c._id).join(',')}`;
              if (items.find(i => i?.id === variantId)) {
                const clone = JSON.parse(JSON.stringify(resultItem)) as Item;
                this.cacheService.put(variantId, { ...clone, variants: [clone.variants[0]] });
              }
            }
            const wrongVariantItems = variantItems
              .filter(vi => resultItem._id && vi.id.includes(resultItem._id) && !variantItemIds.includes(vi.id));
            wrongVariantItems.forEach(wvi => wvi._wrongVariantId = true);
            if (wrongVariantItems.length > 0) {
              this.markAsChanged();
            }
          }
          return true;
        }));
      }),
    );

    // zip(...cachedVariantItems$).pipe(
    //   filter(cacheResponse => !cacheResponse),
    //   switchMap(cacheResponse)
    // );

    // const items$ = this.content.filter(item => !item._wrongVariantId).map(item => this.cacheService.match(item.id).pipe(
    //   switchMap(cacheResponse => {
    //     if (cacheResponse) {
    //       return from(cacheResponse.json()) as Observable<Item>;
    //     }
    //     const [itemId, colorIds] = item.id.split(':');
    //     return this.itemsService.findById(itemId).pipe(
    //       map(response => {
    //         if (response) {
    //           const selectedVariant = response.variants.filter(v => v.colors.map(c => c._id).join(',') === colorIds)[0] || undefined;
    //           if (selectedVariant) {
    //             const freshItem = {
    //               ...JSON.parse(JSON.stringify(response)),
    //               variants: [selectedVariant],
    //             };
    //             this.cacheService.put(item.id, freshItem);
    //             return freshItem;
    //           }
    //         }
    //       })
    //     );
    //   }),
    //   map(almostReadyitem => {
    //     if (almostReadyitem) {
    //       almostReadyitem.wantToSell = item.wantToSell;
    //       // Keep the variant id for reuse in the trackByFn function.
    //       almostReadyitem._variantId = this.userContentService.buildVariantId(almostReadyitem);
    //       item._wrongVariantId = false;
    //     } else {
    //       item._wrongVariantId = true;
    //       this.userContentService.markAsChanged();
    //     }
    //     return almostReadyitem;
    //   })
    // ));
    // return zip(...items$);
  }
}
