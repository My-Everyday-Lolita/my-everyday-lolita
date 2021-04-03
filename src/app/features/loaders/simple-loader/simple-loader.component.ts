import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-simple-loader',
  templateUrl: './simple-loader.component.html',
  styleUrls: ['./simple-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('loader', [
      transition(':enter', [
        style({ opacity: 0, width: '0px' }),
        animate('330ms linear', style({ opacity: 1, width: '{{width}}px' }))
      ])
    ])
  ]
})
export class SimpleLoaderComponent implements OnInit {

  @HostBinding('class.simple-loader') hostClass = true;

  @Input() height = 36;

  constructor() { }

  ngOnInit(): void {
  }

}
