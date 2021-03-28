import { trigger, transition, style, animate } from '@angular/animations';
import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  templateUrl: './my-coord-checklist.component.html',
  styleUrls: ['./my-coord-checklist.component.scss'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('330ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0%)' }),
        animate('330ms linear', style({ opacity: 0, transform: 'translateY(5%)' }))
      ]),
    ])
  ]
})
export class MyCoordChecklistComponent implements OnInit {

  @HostBinding('@pageAnimation') private pageAnimation = true;

  constructor() { }

  ngOnInit(): void {
  }

}