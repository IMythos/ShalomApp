import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, Signal, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MenuItem } from '../../interfaces/menu-item';
import { LucideAngularModule, UserRoundPen, Route, ClipboardMinus, PackagePlus, TicketCheck, LogOut, House  } from 'lucide-angular';
import { AdminUsersComponent } from '../../../features/admin/pages/admin-users/admin-users.component';
import { AdminDashboardComponent } from '../../../features/admin/pages/admin-dashboard/admin-dashboard.component';
import { AdminRatesComponent } from '../../../features/admin/pages/admin-rates/admin-rates.component';
import { AdminReportsComponent } from '../../../features/admin/pages/admin-reports/admin-reports.component';
import { AdminServicesComponent } from '../../../features/admin/pages/admin-services/admin-services.component';
import { EmployeeClaimComponent } from '../../../features/employee/pages/employee-claim/employee-claim.component';
import { EmployeeShipmentComponent } from '../../../features/employee/pages/employee-shipment/employee-shipment.component';
import { EmployeeInvoicesComponent } from '../../../features/employee/pages/employee-invoices/employee-invoices.component';

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
  public HouseIcon = House;

  constructor() {

    if (this.role === 'ADMIN') {
      this.menuItems.set([
        { id: 1, icon: House, label: 'Dashboard', component: AdminDashboardComponent },
        { id: 2, icon: this.UserRoundPenIcon, label: 'Gestionar Usuarios', component: AdminUsersComponent },
        { id: 3, icon: this.RouteIcon, label: 'Configurar Tarifas y Rutas', component: AdminRatesComponent },
        { id: 4, icon: this.ClipboardMinusIcon, label: 'Generar Reportes', component: AdminReportsComponent },
        { id: 5, icon: this.PackagePlusIcon, label: 'Gestionar Servicios', component: AdminServicesComponent }
      ]);
    } else if (this.role === 'EMPLOYEE') {
      this.menuItems.set([
        { id: 1, icon: this.TicketCheckIcon, label: 'Gestionar reclamos', component: EmployeeClaimComponent },
        { id: 2, icon: this.PackagePlusIcon, label: 'Gestionar Envios', component: EmployeeShipmentComponent },
        { id: 3, icon: this.ClipboardMinusIcon, label: 'Emitir Comprobantes', component: EmployeeInvoicesComponent }
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
