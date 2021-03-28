import { trigger, transition, style, animate } from '@angular/animations';
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
        animate('330ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0%)' }),
        animate('330ms linear', style({ opacity: 0, transform: 'translateY(5%)' }))
      ]),
    ])
  ]
})
export class MyCoordChecklistComponent implements OnInit, OnDestroy {

  @HostBinding('@pageAnimation') private pageAnimation = true;

  coordinations: Coordination[] = [];

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

}
