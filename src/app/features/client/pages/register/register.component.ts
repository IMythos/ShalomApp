import { Component, inject, OnInit } from "@angular/core";
import { AuthService } from "../../../../core/services/auth.service";
import { LoadingService } from "../../../../core/services/loading.service";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { LucideAngularModule, ArrowRight } from "lucide-angular";
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";
import { RegisterRequest } from "../../../../models/register/register.model";
import { CommonModule } from "@angular/common";
import { LoginRequest } from "../../../../models/login/login-request.model";

@Component({
  selector: 'client-register',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule, RouterLink, SpinnerComponent],
  templateUrl: 'register.component.html',
  styleUrl: 'register.component.css'
})

export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);

  private fb = inject(FormBuilder);
  private router = inject(Router);

  public readonly ArrowRightIcon = ArrowRight;
  public readonly isSpinning = this.loadingService.spinner;

  // private passwordPattern = /^[0-9+]*$/; // Contiene al menos un numero el regEx
  // private dniPattern = /^[0-9]{8}$/; // Contiene un numero de compinacion del 0 - 9

  registerForm!:  FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['CLIENT', [Validators.required]],
      dni: ['', [Validators.maxLength(8)]],
      phone: [''],
      address: ['']
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.errorMessage = null;
      this.successMessage = null;

      const request: RegisterRequest = this.registerForm.value;

      this.loadingService.loadingOn();
      const startTime = Date.now();

      const turnOffSpinner = () => {
        const MIN_DELAY_MS = 2000;
        const timeElapsed = Date.now() - startTime;
        const requiredDelay = MIN_DELAY_MS - timeElapsed;

        if (requiredDelay > 0) {
          setTimeout(() => this.loadingService.loadingOff(), requiredDelay);
        } else {
          this.loadingService.loadingOff();
        }
      }

      const loginRequest : LoginRequest = {
        email: request.email,
        password: request.password
      };

      this.authService.register(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = response.message || 'Registro exitoso. Ahora puedes iniciar sesion.';
            turnOffSpinner();

            this.authService.login(loginRequest).subscribe({
              next: (loginResponse) => {
                if (loginResponse.success && loginResponse.data) {
                  localStorage.setItem('jwt_token', loginResponse.data.token);
                  this.router.navigate(['/'])
                }
              },
              error: (err) => {
                console.error('Error en el login: ', err);
                this.router.navigate(['/login']);
              }
            })
          } else {
            this.errorMessage = response.message || 'Error al registrar el usuario.';
            turnOffSpinner();
          }
        },
        error: (error) => {
          console.error("Error en el registro: ", error);
          this.errorMessage = error.error?.message || 'Error de conexion o el usuario ya existe.';
        }
      });
    } else {
      console.error('El formulario no es valido.');
      this.registerForm.markAllAsTouched();
    }
  }
}
