import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent implements OnInit {

  @ViewChild('modalTemplate') template!: TemplateRef<any>;

  constructor(
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
  }

  open(): void {
    this.dialogService.open(this.template, { dialogClass: 'details-dialog', modal: true });
  }

}
