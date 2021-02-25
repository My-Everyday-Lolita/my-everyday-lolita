import { animate, style, transition, trigger } from '@angular/animations';
import { ApplicationRef, Component, HostBinding } from '@angular/core';
import { Toast, ToastNoAnimation, ToastPackage, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toast, [app-toast]',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ width: '300px' }),
        animate('330ms linear', style({ width: '300px' })),
      ])
    ])
  ],
  preserveWhitespaces: false,
})
export class ToastComponent extends Toast {

  // @HostBinding('@toastAnimation') toastAnimation = true;

  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
    // protected appRef: ApplicationRef
  ) {
    // super(toastrService, toastPackage, appRef);
    super(toastrService, toastPackage);
  }

  action(event: Event): boolean {
    event.stopPropagation();
    this.toastPackage.triggerAction();
    return false;
  }

}
