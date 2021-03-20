import { trigger, transition, style, animate, query, useAnimation } from '@angular/animations';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';
import { itemsLeaveAnimation, itemsEnterAnimation } from 'src/app/features/animations/items.animation';
import { Criterium, Item } from 'src/app/features/resources/items/items.model';
import { ItemsService } from 'src/app/features/resources/items/items.service';
import { UserContentService } from 'src/app/features/resources/user-content/user-content.service';
import { ThemeService } from 'src/app/features/theme/theme.service';
import { UserSignInService } from 'src/app/features/user/user-sign-in.service';

@Component({
  templateUrl: './my-wishlist.component.html',
  styleUrls: ['./my-wishlist.component.scss'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('330ms linear', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0%)' }),
        animate('330ms linear', style({ opacity: 0, transform: 'translateY(5%)' }))
      ]),
    ]),
    trigger('items', [
      transition('* <=> *', [
        query(':leave', [
          useAnimation(itemsLeaveAnimation),
        ], { optional: true }),
        query(':enter', [
          useAnimation(itemsEnterAnimation),
        ], { optional: true })
      ])
    ])
  ]
})
export class MyWishlistComponent implements OnInit, OnDestroy {

  @HostBinding('@pageAnimation') private pageAnimation = true;

  results: Item[] = [];
  signedIn = false;
  footerEE = 0;
  content: { id: string }[] = [];
  totalEstimatedPrice = 0;
  nbItems = 0;
  selectedCriteria: Criterium[] = [];

  private unsubscriber = new Subject();
  private items: Item[] = [];

  constructor(
    private userSignInService: UserSignInService,
    private userContentService: UserContentService,
    private itemsService: ItemsService,
    public themeService: ThemeService
  ) { }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  ngOnInit(): void {
    this.userSignInService.signedIn$.pipe(takeUntil(this.unsubscriber)).subscribe(signedIn => {
      this.signedIn = signedIn;
    });

    this.userContentService.content$.pipe(
      filter(content => content !== null),
      takeUntil(this.unsubscriber)
    ).subscribe(content => {
      this.content = content.wishlist;
      this.nbItems = this.content.length;
      this.getItems().pipe(takeUntil(this.unsubscriber)).subscribe(items => {
        this.items = items;
        this.results = this.filterItems(this.items, this.selectedCriteria);
        this.totalEstimatedPrice = this.results.map(item => item.estimatedPrice || 0).reduce((count, value) => count + value, 0);
      });
    });
  }

  onFilter(criteria: Criterium[]): void {
    this.results = [];
    setTimeout(() => {
      this.selectedCriteria = criteria;
      this.results = this.filterItems(this.items, this.selectedCriteria);
    });
  }

  remove(item: Item): void {
    this.userContentService.removeFromWishlist(item);
  }

  toggleFooterEE(): void {
    this.footerEE = (this.footerEE + 1) % 2;
  }

  private getItems(): Observable<Item[]> {
    const criteria: Criterium[] = this.content.reduce((acc, value) => {
      const itemId = value.id.split(':')[0];
      if (!acc.find(i => i === itemId)) {
        acc.push(itemId);
      }
      return acc;
    }, [] as string[]).map(id => ({ type: 'id', value: id }));
    return this.itemsService.findByCriteria(criteria).pipe(
      map(response => {
        return response.reduce((acc, item) => {
          for (const variant of item.variants) {
            const vid = `${item._id}:${variant.colors.map(c => c._id).join(',')}`;
            const wishlistData = this.content.find(vi => vi.id === vid);
            if (wishlistData) {
              acc.push({
                ...item,
                variants: [variant],
              });
            }
          }
          return acc;
        }, [] as Item[]);
      })
    );
  }

  filterItems(items: Item[], criteria: Criterium[]): Item[] {
    const brandCriteria = criteria.filter(crit => crit.type === 'brand');
    const categoryCriteria = criteria.filter(crit => crit.type === 'category');
    return items.filter(item => {
      let view = criteria.length === 0;
      if (brandCriteria.length) {
        view = brandCriteria.map(crit => crit.value).includes(item.brand.name);
      }
      if (categoryCriteria.length) {
        view = categoryCriteria.map(crit => crit.value).includes(item.category.name);
        if (!view && item.category.parent) {
          view = categoryCriteria.map(crit => crit.value).includes(item.category.parent.name);
          if (!view && item.category.parent.parent) {
            view = categoryCriteria.map(crit => crit.value).includes(item.category.parent.parent.name);
          }
        }
      }
      return view;
    });
  }

}
