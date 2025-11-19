import { Component, inject, signal } from "@angular/core";
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ShipmentTrackingService } from "../../services/shipment-tracking.service";
import { ShipmentTrackingData } from "../../../../models/shipment-tracking/shipment-tracking.model";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { CommonModule } from "@angular/common";
import { LucideAngularModule, MailWarning, CircleCheck, ArrowLeft, RefreshCw, Search } from "lucide-angular";

@Component({
  selector: 'client-tracking',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, CommonModule, FormsModule, LucideAngularModule],
  templateUrl: 'tracking.component.html'
})

export class TrackingComponent {
  private fb = inject(FormBuilder);
  private trackingService = inject(ShipmentTrackingService);

  public readonly MailWarningIcon = MailWarning;
  public readonly CircleCheckIcon = CircleCheck;
  public readonly ArrowLeftIcon = ArrowLeft;
  public readonly RefreshCwIcon = RefreshCw;
  public readonly SearchIcon = Search;

  isLoading = signal(false);
  shipmentData = signal<ShipmentTrackingData | null>(null);
  errorMessage = signal<string | null>(null);

  trackingForm = this.fb.group({
    code: new FormControl('', Validators.required)
  });

  onTracking() {
    if (this.trackingForm.invalid) {
      this.trackingForm.markAllAsTouched();
      return;
    }

    const code = this.trackingForm.get('code')!.value as string;

    this.isLoading.set(true);
    this.shipmentData.set(null);
    this.errorMessage.set(null);

    this.trackingService.getShipmentByCode(code).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        if (response.success && response.data) {
          this.shipmentData.set(response.data);
          this.errorMessage.set(null);
        } else {
          this.shipmentData.set(null);
          this.errorMessage.set(response.message || 'No se pudo encontrar un envio con el código señalado.');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.shipmentData.set(null);
        this.errorMessage.set(error.error?.message || 'Error de conexión con el servidor. Inténtelo más tarde.');
        console.error('Error al rastrear el envío: ', error);
      }
    })
  }
}
