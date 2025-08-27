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
      const expenses: (Omit<IExpense, 'date'> & { date: string })[] = JSON.parse(items);
      this.expensesSignal.set(
        expenses.map((expense) => ({ ...expense, date: new Date(expense.date) }))
      );
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

  deleteExpense(id: IExpense['id']) {
    this.expensesSignal.update((prev) => prev.filter((expense) => expense.id !== id));
    this.saveExpenses();
  }
}

export default ExpenseService;
