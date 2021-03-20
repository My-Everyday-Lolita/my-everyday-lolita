import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appImageLoad]'
})
export class ImageLoadDirective {

  @HostBinding('class.load-behavior') enable = true;
  @HostBinding('class.loaded') loaded = false;
  @HostBinding('class.error') error = false;

  constructor() { }

  @HostListener('load')
  onLoad(): void {
    this.loaded = true;
    this.error = false;
  }

  @HostListener('error')
  onError(): void {
    this.loaded = true;
    this.error = true;
  }

}
