import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TablaApoyo, TablaDataResponse } from '../models/tabla-apoyo';

@Injectable({
  providedIn: 'root'
})
export class TablaApoyoService {
  private http = inject(HttpClient);
  private apiUrl = `/api/admin/tablaApoyo`;

  public listaTablas = signal<TablaApoyo[]>([]);
  public tablaSeleccionadaData = signal<TablaDataResponse | null>(null);

  obtenerCatalogoTablas(): Observable<TablaApoyo[]> {
    return this.http.get<TablaApoyo[]>(this.apiUrl).pipe(
      tap(tablas => this.listaTablas.set(tablas))
    );
  }

  cargarRegistrosTabla(idTabla: number): Observable<TablaDataResponse> {
    return this.http.get<TablaDataResponse>(`${this.apiUrl}/${idTabla}`).pipe(
      tap(data => this.tablaSeleccionadaData.set(data))
    );
  }

  actualizarRegistro(idTabla: number, idFila: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idTabla}/row/${idFila}`, payload);
  }

  eliminarRegistro(idTabla: number, idFila: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idTabla}/row/${idFila}`);
  }

  crearRegistro(idTabla: number, payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idTabla}/row`, payload);
  }

  obtenerTraduccionesFila(idTabla: number, idFila: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idTabla}/row/${idFila}/lenguajes`);
  }

  guardarTraduccionesFila(idTabla: number, idFila: number, traducciones: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idTabla}/row/${idFila}/lenguajes`, { traducciones });
  }
}