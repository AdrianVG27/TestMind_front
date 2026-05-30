import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { IntentoResultado, RealizarTest, Test } from '../models/test';
import { LaravelPagination } from '../models/laravel-pagination';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private http = inject(HttpClient);

  private _paginationState = signal<LaravelPagination<Test> | null>(null);

  public tests = computed(() => this._paginationState()?.data || []);
  public currentPage = computed(() => this._paginationState()?.meta.current_page || 1);
  public lastPage = computed(() => this._paginationState()?.meta.last_page || 1);
  public totalTests = computed(() => this._paginationState()?.meta.total || 0);

  testsPaginate(page: number = 1, titulo?: string, categoriaId?: number) {
    let params = new HttpParams().set('page', page.toString());

    if (titulo) params = params.set('titulo', titulo);
    if (categoriaId) params = params.set('categoria_id', categoriaId.toString());

    return this.http.get<LaravelPagination<Test>>('/api/tests', { params }).pipe(
      tap(res => this._paginationState.set(res))
    );
  }

  obtenerMisTests(page: number = 1, titulo?: string, categoriaId?: number): Observable<LaravelPagination<Test>> {
    let params = new HttpParams().set('page', page.toString());

    if (titulo) params = params.set('titulo', titulo);
    if (categoriaId) params = params.set('categoria_id', categoriaId.toString());

    return this.http.get<LaravelPagination<Test>>('/api/user/test', { params }).pipe(
      tap(res => this._paginationState.set(res))
    );
  }

  obtenerTest(id: number): Observable<Test> {
    return this.http.get<Test>(`/api/user/test/${id}`);
  }

  realizarTest(id: number): Observable<RealizarTest> {
    return this.http.get<RealizarTest>(`/api/test/${id}/realizar`);
  }

  enviarTestParaCorregir(testId: number, respuestas: any, duracionSegundos: number | null): Observable<IntentoResultado> {
    const payload = {
      respuestas: respuestas,
      duracion: duracionSegundos
    };
    return this.http.post<IntentoResultado>(`/api/user/test/${testId}/corregir`, payload);
  }

  crearTest(payload: {
    documento_id: number;
    titulo: string;
    nivel: string;
    total: number;
    prop_unica: number;
    prop_multi: number;
    prop_escribir: number;
    min_opciones: number;
    max_max_opciones?: number;
    max_opciones: number;
    input_user: string | null;
  }): Observable<Test> {
    return this.http.post<Test>('/api/user/test', payload);
  }
}
