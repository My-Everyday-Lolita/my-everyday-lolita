import { trigger, transition, style, animate } from '@angular/animations';
import { Component, HostBinding, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/features/dialog/dialog.service';
import { Coordination, CoordinationField, CoordinationFieldType } from 'src/app/features/resources/user-content/user-content.model';
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
export class CoordinationComponent implements OnInit {

  CoordinationFieldTypes = CoordinationFieldType;

  @ViewChild('modal', { static: true }) modalTemplate!: TemplateRef<any>;

  @HostBinding('@pageAnimation') private pageAnimation = true;

  form!: FormGroup;
  id: string;
  isNew: boolean;
  coordination: Coordination;

  constructor(
    private title: TitleService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private userContentService: UserContentService,
    private dialogService: DialogService
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.coordination = this.activatedRoute.snapshot.data.coordination as Coordination;
    this.isNew = this.id === 'new';
    this.initForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.isNew) {
        this.title.set('COORDINATION.TITLES.NEW');
      } else {
        this.updateTitle();
      }
    });
  }

  get dateControl(): FormControl {
    return this.form.controls.date as FormControl;
  }

  get themeControl(): FormControl {
    return this.form.controls.theme as FormControl;
  }

  get fieldsControl(): FormArray {
    return this.form.controls.fields as FormArray;
  }

  edit(control: FormGroup): void {
    this.dialogService.open(this.modalTemplate, { modal: true, data: { control } });
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
      fields: [this.coordination.fields.map(field => {
        return this.fb.group({
          type: [field.type, Validators.required],
          value: this.createFieldValueControl(field.type, field)
        });
      })]
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
    // this.title.set(`${this.item.brand.shortname || this.item.brand.name} ${this.item.collectionn || ''}`, true);
  }

}
