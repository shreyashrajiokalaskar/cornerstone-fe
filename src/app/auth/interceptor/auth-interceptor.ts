// import { HttpInterceptorFn } from '@angular/common/http';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth.service';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.token;
    console.log(req.url)

    if(req.url.includes('aws')){
      return next.handle(req);
    }

    const request = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.authService.refresh().pipe(
            switchMap((tokens) => {
              window.alert(tokens.data.token);
              const retry = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.data.token}`,
                },
              });
              return next.handle(retry);
            }),
            catchError(() => {
              this.authService.logout();
              return EMPTY;
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
