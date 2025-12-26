import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { API_ENDPOINTS, ROUTES, SESSION_KEYS } from '../../constant/common.constant';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem(SESSION_KEYS.TOKEN);

  const isLoggedIn = !!token?.length;

  const isAuthRoute = state.url.startsWith('/auth');

  // User NOT logged in trying to access protected route
  if (!isLoggedIn && !isAuthRoute) {
    return router.createUrlTree([`${ROUTES.auth}/${ROUTES.login}`]);
    API_ENDPOINTS.auth.login;
  }

  // User IS logged in trying to access auth pages
  if (isLoggedIn && isAuthRoute) {
    return router.createUrlTree([ROUTES.dashboard]);
  }

  return true;
};
