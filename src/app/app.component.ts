import { animate, animateChild, group, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterOutlet, Routes } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PageData } from './app.model';
import { APP_ROUTES } from './app.token';
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
    ]),
    trigger('toolbarItemAnimation', [
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0%)' }),
        animate('330ms linear', style({ opacity: 0, transform: 'translateY(20%)' }))
      ]),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20%)' }),
        animate('330ms linear', style({ opacity: 1, transform: 'translateY(0%)' }))
      ]),
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('menu', { static: true }) private menuTemplate: any;
  @ViewChild('menuContainer', { static: true }) private menuContainer!: DialogAttachComponent;

  menuComponent?: DialogComponent;
  currentPage?: PageData;
  isMenuOpened?: boolean;
  others: Routes;
  replaceUrl = false;

  private unsubscsriber = new Subject();
  private menuClose$ = new Subject<boolean>();

  constructor(
    public tadaService: TadaService,
    private themeService: ThemeService,
    private dialogService: DialogService,
    public viewContainerRef: ViewContainerRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(APP_ROUTES) routes: Routes
  ) {
    this.others = routes.filter(route => route.data && route.data.others);
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
      takeUntil(this.unsubscsriber)
    ).subscribe(event => {
      this.currentPage = undefined;
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => this.activatedRoute.firstChild as ActivatedRoute),
      switchMap(route => route.data),
      takeUntil(this.unsubscsriber)
    ).subscribe(data => {
      this.currentPage = data as PageData;
      this.replaceUrl = !this.currentPage.isHome;
    });
    // window.onpopstate = (e: PopStateEvent) => {
    //   if (this.isMenuOpened && this.menuComponent) {
    //     this.menuComponent.close();
    //     this.isMenuOpened = false;
    //     e.preventDefault();
    //   }
    // };
    // this.menuClose$.pipe(takeUntil(this.unsubscsriber)).subscribe(closed => {
    //   if (closed) {
    //     history.back();
    //   } else {
    //     history.pushState({ menu: true }, 'Open menu');
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.unsubscsriber.next();
    this.unsubscsriber.complete();
  }

  prepareRoute(outlet: RouterOutlet): any {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  setTheme(): void {
    this.themeService.setTheme(this.themeService.theme === 'sweet' ? 'gothic' : this.themeService.theme === 'gothic' ? 'classic' : 'sweet');
  }

  toggleMenu(notify = true): void {
    if (!this.isMenuOpened) {
      this.menuComponent = this.dialogService.open(this.menuTemplate, {
        dialogClass: 'main-menu',
        modal: true,
      }, this.menuContainer.viewContainerRef);
      this.isMenuOpened = true;
    } else {
      this.isMenuOpened = false;
      if (this.menuComponent) {
        this.menuComponent.close();
      }
    }
    // if (notify) {
    //   this.menuClose$.next(!this.isMenuOpened);
    // }
  }

}
