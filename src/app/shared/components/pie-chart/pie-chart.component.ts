import { Component, effect, ElementRef, input, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css'
})
export class PieChartComponent {
  labels = input.required<string[]>();
  data = input.required<number[]>();

  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chartInstance: Chart | null = null;

  constructor() {
    effect(() => {
      const currentLabels = this.labels();
      const currentData = this.data();

      if (currentLabels.length > 0 && currentData.length > 0) {
        this.renderizarGrafico(currentLabels, currentData);
      }
    });
  }

  private renderizarGrafico(labels: string[], data: number[]) {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: labels.map(l => l.toUpperCase()),
        datasets: [{
          data: data,
          backgroundColor: ['#5cf0a5', '#10b981', '#3b82f6', '#f43f5e'],
          borderColor: '#0f172a',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#E2E8F0',
              font: { family: 'vcr, monospace', size: 13 }
            }
          }
        }
      }
    };

    this.chartInstance = new Chart(ctx, config);
  }

  ngOnDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}
