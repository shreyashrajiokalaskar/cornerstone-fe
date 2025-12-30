import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { APP_ROUTES, SESSION_KEYS } from '@shared/resources';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem(SESSION_KEYS.TOKEN);

  const isLoggedIn = !!token?.length;

  const isAuthRoute = state.url.startsWith('/auth');

  // User NOT logged in trying to access protected route
  if (!isLoggedIn && !isAuthRoute) {
    return router.createUrlTree([`${APP_ROUTES.auth}/${APP_ROUTES.login}`]);
  }

  // User IS logged in trying to access auth pages
  if (isLoggedIn && isAuthRoute) {
    return router.createUrlTree([APP_ROUTES.workspace]);
  }

  return true;
};
