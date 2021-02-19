import { Component, ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-dialog-attach',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogAttachComponent {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
