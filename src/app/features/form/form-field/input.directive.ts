import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appInput]'
})
export class InputDirective {

  @HostBinding('attr.id') id = '';

  @Input() required!: boolean | string;

  constructor() { }

  isRequired(): boolean {
    return this.required === '' || this.required === 'required';
  }

}
