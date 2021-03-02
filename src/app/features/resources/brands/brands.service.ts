import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Brand } from './brands.model';

@Injectable({ providedIn: 'root' })
export class ResourcesBrandsService {

  brands: Brand[] = [];

  constructor(private http: HttpClient) { }

  findAll(): Observable<Brand[]> {
    if (this.brands.length > 0) {
      return of(this.brands);
    }
    return this.http.get<Brand[]>(`${environment.domains.mel}/api/resources/brands`).pipe(
      map(brands => {
        this.brands = brands;
        return this.brands;
      }),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

}
