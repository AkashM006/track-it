import { Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionTrendingDownOutline, ionWalletOutline } from '@ng-icons/ionicons';
import { CurrencyPipe } from '@angular/common';
import { IExpense } from '../types/expense';

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
  expenses = input.required<IExpense[]>();

  totalAmount = computed(() => this.expenses().reduce((prev, expense) => prev + expense.amount, 0));
  expensesCount = computed(() => this.expenses().length);
}
