import { Component, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { TadaService } from '../../effects/tada/tada.service';

@Component({
  selector: 'app-back, [back-button]',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackComponent {

  constructor(
    private tadaService: TadaService
  ) { }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    history.back();
    this.tadaService.tada({
      x: event.clientX,
      y: event.clientY,
      size: 75
    });
  }

}
