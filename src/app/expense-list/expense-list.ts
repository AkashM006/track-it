import { Component, inject } from '@angular/core';
import ExpenseService from '../expense.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionAirplaneOutline,
  ionBagHandleOutline,
  ionCloseOutline,
  ionDocumentOutline,
  ionEllipsisHorizontalOutline,
  ionFastFoodOutline,
  ionTrashBinOutline,
} from '@ng-icons/ionicons';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IExpense } from '../types/expense';

@Component({
  selector: 'app-expense-list',
  imports: [NgIcon, DatePipe, CurrencyPipe],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.scss',
  viewProviders: [
    provideIcons({
      ionCloseOutline,
      ionFastFoodOutline,
      ionAirplaneOutline,
      ionBagHandleOutline,
      ionDocumentOutline,
      ionEllipsisHorizontalOutline,
      ionTrashBinOutline,
    }),
  ],
})
export class ExpenseList {
  expenseService = inject(ExpenseService);
  expenses = this.expenseService.expenses;

  onDeleteExpense(id: IExpense['id']) {
    this.expenseService.deleteExpense(id);
  }
}
