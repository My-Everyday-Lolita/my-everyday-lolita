import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Feature } from './features.model';

@Injectable({ providedIn: 'root' })
export class ResourcesColorsService {
  features: Feature[] = [];

  constructor(private http: HttpClient) { }

  findAll(): Observable<Feature[]> {
    if (this.features.length > 0) {
      return of(this.features);
    }
    return this.http.get<Feature[]>(`${environment.domains.mel}/api/resources/features`).pipe(
      map(features => {
        this.features = features;
        return this.features;
      }),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }
}
