import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Coordination } from 'src/app/features/resources/user-content/user-content.model';
import { UserContentService } from 'src/app/features/resources/user-content/user-content.service';

@Component({
  templateUrl: './my-coord-checklist.component.html',
  styleUrls: ['./my-coord-checklist.component.scss'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('330ms linear', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0%)' }),
        animate('330ms linear', style({ opacity: 0, transform: 'translateY(5%)' }))
      ]),
    ]),
    trigger('remove', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5) translate(50%, -50%)' }),
        animate('200ms linear', style({ opacity: 1, transform: 'scale(1) translate(50%, -50%)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1) translate(50%, -50%)' }),
        animate('200ms linear', style({ opacity: 0, transform: 'scale(0.5) translate(50%, -50%)' }))
      ]),
    ]),
    trigger('list', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, animate('330ms linear', style({ opacity: 1 })))
        ], { optional: true }),
        query(':leave', [
          style({ opacity: 1, transform: 'translateX(0%)' }),
          animate('330ms linear', style({ opacity: 0, transform: 'translateX(-20%)' }))
        ], { optional: true }),
      ])
    ])
  ]
})
export class MyCoordChecklistComponent implements OnInit, OnDestroy {

  @HostBinding('@pageAnimation') private pageAnimation = true;

  coordinations: Coordination[] = [];
  trashMode = false;

  private unsubscriber = new Subject();

  constructor(
    private userContentService: UserContentService
  ) { }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  ngOnInit(): void {
    this.userContentService.content$.pipe(takeUntil(this.unsubscriber)).subscribe({
      next: content => {
        this.coordinations = content.coordinations;
      }
    });
  }

  toggleTrashMode() {
    this.trashMode = !this.trashMode;
  }

  remove(coord: Coordination): void {
    const index = this.coordinations.findIndex(c => c.id === coord.id);
    if (index >= 0) {
      this.coordinations.splice(index, 1);
      this.userContentService.updateCoordinations();
    }
  }

}
