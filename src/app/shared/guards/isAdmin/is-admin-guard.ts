import { CanActivateFn } from '@angular/router';
import { ROLES, SESSION_KEYS } from '../../constant/common.constant';

export const isAdminGuard: CanActivateFn = (route, state) => {
  console.log('isAdminGuard check', localStorage.getItem(SESSION_KEYS.ROLE), ROLES.ADMIN);
  return localStorage.getItem(SESSION_KEYS.ROLE) === ROLES.ADMIN;
};
