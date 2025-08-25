import { Component, computed, inject, signal } from '@angular/core';
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
import { ICategory } from '../types/category';
import CATEGORIES from '../categories';
import { Charts } from '../charts/charts';

@Component({
  selector: 'app-expense-list',
  imports: [NgIcon, DatePipe, CurrencyPipe, Charts],
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
  selectedCategory = signal<string>('all');
  categories = signal<ICategory[]>(CATEGORIES);
  showCharts = signal(false);

  expenses = computed(() => {
    const allExpenses = this.expenseService.expenses();
    const selectedCategory = this.selectedCategory();

    if (selectedCategory === 'all') return allExpenses;

    return allExpenses.filter((expense) => expense.category.name === selectedCategory);
  });

  onDeleteExpense(id: IExpense['id']) {
    this.expenseService.deleteExpense(id);
  }

  onCategoryChanged(event: Event) {
    const target = event.target as HTMLSelectElement;

    const selectedValue = target.value;

    this.selectedCategory.set(selectedValue);
  }

  onToggleCharts() {
    this.showCharts.update((prev) => !prev);
  }
}
