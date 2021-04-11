import { trigger, transition, style, animate } from '@angular/animations';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Content } from 'src/app/features/static-content/static-content.model';
import { StaticContentService } from 'src/app/features/static-content/static-content.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './about-project.component.html',
  styleUrls: ['./about-project.component.scss'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('330ms 330ms linear', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0%)' }),
        animate('330ms linear', style({ opacity: 0, transform: 'translateY(5%)' }))
      ]),
    ])
  ]
})
export class AboutProjectComponent implements OnInit, OnDestroy {

  @HostBinding('@pageAnimation') private pageAnimation = true;

  data: Content[] = [];

  translateParams = {
    patreon: environment.links.patreon,
  };

  private unsubscriber = new Subject();

  constructor(
    private staticContentService: StaticContentService
  ) { }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  ngOnInit(): void {

    this.staticContentService.getAndlisten('ABOUT_PROJECT').pipe(takeUntil(this.unsubscriber)).subscribe({
      next: data => {
        this.data = data;
      }
    });
  }


}
