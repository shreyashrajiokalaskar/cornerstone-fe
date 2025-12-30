import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { IHttpResponse, IUserDetails, SESSION_KEYS } from '@shared/resources';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  hidePassword = true;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    console.log('this.activatedRoute.url');
    if (this.router.url.includes('code')) {
      this.verifyGoogleCode();
    }
  }

  verifyGoogleCode() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const paramValue = params['paramName'];
      console.log(paramValue);
      this.authService.verifyGoogleCode(params['code'], params['state']).subscribe({
        next: (res: IHttpResponse<IUserDetails>) => {
          console.log('GOOGLE LOGIN RESPONSE', res);
          if (res.success) {
            this.toastr.success('Logged In successfully!');
            this.authService.userData = res.data;
            localStorage.setItem(SESSION_KEYS.TOKEN, res.data.token as string);
            this.toastr.success('Logged In successfully!');
            this.router.navigate(['/workspace']);
          } else {
            this.toastr.error('Something went wrong! Try again.');
            this.authService.logout();
          }
        },
        error: () => {
          this.toastr.error('Something went wrong! Try again.');
          this.authService.logout();
        },
      });
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe({
      next: (res: any) => {
        console.log('GOOGLE LOGIN RESPONSE', res);
        window.open(res?.data?.url, '');
      },
    });
  }

  login() {
    this.authService
      .login(this.loginForm.value.email as string, this.loginForm.value.password as string)
      .subscribe({
        next: (details: IHttpResponse<IUserDetails>) => {
          this.authService.userData = { email: details.data.email, name: details.data.name };
          this.authService.token = details.data.token as string;
          this.authService.refreshToken = details.data.refreshToken as string;
          this.toastr.success('Logged In successfully!');
          this.router.navigate(['/workspace']);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err.error.message);
          this.toastr.error(err.error.message);
        },
      });
  }
}
