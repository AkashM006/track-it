import { computed, Injectable, signal } from '@angular/core';
import { IExpense } from './types/expense';

@Injectable({ providedIn: 'root' })
class ExpenseService {
  addExpense(newExpense: IExpense) {
    // TODO
  }

  deleteExpense(id: IExpense['id']) {
    // TODO
  }
}

export default ExpenseService;
