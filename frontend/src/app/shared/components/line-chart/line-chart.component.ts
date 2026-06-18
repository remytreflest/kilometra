import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import {
  Chart, LineController, LineElement, PointElement,
  LinearScale, CategoryScale, Filler, Tooltip, Legend,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

export interface LineDataset {
  label: string;
  data: number[];
  color: string;
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="chart-wrap">
      <canvas baseChart
        [data]="chartData"
        [options]="chartOptions"
        type="line">
      </canvas>
    </div>
  `,
  styles: [`
    .chart-wrap { width: 100%; }
  `]
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() labels: string[] = [];
  @Input() datasets: LineDataset[] = [];
  @Input() yLabel = 'Score';

  chartData: ChartData<'line'> = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#E2E4E7' },
        ticks: { font: { family: 'Noto Sans', size: 11 }, color: '#9DA1A8' }
      },
      y: {
        grid: { color: '#E2E4E7' },
        ticks: { font: { family: 'Noto Sans', size: 11 }, color: '#9DA1A8' },
        title: { display: true, text: this.yLabel, color: '#9DA1A8', font: { size: 10 } }
      }
    }
  };

  ngOnInit()    { this.buildChart(); }
  ngOnChanges() { this.buildChart(); }

  private buildChart() {
    this.chartData = {
      labels: this.labels,
      datasets: this.datasets.map(d => ({
        label: d.label,
        data: d.data,
        borderColor: d.color,
        backgroundColor: d.color + '15',
        borderWidth: 3,
        pointBackgroundColor: d.color,
        pointRadius: 4,
        fill: true,
        tension: 0.35,
      }))
    };
  }
}
