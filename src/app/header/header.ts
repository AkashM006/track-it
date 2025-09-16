import { Component, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionLogOutOutline, ionTrendingDownOutline, ionWalletOutline } from '@ng-icons/ionicons';
import { CurrencyPipe } from '@angular/common';
import { IExpense } from '../../types/expense';
import { UserStore } from '../store/user/user-store';
import AuthService from '../services/auth.service';
import useMutation from '../../helper/useMutation';
import { Router } from '@angular/router';
import { Loader } from '../common/loader/loader';

@Component({
  selector: 'app-header',
  imports: [NgIcon, CurrencyPipe, Loader],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  viewProviders: [
    provideIcons({
      ionWalletOutline,
      ionTrendingDownOutline,
      ionLogOutOutline,
    }),
  ],
})
export class Header {
  expenses = input.required<IExpense[]>();

  userStore = inject(UserStore);
  authService = inject(AuthService);
  router = inject(Router);

  logoutMutation = useMutation(() => this.authService.logoutUser(), {
    onSuccess: this.onUserLogout.bind(this),
    onError: this.onUserLogoutError.bind(this),
  });

  user = this.userStore.user;

  totalAmount = computed(() => this.expenses().reduce((prev, expense) => prev + expense.amount, 0));
  expensesCount = computed(() => this.expenses().length);

  onUserLogout() {
    this.userStore.logout();
    this.router.navigate(['/auth']);
  }
  onUserLogoutError(errorMsg: string) {
    alert(errorMsg);
  }

  onLogout() {
    this.logoutMutation.mutate();
  }
}
