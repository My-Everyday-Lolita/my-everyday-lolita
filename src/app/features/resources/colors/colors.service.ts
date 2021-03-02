import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Color } from './colors.model';

@Injectable({ providedIn: 'root' })
export class ResourcesColorsService {
  colors: Color[] = [];

  constructor(private http: HttpClient) { }

  findAll(): Observable<Color[]> {
    if (this.colors.length > 0) {
      return of(this.colors);
    }
    return this.http.get<Color[]>(`${environment.domains.mel}/api/resources/colors`).pipe(
      map(colors => {
        this.colors = colors;
        return this.colors;
      }),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }
}
