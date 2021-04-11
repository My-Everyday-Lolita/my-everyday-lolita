import { Pipe, PipeTransform } from '@angular/core';
import { Content } from './static-content.model';

@Pipe({
  name: 'scIsParagraph'
})
export class ScIsParagraphPipe implements PipeTransform {

  transform(item: Content): boolean {
    return typeof item === 'string';
  }

}
