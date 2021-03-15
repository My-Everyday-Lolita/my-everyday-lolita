import { animate, AnimationEvent, query, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { ImageDialogConfiguration } from '../dialog.model';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss'],
  animations: [
    trigger('backdrop', [
      transition('* => open', [
        style({ opacity: 0 }),
        animate('330ms linear', style({ opacity: 0.8 })),
      ]),
      transition('open => close', [
        style({ opacity: 0.8 }),
        animate('330ms linear', style({ opacity: 0 })),
      ]),
    ]),
    trigger('animation', [
      transition('* => open', [
        style({
          width: '{{ initialWidth }}px',
          height: '{{ initialHeight }}px',
          top: '{{ initialTop }}px',
          left: '{{ initialLeft }}px',
          transform: 'translate(0%, 0%)',
        }),
        animate('330ms linear', style({
          width: '{{ finalWidth }}px',
          height: '{{ finalHeight }}px',
          top: '{{ finalTop }}px',
          left: '{{ finalLeft }}px',
          transform: 'translate(-50%, -50%)',
        }))
      ]),
      transition('open => close', [
        style({
          width: '{{ finalWidth }}px',
          height: '{{ finalHeight }}px',
          top: '{{ finalTop }}px',
          left: '{{ finalLeft }}px',
          transform: 'translate(-50%, -50%)',
        }),
        animate('330ms linear', style({
          width: '{{ initialWidth }}px',
          height: '{{ initialHeight }}px',
          top: '{{ initialTop }}px',
          left: '{{ initialLeft }}px',
          transform: 'translate(0%, 0%)',
        }))
      ]),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageDialogComponent implements OnInit {

  @HostBinding('class.modal') modal = true;

  url!: string;
  config!: ImageDialogConfiguration;
  opened = false;
  animationState = 'open';

  onClose?: () => void;

  constructor() { }

  ngOnInit(): void {
  }

  show(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
    this.animationState = 'close';
  }

  onAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'close') {
      if (this.onClose) {
        this.onClose();
      }
    }
  }

}
