import { Component, computed, inject, signal } from '@angular/core';
import { PieChartComponent } from '../../../shared/components/pie-chart/pie-chart.component';
import { AdminMetricService } from '../../../core/services/admin-metric.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PieChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private metricService = inject(AdminMetricService);

  public chartLabels = computed(() => this.metricService.segmentacionUsuarios()?.labels || []);
  public chartData = computed(() => this.metricService.segmentacionUsuarios()?.data || []);

  public isVisualLoading = signal<boolean>(false);

  ngOnInit() {
    this.cargarMetricasSegmentacion();
  }

  cargarMetricasSegmentacion() {
    this.isVisualLoading.set(true);

    this.metricService.obtenerSegmentacionUsuarios().subscribe({
      next: () => {
        this.isVisualLoading.set(false);
      },
      error: (err) => {
        this.isVisualLoading.set(true); // Bloqueo visual por fallo crítico d sincronización
        console.error('Fallo en TestMind Admin Core al actualizar el pipeline d analíticas', err);
      }
    });
  }
}
