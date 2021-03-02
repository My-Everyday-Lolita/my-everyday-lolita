import { Component, ChangeDetectionStrategy, Input, HostBinding, HostListener } from '@angular/core';
import { TadaService } from '../../effects/tada/tada.service';
import { AppButtonColor } from '../button.model';

@Component({
  selector: 'app-button, [app-button]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  @HostBinding('class.user-link') get userLinkClass(): boolean {
    return this.color === 'user-link';
  }

  constructor(
    private tadaService: TadaService
  ) { }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.tadaService.tada({
      x: event.clientX,
      y: event.clientY,
      size: this.tadaSize,
      color: `${this.color}-shadow`,
    });
  }

}
