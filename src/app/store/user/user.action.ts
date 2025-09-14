import { createAction, props } from '@ngrx/store';
import { IUser } from '../../../types/user';

export const onUserRegister = createAction(
  '[Auth Page] Get User Details',
  props<{
    user: IUser;
  }>()
);
