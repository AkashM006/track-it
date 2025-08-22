import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionTrendingDownOutline, ionWalletOutline } from '@ng-icons/ionicons';
import ExpenseService from '../expense.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgIcon, CurrencyPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  viewProviders: [
    provideIcons({
      ionWalletOutline,
      ionTrendingDownOutline,
    }),
  ],
})
export class Header {
  expenseService = inject(ExpenseService);

  totalAmount = this.expenseService.totalExpense;
  expensesCount = this.expenseService.expensesCount;
}
