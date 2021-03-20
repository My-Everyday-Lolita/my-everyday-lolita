import { animate, animation, stagger, style } from '@angular/animations';

export const itemsLeaveAnimation = animation([
  style({ opacity: 1 }),
  animate('150ms linear', style({ opacity: 0 })),
]);

export const itemsEnterAnimation = animation([
  style({ opacity: 0 }),
  stagger(150, animate('330ms linear', style({ opacity: 1 }))),
]);
