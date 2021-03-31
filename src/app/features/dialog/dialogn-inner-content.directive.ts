import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appDialognInnerContent]'
})
export class DialognInnerContentDirective implements AfterViewInit {

  @Input('appDialognInnerContent') public dialogRef: any;
  @Input() public padding = 0;

  constructor(
    private eltRef: ElementRef
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dialogRef.height = this.eltRef.nativeElement.getBoundingClientRect().height + (this.padding * 2);
    });
  }

}
