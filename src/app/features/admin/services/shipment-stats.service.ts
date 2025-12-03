import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import { ShipmentStatsData } from '../../../models/shipments/shipment-stats-response.interface';
import { TotalIncomeData } from '../../../models/shipments/total-income-response.interface';
import { EmployeeShipmentDetailsData } from '../../../models/shipments/employee-shipment-detail-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ShipmentStatsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/stats';

  getShipmentStats(days: number): Observable<ApiResponse<ShipmentStatsData[]>> {
    const shipmentStats = `${this.apiUrl}/shipments?days=${days}`;

    return this.http.get<ApiResponse<ShipmentStatsData[]>>(shipmentStats);
  }

  getTotalIncome():Observable<ApiResponse<TotalIncomeData>> {
    const totalIncome = `${this.apiUrl}/income/total-month`;

    return this.http.get<ApiResponse<TotalIncomeData>>(totalIncome);
  }

  getEmployeeShipmentDetails(): Observable<ApiResponse<EmployeeShipmentDetailsData[]>> {
    const employeeDetails = `${this.apiUrl}/employees`;

    return this.http.get<ApiResponse<EmployeeShipmentDetailsData[]>>(employeeDetails);
  }
}
