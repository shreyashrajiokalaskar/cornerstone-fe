import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { APP_ROUTES } from '@shared/resources';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class Signup {
  signupForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  adminToken!: string;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );

    this.activatedRoute.queryParamMap.subscribe({
      next: (params: ParamMap) => {
        console.log('PARAMS', params);
        this.adminToken = params.get('token') as string;
        console.log('Activated ADMIN', this.adminToken);
        this.verifyToken();
      },
    });

    this.signupForm.valueChanges.subscribe({
      next: () => {
        console.log('VALUES', this.signupForm);
      },
    });
  }

  verifyToken() {
    this.authService.verifyAdminToken(this.adminToken).subscribe({
      next: () => {
        this.signupForm.removeControl('email');
        this.signupForm.updateValueAndValidity();
      },
      error: (err: HttpErrorResponse) => {
        this.toastrService.error(err.error.message);
        this.router.navigate([`${APP_ROUTES.auth}/${APP_ROUTES.login}`]);
      },
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      // Manually set the error on the specific field
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // If they match, we need to clear the manual error
      // but keep other errors (like 'required') if they exist
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }

  createAdmin() {
    if (this.signupForm.valid) {
      console.log('Signup Data:', this.signupForm.value);
      this.authService
        .createAdmin({
          password: this.signupForm.value['password'],
          name: this.signupForm.value['name'],
          token: this.adminToken,
        })
        .subscribe({
          next: (res) => {
            console.log(res);
            this.toastrService.success('Account created successfully!');
            this.router.navigate([`${APP_ROUTES.auth}/${APP_ROUTES.login}`]);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err.error.message);
            this.toastrService.error(err.error.message);
          },
        });
      // Proceed to: Create Workspace
    }
  }

  submit() {
    if (this.signupForm.valid) {
      console.log('Signup Data:', this.signupForm.value);
      this.authService
        .signupUser({
          email: this.signupForm.value['email'],
          password: this.signupForm.value['password'],
          name: this.signupForm.value['name'],
        })
        .subscribe({
          next: (res) => {
            console.log(res);
            this.toastrService.success('Account created successfully!');
            this.router.navigate([`${APP_ROUTES.auth}/${APP_ROUTES.login}`]);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err.error.message);
            this.toastrService.error(err.error.message);
          },
        });
      // Proceed to: Create Workspace
    }
  }
}
