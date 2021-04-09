import { Pipe, PipeTransform } from '@angular/core';
import { PaginationService } from 'ngx-pagination';

@Pipe({
  name: 'paginateInfo',
  pure: false,
})
export class PaginateInfoPipe implements PipeTransform {

  constructor(private paginationService: PaginationService) { }

  transform(id: string, elt: 'start' | 'end' | 'total'): number | undefined {
    const instance = this.paginationService.getInstance(id);
    let result = instance.totalItems as number;
    if (elt === 'start') {
      result = ((instance.currentPage - 1) * instance.itemsPerPage) + 1;
    } else if (elt === 'end') {
      result = Math.min(result, instance.currentPage * instance.itemsPerPage);
    }
    return result;
  }

}
