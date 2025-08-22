import { computed, Injectable, signal } from '@angular/core';
import { IExpense } from './types/expense';

@Injectable({ providedIn: 'root' })
class ExpenseService {
  private expensesSignal = signal<IExpense[]>([]);
  totalExpense = computed<number>(() => {
    return this.expensesSignal().reduce((prev, expense) => prev + expense.amount, 0);
  });
  expensesCount = computed<number>(() => this.expensesSignal().length);

  get expenses() {
    return this.expensesSignal.asReadonly();
  }

  addExpense(newExpense: IExpense) {
    this.expensesSignal.update((prev) => [newExpense, ...prev]);
  }
}

export default ExpenseService;
