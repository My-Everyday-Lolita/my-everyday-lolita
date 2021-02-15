import { animate, group, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('stripAnimations', [
      transition(':enter', [
        group([
          query('.left', [
            style({ opacity: 0, transform: 'translateX(-100%)' }),
            stagger('100ms', [
              animate('2s easeOutElastic(1, .8)', style({ opacity: 1, transform: 'translateX(0%)' })),
            ]),
          ], { optional: true }),
          query('.right', [
            style({ opacity: 0, transform: 'translateX(100%)' }),
            stagger('100ms', [
              animate('2s easeOutElastic(1, .8)', style({ opacity: 1, transform: 'translateX(0%)' })),
            ]),
          ], { optional: true }),
        ])
      ]),
    ]),
    trigger('cloudsAnimations', [
      transition(':enter', [
        group([
          query('#top-left-cloud', [
            style({ opacity: 1, transform: 'translateX(-42%)' }),
            stagger('100ms', [
              animate('800ms linear', style({ opacity: 1, transform: 'translateX(0%)' })),
            ]),
          ], { optional: true }),
          query('#top-right-cloud', [
            style({ opacity: 1, transform: 'translateX(42%)' }),
            stagger('100ms', [
              animate('800ms linear', style({ opacity: 1, transform: 'translateX(0%)' })),
            ]),
          ], { optional: true }),
        ])
      ]),
    ]),
  ]
})
export class AppComponent {
  title = 'my-everyday-lolita';
}
