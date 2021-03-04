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

export interface Criterium {
  type: 'brand' | 'color' | 'feature' | 'category' | 'keyword';
  name: string;
  parents?: string[];
}

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
  results: any[] = [];
  selectedCriteria: Criterium[] = [];

  private unsubscriber = new Subject();

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
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
        ...brand,
      });
    });
    (this.activatedRoute.snapshot.data.colors as Color[]).forEach(color => {
      this.criteria.push({
        type: 'color',
        ...color,
      });
    });
    (this.activatedRoute.snapshot.data.features as Feature[]).forEach(feature => {
      this.criteria.push({
        type: 'feature',
        ...feature,
      });
    });
    (this.activatedRoute.snapshot.data.categories as Category[]).forEach(category => {
      this.criteria.push({
        type: 'category',
        name: category.name,
      });
      if (category.children) {
        category.children.forEach(category2 => {
          this.criteria.push({
            type: 'category',
            name: category2.name,
            parents: [category.name],
          });
          if (category2.children) {
            category2.children.forEach(category3 => {
              this.criteria.push({
                type: 'category',
                name: category3.name,
                parents: [category.name, category2.name],
              });
            });
          }
        });
      }
    });

    this.form.valueChanges.pipe(takeUntil(this.unsubscriber)).subscribe(values => {
      this.selectedCriteria = values.criteria;
    });
  }

  searchCriterias(term: string, item: Criterium): boolean {
    term = term.toLowerCase();
    return item.name.toLowerCase().indexOf(term) > -1 || item.type.toLowerCase().indexOf(term) > -1;
  }

  addKeywords(term: string): Criterium {
    return {
      name: term,
      type: 'keyword',
    };
  }

}
