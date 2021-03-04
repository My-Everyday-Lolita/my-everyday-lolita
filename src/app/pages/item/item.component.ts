import { trigger, transition, style, animate } from '@angular/animations';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Brand } from 'src/app/features/resources/brands/brands.model';
import { ExtendedCategory } from 'src/app/features/resources/categories/categories.model';
import { Color } from 'src/app/features/resources/colors/colors.model';
import { Feature } from 'src/app/features/resources/features/features.model';
import { TitleService } from 'src/app/features/title/title.service';

@Component({
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
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
export class ItemComponent implements OnInit {

  @HostBinding('@pageAnimation') private pageAnimation = true;

  form: FormGroup;
  id!: string;
  isNew!: boolean;
  brands: Brand[] = [];
  featuresData: Feature[] = [];
  categories: ExtendedCategory[] = [];
  colors: Color[] = [];
  editing = false;

  constructor(
    private title: TitleService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      brand: [null, Validators.required],
      collectionn: [null],
      category: [null],
      features: [null],
      variants: this.fb.array([
        this.fb.group({
          colors: [null, [Validators.required]],
          photo: ['', [Validators.required]]
        })
      ]),
      year: [''],
      japanese: [''],
      measurments: [''],
      estimatedPrice: [null],
      keywords: [null],
    });
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.brands = this.activatedRoute.snapshot.data.brands;
    this.colors = this.activatedRoute.snapshot.data.colors;
    this.featuresData = this.activatedRoute.snapshot.data.features;
    this.categories = (this.activatedRoute.snapshot.data.categories as ExtendedCategory[]).reduce((acc, root) => {
      root.disabled = root.children !== undefined;
      root._lvlClass = 'lvl-0';
      acc.push(root);
      if (root.children) {
        root.children.forEach(child => {
          child.disabled = child.children !== undefined;
          child._lvlClass = 'lvl-1';
          acc.push(child);
          if (child.children) {
            child.children.forEach(leaf => {
              leaf.disabled = false;
              leaf._lvlClass = 'lvl-2';
              acc.push(leaf);
            });
          }
        });
      }
      return acc;
    }, [] as ExtendedCategory[]);
    this.isNew = this.id === 'new';
    this.editing = this.isNew;
    setTimeout(() => {
      if (this.isNew) {
        this.title.set('ITEM.TITLES.NEW');
      }
    });
  }

  get brand(): FormControl {
    return this.form.controls.brand as FormControl;
  }

  get category(): FormControl {
    return this.form.controls.category as FormControl;
  }

  get features(): FormControl {
    return this.form.controls.features as FormControl;
  }

  get variants(): FormArray {
    return this.form.controls.variants as FormArray;
  }

  get year(): FormControl {
    return this.form.controls.year as FormControl;
  }

  get japanese(): FormControl {
    return this.form.controls.japanese as FormControl;
  }

  get measurments(): FormControl {
    return this.form.controls.measurments as FormControl;
  }

  get estimatedPrice(): FormControl {
    return this.form.controls.estimatedPrice as FormControl;
  }

  get keywords(): FormControl {
    return this.form.controls.keywords as FormControl;
  }

  onSubmit(): void {
    console.log(this.form.value);
  }

  addVariant(): void {
    this.variants.push(this.fb.group({
      colors: [null, [Validators.required]],
      photo: ['', [Validators.required]]
    }));
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

}
