import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, Signal, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MenuItem } from '../../interfaces/menu-item';
import { LucideAngularModule, UserRoundPen, Route, ClipboardMinus, PackagePlus, TicketCheck, LogOut  } from 'lucide-angular';
import { AdminUsersComponent } from '../../../features/admin/pages/admin-users/admin-users.component';

@Component({
  selector: 'dashboard-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public menuItems = signal<MenuItem[]>([]);
  public username = this.authService.userDisplayName$;
  public role = this.authService.getUserRole();

  @Output() selectComponent = new EventEmitter<any>();

  public UserRoundPenIcon = UserRoundPen;
  public RouteIcon = Route;
  public ClipboardMinusIcon = ClipboardMinus;
  public PackagePlusIcon = PackagePlus;
  public TicketCheckIcon = TicketCheck;
  public LogOutIcon = LogOut;

  constructor() {

    if (this.role === 'ADMIN') {
      this.menuItems.set([
        { id: 1, icon: this.UserRoundPenIcon, label: 'Gestionar Usuarios', component: AdminUsersComponent },
        //{ id: 2, icon: this.RouteIcon, label: 'Configurar Tarifas y Rutas', route: '/dashboard/admin/rates-and-routes' },
        //{ id: 3, icon: this.ClipboardMinusIcon, label: 'Generar Reportes', route: '/dashboard/admin/reports' },
        //{ id: 4, icon: this.PackagePlusIcon, label: 'Gestionar Servicios', route: '/dashboard/admin/services' }
      ]);
    } else if (this.role === 'EMPLOYEE') {
      this.menuItems.set([
        //{ id: 1, icon: this.TicketCheckIcon, label: 'Gestionar reclamos', route: '/dashboard/employee/claims' },
        //{ id: 2, icon: this.PackagePlusIcon, label: 'Gestionar Envios', route: '/dashboard/employee/shipments' },
        //{ id: 3, icon: this.ClipboardMinusIcon, label: 'Emitir Comprobantes', route: '/dashboard/employee/invoices' }
      ]);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/dashboard-login']);
  }

  select(component: any) {
    this.selectComponent.emit(component);
  }
}
