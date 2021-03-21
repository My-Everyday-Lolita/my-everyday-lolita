import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(
    private toastr: ToastrService,
    private swUpdate: SwUpdate
  ) {
    this.swUpdate.available.subscribe({
      next: () => {
        this.toastr.info('APP.TOASTS.PWA_UPDATE', undefined, {
          disableTimeOut: true,
          enableHtml: true,
          closeButton: false,
        }).onTap.subscribe({ next: () => location.reload() });
      }
    });
  }
}
