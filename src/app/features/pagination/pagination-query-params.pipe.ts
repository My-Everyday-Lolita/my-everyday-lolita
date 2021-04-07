import { Pipe, PipeTransform } from '@angular/core';
import { Params } from '@angular/router';

@Pipe({
  name: 'paginationQueryParams'
})
export class PaginationQueryParamsPipe implements PipeTransform {

  transform(queryParams: Params, page: number, last = 0, item: 'previous' | 'next' | 'default' = 'default'): Params {
    const clone = JSON.parse(JSON.stringify(queryParams));
    if (item === 'previous') {
      if (page > 1) {
        clone.page = page - 1;
      } else {
        clone.page = 1;
      }
    } else if (item === 'next') {
      if (page < last) {
        clone.page = page + 1;
      } else {
        clone.page = last;
      }
    } else {
      clone.page = page;
    }
    return clone;
  }

}
