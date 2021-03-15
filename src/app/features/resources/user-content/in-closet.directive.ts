import { Directive, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Item, ItemVariant } from '../items/items.model';
import { UserContentService } from './user-content.service';

@Directive({
  selector: '[appInCloset]',
  exportAs: 'inCloset'
})
export class InClosetDirective implements OnInit, OnDestroy {

  private ucItem!: Item;
  @Input() item!: Item;
  @Input() variant!: ItemVariant;

  isIn = false;
  private unsubscriber = new Subject();

  constructor(
    private userContentService: UserContentService
  ) { }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  ngOnInit(): void {
    this.ucItem = {
      ...this.item,
      variants: [this.variant],
    };
    this.userContentService.content$.pipe(takeUntil(this.unsubscriber)).subscribe(() => {
      this.isIn = this.userContentService.isInCloset(this.ucItem);
    });
  }

  @HostListener('click')
  onClick(): void {
    if (this.isIn) {
      this.userContentService.removeFromCloset(this.ucItem);
    } else {
      this.userContentService.addToCloset(this.ucItem);
    }
  }

}
