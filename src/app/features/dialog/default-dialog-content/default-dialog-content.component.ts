import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-default-dialog-content',
  templateUrl: './default-dialog-content.component.html',
  styleUrls: ['./default-dialog-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultDialogContentComponent {

  @Input() ref!: DialogComponent;

}
