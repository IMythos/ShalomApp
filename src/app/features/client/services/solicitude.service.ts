import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { AuthService } from "../../../core/services/auth.service";
import { SolicitudeResponseData } from "../../../models/solicitude/solicitude-response.model";
import { SolicitudeListResponse, SolicitudeResponse } from "../../../shared/interfaces/solicitude-response";
import { SolicitudeRequest } from "../../../models/solicitude/solicitude-request.model";

@Injectable({
  providedIn: 'root'
})

export class SolicitudeService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = 'http://localhost:8080/api/client/solicitudes';

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('No se encontro un token de autenticacion. Sesion expirada o no iniciada.');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listByClient(): Observable<SolicitudeResponseData[]> {
    try {
        const headers = this.getAuthHeaders();

        return this.http.get<SolicitudeListResponse>(this.apiUrl, { headers }).pipe(
            map(response => {
                if (!response.success) {
                    throw new Error(response.message || 'Fallo al listar solicitudes.');
                }

                return response.data!;
            }),
            catchError(error => {
                console.error('Error al listar solicitudes:', error);

                if (error.status === 401 || error.status === 403) {
                    this.authService.logout();
                }
                return throwError(() => new Error(error.error?.message || 'Error de conexión o permisos.'));
            })
        );
    } catch (e: any) {
        return throwError(() => new Error(e.message));
    }
  }

  createSolicitude(request: SolicitudeRequest, imageFile: File): Observable<SolicitudeResponseData> {
    try {
        const headers = this.getAuthHeaders();
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });

        formData.append('data', jsonBlob, 'data.json');
        formData.append('image', imageFile);

        const uploadHeaders = headers.delete('Content-Type');

        return this.http.post<SolicitudeResponse>(`${this.apiUrl}/create`, formData, { headers: uploadHeaders }).pipe(
            map(response => {
                if (!response.success) {
                    throw new Error(response.message || 'Fallo al crear la solicitud.');
                }

                return response.data!;
            }),
            catchError(error => {
                console.error('Error al crear solicitud:', error);

                const errorMessage = error.error?.message || error.message || 'Error desconocido al registrar la solicitud.';
                return throwError(() => new Error(errorMessage));
            })
        );
    } catch (e: any) {
        return throwError(() => new Error(e.message));
    }
  }
}
