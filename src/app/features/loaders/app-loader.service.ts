import { animate, AnimationBuilder, style } from '@angular/animations';
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppLoaderService {

  elt: HTMLDivElement;
  hidden = false;
  private renderer: Renderer2;

  constructor(
    private ab: AnimationBuilder,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.elt = document.querySelector('body > .app-loader-wrapper') as HTMLDivElement;
  }

  hide(): void {
    if (!this.hidden) {
      const hide = this.ab.build([
        style({ opacity: 1 }),
        animate('330ms linear', style({ opacity: 0 }))
      ]).create(this.elt);
      hide.onDone(() => {
        this.renderer.setStyle(this.elt, 'display', 'none');
      });
      this.hidden = true;
      hide.play();
    }
  }
}
