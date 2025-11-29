import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AgencyService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

}
