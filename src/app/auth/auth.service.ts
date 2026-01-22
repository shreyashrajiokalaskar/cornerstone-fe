import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  API_ENDPOINTS,
  APP_ROUTES,
  CommonHttpService,
  IHttpResponse,
  IUserDetails,
  SESSION_KEYS,
} from '@shared/resources';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private commonHttpClient: CommonHttpService,
    private router: Router,
    private toastrService: ToastrService,
  ) {}

  loginWithGoogle() {
    return this.commonHttpClient.get(API_ENDPOINTS.auth.googleLogin);
  }

  verifyGoogleCode(code: string, seed: string): Observable<IHttpResponse<IUserDetails>> {
    return this.commonHttpClient.get<IHttpResponse<IUserDetails>>(
      API_ENDPOINTS.auth.verifyCode(code, seed),
    );
  }

  set userData(userData: IUserDetails) {
    localStorage.setItem(SESSION_KEYS.USER, JSON.stringify(userData));
  }

  get userData(): IUserDetails {
    return JSON.parse(localStorage.getItem(SESSION_KEYS.USER) ?? '');
  }

  storeTokens(tokens: { token: string; refreshToken: string }) {
    localStorage.setItem(SESSION_KEYS.TOKEN, tokens.token ?? '');
    localStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, tokens.refreshToken ?? '');
    console.log('SETTING VALUES', tokens.token, tokens.refreshToken);
  }

  logout() {
    this.commonHttpClient
      .post(API_ENDPOINTS.auth.logout, {
        refreshToken: this.refreshToken,
      })
      .subscribe({
        next: () => {
          console.log('LOGOUT SUCCESSFUL!');
          localStorage.clear();
          this.toastrService.success('Logged out successfully!');
          this.router.navigate([`${APP_ROUTES.auth}/${APP_ROUTES.login}`]);
        },
      });
  }

  login(email: string, password: string) {
    return this.commonHttpClient.post<IHttpResponse<IUserDetails>>(API_ENDPOINTS.auth.login, {
      email,
      password,
    });
  }

  signupUser(userDetails: { name: string; password: string; email: string }) {
    return this.commonHttpClient.post<IHttpResponse<IUserDetails>>(
      API_ENDPOINTS.auth.signup,
      userDetails,
    );
  }

  refresh() {
    const refreshToken = localStorage.getItem(SESSION_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      localStorage.clear();
      this.router.navigate([`${APP_ROUTES.auth}/${APP_ROUTES.login}`]);
      return EMPTY;
    }
    return this.commonHttpClient
      .post<{ data: { token: string; refreshToken: string } }>(API_ENDPOINTS.auth.refresh, {
        refreshToken,
      })
      .pipe(
        tap((tokens) => {
          console.log('THIS ARE THE TOKENS FROM REFRESH', tokens);
          window.alert(JSON.stringify(tokens));
          this.storeTokens(tokens.data);
        }),
        catchError((error) => {
          console.log('ERROR DURING TOKEN REFRESH', error);
          localStorage.clear();
          this.router.navigate([`${APP_ROUTES.auth}/${APP_ROUTES.login}`]);
          return EMPTY;
        }),
      );
  }

  verifyAdminToken(token: string) {
    return this.commonHttpClient.get<IHttpResponse<any>>(API_ENDPOINTS.auth.verifyAdminCode(token));
  }

  createAdmin(userDetails: { name: string; password: string; token: string }) {
    return this.commonHttpClient.post<IHttpResponse<IUserDetails>>(
      API_ENDPOINTS.auth.createAdmin,
      userDetails,
    );
  }

  set role(role: string) {
    localStorage.setItem(SESSION_KEYS.ROLE, role);
  }

  get role(): string {
    return localStorage.getItem(SESSION_KEYS.ROLE) as string;
  }

  set token(authToken: string) {
    localStorage.setItem(SESSION_KEYS.TOKEN, authToken);
  }

  get token(): string {
    return localStorage.getItem(SESSION_KEYS.TOKEN) as string;
  }

  set refreshToken(token: string) {
    localStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, token);
  }

  get refreshToken(): string {
    return localStorage.getItem(SESSION_KEYS.REFRESH_TOKEN) as string;
  }
}
