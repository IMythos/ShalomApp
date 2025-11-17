import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from "../../../../core/services/auth.service";
import { LoginRequest } from "../../../../models/login/login-request.model";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { LucideAngularModule, ArrowRight } from "lucide-angular";

@Component({
  selector: 'client-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RouterModule],
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
  public readonly ArrowRightIcon = ArrowRight;

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

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

      this.authService.login(request).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            if (response.data.role === 'CLIENT') {
              console.log('Login Exitoso como CLIENTE. Token:', response.data.token);
              this.router.navigate(['/']);
            } else {
              this.authService.logout();
              console.warn(`Intento de acceso denegado. Rol detectado: ${response.data.role}`);
              this.errorMessage = 'Acceso denegado. Solo se permite el ingreso a usuarios con rol CLIENTE.';
            }

          } else {
            this.errorMessage = response.message || 'Credenciales inválidas.';
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
