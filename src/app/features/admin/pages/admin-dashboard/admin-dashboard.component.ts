import { Component, inject, OnInit } from '@angular/core';
import { LucideAngularModule, CircleDollarSign, CircleUserRound, Truck, RefreshCcw } from 'lucide-angular';
import { StatsLineChart } from "../../charts/stats-line-chart/stats-line-chart.component";
import { ShipmentStatsService } from '../../services/shipment-stats.service';
import { EmployeeShipmentDetailsData } from '../../../../models/shipments/employee-shipment-detail-response.interface';

@Component({
  selector: 'admin-dashboard',
  imports: [LucideAngularModule, StatsLineChart],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  private statsService = inject(ShipmentStatsService);

  public CircleDollarSignIcon = CircleDollarSign;
  public CircleUserRoundIcon = CircleUserRound;
  public TruckIcon = Truck;
  public RefreshCcwIcon = RefreshCcw;

  public totalIncome: number = 0;
  public employees: EmployeeShipmentDetailsData[] = [];

  ngOnInit(): void {
    this.loadTotalIncomes();
    this.loadEmployeeDetails();
  }

  loadTotalIncomes() {
    this.statsService.getTotalIncome().subscribe({
      next: (res) => {
        if (!res.success || !res.data) {
          console.warn("No hay datos para cargar totales.");
          return;
        }

        this.totalIncome = res.data.totalIncome;
      },
      error: (err) => console.error(err)
    })
  }

  loadEmployeeDetails() {
    this.statsService.getEmployeeShipmentDetails().subscribe({
      next: (res) => {
        if (!res.success || !res.data) {
          console.warn("No hay datos de empleados.");
          return;
        }

        this.employees = res.data;
      },
      error: (err) => console.error(err)
    });
  }
}
