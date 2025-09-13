import { Component, inject, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionWalletOutline } from '@ng-icons/ionicons';
import { FormsModule, NgForm } from '@angular/forms';
import useMutation from '../../helper/useMutation';
import { IRegisterUser } from '../../types/user';
import AuthService from '../services/auth.service';
import { Loader } from '../common/loader/loader';
import { FormErrorPipe } from '../pipes/form-error-pipe';

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
export class Auth {
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
  authService = inject(AuthService);

  // Mutations
  registerMutation = useMutation(
    (newUser: IRegisterUser) => this.authService.registerUser(newUser),
    {
      onSuccess: this.onUserRegistered.bind(this),
      onError: this.onUserRegisterError.bind(this),
    }
  );

  onToggleAuthType() {
    this.isLogin.update((prev) => !prev);
  }

  async onSubmit() {
    const { email, name, password, confirmPassword } = this.authForm();

    const isValid = this.authFormRef()?.valid;

    const emailControl = this.authFormRef()?.controls['password'];

    console.log({ ref: emailControl });

    if (!isValid) {
      return;
    }

    if (this.isLogin()) {
      // Todo: Call login mutation
    } else {
      if (password !== confirmPassword) {
        // Todo: Show toast
        alert('Password and confirm password do not match');
      }

      const newUser: IRegisterUser = { email, name, password };
      this.registerMutation.mutate(newUser);
    }
  }

  onUserRegistered() {
    // Todo: Use some kind of state management like ngRx to get the user details again and store here
    alert('User registered');
  }
  onUserRegisterError(error: string) {
    // Todo: Show Toast
    alert(error);
  }
}
