import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  templateUrl: './my-closet.component.html',
  styleUrls: ['./my-closet.component.scss'],
  animations: [
    trigger('closetAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('330ms linear', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0%)' }),
        animate('330ms linear', style({ opacity: 0, transform: 'translateY(5%)' }))
      ]),
    ])
  ]
})
export class MyClosetComponent implements OnInit {

  @HostBinding('@closetAnimation') private animation = true;

  constructor() { }

  ngOnInit(): void {
  }

}
