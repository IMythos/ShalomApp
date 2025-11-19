import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ShipmentTrackingResponse } from "../../../shared/interfaces/shipment-tracking-response";

@Injectable({
  providedIn: 'root'
})

export class ShipmentTrackingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/client/shipments';

  getShipmentByCode(code: string): Observable<ShipmentTrackingResponse> {
    const shipmentUrl = `${this.apiUrl}/${code}`;

    return this.http.get<ShipmentTrackingResponse>(shipmentUrl);
  }
}
