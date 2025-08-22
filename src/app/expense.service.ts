import { computed, Injectable, signal } from '@angular/core';
import { IExpense } from './types/expense';

@Injectable({ providedIn: 'root' })
class ExpenseService {
  private expensesSignal = signal<IExpense[]>([]);
  totalExpense = computed<number>(() => {
    return this.expensesSignal().reduce((prev, expense) => prev + expense.amount, 0);
  });
  expensesCount = computed<number>(() => this.expensesSignal().length);

  constructor() {
    this.loadExpenses();
  }

  loadExpenses() {
    const items = localStorage.getItem('expenses');
    if (!items) {
      this.expensesSignal.set([]);
    } else {
      this.expensesSignal.set(JSON.parse(items));
    }
  }

  saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(this.expensesSignal()));
  }

  get expenses() {
    return this.expensesSignal.asReadonly();
  }

  addExpense(newExpense: IExpense) {
    this.expensesSignal.update((prev) => [newExpense, ...prev]);
    this.saveExpenses();
  }
}

export default ExpenseService;
