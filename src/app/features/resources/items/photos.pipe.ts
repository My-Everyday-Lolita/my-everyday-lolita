import { Pipe, PipeTransform } from '@angular/core';
import { Item } from './items.model';

@Pipe({
  name: 'photos'
})
export class PhotosPipe implements PipeTransform {

  transform(item: Item): string[] {
    return item.variants.reduce((acc, variant) => {
      variant.photos.forEach(photo => {
        acc.push(photo);
      });
      return acc;
    }, [] as string[]);
  }

}
