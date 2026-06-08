import { Component, computed, inject, signal } from '@angular/core';
import { PieChartComponent } from '../../../shared/components/pie-chart/pie-chart.component';
import { LineChartComponent } from '../../../shared/components/line-chart/line-chart.component';
import { AdminMetricService } from '../../../core/services/admin-metric.service';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PieChartComponent, LineChartComponent, TranslocoModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private metricService = inject(AdminMetricService);

  public chartLabels = computed(() => this.metricService.segmentacionUsuarios()?.labels || []);
  public chartData = computed(() => this.metricService.segmentacionUsuarios()?.data || []);

  public creadosLabels = computed(() => this.metricService.testsCreadosHistorico()?.labels || []);
  public creadosData = computed(() => this.metricService.testsCreadosHistorico()?.data || []);

  public categoriasLabels = computed(() => this.metricService.testsPorCategoria()?.labels || []);
  public categoriasData = computed(() => this.metricService.testsPorCategoria()?.data || []);

  public isVisualLoading = signal<boolean>(false);

  ngOnInit() {
    this.cargarMetricasDashboard();
  }

  cargarMetricasDashboard() {
    this.isVisualLoading.set(true);

    this.metricService.obtenerSegmentacionUsuarios().subscribe({
      next: () => this.isVisualLoading.set(false),
      error: (err) => {
        this.isVisualLoading.set(false);
        console.error('Fallo en TestMind Admin Core al actualizar el pipeline d analíticas', err);
      }
    });

    this.metricService.obtenerTestsPorCategoria().subscribe({
      next: () => this.isVisualLoading.set(false),
      error: (err) => {
        this.isVisualLoading.set(false);
        console.error('Fallo al actualizar pipeline de distribución por categorías', err);
      }
    });

    this.metricService.obtenerHistoricoTestsCreados().subscribe({
      next: () => this.isVisualLoading.set(false),
      error: (err) => {
        this.isVisualLoading.set(false);
        console.error('Fallo en TestMind Admin Core al actualizar el pipeline de actividad temporal', err);
      }
    });
  }
}