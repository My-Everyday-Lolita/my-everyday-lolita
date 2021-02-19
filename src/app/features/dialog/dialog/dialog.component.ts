import { Component, ChangeDetectionStrategy, TemplateRef, HostBinding } from '@angular/core';
import { DialogConfiguration } from '../dialog.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent {


  template!: TemplateRef<any>;
  config?: DialogConfiguration;
  opened = false;

  onClose?: () => void;

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
    try {
      // this.dialog.nativeElement[modal ? 'showModal' : 'show']();
    } catch (error) {
      // Fail silently.
    }
  }

  close(): void {
    this.opened = false;
    try {
      // this.dialog.nativeElement.close();
    } catch (error) {
      // Fail silently.
    }
    if (this.onClose) {
      this.onClose();
    }
  }

}
