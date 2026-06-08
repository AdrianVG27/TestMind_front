import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Documento } from '../models/documento';
import { LaravelPagination } from '../models/laravel-pagination';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private http = inject(HttpClient);
  private _paginationState = signal<LaravelPagination<Documento> | null>(null);
  private _misDocumentosState = signal<Documento[]>([]);

  public documentos = computed(() => this._paginationState()?.data || []);
  public currentPage = computed(() => this._paginationState()?.meta.current_page || 1);
  public lastPage = computed(() => this._paginationState()?.meta.last_page || 1);
  public totalDocumentos = computed(() => this._paginationState()?.meta.total || 0);
  public misDocumentos = computed(() => this._misDocumentosState());

  documentosPublicos(page: number = 1, nombre?: string, categoriaCodigo?: string) {
    let params = new HttpParams().set('page', page.toString());

    if (nombre) params = params.set('nombre', nombre);
    if (categoriaCodigo) params = params.set('categoria_codigo', categoriaCodigo);

    return this.http.get<LaravelPagination<Documento>>('/api/documentos', { params }).pipe(
      tap(res => this._paginationState.set(res))
    );
  }

  obtenerMisDocumentos(): Observable<Documento[]> {
    return this.http.get<{ data: Documento[] }>('/api/user/documento').pipe(
      map(response => response.data),
      tap(documentosPropios => this._misDocumentosState.set(documentosPropios))
    );
  }

  descargarDocumento(id: number): Observable<Blob> {
    return this.http.get(`/api/documentos/${id}/descargar`, { responseType: 'blob' });
  }

  subirDocumento(formData: FormData): Observable<Documento> {
    return this.http.post<Documento>('/api/user/documento', formData);
  }
}
