import { trigger, transition, style, animate } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { interval, Subject } from 'rxjs';
import { map, publish, takeUntil, tap } from 'rxjs/operators';
import { Criterium, Item } from 'src/app/features/resources/items/items.model';
import { ItemsService } from 'src/app/features/resources/items/items.service';
import { UserContentService } from 'src/app/features/resources/user-content/user-content.service';
import { UserSignInService } from 'src/app/features/user/user-sign-in.service';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
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
    trigger('searching', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10%)' }),
        animate('330ms linear', style({ opacity: 1, transform: 'translateY(0%)' }))
      ])
    ])
  ]
})
export class SearchComponent implements OnInit, OnDestroy {

  @HostBinding('@pageAnimation') private pageAnimation = true;

  results: Item[] = [];
  recentlyAddedItems: Item[] = [];
  signedIn = false;
  displayLoader = false;
  loading = false;
  searching = 0;
  paginationConfig: PaginationInstance = {
    id: 'mel-pager',
    itemsPerPage: 20,
    currentPage: 1
  };

  private unsubscriber = new Subject();
  private breakpoints = ['(min-width: 700px)', '(min-width: 900px)', '(min-width: 1367px)'];
  private breakpointsItemsPerPageMap: { [key: string]: number } = {
    '(min-width: 700px)': 10,
    '(min-width: 900px)': 10,
    '(min-width: 1367px)': 10,
  };

  constructor(
    private userSignInService: UserSignInService,
    private itemsService: ItemsService,
    private userContentService: UserContentService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  ngOnInit(): void {
    this.userSignInService.signedIn$.pipe(takeUntil(this.unsubscriber)).subscribe(signedIn => {
      this.signedIn = signedIn;
    });
    this.itemsService.recentlyAdded().subscribe(response => {
      this.recentlyAddedItems = response || [];
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

  search(criteria: Criterium[]): void {
    this.results = [];
    this.loading = true;
    const search$ = this.itemsService.findByCriteria(criteria).pipe(
      map(response => {
        const colorCriteria = criteria.filter(crit => crit.type === 'color');
        const displayedItems = [];
        for (const item of response) {
          displayedItems.push(...item.variants
            .filter(variant => {
              return colorCriteria.length > 0 ? colorCriteria.every(crit => variant.colors.some(color => color.name === crit.value)) : true;
            })
            .map(variant => {
              const displayedItem = {
                ...item,
                variants: [variant]
              };
              displayedItem._variantId = this.userContentService.buildVariantId(item);
              return displayedItem;
            })
          );
        }
        this.loading = false;
        this.displayLoader = false;
        this.results = displayedItems;
      }),
      takeUntil(this.unsubscriber)
    );
    this.searching = 0;
    publish()(interval(500).pipe(
      tap(() => {
        this.displayLoader = true;
        this.searching += 500;
      }),
      takeUntil(search$)
    )).connect();
  }

  trackByFn(index: number, item: Item): string {
    return item._variantId as string;
  }

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
  }

}
