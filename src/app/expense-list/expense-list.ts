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
import { IExpense } from '../../types/expense';
import { ICategory } from '../../types/category';
import CATEGORIES from '../categories';
import useMutation from '../../helper/useMutation';
import { Loader } from '../common/loader/loader';

@Component({
  selector: 'app-expense-list',
  imports: [NgIcon, DatePipe, CurrencyPipe, Loader],
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
  // inputs & outputs
  expenses = input.required<IExpense[]>();
  toggleCharts = output();
  selectExpense = output<IExpense>();
  deleteExpense = output<IExpense['id']>();

  // services
  expenseService = inject(ExpenseService);

  // signals used in template
  selectedCategory = signal<string>('all');
  categories = signal<ICategory[]>(CATEGORIES);
  selectedExpenses = computed(() => {
    const allExpenses = this.expenses();
    const selectedCategory = this.selectedCategory();

    if (selectedCategory === 'all') return allExpenses;

    return allExpenses.filter((expense) => expense.category.name === selectedCategory);
  });

  // Mutations
  deleteExpenseMutation = useMutation(
    (id: IExpense['id']) => this.expenseService.deleteExpense(id),
    {
      onSuccess: this.onExpenseDeleted.bind(this),
      onError: this.onExpenseDeleteError.bind(this),
    }
  );

  onDeleteExpense(id: IExpense['id']) {
    this.deleteExpenseMutation.mutate(id);
  }

  onExpenseDeleted(_: unknown, id: IExpense['id']) {
    this.deleteExpense.emit(id);
    // Todo: Maybe show a toast
  }

  onExpenseDeleteError(error: string) {
    // Todo: Show toast
    alert(error);
  }

  onCategoryChanged(event: Event) {
    const target = event.target as HTMLSelectElement;

    const selectedValue = target.value;

    this.selectedCategory.set(selectedValue);
  }

  onToggleCharts() {
    this.toggleCharts.emit();
  }

  onSelectExpense(expense: IExpense) {
    this.selectExpense.emit(expense);
  }
}
