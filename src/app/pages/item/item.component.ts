import { trigger, transition, style, animate } from '@angular/animations';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, Subject } from 'rxjs';
import { map, publish, takeUntil, tap } from 'rxjs/operators';
import { Brand } from 'src/app/features/resources/brands/brands.model';
import { Category, ExtendedCategory } from 'src/app/features/resources/categories/categories.model';
import { Color } from 'src/app/features/resources/colors/colors.model';
import { Feature } from 'src/app/features/resources/features/features.model';
import { Item, ItemVariant } from 'src/app/features/resources/items/items.model';
import { ItemsService } from 'src/app/features/resources/items/items.service';
import { TitleService } from 'src/app/features/title/title.service';
import { UserSignInService } from 'src/app/features/user/user-sign-in.service';
import { UserService } from 'src/app/features/user/user.service';

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
export class ItemComponent implements OnInit, OnDestroy {

  @HostBinding('@pageAnimation') private pageAnimation = true;

  form!: FormGroup;
  id!: string;
  isNew!: boolean;
  brands: Brand[] = [];
  featuresData: Feature[] = [];
  categories: ExtendedCategory[] = [];
  colors: Color[] = [];
  editing = false;
  editable = true;
  item: Item;
  signedIn = false;
  displayLoader = false;
  availableFeatures: Feature[] = [];

  substyles = [
    'Sweet lolita',
    'Gothic lolita',
    'Classic lolita',
    'Punk lolita',
    'Sailor lolita',
    'Bride lolita',
    'Steam lolita',
    'Military lolita',
    'Pirate lolita',
    'Ero lolita',
    'Country lolita',
    'Vintage lolita',
    'Hime lolita',
    'Wa lolita (Japanese)',
    'Qi lolita (Chinese)',
    'Han lolita (Korean)',
    'Monochrome (Shiro / Kuro / Ao / Pinku)',
    'Guro lolita (gore)',
    'Circus lolita',
    'Cyber lolita',
    'Halloween',
    'Christmas',
    'Easter',
    'Valentine’s Day',
  ];

  private unsubscriber = new Subject();

