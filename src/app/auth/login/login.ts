import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

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

  constructor(private httpClient: HttpClient, private activatedRoute: ActivatedRoute) {
    console.log();
    this.activatedRoute.queryParamMap.subscribe({
      next: (data: ParamMap) => {
        console.log('Data from route', data);
        this.httpClient
          .get(`${environment.API_URL}/auth/google-verify?code=${data.get('code')}`)
          .subscribe({
            next: (res: any) => {
              console.log('GOOGLE LOGIN RESPONSE', res);
              // window.open(res?.data?.url, '_blank');
            },
          });
      },
    });
  }

  loginWithGoogle() {
    this.httpClient.get(`${environment.API_URL}/auth/google-login`).subscribe({
      next: (res: any) => {
        console.log('GOOGLE LOGIN RESPONSE', res);
        window.open(res?.data?.url, '_blank');
      },
    });
  }
}
