import { inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { lastValueFrom } from 'rxjs';
import { UserStore } from './user-store';

export const appInitializer = async () => {
  const userService = inject(UserService);
  const userStore = inject(UserStore);

  try {
    const userDetails = await lastValueFrom(userService.getUserDetails());
    userStore.setUser(userDetails);
  } catch (error) {
    // Todo: Show Toast
    console.error(error);
  }
  return null;
};
