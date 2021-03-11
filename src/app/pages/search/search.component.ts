import { trigger, transition, style, animate } from '@angular/animations';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Brand } from 'src/app/features/resources/brands/brands.model';
import { Category } from 'src/app/features/resources/categories/categories.model';
import { Color } from 'src/app/features/resources/colors/colors.model';
import { Feature } from 'src/app/features/resources/features/features.model';
import { Criterium, Item } from 'src/app/features/resources/items/items.model';
import { ItemsService } from 'src/app/features/resources/items/items.service';
import { UserSignInService } from 'src/app/features/user/user-sign-in.service';
import { UserService } from 'src/app/features/user/user.service';

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
    ])
  ]
})
export class SearchComponent implements OnInit, OnDestroy {

  @HostBinding('@pageAnimation') private pageAnimation = true;

  form: FormGroup;
  criteria: Criterium[] = [];
  results: Item[] = [];
  selectedCriteria: Criterium[] = [];
  displayAddItem = false;

  private unsubscriber = new Subject();

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userSignInService: UserSignInService,
    private userService: UserService,
    private itemsService: ItemsService
  ) {
    this.form = this.fb.group({
      criteria: [''],
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  ngOnInit(): void {
    (this.activatedRoute.snapshot.data.brands as Brand[]).forEach(brand => {
      this.criteria.push({
        type: 'brand',
        value: brand.name,
        displayValue: brand.name,
      });
    });
    (this.activatedRoute.snapshot.data.colors as Color[]).forEach(color => {
      this.criteria.push({
        type: 'color',
        value: color.name,
        displayValue: color.name,
      });
    });
    (this.activatedRoute.snapshot.data.features as Feature[]).forEach(feature => {
      this.criteria.push({
        type: 'feature',
        value: feature.name,
        displayValue: feature.name,
      });
    });
    (this.activatedRoute.snapshot.data.categories as Category[]).forEach(category => {
      this.criteria.push({
        type: 'category',
        value: category.name,
        displayValue: category.name,
      });
      if (category.children) {
        category.children.forEach(category2 => {
          this.criteria.push({
            type: 'category',
            value: category2.name,
            displayValue: category2.name,
            parents: [category.name],
          });
          if (category2.children) {
            category2.children.forEach(category3 => {
              this.criteria.push({
                type: 'category',
                value: category3.name,
                displayValue: category3.name,
                parents: [category.name, category2.name],
              });
            });
          }
        });
      }
    });

    this.form.valueChanges.pipe(takeUntil(this.unsubscriber)).subscribe(values => {
      this.selectedCriteria = values.criteria;
      this.search();
    });

    this.userSignInService.signedIn$.pipe(takeUntil(this.unsubscriber)).subscribe(signedIn => {
      this.displayAddItem = signedIn;
      if (signedIn) {
        if (!this.criteria.find(crit => crit.type === 'own')) {
          this.criteria.push({
            type: 'own',
            displayValue: 'My items',
            value: this.userService.user?.email as string
          });
        }
      } else {
        this.criteria = this.criteria.filter(crit => crit.type !== 'own');
      }
    });
  }

  searchCriterias(term: string, item: Criterium): boolean {
    term = term.toLowerCase();
    return item.displayValue.toLowerCase().indexOf(term) > -1 || item.type.toLowerCase().indexOf(term) > -1;
  }

  addKeywords(term: string): Criterium {
    return {
      value: term,
      displayValue: term,
      type: 'keyword',
    };
  }

  search(): void {
    this.itemsService.findByCriteria(this.selectedCriteria).subscribe(response => {
      const colorCriteria = this.selectedCriteria.filter(crit => crit.type === 'color');
      let displayedItems = [];
      for (const item of response) {
        displayedItems.push(...item.variants
          .filter(variant => {
            return colorCriteria.length > 0 ? colorCriteria.every(crit => variant.colors.some(color => color.name === crit.value)) : true
          })
          .map(variant => {
            return {
              ...item,
              variants: [variant]
            }
          })
        );
      }
      this.results = displayedItems;
    });
  }

}
