import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {

  constructor(
    private datePipe: DatePipe,
    private translateService: TranslateService
  ) { }

  transform(value: string | number | Date, pattern = 'mediumDate'): string | null {
    return this.datePipe.transform(value, pattern, undefined, this.translateService.currentLang || this.translateService.defaultLang);
  }

}
