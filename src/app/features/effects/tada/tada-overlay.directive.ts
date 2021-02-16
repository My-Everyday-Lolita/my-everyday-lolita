import { ComponentFactoryResolver, Directive, ViewContainerRef } from '@angular/core';
import { TadaComponent } from './tada.component';
import { TadaService } from './tada.service';

@Directive({
  selector: '[appTadaOverlay], [tada-overlay]',
})
export class TadaOverlayDirective {

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private tadaService: TadaService
  ) {
    this.tadaService.tadas$.subscribe(config => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TadaComponent);
      const componentRef = this.viewContainerRef.createComponent(componentFactory);
      componentRef.instance.tadaStyle = {
        'top.px': config.y,
        'left.px': config.x,
        'width.px': config.size,
        'height.px': config.size,
      };
      componentRef.instance.color = config.color || 'primary-shadow';
      componentRef.instance.onDone = () => {
        componentRef.destroy();
      };
    });
  }

}
