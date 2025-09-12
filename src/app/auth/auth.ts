import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  isLogin = signal(true);

  onToggleAuthType() {
    this.isLogin.update((prev) => !prev);
  }
}
