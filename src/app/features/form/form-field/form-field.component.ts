import { Component, OnInit, ChangeDetectionStrategy, ContentChild, Query, AfterContentInit } from '@angular/core';
import { InputDirective } from './input.directive';
import { LabelComponent } from './label.component';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent implements AfterContentInit {

  private static COUNT = 0;

  private id = '';

  @ContentChild(LabelComponent) label!: LabelComponent;
  @ContentChild(InputDirective) input!: InputDirective;

  constructor() {
    this.id = `form-field-${FormFieldComponent.COUNT}`;
    FormFieldComponent.COUNT += 1;
  }

  ngAfterContentInit(): void {
    if (this.label) {
      this.label.for = this.id;
    }
    if (this.input) {
      this.input.id = this.id;
      if (this.label) {
        this.label.required = this.input.isRequired();
      }
    }
  }

}
