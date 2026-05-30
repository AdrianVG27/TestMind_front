import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { UserMetrics } from '../models/user';
import { IntentoResultado } from '../models/test';

@Injectable({
  providedIn: 'root'
})
export class ProfileMetricService {
  private http = inject(HttpClient);

  private _intentos = signal<any[]>([]);
  private _metricsState = signal<UserMetrics>({
    mediaResultados: 0,
    totalRealizados: 0,
    categoriaMasRealizada: 'Ninguna'
  });

  public listaIntentos = computed(() => this._intentos());
  public metrics = computed(() => this._metricsState());

  cargarHistorialIntentos() {
    return this.http.get<{ data: { intentos: any[]; metrics: UserMetrics } }>('/api/user/intento').pipe(
      map(res => res.data),
      tap(data => {
        this._intentos.set(data.intentos || []);
        this._metricsState.set(data.metrics || { mediaResultados: 0, totalRealizados: 0, categoriaMasRealizada: 'Ninguna' });
      })
    );
  }

  obtenerDetalleIntento(idIntento: number): Observable<IntentoResultado> {
    return this.http.get<{ data: any }>('/api/user/intento/' + idIntento).pipe(
      map(res => {
        const intentoBackend = res.data;

        return {
          nota: intentoBackend.nota,
          aciertos: intentoBackend.aciertos,
          total: intentoBackend.total,
          feedback: intentoBackend.feedback || []
        } as IntentoResultado;
      })
    );
  }
}
