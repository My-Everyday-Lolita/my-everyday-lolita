import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { tadaAnimation } from './tada.animation';
import { TadaConfig } from './tada.model';

@Component({
  selector: 'app-tada',
  templateUrl: './tada.component.html',
  styleUrls: ['./tada.component.scss'],
  animations: [
    trigger('tadaAnimation', [
      transition('* => active', [
        useAnimation(tadaAnimation, { params: { time: '330ms' } })
      ])
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TadaComponent implements OnInit {

  tadaStyle: any = { top: '50%', left: '50%', 'width.px': 10, 'height.px': 10 };
  color = 'primary';
  activate = 'none';

  onDone?: () => void;

  ngOnInit(): void {
    this.activate = 'active';
  }

  onAnimationDone(): void {
    if (this.onDone) {
      this.onDone();
    }
  }

}
