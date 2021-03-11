import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-label, [appLabel]',
  template: `
  <ng-content></ng-content>
  <span *ngIf="required">*</span>
  `
})
export class LabelComponent {

  @HostBinding('attr.for') for = '';

  required = false;

  constructor() { }

}
