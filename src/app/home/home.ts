import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { IExpense } from '../../types/expense';
import ExpenseService from '../services/expense.service';
import useQuery from '../../helper/useQuery';
import { Loader } from '../common/loader/loader';
import { Charts } from '../charts/charts';
import { ExpenseList } from '../expense-list/expense-list';
import { FormModal } from '../form-modal/form-modal';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { Header } from '../header/header';
import { ionAddOutline } from '@ng-icons/ionicons';

@Component({
  selector: 'app-home',
  imports: [Header, NgIcon, FormModal, ExpenseList, Charts, Loader],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  viewProviders: [provideIcons({ ionAddOutline })],
})
export class Home implements OnInit, OnDestroy {
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
        if (e.id !== expense.id) return e;

        return {
          ...expense,
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
