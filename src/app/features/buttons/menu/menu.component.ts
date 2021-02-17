import { Component, ChangeDetectionStrategy, HostListener, HostBinding, Input } from '@angular/core';
import { TadaService } from '../../effects/tada/tada.service';

@Component({
  selector: 'app-menu, [menu-button]',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

  @HostBinding('class.active')
  @Input()
  active = false;

  constructor(
    private tadaService: TadaService
  ) { }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.tadaService.tada({
      x: event.clientX,
      y: event.clientY,
      size: 75
    });
  }

}
