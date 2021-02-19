import { animate, animateChild, group, query, sequence, stagger, style, transition, trigger } from '@angular/animations';
import { Component, ChangeDetectionStrategy, TemplateRef, HostBinding } from '@angular/core';
import { DialogConfiguration } from '../dialog.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('330ms linear', style({ opacity: 1 })),
        animateChild(),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animateChild(),
        animate('330ms linear', style({ opacity: 0 })),
      ])
    ])
  ]
})
export class DialogComponent {

  template!: TemplateRef<any>;
  config?: DialogConfiguration;
  opened = false;

  onClose?: () => void;

  @HostBinding('@dialogAnimation') private dialogAnimation = true;

  @HostBinding('class')
  get classes(): string {
    return this.config?.dialogClass || '';
  }

  @HostBinding('class.modal')
  get modal(): boolean {
    return this.config?.modal || false;
  }

  constructor() { }

  show(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
    if (this.onClose) {
      this.onClose();
    }
  }

}
