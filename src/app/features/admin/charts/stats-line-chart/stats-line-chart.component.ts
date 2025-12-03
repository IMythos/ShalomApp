import { Component, inject, OnInit } from '@angular/core';
import { ShipmentStatsService } from '../../services/shipment-stats.service';
import { ShipmentStatsData } from '../../../../models/shipments/shipment-stats-response.interface';
import * as echarts from 'echarts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'line-chart-shipment-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-line-chart.component.html',
  styleUrl: './stats-line-chart.component.css',
})
export class StatsLineChart implements OnInit {
  private statsService = inject(ShipmentStatsService);

  public days: number = 7;
  public chart: any;

  ngOnInit(): void {
    this.loadData();
  }

  onDaysChange(event: Event) {
    this.days = Number((event.target as HTMLSelectElement).value);
    this.loadData();
  }

  loadData() {
    this.statsService.getShipmentStats(this.days).subscribe({
      next: (res) => {
        if (!res.success || !res.data) {
          console.warn("No hay datos para mostrar en el gráfico.");
          return;
        }

        this.renderChart(res.data);
      },
      error: (err) => console.error(err)
    });
  }

  renderChart(data: ShipmentStatsData[]) {
    const element = document.getElementById('lineChart');

    if (!this.chart) {
      this.chart = echarts.init(element);
    }

    const dates = data.map(x => this.parseDate(x.fecha));
    const pending = data.map((x) => x.pendientes);
    const approved = data.map((x) => x.enviados);

    const options = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Pendientes', 'Aprobados']
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Pendientes',
          type: 'line',
          smooth: true,
          data: pending
        },
        {
          name: 'Aprobados',
          type: 'line',
          smooth: true,
          data: approved
        }
      ]
    };

    this.chart.setOption(options);
  }

  private parseDate(value: any): string {
  if (!value) return "--";

  if (typeof value === "string") {
    if (!isNaN(Date.parse(value))) {
      return value.substring(0, 10);
    }
  }

  if (typeof value === "object" && "year" in value) {
    const y = value.year;
    const m = value.month.toString().padStart(2, "0");
    const d = value.day.toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date.toISOString().substring(0, 10);
  }

  console.warn("Fecha inválida recibida:", value);
  return "--";
}
}
