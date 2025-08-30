import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from './header/header';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionAddOutline } from '@ng-icons/ionicons';
import { FormModal } from './form-modal/form-modal';
import { ExpenseList } from './expense-list/expense-list';
import { Charts } from './charts/charts';
import { IExpense } from './types/expense';
import ExpenseService from './expense.service';

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

  async ngOnInit() {
    const result = await this.expenseService.getAllExpenses();
    if (!result || !result.success || !result.results) return;
    this.expenses.set(result.results);
  }

  onNewExpense() {
    this.isFormOpen.set(true);
  }

  onCloseExpenseForm() {
    this.isFormOpen.set(false);
  }

  onToggleCharts() {
    this.isChartsOpen.update((prev) => !prev);
  }
}
