import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@ngneat/transloco';
import { tap, catchError, of } from 'rxjs';

export interface LenguajeModel {
  codigo: string;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class IdiomaConfigService {
  private http = inject(HttpClient);
  private translocoService = inject(TranslocoService);

  public idiomasDisponibles = signal<LenguajeModel[]>([
    { codigo: 'es', descripcion: 'Castellano' }
  ]);

  cargarIdiomasDesdeBD() {
    return this.http.get<LenguajeModel[]>('/api/idiomas-disponibles').pipe(
      tap(idiomas => {
        if (Array.isArray(idiomas) && idiomas.length > 0) {
          this.idiomasDisponibles.set(idiomas);

          const codigos = idiomas.map(l => l.codigo);
          this.translocoService.setAvailableLangs(codigos);
        }
      }),
      catchError(error => {
        console.error('Error recuperando idiomas maestros, activando fallback seguro.', error);
        return of([{ codigo: 'es', descripcion: 'Castellano' }]);
      })
    );
  }
}