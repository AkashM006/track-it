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
} from '@ng-icons/ionicons';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expense-list',
  imports: [NgIcon, DatePipe],
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
    }),
  ],
})
export class ExpenseList {
  expenseService = inject(ExpenseService);
  expenses = this.expenseService.expenses;
}
