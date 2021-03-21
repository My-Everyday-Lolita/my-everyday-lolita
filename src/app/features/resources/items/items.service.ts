import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Criterium, Item } from './items.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  readonly TMP_SAVE_KEY = 'item:tmp-save';

  constructor(
    private http: HttpClient
  ) { }

  create(data: Item): Observable<Item> {
    return this.http.put<Item>(`${environment.domains.mel}/api/resources/items`, data, {
      headers: new HttpHeaders({
        Authorization: 'auto'
      })
    });
  }

  update(data: Item): Observable<Item> {
    return this.http.patch<Item>(`${environment.domains.mel}/api/resources/items`, data, {
      headers: new HttpHeaders({
        Authorization: 'auto'
      })
    });
  }

  findById(id: string): Observable<Item> {
    return this.http.get<Item>(`${environment.domains.mel}/api/resources/items/${id}`);
  }

  findByCriteria(criteria: Criterium[], skip = 0, limit = 20): Observable<Item[]> {
    const params = new HttpParams({
      fromObject: {
        limit: `${limit}`,
        skip: `${skip}`,
      }
    });
    return this.http.post<Item[]>(`${environment.domains.mel}/api/resources/items/search`, criteria, { params });
  }

  recentlyAdded(): Observable<Item[]> {
    return this.http.get<Item[]>(`${environment.domains.mel}/api/resources/items/recently-added`);
  }

}
