import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [MatMenuModule, MatIconModule, MatButtonModule, MatToolbarModule, MatDividerModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  activeWorkspace!: any;
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
