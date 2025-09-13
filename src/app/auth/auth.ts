import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionWalletOutline } from '@ng-icons/ionicons';

@Component({
  selector: 'app-auth',
  imports: [NgIcon],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  viewProviders: [
    provideIcons({
      ionWalletOutline,
    }),
  ],
})
export class Auth {
  isLogin = signal(true);

  onToggleAuthType() {
    this.isLogin.update((prev) => !prev);
  }
}
