import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthModalService } from '../../../core/services/auth-modal.service';

@Component({
  selector: 'auth-modal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css',
})
export class AuthModalComponent {
  modalService = inject(AuthModalService);
  private router = inject(Router);

  navigateTo(path: string): void {
    this.modalService.close();
    this.router.navigate([path]);
  }
}
