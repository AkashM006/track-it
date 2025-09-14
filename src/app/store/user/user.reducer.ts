import { createReducer, on } from '@ngrx/store';
import { IUser } from '../../../types/user';
import { onUserRegister } from './user.action';

export interface UserState {
  user?: IUser;
}

export const intialState: UserState = {};

export const userReducer = createReducer(
  intialState,
  on(onUserRegister, (state, { user }) => ({ ...state, user }))
);
