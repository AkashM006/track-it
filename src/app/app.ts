import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Header } from './header/header';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionAddOutline } from '@ng-icons/ionicons';
import { FormModal } from './form-modal/form-modal';
import { ExpenseList } from './expense-list/expense-list';
import { Charts } from './charts/charts';
import { IExpense } from '../types/expense';
import ExpenseService from './services/expense.service';

@Component({
  selector: 'app-root',
  imports: [Header, NgIcon, FormModal, ExpenseList, Charts],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  viewProviders: [provideIcons({ ionAddOutline })],
})
export class App {
  isFormOpen = signal(false);
  isChartsOpen = signal(false);

  expenseService = inject(ExpenseService);
  destroyRef = inject(DestroyRef);

  expensesObject = this.expenseService.getAllExpenses();
  expenses = computed(() => this.expensesObject().data ?? []);
  selectedExpense = signal<IExpense | null>(null);

  onNewExpense() {
    this.isFormOpen.set(true);
    this.selectedExpense.set(null);
  }

  onCloseExpenseForm() {
    this.isFormOpen.set(false);
    this.selectedExpense.set(null);
  }

  onToggleCharts() {
    this.isChartsOpen.update((prev) => !prev);
  }

  onSelectExpense(expense: IExpense) {
    this.selectedExpense.set(expense);
    this.isFormOpen.set(true);
  }
}
