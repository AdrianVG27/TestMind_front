import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/categoria';

  private _categorias = signal<Categoria[]>([]);

  public listaCategorias = computed(() => this._categorias());

  index() {
    return this.http.get<{ data: Categoria[] }>(this.API_URL).pipe(
      map(res => res.data),
      tap(cats => this._categorias.set(cats))
    );
  }

}
