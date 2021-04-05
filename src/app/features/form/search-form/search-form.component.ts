import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Brand } from '../../resources/brands/brands.model';
import { Category } from '../../resources/categories/categories.model';
import { Color } from '../../resources/colors/colors.model';
import { Feature } from '../../resources/features/features.model';
import { Criterium } from '../../resources/items/items.model';
import { UserSignInService } from '../../user/user-sign-in.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  exportAs: 'searchForm',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormComponent implements OnInit {

  @Output() search = new EventEmitter<Criterium[]>();

  @Input() enableMyItems = true;
  @Input() enableBrands = true;
  @Input() enableColors = true;
  @Input() enableFeatures = true;
  @Input() enableCategories = true;
  @Input() enableKeywords = true;
  @Input() placeholder = '';

  form: FormGroup;
  criteria: Criterium[] = [];
  selectedCriteria: Criterium[] = [];
  signedIn = false;
  private unsubscriber = new Subject();

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userSignInService: UserSignInService,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      criteria: [''],
    });
  }

  ngOnInit(): void {
    if (this.enableBrands) {
      (this.activatedRoute.snapshot.data.brands as Brand[]).forEach(brand => {
        this.criteria.push({
          type: 'brand',
          value: brand.name,
          displayValue: brand.shortname ? `${brand.name} (${brand.shortname})` : brand.name,
        });
      });
    }
    if (this.enableColors) {
      (this.activatedRoute.snapshot.data.colors as Color[]).forEach(color => {
        this.criteria.push({
          type: 'color',
          value: color.name,
          displayValue: color.name,
        });
      });
    }
    if (this.enableFeatures) {
      (this.activatedRoute.snapshot.data.features as Feature[]).forEach(feature => {
        this.criteria.push({
          type: 'feature',
          value: feature.name,
          displayValue: feature.name,
        });
      });
    }
    if (this.enableCategories) {
      (this.activatedRoute.snapshot.data.categories as Category[]).forEach(category => {
        this.criteria.push({
          type: 'category',
          value: category.name,
          displayValue: category.shortname ? `${category.name} (${category.shortname})` : category.name,
          _lvlClass: 'lvl-0',
        });
        if (category.children) {
          category.children.forEach(category2 => {
            this.criteria.push({
              type: 'category',
              value: category2.name,
              displayValue: category2.shortname ? `${category2.name} (${category2.shortname})` : category2.name,
              parents: [category.name],
              _lvlClass: 'lvl-1',
            });
            if (category2.children) {
              category2.children.forEach(category3 => {
                this.criteria.push({
                  type: 'category',
                  value: category3.name,
                  displayValue: category3.shortname ? `${category3.name} (${category3.shortname})` : category3.name,
                  parents: [category.name, category2.name],
                  _lvlClass: 'lvl-2',
                });
              });
            }
          });
        }
      });
    }

    this.form.valueChanges.pipe(takeUntil(this.unsubscriber)).subscribe(values => {
      this.selectedCriteria = values.criteria;
      this.triggerSearch();
    });

    this.userSignInService.signedIn$.pipe(takeUntil(this.unsubscriber)).subscribe(signedIn => {
      this.signedIn = signedIn;
      if (this.enableMyItems) {
        if (signedIn) {
          if (!this.criteria.find(crit => crit.type === 'own')) {
            this.criteria.push({
              type: 'own',
              displayValue: 'My items',
              value: this.userService.user?.sub as string
            });
          }
        } else {
          this.criteria = this.criteria.filter(crit => crit.type !== 'own');
        }
      }
    });
  }

  triggerSearch(): void {
    this.search.emit(this.selectedCriteria);
  }

  searchCriterias(term: string, item: Criterium): boolean {
    term = term.toLowerCase();
    return (item.displayValue && item.displayValue.toLowerCase().indexOf(term) > -1) || item.type.toLowerCase().indexOf(term) > -1;
  }

  addKeywords(term: string): Criterium {
    return {
      value: term,
      displayValue: term,
      type: 'keyword',
    };
  }

}
