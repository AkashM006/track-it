import { Component, computed, inject, input, output, signal } from '@angular/core';
import ExpenseService from '../services/expense.service';
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
  expenses = input.required<IExpense[]>();
  expenseService = inject(ExpenseService);
  selectedCategory = signal<string>('all');
  categories = signal<ICategory[]>(CATEGORIES);
  toggleCharts = output();

  selectedExpenses = computed(() => {
    const allExpenses = this.expenses();
    const selectedCategory = this.selectedCategory();

    if (selectedCategory === 'all') return allExpenses;

    return allExpenses.filter((expense) => expense.category.name === selectedCategory);
  });

  async onDeleteExpense(id: IExpense['id']) {
    await this.expenseService.deleteExpense(id);
  }

  onCategoryChanged(event: Event) {
    const target = event.target as HTMLSelectElement;

    const selectedValue = target.value;

    this.selectedCategory.set(selectedValue);
  }

  onToggleCharts() {
    this.toggleCharts.emit();
  }
}
