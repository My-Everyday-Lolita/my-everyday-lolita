import { trigger, transition, style, animate } from '@angular/animations';
import { Component, HostBinding, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable, Subject, zip } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { CacheService } from 'src/app/features/cache/cache.service';
import { DialogService } from 'src/app/features/dialog/dialog.service';
import { Item } from 'src/app/features/resources/items/items.model';
import { ItemsService } from 'src/app/features/resources/items/items.service';
import { Coordination, CoordinationField, CoordinationFieldType, coordinationTypeMap } from 'src/app/features/resources/user-content/user-content.model';
import { UserContentService } from 'src/app/features/resources/user-content/user-content.service';
import { TitleService } from 'src/app/features/title/title.service';

@Component({
  templateUrl: './coordination.component.html',
  styleUrls: ['./coordination.component.scss'],
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
export class CoordinationComponent implements OnInit, OnDestroy {

  CoordinationFieldTypes = CoordinationFieldType;

  @ViewChild('modal', { static: true }) modalTemplate!: TemplateRef<any>;

  @HostBinding('@pageAnimation') private pageAnimation = true;

  form!: FormGroup;
  id: string;
  isNew: boolean;
  coordination: Coordination;

  private unsubscriber = new Subject();
  private content: { id: string; }[] = [];
  private groupedItems: { [key in CoordinationFieldType]?: { id: string, photo: string }[] } = {};
  private coordinations!: Coordination[];

  constructor(
    private title: TitleService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private userContentService: UserContentService,
    private dialogService: DialogService,
    private cacheService: CacheService,
    private itemsService: ItemsService,
    private router: Router
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.coordination = this.activatedRoute.snapshot.data.coordination as Coordination;
    this.isNew = this.id === 'new';
    this.initForm();
    this.form.valueChanges.pipe(takeUntil(this.unsubscriber)).subscribe((values) => {
      if (values.title !== '') {
        this.title.set(values.title);
      } else {
        if (this.isNew) {
          this.title.set('COORDINATION.TITLES.NEW');
        }
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.isNew) {
        this.title.set('COORDINATION.TITLES.NEW');
      } else {
        this.updateTitle();
      }
    });
    this.userContentService.content$.pipe(
      filter(content => content !== null),
      takeUntil(this.unsubscriber)
    ).subscribe(content => {
      this.coordinations = content.coordinations;
      this.content = content.closet;
      this.getItems().pipe(takeUntil(this.unsubscriber)).subscribe(items => {
        Object.entries(coordinationTypeMap).forEach(([type, categories]) => {
          this.groupedItems[type as CoordinationFieldType] = items.filter(item => {
            return categories?.includes(item.category.name) ||
              (item.category.parent && categories?.includes(item.category.parent.name)) ||
              (item.category.parent && item.category.parent.parent && categories?.includes(item.category.parent.parent.name));
          }).map(item => ({ id: this.userContentService.buildVariantId(item), photo: item.variants[0].photos[0] }));
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  get dateControl(): FormControl {
    return this.form.controls.date as FormControl;
  }

  get themeControl(): FormControl {
    return this.form.controls.theme as FormControl;
  }

  get fieldsControls(): FormGroup[] {
    return (this.form.controls.fields as FormArray).controls as FormGroup[];
  }

  edit(control: AbstractControl, key: string): void {
    this.dialogService.open(this.modalTemplate, {
      modal: true,
      data: { key, control, items: this.groupedItems[control.value.type as CoordinationFieldType] }
    });
  }

  onSubmit(): void {
    if (this.isNew) {
      this.coordination = this.form.value;
      this.coordinations.push(this.coordination);
    } else {
      Object.entries(this.form.value).forEach(([key, value]) => {
        (this.coordination as any)[key] = value;
      });
    }
    this.userContentService.updateCoordinations();
    if (this.isNew) {
      this.router.navigateByUrl(`/my-coord-checklist/${this.coordination.id}`, { replaceUrl: true }).then(() => {
        this.isNew = false;
        this.updateTitle();
      });
    }
    this.form.markAsPristine();
  }

  private initForm(): void {
    this.form = this.fb.group({
      id: [this.coordination.id, Validators.required],
      title: [this.coordination.title, Validators.required],
      event: [this.coordination.event],
      place: [this.coordination.place],
      theme: [this.coordination.theme],
      date: [this.coordination.date],
      memo: [this.coordination.memo],
      fields: this.fb.array(this.coordination.fields.map(field => {
        return this.fb.group({
          type: [field.type, Validators.required],
          value: this.createFieldValueControl(field.type, field)
        });
      }))
    });
  }

  private createFieldValueControl(type: string, initialValue: CoordinationField): AbstractControl {
    let control: AbstractControl;
    switch (type) {
      case CoordinationFieldType.ACCESSORIES:
      case CoordinationFieldType.LEGWEAR:
      case CoordinationFieldType.UNDERWEAR:
      case CoordinationFieldType.OTHERS:
        control = this.fb.array(initialValue.value.map((val: any) => this.fb.control(val)));
        break;
      default:
        control = this.fb.control(initialValue.value);
        break;
    }
    return control;
  }

  private updateTitle(): void {
    this.title.set(this.coordination.title, true);
  }

  private getItems(): Observable<Item[]> {
    const items$ = this.content.map(item => this.cacheService.match(item.id).pipe(
      switchMap(cacheResponse => {
        if (cacheResponse) {
          return from(cacheResponse.json()) as Observable<Item>;
        }
        const [itemId, colorIds] = item.id.split(':');
        return this.itemsService.findById(itemId).pipe(
          map(response => {
            if (response) {
              const selectedVariant = response.variants.filter(v => v.colors.map(c => c._id).join(',') === colorIds)[0] || undefined;
              if (selectedVariant) {
                const freshItem = {
                  ...JSON.parse(JSON.stringify(response)),
                  variants: [selectedVariant],
                };
                this.cacheService.put(item.id, freshItem);
                return freshItem;
              }
            }
          })
        );
      })
    ));
    return zip(...items$);
  }

  checkItemMultiple(event: Event, formArray: FormArray): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      const exist = !!formArray.controls.find(control => control.value === target.value);
      if (!exist) {
        formArray.push(this.fb.control(target.value));
        this.form.markAsDirty();
      }
    } else {
      const indexToRemove = formArray.controls.findIndex(control => control.value === target.value);
      if (indexToRemove >= 0) {
        formArray.removeAt(indexToRemove);
        this.form.markAsDirty();
      }
    }
  }

}
