import { trigger, transition, style, animate, query, useAnimation } from '@angular/animations';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { itemsEnterAnimation, itemsLeaveAnimation } from 'src/app/features/animations/items.animation';
import { Criterium, Item } from 'src/app/features/resources/items/items.model';
import { ItemsService } from 'src/app/features/resources/items/items.service';
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
export class SearchComponent implements OnInit, OnDestroy {

  @HostBinding('@pageAnimation') private pageAnimation = true;

  results: Item[] = [];
  recentlyAddedItems: Item[] = [];
  signedIn = false;

  private unsubscriber = new Subject();

  constructor(
    private userSignInService: UserSignInService,
    private itemsService: ItemsService
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
  }

  search(criteria: Criterium[]): void {
    this.results = [];
    this.itemsService.findByCriteria(criteria).subscribe(response => {
      const colorCriteria = criteria.filter(crit => crit.type === 'color');
      const displayedItems = [];
      for (const item of response) {
        displayedItems.push(...item.variants
          .filter(variant => {
            return colorCriteria.length > 0 ? colorCriteria.every(crit => variant.colors.some(color => color.name === crit.value)) : true;
          })
          .map(variant => {
            return {
              ...item,
              variants: [variant]
            };
          })
        );
      }
      this.results = displayedItems;
    });
  }

}
