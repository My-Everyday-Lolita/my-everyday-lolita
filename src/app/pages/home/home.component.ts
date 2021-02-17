import { animate, group, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { APP_ROUTES } from 'src/app/app.token';
import { TadaService } from 'src/app/features/effects/tada/tada.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('homeEnterAnimation', [
      transition(':enter', [
        group([
          query('.top-item', [
            style({ opacity: 0, transform: 'scale(0.5)' }),
            animate('330ms linear', style({ opacity: 1, transform: 'scale(1)' }))
          ], { optional: true }),
          query('nav a', [
            style({ opacity: 0, transform: 'scale(0.7)' }),
            stagger(100, animate('330ms linear', style({ opacity: 1, transform: 'scale(1)' })))
          ], { optional: true }),
          query('.deco-item', [
            style({ opacity: 0, transform: 'scale(0.5)' }),
            stagger(200, animate('500ms linear', style({ opacity: 1, transform: 'scale(1)' })))
          ], { optional: true }),
          query('#brand-logo, #brand-title', [
            style({ opacity: 0 }),
            stagger(400, animate('800ms linear', style({ opacity: 1 })))
          ], { optional: true }),
        ])
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0%)' }),
        animate('330ms linear', style({ opacity: 0, transform: 'translateY(-5%)' }))
      ]),
    ])
  ]
})
export class HomeComponent {

  @HostBinding('@homeEnterAnimation') homeEnterAnimation = true;

  routes: Routes;

  constructor(
    private tadaService: TadaService,
    @Inject(APP_ROUTES) routes: Routes
  ) {
    this.routes = routes.filter(route => route.data && route.data.home);
  }

  onBrandLogoClick(event: MouseEvent): void {
    this.tadaService.tada({
      x: event.clientX,
      y: event.clientY,
      size: 100,
      color: 'accent'
    });
  }

}
