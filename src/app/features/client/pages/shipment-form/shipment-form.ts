import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { SolicitudeService } from '../../services/solicitude.service';
import { SolicitudeRequest } from '../../../../models/solicitude/solicitude-request.model';
import { SolicitudeResponseData } from '../../../../models/solicitude/solicitude-response.model';
import { AgencyResponseData } from '../../../../models/agency/agency-response.model';
import { AgencyService } from '../../services/agency.service';
import { AgencyResponse } from '../../../../shared/interfaces/agency-response';

@Component({
  selector: 'shipment-form',
  imports: [HeaderComponent, ReactiveFormsModule],
  templateUrl: './shipment-form.html',
  styleUrl: './shipment-form.css',
})
export class ShipmentForm implements OnInit {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private solicitudeService = inject(SolicitudeService);
  private agenciesService = inject(AgencyService);

  public availableAgencies: AgencyResponseData[] = [];

  public solicitudeForm: FormGroup;
  public packageImageFile: WritableSignal<File | null> = signal(null);
  public solicitudeList: WritableSignal<SolicitudeResponseData[]> = signal([]);
  public packageImageError: WritableSignal<string> = signal('');
  public loading = signal(false);
  public loadingAgencies = signal(false);
  public errorMessage = signal('');
  public successMessage = signal('');

  constructor() {
    this.solicitudeForm = this.fb.group({
      recipientDni: ['', [Validators.required, Validators.pattern(/^\d{8,10}$/)]],
      recipientName: ['', [Validators.required, Validators.minLength(3)]],
      recipientCity: ['', [Validators.required]],
      destinationCity: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
    });

    this.loadSolicitudes();
  }

  ngOnInit(): void {
    this.loadAgencies();
  }

  loadAgencies() {
    this.loadingAgencies.set(true);
    this.agenciesService.listAgencies().subscribe({
      next: (agencies) => {
        this.availableAgencies = agencies.data ?? [];
        this.loadingAgencies.set(false);
      },
      error: (err) => {
        console.error('Error cargando agencias.', err);
        this.loadingAgencies.set(false);
      }
    })
  }

  getControl(name: string): AbstractControl | null {
    return this.solicitudeForm.get(name);
  }

  isInvalid(name: string): boolean {
    const control = this.getControl(name);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onFileSelected(event: Event): void {
    this.packageImageError.set('');
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        this.packageImageError.set('El archivo es demasiado grande (Máx. 5MB).');
        this.packageImageFile.set(null);
        input.value = ''; // Reset input field
      } else {
        this.packageImageFile.set(file);
      }
    } else {
      this.packageImageFile.set(null);
    }
  }

  loadSolicitudes(): void {
    this.solicitudeService.listByClient().subscribe({
      next: (data) => this.solicitudeList.set(data),
      error: (err) => console.error('Error al cargar solicitudes: ', err)
    })
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.solicitudeForm.invalid || !this.packageImageFile()) {
      this.solicitudeForm.markAllAsTouched();
      this.packageImageError.set(this.packageImageFile() ? '' : 'Debe seleccionar una imagen del paquete.');
      return;
    }

    this.loading.set(true);

    const requestData: SolicitudeRequest = this.solicitudeForm.value;
    const file = this.packageImageFile() as File;

    this.solicitudeService.createSolicitude(requestData, file).subscribe({
      next: (response) => {
        this.successMessage.set('Solicitud enviada correctamente. ID: ' + response.id);
        this.loading.set(false);
        // Resetear el formulario después de un envío exitoso
        this.solicitudeForm.reset({
            recipientDni: '', recipientName: '', recipientCity: '', destinationCity: '', description: ''
        });
        this.packageImageFile.set(null);
        this.solicitudeList.update(list => [...list, response]);
        // Resetear el input de archivo manualmente ya que reset() del formulario no funciona
        const fileInput = document.getElementById('packageImage') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
