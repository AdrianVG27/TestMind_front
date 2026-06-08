import { Component, ElementRef, Input, ViewChild, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent {
  @ViewChild('lineCanvas', { static: true }) private lineCanvas!: ElementRef;

  @Input() labels: string[] = [];
  @Input() data: number[] = [];

  private chartInstance: Chart | null = null;

  ngOnInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['data'] || changes['labels']) && !changes['data']?.isFirstChange()) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = this.lineCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(92, 240, 165, 0.25)');
    gradient.addColorStop(1, 'rgba(92, 240, 165, 0.0)');

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Tests Registrados',
            data: this.data,
            borderColor: '#5CF0A5',
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#18222D',
            pointBorderColor: '#5CF0A5',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: '#314357' },
            ticks: {
              color: '#8A99AD',
              font: { family: 'VCR OSD Mono', size: 11 }
            }
          },
          y: {
            grid: { color: '#314357' },
            beginAtZero: true,
            ticks: {
              color: '#8A99AD',
              font: { family: 'VCR OSD Mono', size: 11 },
              stepSize: 1
            }
          }
        }
      }
    };

    this.chartInstance = new Chart(ctx, config);
  }
}