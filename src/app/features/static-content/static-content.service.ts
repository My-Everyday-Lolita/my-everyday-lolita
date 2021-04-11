import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { merge, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Content, ContentDisclaimer, ContentList } from './static-content.model';

@Injectable({
  providedIn: 'root'
})
export class StaticContentService {

  constructor(private translateService: TranslateService) { }

  getAndlisten(root: string): Observable<Content[]> {
    return merge(
      this.translateService.onLangChange.pipe(switchMap(() => this.getStaticContent(root))),
      this.getStaticContent(root)
    );
  }

  getStaticContent(root: string): Observable<Content[]> {
    return this.translateService.get(root).pipe(
      map((data: any[]) => {
        return this.parseContent(data, root);
      })
    );
  }

  private parseContent(content: any[], rootPath: string): Content[] {
    return content.map((item, index) => {
      const path = `${rootPath}.${index}`;
      if (typeof item === 'object') {
        if (item.DISCLAIMER !== undefined) {
          return {
            DISCLAIMER: `${path}.DISCLAIMER`,
            CHILDREN: this.parseContent(item.CHILDREN, `${path}.CHILDREN`),
          } as ContentDisclaimer;
        } else if (item.ITEMS !== undefined && Array.isArray(item.ITEMS)) {
          return {
            ITEMS: this.parseContent(item.ITEMS, `${path}.ITEMS`),
          } as ContentList;
        }
      }
      return path;
    });
  }
}
