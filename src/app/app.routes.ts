import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { ChatWrapper } from './chat/chat-wrapper';
import { Chat } from './chat/chat/chat';
import { Dashboard } from './dashboard/dashboard';
import { APP_ROUTES, authGuard } from './shared';
import { isAdminGuard } from './shared/guards/isAdmin/is-admin-guard';
import { Workspace } from './workspace/workspace';
import { WorkspaceDetails } from './workspace/workspace-details/workspace-details';

export const routes: Routes = [
  {
    path: '',
    redirectTo: `${APP_ROUTES.auth}/${APP_ROUTES.login}`,
    pathMatch: 'full',
  },
  {
    path: APP_ROUTES.auth,
    children: [
      {
        path: APP_ROUTES.login,
        component: Login,
        canActivate: [authGuard],
      },
      {
        path: APP_ROUTES.signup,
        component: Signup,
        canActivate: [authGuard],
      },
      {
        path: APP_ROUTES.activateAdmin,
        component: Signup,
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: APP_ROUTES.workspace,
    canActivate: [authGuard],
    component: Dashboard,
    children: [
      {
        path: '',
        component: Workspace,
      },
      {
        path: ':workspaceId',
        children: [
          {
            path: '',
            component: WorkspaceDetails,
            canActivate: [isAdminGuard],
          },
          {
            component: ChatWrapper,
            path: 'chat',
            canActivate: [authGuard],
            children: [
              {
                path: '',
                component: Chat,
              },
              {
                path: ':chatId',
                component: Chat,
              },
            ],
          },
        ],
      },
    ],
  },
  // {
  //   path: '**',
  //   canActivate: [authGuard],
  //   redirectTo: 'auth/login',
  // },
];
