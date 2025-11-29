import { Component, inject, Signal, signal } from "@angular/core";
import { LucideAngularModule, House, Search, MapPin, ClipboardList, SquareMenu, CircleX, UserRoundPlus, ArrowLeft } from "lucide-angular";
import { AuthService } from "../../../core/services/auth.service";
import { Router, RouterLink } from "@angular/router";
import { LoadingService } from "../../../core/services/loading.service";
import { SpinnerComponent } from "../spinner/spinner.component";
import { AuthModalService } from "../../../core/services/auth-modal.service";
@Component({
  selector: 'client-header',
  standalone: true,
  imports: [LucideAngularModule, RouterLink, SpinnerComponent],
  templateUrl: 'header.component.html'
})

export class HeaderComponent {

  // Icons

  public readonly HomeIcon = House;
  public readonly SearchIcon = Search;
  public readonly MapPinIcon = MapPin;
  public readonly ClipboardListIcon = ClipboardList;
  public readonly SquareMenuIcon = SquareMenu;
  public readonly CircleXIcon = CircleX;
  public readonly UserRoundPlusIcon = UserRoundPlus;
  public readonly ArrowLeftIcon = ArrowLeft;

  // Services
  private authService = inject(AuthService);
  private modalService = inject(AuthModalService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);

  // Signals

  public isOpen = signal(false);
  public isAuthenticated: Signal<boolean> = this.authService.isAuthenticated$;
  public userDisplayName: Signal<string | null> = this.authService.userDisplayName$;

  // Methods

  public toggleMenu() : void {
    this.isOpen.update(state => !state);
  }

  onLogin(): void {
    this.router.navigate(['/login']);
    this.isOpen.set(false);
  }

  onLogout(): void {
    this.loadingService.loadingOn();
    this.authService.logout();
    setTimeout(() => this.loadingService.loadingOff(), 2000);
    this.router.navigate(['/']);
    this.isOpen.set(false);
  }

  onRegister(): void {
    this.router.navigate(['/register']);
    this.isOpen.set(false);
  }

  handleProtectedRoute(path: string) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([path]);
    } else {
      this.modalService.open();
    }

    this.isOpen.set(false);
  }
}
