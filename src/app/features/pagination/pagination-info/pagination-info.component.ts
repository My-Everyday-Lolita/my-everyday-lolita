import { Component, OnInit, ChangeDetectionStrategy, Input, AfterContentInit } from '@angular/core';
import { PaginationService } from 'ngx-pagination';

@Component({
  selector: 'app-pagination-info',
  templateUrl: './pagination-info.component.html',
  styleUrls: ['./pagination-info.component.scss'],
})
export class PaginationInfoComponent {

  @Input() id!: string;

}
