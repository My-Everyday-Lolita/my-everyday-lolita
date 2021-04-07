import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PaginationControlsDirective } from 'ngx-pagination';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit, OnDestroy {

  queryParams!: Params;
  @Input() id!: string;
  @Output() pageChange = new EventEmitter<number>();

  @ViewChild('p', { static: true }) paginationApi!: PaginationControlsDirective;

  private unsubscriber = new Subject();
  private lastPage = 1;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscriber)).subscribe({
      next: params => {
        if (params.page !== this.lastPage) {
          this.paginationApi.setCurrent(params.page);
        }
        this.queryParams = params;
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

}
