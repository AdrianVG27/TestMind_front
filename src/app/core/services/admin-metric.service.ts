import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserSegmentationData } from '../models/user-segmentation-data';

@Injectable({
  providedIn: 'root'
})
export class AdminMetricService {
  private http = inject(HttpClient);

  public segmentacionUsuarios = signal<UserSegmentationData | null>(null);

  obtenerSegmentacionUsuarios(): Observable<UserSegmentationData> {
    return this.http.get<UserSegmentationData>('/api/admin/metrics/users').pipe(
      tap(res => this.segmentacionUsuarios.set(res))
    );
  }
}
