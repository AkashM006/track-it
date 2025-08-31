import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Header } from './header/header';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionAddOutline } from '@ng-icons/ionicons';
import { FormModal } from './form-modal/form-modal';
import { ExpenseList } from './expense-list/expense-list';
import { Charts } from './charts/charts';
import { IExpense } from '../types/expense';
import ExpenseService from './services/expense.service';
import useQuery from '../helper/useQuery';

@Component({
  selector: 'app-root',
  imports: [Header, NgIcon, FormModal, ExpenseList, Charts],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  viewProviders: [provideIcons({ ionAddOutline })],
})
export class App implements OnInit, OnDestroy {
  isFormOpen = signal(false);
  isChartsOpen = signal(false);
  selectedExpense = signal<IExpense | null>(null);

  expenseService = inject(ExpenseService);

  expensesQuery = useQuery(() => this.expenseService.getAllExpenses(), {
    initialData: [],
    placeholder: [],
  });
  expenses = computed(() => this.expensesQuery.state().data);

  ngOnInit(): void {
    this.expensesQuery.execute();
  }

  ngOnDestroy(): void {
    this.expensesQuery.destroy();
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

  onAddExpense(expense: IExpense) {
    if (this.expensesQuery.state().status !== 'success') return;
    this.expensesQuery.state.update((prev) => ({
      ...prev,
      data: [...prev.data, expense],
    }));
  }

  onUpdateExpense(expense: IExpense) {
    if (this.expensesQuery.state().status !== 'success') return;
    this.expensesQuery.state.update((prev) => ({
      ...prev,
      data: prev.data.map((e) => {
        if (e.id === expense.id) return { ...expense };

        return {
          ...expense,
          id: e.id,
        };
      }),
    }));
  }

  onDeleteExpense(id: IExpense['id']) {
    if (this.expensesQuery.state().status !== 'success') return;
    this.expensesQuery.state.update((prev) => {
      return { ...prev, data: prev.data.filter((expense) => expense.id !== id) };
    });
  }
}
