import { Routes } from '@angular/router';
import { HomeComponent } from './features/client/pages/home/home.component';
import { LoginComponent } from './features/client/pages/login/login.component';
import { RegisterComponent } from './features/client/pages/register/register.component';
import { TrackingComponent } from './features/client/pages/shipment-tracking/tracking.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'shipment-tracking',
    component: TrackingComponent
  }
];
