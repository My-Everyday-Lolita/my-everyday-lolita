import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  current = '';

  constructor(
    private title: Title,
    private translate: TranslateService
  ) { }

  set(untranslatedTitle: string, disableTranslate = false): void {
    this.current = untranslatedTitle;
    if (disableTranslate) {
      this.title.setTitle(untranslatedTitle);
    } else {
      this.translate.get(untranslatedTitle).subscribe(translatedTitle => {
        this.title.setTitle(translatedTitle);
      });
    }
  }

}
