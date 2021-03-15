import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Item, ItemVariant } from '../items/items.model';
import { UserContentService } from './user-content.service';

@Directive({
  selector: '[appInWishlist]',
  exportAs: 'inWishlist'
})
export class InWishListDirective implements OnInit {

  private ucItem!: Item;
  @Input() item!: Item;
  @Input() variant!: ItemVariant;

  isIn = false;
  private unsubscriber = new Subject();


  constructor(
    private userContentService: UserContentService
  ) { }

  ngOnInit(): void {
    this.ucItem = {
      ...this.item,
      variants: [this.variant],
    };
    this.userContentService.content$.pipe(takeUntil(this.unsubscriber)).subscribe(() => {
      this.isIn = this.userContentService.isInWishlist(this.ucItem);
    });
  }

  @HostListener('click')
  onClick(): void {
    if (this.isIn) {
      this.userContentService.removeFromWishlist(this.ucItem);
    } else {
      this.userContentService.addToWishlist(this.ucItem);
    }
  }

}
