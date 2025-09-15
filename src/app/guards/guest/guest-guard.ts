import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { UserStore } from '../../store/user/user-store';

export const guestGuard: CanActivateChildFn = (childRoute, state) => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  const isAuthenticated = userStore.isAuthenticated();

  if (!isAuthenticated) {
    return true;
  }

  return router.createUrlTree(['/']);
};
