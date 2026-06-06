import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { Estado } from '../models/estado';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/estado';

  private _estados = signal<Estado[]>([]);

  public listaEstados = computed(() => this._estados());

  index() {
    return this.http.get<{ data: Estado[] }>(this.API_URL).pipe(
      map(res => res.data),
      tap(cats => this._estados.set(cats))
    );
  }
}
