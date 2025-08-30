import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from './header/header';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionAddOutline } from '@ng-icons/ionicons';
import { FormModal } from './form-modal/form-modal';
import { ExpenseList } from './expense-list/expense-list';
import { Charts } from './charts/charts';
import { IExpense } from './types/expense';
import ExpenseService from './services/expense.service';

@Component({
  selector: 'app-root',
  imports: [Header, NgIcon, FormModal, ExpenseList, Charts],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  viewProviders: [provideIcons({ ionAddOutline })],
})
export class App implements OnInit {
  isFormOpen = signal(false);
  isChartsOpen = signal(false);

  expenses = signal<IExpense[]>([]);
  expenseService = inject(ExpenseService);
  selectedExpense = signal<IExpense | null>(null);

  async ngOnInit() {
    const result = await this.expenseService.getAllExpenses();
    if (!result || !result.success || !result.results) return;
    this.expenses.set(result.results);
  }

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
