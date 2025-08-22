import { Injectable, signal } from '@angular/core';
import { IExpense } from './types/expense';
import CATEGORIES from './categories';

const EXPENSES: IExpense[] = [
  {
    id: '1',
    name: 'BreakFast',
    amount: 100,
    category: CATEGORIES[0],
    date: new Date('2025-08-21T00:00:00Z'),
  },
  {
    id: '2',
    name: 'EB',
    amount: 300,
    category: CATEGORIES[3],
    date: new Date('2025-08-21T00:00:00Z'),
  },
  {
    id: '3',
    name: 'Bus Ticket',
    amount: 1300,
    category: CATEGORIES[1],
    date: new Date('2025-08-21T00:00:00Z'),
  },
  {
    id: '4',
    name: 'Dress',
    amount: 1300,
    category: CATEGORIES[2],
    date: new Date('2025-08-21T00:00:00Z'),
  },
  {
    id: '5',
    name: 'Donation',
    amount: 2500,
    category: CATEGORIES[4],
    date: new Date('2025-08-21T00:00:00Z'),
  },
];

@Injectable({ providedIn: 'root' })
class ExpenseService {
  private expensesSignal = signal<IExpense[]>(EXPENSES);

  get expenses() {
    return this.expensesSignal.asReadonly();
  }
}

export default ExpenseService;
