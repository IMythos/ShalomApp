import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { LoginRequest } from '../../../models/login/login-request.model';

@Component({
  selector: 'app-dashboard-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RouterModule, SpinnerComponent],
  templateUrl: './dashboard-login.component.html',
  styleUrl: './dashboard-login.component.css',
})
export class DashboardLoginComponent implements OnInit {
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public readonly isSpinning = this.loadingService.spinner;

  loginForm!: FormGroup;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onLoginDashboard(): void {
    if (this.loginForm.valid) {
      this.errorMessage = null;

      const request: LoginRequest = this.loginForm.value;

      this.loadingService.loadingOn();
      const startTime = Date.now();

      const turnOffSpinner = () => {
        const MIN_DELAY_MS = 2000;
        const timeElapsed = Date.now() - startTime;
        const requiredDelay = MIN_DELAY_MS - timeElapsed;

        if (requiredDelay > 0) {
          setTimeout(() => this.loadingService.loadingOff(), requiredDelay)
        } else {
          this.loadingService.loadingOff();
        }
      }

      this.authService.login(request).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            if (response.data.role === 'ADMIN') {
              console.log('Login exitoso como ADMIN.');
              turnOffSpinner();

              this.router.navigate(['/dashboard/admin']);
            } else if (response.data.role === 'EMPLOYEE') {
              console.log('Login exitoso como EMPLOYEE');
              turnOffSpinner();

              this.router.navigate(['/dashboard/employee']);
            } else {
              this.authService.logout();
              console.warn(`Intento de acceso denegado. Rol detectado: ${response.data.role}`);

              this.errorMessage = 'Acceso denegado. Solo se permite el ingreso a usuarios AUTORIZADOS DEL SISTEMA.';
              turnOffSpinner();
            }
          } else {
            this.errorMessage = response.message || 'Credenciales inválidas.';
            turnOffSpinner();
          }
        },
        error: (err) => {
          console.error('Error durante el login:', err);
          this.errorMessage = 'Error de conexión o credenciales incorrectas.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
