export interface IRegisterUser {
  email: string;
  name: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IUser {
  name: string;
  email: string;
}
