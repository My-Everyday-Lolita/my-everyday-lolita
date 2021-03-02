import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from './categories.model';

@Injectable({ providedIn: 'root' })
export class ResourcesCategoriesService {
  categories: Category[] = [];

  constructor(private http: HttpClient) { }

  findAll(): Observable<Category[]> {
    if (this.categories.length > 0) {
      return of(this.categories);
    }
    return this.http.get<Category[]>(`${environment.domains.mel}/api/resources/categories`).pipe(
      map(categories => {
        this.categories = categories;
        return this.categories;
      }),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }
}
