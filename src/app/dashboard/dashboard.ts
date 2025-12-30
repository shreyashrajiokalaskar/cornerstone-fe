import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { API_ENDPOINTS, CommonHttpService, Header } from '@shared/resources';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [Header, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  authService = inject(AuthService);

  constructor(private commonHttpService: CommonHttpService) {
    this.commonHttpService.get(API_ENDPOINTS.users).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
