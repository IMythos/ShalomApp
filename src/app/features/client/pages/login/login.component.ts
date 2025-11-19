import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from "../../../../core/services/auth.service";
import { LoginRequest } from "../../../../models/login/login-request.model";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { LucideAngularModule, ArrowRight } from "lucide-angular";
import { LoadingService } from "../../../../core/services/loading.service";
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";

@Component({
  selector: 'client-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RouterModule, SpinnerComponent],
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public readonly ArrowRightIcon = ArrowRight;
  public readonly isSpinning = this.loadingService.spinner;

  loginForm!: FormGroup;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onLogin(): void {
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
            if (response.data.role === 'CLIENT') {
              console.log('Login Exitoso como CLIENTE. Token:', response.data.token);
              turnOffSpinner();
              this.router.navigate(['/']);
            } else {
              this.authService.logout();
              console.warn(`Intento de acceso denegado. Rol detectado: ${response.data.role}`);
              this.errorMessage = 'Acceso denegado. Solo se permite el ingreso a usuarios con rol CLIENTE.';
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

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
