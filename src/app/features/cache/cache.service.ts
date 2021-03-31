import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map, publish, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private cache!: Cache;
  private inMemoryFallback: { [key: string]: Response } = {};

  constructor() {
    try {
      caches.open('mel-cache').then(cache => {
        this.cache = cache;
      }).catch(() => {
        this.initFallback();
      });
    } catch (error) {
      this.initFallback();
    }
  }

  match(id: RequestInfo): Observable<Response | undefined> {
    return from(this.cache.match(`/${id}`));
  }

  put(id: string, body: any): Observable<boolean> {
    const obs = from(this.cache.put(`/${id}`, new Response(JSON.stringify(body)))).pipe(
      catchError((error) => {
        console.error(error);
        return of(false);
      }),
      map(() => true),
      shareReplay(1)
    );
    publish()(obs).connect();
    return obs;
  }

  delete(id: string): Observable<boolean> {
    const obs = from(this.cache.delete(`/${id}`)).pipe(
      catchError((error) => {
        console.error(error);
        return of(false);
      }),
      map(() => true),
      shareReplay(1)
    );
    publish()(obs).connect();
    return obs;
  }

  private initFallback(): void {
    console.error('Cache unavailable (☍﹏⁰), use the session storage as fallback.');
    this.cache = {
      put: (id: RequestInfo, response: Response): Promise<void> => {
        return new Promise(resolve => {
          response.json().then(value => {
            sessionStorage.setItem(id as string, JSON.stringify(value));
            resolve();
          });
        });
      },
      delete: (id: RequestInfo, options?: CacheQueryOptions | undefined): Promise<boolean> => {
        return new Promise(resolve => {
          sessionStorage.removeItem(id as string);
          resolve(true);
        });
      },
      add(id: RequestInfo): Promise<void> {
        return Promise.reject('sessionStorage fallback add() method is not available.');
      },
      addAll(ids: RequestInfo[]): Promise<void> {
        return Promise.reject('sessionStorage fallback addAll() method is not available.');
      },
      match: (id: RequestInfo, options?: CacheQueryOptions | undefined): Promise<Response | undefined> => {
        return new Promise(resolve => {
          const value = sessionStorage.getItem(id as string);
          if (value) {
            resolve(new Response(value));
          }
          resolve(undefined);
        });
      },
      matchAll: (id?: RequestInfo | undefined, options?: CacheQueryOptions | undefined): Promise<any> => {
        return Promise.reject('sessionStorage fallback matchAll() method is not available.');
      },
      keys: (request?: RequestInfo | undefined, options?: CacheQueryOptions | undefined): Promise<readonly Request[]> => {
        return new Promise(resolve => {
          resolve(Object.keys(this.inMemoryFallback).map(id => new Request(id)));
        });
      }
    };
  }
}
