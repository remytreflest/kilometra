import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export interface RadarDataset {
  label: string;
  data: number[];
  color: string;
}

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="chart-wrap">
      <canvas baseChart
        [data]="chartData"
        [options]="chartOptions"
        type="radar">
      </canvas>
    </div>
  `,
  styles: [`
    .chart-wrap {
      width: 100%;
      max-width: 340px;
      margin: 0 auto;
    }
  `]
})
export class RadarChartComponent implements OnInit, OnChanges {
  @Input() labels: string[] = ['Adhérence', 'Rendement', 'Confort', 'Anti-crevaison', 'Durabilité'];
  @Input() datasets: RadarDataset[] = [];

  chartData: ChartData<'radar'> = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
          color: '#9DA1A8',
          font: { family: 'Noto Sans', size: 10 },
          backdropColor: 'transparent',
        },
        grid: { color: '#E2E4E7' },
        pointLabels: {
          font: { family: 'Noto Sans', size: 11, weight: 700 },
          color: '#53565A',
        },
        angleLines: { color: '#E2E4E7' },
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Noto Sans', size: 12 },
          color: '#53565A',
          padding: 16,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}/10`
        }
      }
    }
  };

  ngOnInit() { this.buildChart(); }
  ngOnChanges() { this.buildChart(); }

  private buildChart() {
    this.chartData = {
      labels: this.labels,
      datasets: this.datasets.map(d => ({
        label: d.label,
        data: d.data,
        backgroundColor: d.color + '30',
        borderColor: d.color,
        borderWidth: 2.5,
        pointBackgroundColor: d.color,
        pointRadius: 4,
      }))
    };
  }
}
