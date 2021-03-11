import { Pipe, PipeTransform } from '@angular/core';
import { Item } from './items.model';

@Pipe({
  name: 'itemPhoto'
})
export class ItemPhotoPipe implements PipeTransform {

  transform(item: Item): string {
    return item.variants[0].photos[0];
  }

}
