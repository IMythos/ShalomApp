import { HttpClient } from "@angular/common/http";
import { inject, Injectable, Signal, signal } from "@angular/core";
import { LoginRequest } from "../../models/login/login-request.model";
import { Observable, tap } from "rxjs";
import { LoginResponse } from "../../shared/interfaces/login-response";
import { RegisterRequest } from "../../models/register/register.model";
import { RegisterResponse } from "../../shared/interfaces/register-response";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  private _isAuthenticated = signal<boolean>(this.checkInitialAuthStatus());
  public isAuthenticated$: Signal<boolean> = this._isAuthenticated.asReadonly();

  private _userDisplayName = signal<string | null>(this.getInitialUsername());
  public userDisplayName$: Signal<string | null> = this._userDisplayName.asReadonly();

  private _userRole = signal<string | null>(this.getInitialUserRole());

  private checkInitialAuthStatus(): boolean {
    const token = localStorage.getItem('jwt_token');
    return !!token;
  }

  private getInitialUsername(): string | null {
    return localStorage.getItem('user_email');
  }

  private getInitialUserRole(): string | null {
    return localStorage.getItem('role');
  }

  private saveAuthData(token: string, role: string, email: string): void {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user_email', email);

    this._isAuthenticated.set(true);
    this._userDisplayName.set(email);
    this._userRole.set(role);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    const loginUrl = `${this.apiUrl}/auth/login`;

    return this.http.post<LoginResponse>(loginUrl, request)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.saveAuthData(response.data.token, response.data.role, request.email);
            // console.log(`Usuario autenticado: ${response.data.role}`);
          }
        })
      );
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    const registerUrl = `${this.apiUrl}/users/register`;
    return this.http.post<RegisterResponse>(registerUrl, request);
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_email');

    this._isAuthenticated.set(false);
    this._userDisplayName.set(null);
    this._userRole.set(null);
    // console.log('Sesión cerrada.');
  }

  public getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  public isAuthenticated(): boolean {
    return this._isAuthenticated();
  }

  public getUserRole(): string | null {
    return this._userRole() || localStorage.getItem('role');
  }
}
