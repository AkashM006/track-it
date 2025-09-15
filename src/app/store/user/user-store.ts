import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { IUser } from '../../../types/user';
import { computed } from '@angular/core';

type UserStore = {
  user: IUser | undefined | null;
};

const initialState: UserStore = {
  user: undefined,
};

export const UserStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withComputed(({ user }) => ({
    isAuthenticated: computed(() => user !== null && user !== undefined),
  })),
  withMethods((store) => ({
    setUser(user: UserStore['user']) {
      patchState(store, (state) => ({ ...state, user }));
    },
  }))
);
