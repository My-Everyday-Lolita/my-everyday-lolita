import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TadaConfig } from './tada.model';

@Injectable({ providedIn: 'root' })
export class TadaService {

  private tadas = new Subject<TadaConfig>();

  tada(config: TadaConfig): void {
    this.tadas.next(config);
  }

  get tadas$(): Observable<TadaConfig> {
    return this.tadas.asObservable();
  }

}
