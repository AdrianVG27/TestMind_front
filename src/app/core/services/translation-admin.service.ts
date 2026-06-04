import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface InterfazTraduccionModel {
  id?: number;
  clave: string;
  valor: string;
  lenguaje_codigo: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationAdminService {
  private http = inject(HttpClient);

  public catalogoTraducciones = signal<InterfazTraduccionModel[]>([]);

  obtenerCatalogo(): Observable<InterfazTraduccionModel[]> {
    return this.http.get<InterfazTraduccionModel[]>('/api/admin/lenguaje').pipe(
      tap(res => this.catalogoTraducciones.set(res))
    );
  }

  actualizarLiteral(payload: InterfazTraduccionModel): Observable<any> {
    return this.http.put('/api/admin/lenguaje/update', payload).pipe(
      tap(() => {
        this.catalogoTraducciones.update(lista =>
          lista.map(item => item.id === payload.id ? { ...item, valor: payload.valor } : item)
        );
      })
    );
  }

  eliminarLiteral(clave: string): Observable<any> {
    return this.http.delete('/api/admin/lenguaje/destroy', { body: { clave } }).pipe(
      tap(() => {
        this.catalogoTraducciones.update(lista => 
          lista.filter(item => item.clave !== clave)
        );
      })
    );
  }
}