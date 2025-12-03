import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserRequest } from '../../../models/users/user-request.interface';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import { UserResponseData } from '../../../models/users/user-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users';

  createUser(request: UserRequest): Observable<ApiResponse<UserResponseData>> {
    const createUrl = `${this.apiUrl}/register`;

    return this.http.post<ApiResponse<UserResponseData>>(createUrl, request);
  }

  listUsers(): Observable<ApiResponse<UserResponseData[]>> {
    return this.http.get<ApiResponse<UserResponseData[]>>(this.apiUrl);
  }

  updateUser(id: number, request: UserRequest): Observable<ApiResponse<UserResponseData>> {
    return this.http.put<ApiResponse<UserResponseData>>(`${this.apiUrl}/update/${id}`, request);
  }

  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete`, { params: { id: id.toString() } });
  }
}
