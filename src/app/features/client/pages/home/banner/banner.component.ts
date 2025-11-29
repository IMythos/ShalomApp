import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { LucideAngularModule, ArrowRight } from "lucide-angular";
import { AuthService } from "../../../../../core/services/auth.service";
import { AuthModalService } from "../../../../../core/services/auth-modal.service";

@Component({
  selector: 'client-banner',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: 'banner.component.html'
})

export class BannerComponent {
  public readonly ArrowRightIcon = ArrowRight;

  private authService = inject(AuthService);
  private modalService = inject(AuthModalService);
  private router = inject(Router);

  // Nuevo método para manejar el clic del botón
  handleSolicitarEnvio() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/shipment-form']);
    } else {
      this.modalService.open();
    }
  }
}
