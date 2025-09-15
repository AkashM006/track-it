import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { authGuard } from './guards/auth/auth-guard';
import { Home } from './home/home';
import { guestGuard } from './guards/guest/guest-guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivateChild: [guestGuard],
    children: [
      {
        path: '',
        component: Auth,
        title: 'Track-It Login / Register',
      },
    ],
  },
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        component: Home,
      },
    ],
  },
];