  constructor(
    private title: TitleService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private userSignInService: UserSignInService,
    private userService: UserService,
    private router: Router,
    private itemsService: ItemsService,
    private toastr: ToastrService
  ) {
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
          child.parent = { ...root, children: undefined, disabled: undefined, _lvlClass: undefined };
          acc.push(child);
          if (child.children) {
            child.children.forEach(leaf => {
              leaf.disabled = false;
              leaf._lvlClass = 'lvl-2';
              leaf.parent = { ...child, children: undefined, _lvlClass: undefined, disabled: undefined };
              acc.push(leaf);
            });
          }
        });
      }
      return acc;
    }, [] as ExtendedCategory[]);

    this.item = this.activatedRoute.snapshot.data.item;

    this.isNew = this.id === 'new';
    this.editing = this.isNew;

    this.initForm(this.item || null);

    // Init available features
    const category: ExtendedCategory = this.form.value.category || null;
    this.availableFeatures = this.getAvailableFeatures(category);
  }

  ngOnInit(): void {

    this.form.valueChanges.pipe(takeUntil(this.unsubscriber)).subscribe(values => {
      sessionStorage.setItem(this.itemsService.TMP_SAVE_KEY, JSON.stringify(values));
    });

    this.category.valueChanges.pipe(takeUntil(this.unsubscriber)).subscribe({
      next: value => {
        this.availableFeatures = this.getAvailableFeatures(value);
        this.features.setValue(this.features.value.filter((feature: Feature) => this.availableFeatures.some(f => f._id === feature._id)));
      }
    });

    this.userSignInService.signedIn$.pipe(takeUntil(this.unsubscriber)).subscribe(signedIn => {
      this.signedIn = signedIn;
      this.editable = signedIn && (this.isNew || this.item.owner === this.userService.user?.sub || this.userService.isAdmin());
      if (!signedIn && this.isNew) {
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
    });

    setTimeout(() => {
      if (this.isNew) {
        this.title.set('ITEM.TITLES.NEW');
      } else {
        this.updateTitle();
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  toggleEditMode(): void {
    this.editing = !this.editing;
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

  cancel(): void {
    this.toggleEditMode();
    this.form.reset(this.item || null);
  }

  onSubmit(): void {
    const values = JSON.parse(JSON.stringify(this.form.value));
    this.cleanValues(values);
    let request$;
    if (this.isNew) {
      delete values._id;
      request$ = this.itemsService.create(values).pipe(
        map(response => {
          this.item = response;
          this.toastr.success('ITEM.TOASTS.NEW_SUCCESS', undefined);
          this.router.navigateByUrl(`/item/${response._id}`, { replaceUrl: true });
          this.updateTitle();
          this.isNew = false;
          this.editing = false;
          sessionStorage.removeItem(this.itemsService.TMP_SAVE_KEY);
          this.displayLoader = false;
        })
      );
    } else {
      request$ = this.itemsService.update(values).pipe(
        map(response => {
          this.item = response;
          sessionStorage.removeItem(this.itemsService.TMP_SAVE_KEY);
          this.toastr.success('ITEM.TOASTS.UPDATE_SUCCESS', undefined);
          this.toggleEditMode();
          this.updateTitle();
          this.displayLoader = false;
        })
      );
    }
    if (request$) {
      publish()(interval(500).pipe(tap(() => this.displayLoader = true), takeUntil(request$))).connect();
    }
  }

  addVariant(initialValue?: ItemVariant): void {
    this.variants.push(this._addVariant(initialValue));
  }

  addPhoto(variantControl: FormGroup, initialValue?: string): void {
    (variantControl.get('photos') as FormArray).push(this.fb.control(initialValue || null));
  }

  removePhoto(variantControl: FormGroup, index: number): void {
    (variantControl.get('photos') as FormArray).removeAt(index);
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

  addCustomBrand(term: string): Brand {
    return {
      name: term,
    };
  }

  searchFn(term: string, item: any): boolean {
    term = term.toLowerCase();
    return item && (item.name && item.name.toLowerCase().includes(term) || item.shortname && item.shortname.toLowerCase().includes(term));
  }

  private _addVariant(initialValue?: ItemVariant): FormGroup {
    const variantControl = this.fb.group({
      colors: [initialValue && initialValue.colors || null, [Validators.required]],
      photos: this.fb.array([], [Validators.required])
    });
    (initialValue && initialValue.photos || [null]).forEach((photo: any) => {
      this.addPhoto(variantControl, photo);
    });
    return variantControl;
  }

  private cleanValues(values: Item): void {
    if (values.variants) {
      for (const variant of values.variants) {
        // clean photos
        variant.photos = variant.photos.filter(photo => !!photo);
      }
    }
  }

  private initForm(initialValue?: Item): void {
    const value = {
      brand: null,
      collectionn: null,
      category: null,
      features: null,
      year: null,
      japanese: null,
      measurments: null,
      estimatedPrice: null,
      keywords: null,
      substyles: null,
      owner: this.userService.user && this.userService.user.sub || null,
      variants: [
        null
      ],
      _id: null,
      ...(initialValue || {})
    };
    this.form = this.fb.group({
      _id: [value._id, !this.isNew ? [Validators.required] : []],
      brand: [value.brand, Validators.required],
      collectionn: [value.collectionn],
      category: [value.category],
      features: [value.features],
      year: [value.year],
      japanese: [value.japanese],
      measurments: [value.measurments],
      estimatedPrice: [value.estimatedPrice],
      keywords: [value.keywords],
      substyles: [value.substyles],
      owner: [value.owner, Validators.required],
      variants: this.fb.array((value.variants as any[]).map((variant: any) => this._addVariant(variant)), [Validators.required])
    });
  }

  private updateTitle(): void {
    this.title.set(`${this.item.brand.shortname || this.item.brand.name} ${this.item.collectionn || ''}`, true);
  }

  private getAvailableFeatures(category: ExtendedCategory): Feature[] {
    return this.featuresData.filter(feature => {
      const categoryNames = feature.categories.map(c => c.name);
      return category && (
        categoryNames.includes(category.name) ||
        category.parent && categoryNames.includes(category.parent.name) ||
        category.parent && category.parent.parent && categoryNames.includes(category.parent.parent.name)
      );
    });
  }

}
