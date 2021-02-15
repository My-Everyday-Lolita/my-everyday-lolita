import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('homeEnterAnimation', [
      transition(':enter', [
        query('nav a', [
          style({ opacity: 0, transform: 'scale(0.7)' }),
          stagger(100, animate('330ms linear', style({ opacity: 1, transform: 'scale(1)' })))
        ], { optional: true }),
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  @HostBinding('@homeEnterAnimation') homeEnterAnimation = true;

  constructor() { }

  ngOnInit(): void {
  }

}
