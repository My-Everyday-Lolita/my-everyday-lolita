import { animate, AnimationEvent, query, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-fieldset',
  templateUrl: './fieldset.component.html',
  styleUrls: ['./fieldset.component.scss'],
  animations: [
    trigger('collapseAnimation', [
      transition('void => close', [
        query('.fieldset-container', [
          style({ height: '*' }),
          animate('10ms linear', style({ height: '0px' }))
        ], { optional: true }),
      ]),
      transition('close => open', [
        query('.fieldset-container', [
          style({ height: '0px' }),
          animate('330ms linear', style({ height: '{{ height }}' }))
        ], { optional: true }),
      ]),
      transition('open => close', [
        query('.fieldset-container', [
          style({ height: '{{ height }}' }),
          animate('330ms linear', style({ height: '0px' })),
        ], { optional: true }),
      ]),
    ])
  ]
})
export class FieldsetComponent implements OnInit {

  private static COUNT = 0;

  legendId: string;
  open = false;
  animationParams: any = { height: '0px' };
  openAnimationDone = false;

  @Input() legend = '';
  @Input() opened = false;

  @ViewChild('content', { static: true }) content!: ElementRef<HTMLElement>;
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLElement>;

  constructor(
    private renderer: Renderer2
  ) {
    this.legendId = `app-fieldset-legend-${FieldsetComponent.COUNT}`;
    FieldsetComponent.COUNT += 1;
  }

  ngOnInit(): void {
    this.open = this.opened;
  }

  toggle(): void {
    this.open = !this.open;
    if (this.open) {
      this.openAnimationDone = false;
    }
  }

  onAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'open') {
      this.openAnimationDone = true;
    }
  }

  onContentChange(): void {
    const height = `${this.content.nativeElement.getBoundingClientRect().height}px`;
    if (height !== this.animationParams.height) {
      if (this.open) {
        this.renderer.setStyle(this.container.nativeElement, 'height', height);
      }
      this.animationParams.height = height;
    }
  }

}
