import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ChangeDetectionStrategy, Input, HostBinding, HostListener, ElementRef } from '@angular/core';
import { tadaAnimation } from '../tada.animation';
import { AppButtonColor } from '../button.model';

@Component({
  selector: 'app-button, [app-button]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tadaAnimation', [
      transition('* => active', [
        useAnimation(tadaAnimation, { params: { time: '330ms' } })
      ])
    ]),
  ]
})
export class ButtonComponent {

  @Input() color: AppButtonColor = 'default';
  @Input() tadaSize = 75;

  @HostBinding('class.primary') get primaryClass(): boolean {
    return this.color === 'primary';
  }

  @HostBinding('class.accent') get accentClass(): boolean {
    return this.color === 'accent';
  }

  @HostBinding('class.default') get defaultClass(): boolean {
    return this.color === 'default';
  }

  tadaStyle: any = { top: '50%', left: '50%', 'width.px': 10, 'height.px': 10 };
  animate = 'none';

  constructor(private elt: ElementRef) { }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const rect = (this.elt.nativeElement as HTMLElement).getBoundingClientRect();
    this.tadaStyle = {
      'top.px': event.clientY - rect.y,
      'left.px': event.clientX - rect.x,
      'width.px': this.tadaSize,
      'height.px': this.tadaSize,
    };
    this.animate = 'active';
  }

  onTadaAnimationDone(): void {
    this.animate = 'none';
    this.tadaStyle = { top: '50%', left: '50%', 'width.px': 10, 'height.px': 10 };
  }

}
