import {
  ApplicationRef,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Injector,
  Input,
  ViewContainerRef
} from '@angular/core';
import { ImageDialogConfiguration } from './dialog.model';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';

@Directive({
  selector: '[appImageZoom]'
})
export class ImageZoomDirective {

  @Input('appImageZoom') url!: string;

  @HostBinding('class.active') active = false;

  constructor(
    private elementRef: ElementRef<HTMLImageElement>,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef
  ) { }

  @HostListener('click')
  onClick(): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();

    this.open(this.url, {
      initialTop: rect.y,
      initialLeft: rect.x,
      initialWidth: rect.width,
      initialHeight: rect.height,
      finalTop: window.innerHeight / 2,
      finalLeft: window.innerWidth / 2,
      finalWidth: window.innerWidth,
      finalHeight: window.innerHeight,
    });
  }

  private open(url: string, config: ImageDialogConfiguration, container?: ViewContainerRef): ImageDialogComponent {
    const dialogRef = this.componentFactoryResolver.resolveComponentFactory(ImageDialogComponent).create(this.injector);
    dialogRef.instance.url = url;
    dialogRef.instance.config = config;
    dialogRef.instance.onClose = () => {
      this.appRef.components[0].instance.getRenderer().setStyle(document.body, 'overflow', 'auto');
      dialogRef.destroy();
    };
    this.appRef.components[0].instance.getRenderer().setStyle(document.body, 'overflow', 'hidden');
    if (container) {
      container.insert(dialogRef.hostView);
    } else {
      this.appRef.components[0].instance.viewContainerRef.insert(dialogRef.hostView);
    }
    dialogRef.instance.show();
    return dialogRef.instance;
  }


}
