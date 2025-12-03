import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, signal } from '@angular/core';
import { SidebarComponent } from '../../../../shared/dashboard/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard.component";

@Component({
  selector: 'admin-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NgComponentOutlet, AdminDashboardComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css',
})
export class AdminHomeComponent {
  public selectComponent = signal<any>(null);

  onSelect(component: any) {
    this.selectComponent.set(component);
  }
}
