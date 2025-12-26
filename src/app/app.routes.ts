import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { Dashboard } from './dashboard/dashboard';
import { ROUTES } from './shared/constant/common.constant';
import { authGuard } from './shared/guards/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: `${ROUTES.auth}/${ROUTES.login}`,
    pathMatch: 'full',
  },
  {
    path: ROUTES.auth,
    children: [
      {
        path: ROUTES.login,
        component: Login,
        canActivate: [authGuard],
      },
      {
        path: ROUTES.signup,
        component: Signup,
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: ROUTES.dashboard,
    component: Dashboard,
    canActivate: [authGuard],
  },
  // {
  //   path: '**',
  //   canActivate: [authGuard],
  //   redirectTo: 'auth/login',
  // },
];
