import { animate, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { from, Observable, of, Subject, zip } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { CacheService } from 'src/app/features/cache/cache.service';
import { Criterium, Item } from 'src/app/features/resources/items/items.model';
import { UserContentService } from 'src/app/features/resources/user-content/user-content.service';
import { ThemeService } from 'src/app/features/theme/theme.service';
import { UserSignInService } from 'src/app/features/user/user-sign-in.service';

@Component({
  templateUrl: './my-closet.component.html',
  styleUrls: ['./my-closet.component.scss'],
  animations: [
    trigger('closetAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('330ms linear', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0%)' }),
        animate('330ms linear', style({ opacity: 0, transform: 'translateY(5%)' }))
      ]),
    ])
  ]
})
export class MyClosetComponent implements OnInit, OnDestroy {

  @HostBinding('@closetAnimation') private animation = true;

  results: Item[] = [];
  signedIn = false;
  footerEE = 0;
  content: { id: string, wantToSell?: boolean | undefined, _wrongVariantId?: boolean }[] = [];
  nbItems = 0;
  totalEstimatedPrice = 0;
  selectedCriteria: Criterium[] = [];
  paginationConfig: PaginationInstance = {
    id: 'mel-pager',
    itemsPerPage: 20,
    currentPage: 1
  };

  private unsubscriber = new Subject();
  private items: Item[] = [];
  private breakpoints = ['(min-width: 700px)', '(min-width: 900px)', '(min-width: 1367px)'];
  private breakpointsItemsPerPageMap: { [key: string]: number } = {
    '(min-width: 700px)': 10,
    '(min-width: 900px)': 10,
    '(min-width: 1367px)': 10,
  };

  constructor(
    private userSignInService: UserSignInService,
    private userContentService: UserContentService,
    public themeService: ThemeService,
    private cacheService: CacheService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private activatedRoute: ActivatedRoute
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
      this.content = content.closet;
      this.nbItems = this.content.length;
      this.getItems().pipe(takeUntil(this.unsubscriber)).subscribe(items => {
        this.items = items;
        this.results = this.filterItems(this.items, this.selectedCriteria);
        this.totalEstimatedPrice = this.results.map(item => item.estimatedPrice || 0).reduce((count, value) => count + value, 0);
      });
    });

    this.breakpointObserver.observe(this.breakpoints).pipe(takeUntil(this.unsubscriber)).subscribe({
      next: result => {
        const itemsPerPage = Object.entries(result.breakpoints).reduce((acc, [breakpoint, value]) => {
          if (value) {
            acc += this.breakpointsItemsPerPageMap[breakpoint];
          }
          return acc;
        }, 20);
        if (this.paginationConfig.itemsPerPage !== itemsPerPage) {
          this.paginationConfig.itemsPerPage = itemsPerPage;
          this.router.navigate([], { queryParams: { ...this.activatedRoute.snapshot.queryParams, page: 1 }, replaceUrl: true });
        }
      }
    });
  }

  onFilter(criteria: Criterium[]): void {
    this.results = [];
    setTimeout(() => {
      this.selectedCriteria = criteria;
      this.results = this.filterItems(this.items, this.selectedCriteria);
    });
  }

  toggleWantToSellProperty(item: Item): void {
    item.wantToSell = this.userContentService.toggleWanToSellPropertyCloset(item);
  }

  remove(item: Item): void {
    this.userContentService.removeFromCloset(item);
  }

  toggleFooterEE(): void {
    this.footerEE = (this.footerEE + 1) % 3;
  }

  trackByFn(index: number, item: Item): string {
    return item._variantId as string;
  }

  private getItems(): Observable<Item[]> {
    const items$ = this.content.filter(item => !item._wrongVariantId).map(item => this.cacheService.match(item.id).pipe(
      switchMap(cache => cache ? from(cache?.json()) : of(undefined)),
      map((almostReadyitem: Item) => {
        if (almostReadyitem) {
          almostReadyitem.wantToSell = item.wantToSell;
        }
        return almostReadyitem;
      })
    ));
    if (items$.length === 0) {
      return of([]);
    }
    return zip(...items$).pipe(
      map(items => items.filter(i => i !== undefined))
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

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
  }

}
