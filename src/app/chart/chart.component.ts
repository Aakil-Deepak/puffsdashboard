import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardData } from '../shared/models/dashboard-data';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit, OnChanges {
  chart: any;

  @Input() chartData: DashboardData;

  ngOnInit(): void {
    Chart.register(...registerables);
    this.loadChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      changes.chartData &&
      changes.chartData.currentValue &&
      changes.chartData.previousValue
    ) {
      const currentValue = changes.chartData.currentValue;
      this.chartData = currentValue;
      this.loadChart();
    }
  }

  loadChart(): void {
    let chartStatus = Chart.getChart('line-chart'); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    this.chart = new Chart('line-chart', {
      type: 'line',
      data: {
        labels: Array.from({ length: this.chartData.days }, (_, i) => i + 1),
        datasets: [
          {
            label: '',
            data: this.chartData.values,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Days',
              color: '#911',
              padding: { top: 20, bottom: 20 },
              font: {
                family: 'Comic Sans MS',
                size: 20,
                weight: 'bold',
                lineHeight: 1.2,
              },
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value',
              color: '#191',
              font: {
                family: 'Times',
                size: 20,
                style: 'normal',
                lineHeight: 1.2,
              },
            },
          },
        },
      },
    });

    this.chart.update();
  }
}
