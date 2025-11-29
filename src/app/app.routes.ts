import { Routes } from '@angular/router';
import { HomeComponent } from './features/client/pages/home/home.component';
import { LoginComponent } from './features/client/pages/login/login.component';
import { RegisterComponent } from './features/client/pages/register/register.component';
import { TrackingComponent } from './features/client/pages/shipment-tracking/tracking.component';
import { ShipmentForm } from './features/client/pages/shipment-form/shipment-form';
import { roleGuard } from './core/guards/role-guard';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';

export const routes: Routes = [
  // RUTAS PÚBLICAS
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'shipment-tracking', component: TrackingComponent },
  { path: 'shipment-form', component: ShipmentForm },

  // RUTAS PROTEGIDAS
  {
    path: 'admin-panel',
    canActivate: [roleGuard],
    data: { allowedRoles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/pages/admin-home/admin-home.component').then(m => m.AdminHomeComponent)
  },

  // RUTA NO AUTORIZADA
  { path: 'unauthorized', component: UnauthorizedComponent },

  // RUTA COMODIN
  { path: '**', redirectTo: '' }
];
