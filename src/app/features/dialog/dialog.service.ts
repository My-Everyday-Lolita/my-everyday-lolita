import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { DialogConfiguration } from './dialog.model';
import { DialogComponent } from './dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef
  ) { }

  open(templateModal: TemplateRef<any>, config: DialogConfiguration, container?: ViewContainerRef): DialogComponent {
    const dialogRef = this.componentFactoryResolver.resolveComponentFactory(DialogComponent).create(this.injector);
    dialogRef.instance.config = config;
    dialogRef.instance.template = templateModal;
    dialogRef.instance.onClose = () => {
      this.appRef.components[0].instance.getRenderer().setStyle(document.body, 'overflow', 'auto');
      dialogRef.destroy();
    };
    if (container) {
      container.insert(dialogRef.hostView);
    } else {
      this.appRef.components[0].instance.viewContainerRef.insert(dialogRef.hostView);
    }
    this.appRef.components[0].instance.getRenderer().setStyle(document.body, 'overflow', 'hidden');
    dialogRef.instance.show();
    return dialogRef.instance;
  }

}
