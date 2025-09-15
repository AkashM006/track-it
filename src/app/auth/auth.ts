import { Component, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionWalletOutline } from '@ng-icons/ionicons';
import { FormsModule, NgForm } from '@angular/forms';
import useMutation from '../../helper/useMutation';
import { ILoginUser, IRegisterUser, IUser } from '../../types/user';
import AuthService from '../services/auth.service';
import { Loader } from '../common/loader/loader';
import { FormErrorPipe } from '../pipes/form-error/form-error-pipe';
import useQuery from '../../helper/useQuery';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { UserStore } from '../store/user/user-store';

@Component({
  selector: 'app-auth',
  imports: [NgIcon, FormsModule, Loader, FormErrorPipe],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  viewProviders: [
    provideIcons({
      ionWalletOutline,
    }),
  ],
})
export class Auth implements OnDestroy {
  // signals used in templates
  isLogin = signal(true);
  authForm = signal<{
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
  }>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  authFormRef = viewChild<NgForm>('authFormRef');

  // services
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private userStore = inject(UserStore);

  // Mutations
  registerMutation = useMutation(
    (newUser: IRegisterUser) => this.authService.registerUser(newUser),
    {
      onSuccess: this.onUserAuthComplete.bind(this),
      onError: this.onUserRegisterError.bind(this),
    }
  );
  loginMutation = useMutation((user: ILoginUser) => this.authService.loginUser(user), {
    onSuccess: this.onUserAuthComplete.bind(this),
    onError: this.onUserLoginError.bind(this),
  });

  // Queries
  userDetailsQuery = useQuery(() => this.userService.getUserDetails(), {
    initialData: null,
    placeholder: null,
    idleOnInit: true,
    onSuccess: this.onUserDetailSuccess.bind(this),
    onError: this.onUserDetailError.bind(this),
  });

  ngOnDestroy(): void {
    this.registerMutation.destroy();
    this.userDetailsQuery.destroy();
  }

  onUserDetailSuccess(user: IUser | null | undefined) {
    if (!user) {
      alert('Something went wrong when trying to get user details. Please try again');
      return;
    }
    this.userStore.setUser(user);
    this.router.navigate(['/']);
  }
  onUserDetailError(errorMsg: string) {
    alert(errorMsg);
  }

  onToggleAuthType() {
    this.isLogin.update((prev) => !prev);
  }

  async onSubmit() {
    const { email, name, password, confirmPassword } = this.authForm();

    const isValid = this.authFormRef()?.valid;

    if (!isValid) {
      return;
    }

    if (this.isLogin()) {
      // Todo: Call login mutation
      const user: ILoginUser = {
        email,
        password,
      };
      this.loginMutation.mutate(user);
    } else {
      if (password !== confirmPassword) {
        // Todo: Show toast
        alert('Password and confirm password do not match');
        return;
      }

      const newUser: IRegisterUser = { email, name, password };
      this.registerMutation.mutate(newUser);
    }
  }

  onUserAuthComplete() {
    this.userDetailsQuery.execute();
  }
  onUserRegisterError(error: string) {
    // Todo: Show Toast
    alert(error);
  }
  onUserLoginError(error: string) {
    // Todo: Show Toast
    alert(error);
  }
}
