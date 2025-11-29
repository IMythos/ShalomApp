import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgencyResponse } from '../../../shared/interfaces/agency-response';
import { AgencyRequest } from '../../../models/agency/agency-request.model';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import { AgencyResponseData } from '../../../models/agency/agency-response.model';

@Injectable({
  providedIn: 'root',
})
export class AgencyService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/agencies';

  createAgency(request: AgencyRequest): Observable<ApiResponse<AgencyResponseData>> {
    const createUrl = `${this.apiUrl}/create`;

    return this.http.post<AgencyResponse>(createUrl, request);
  }

  listAgencies(): Observable<ApiResponse<AgencyResponseData[]>> {
    return this.http.get<ApiResponse<AgencyResponseData[]>>(this.apiUrl);
  }

  getAgencyById(id: number): Observable<ApiResponse<AgencyResponseData>> {
    const agencyUrl = `${this.apiUrl}/search?id=${id}`;

    return this.http.get<ApiResponse<AgencyResponseData>>(agencyUrl);
  }
}
