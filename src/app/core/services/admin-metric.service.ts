import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserSegmentationData } from '../models/user-segmentation-data';

@Injectable({
  providedIn: 'root'
})
export class AdminMetricService {
  private http = inject(HttpClient);
  private apiUrl = '/api/admin/metrics';

  public segmentacionUsuarios = signal<UserSegmentationData | null>(null);
  public testsCreadosHistorico = signal<any | null>(null); 
  public testsPorCategoria = signal<any | null>(null);

  obtenerSegmentacionUsuarios(): Observable<UserSegmentationData> {
    return this.http.get<UserSegmentationData>(`${this.apiUrl}/users`).pipe(
      tap(res => this.segmentacionUsuarios.set(res))
    );
  }

  obtenerHistoricoTestsCreados(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tests-creados`).pipe(
      tap(res => this.testsCreadosHistorico.set(res))
    );
  }

  obtenerTestsPorCategoria(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/categorias`).pipe(
    tap(res => this.testsPorCategoria.set(res))
  );
}
}