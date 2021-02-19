import { animate, animateChild, group, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogAttachComponent } from './features/dialog/dialog-attach/dialog-container.component';
import { DialogService } from './features/dialog/dialog.service';
import { DialogComponent } from './features/dialog/dialog/dialog.component';
import { TadaService } from './features/effects/tada/tada.service';
import { ThemeService } from './features/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('stripAnimations', [
      transition(':enter', [
        group([
          query('.left', [
            style({ opacity: 0, transform: 'translateX(-100%)' }),
            stagger('100ms', [
              animate('2s easeOutElastic(1, .8)', style({ opacity: 1, transform: 'translateX(0%)' })),
            ]),
          ], { optional: true }),
          query('.right', [
            style({ opacity: 0, transform: 'translateX(100%)' }),
            stagger('100ms', [
              animate('2s easeOutElastic(1, .8)', style({ opacity: 1, transform: 'translateX(0%)' })),
            ]),
          ], { optional: true }),
        ])
      ]),
    ]),
    trigger('cloudsAnimations', [
      transition(':enter', [
        group([
          query('#top-left-cloud', [
            style({ opacity: 1, transform: 'translateX(-42%)' }),
            stagger('100ms', [
              animate('800ms linear', style({ opacity: 1, transform: 'translateX(0%)' })),
            ]),
          ], { optional: true }),
          query('#top-right-cloud', [
            style({ opacity: 1, transform: 'translateX(42%)' }),
            stagger('100ms', [
              animate('800ms linear', style({ opacity: 1, transform: 'translateX(0%)' })),
            ]),
          ], { optional: true }),
        ])
      ]),
    ]),
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':leave', animateChild(), { optional: true }),
        query(':enter', [
          animateChild(),
          style({ position: 'relative' }),
        ], { optional: true }),
      ])
    ])
  ]
})
export class AppComponent {

  @ViewChild('menu', { static: true }) private menuTemplate: any;
  @ViewChild('menuContainer', { static: true }) private menuContainer!: DialogAttachComponent;

  menuComponent?: DialogComponent;

  constructor(
    public tadaService: TadaService,
    private themeService: ThemeService,
    private dialogService: DialogService,
    public viewContainerRef: ViewContainerRef
  ) { }

  prepareRoute(outlet: RouterOutlet): any {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  setTheme(): void {
    this.themeService.setTheme(this.themeService.theme === 'sweet' ? 'gothic' : this.themeService.theme === 'gothic' ? 'classic' : 'sweet');
  }

  toggleMenu(): void {
    if (this.menuComponent === undefined) {
      this.menuComponent = this.dialogService.open(this.menuTemplate, {
        dialogClass: 'main-menu',
        modal: true,
      }, this.menuContainer.viewContainerRef);
    } else {
      this.menuComponent.close();
      this.menuComponent = undefined;
    }
  }

}
