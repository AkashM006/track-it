import { Injectable } from '@angular/core';
import { IExpense } from './types/expense';
import ApiResponse from './types/response';

@Injectable({ providedIn: 'root' })
class ExpenseService {
  async getAllExpenses(): Promise<ApiResponse<IExpense[]>> {
    const response = await fetch('http://localhost:5000/expenses', {});
    const result: ApiResponse<IExpense[]> = await response.json();
    // Todo: Change this logic later
    if (result.results) {
      result.results = result.results.map((expense) => ({
        ...expense,
        amount: Number(expense.amount),
      }));
    }
    return result;
  }

  addExpense(newExpense: IExpense) {
    // TODO
  }

  deleteExpense(id: IExpense['id']) {
    // TODO
  }
}

export default ExpenseService;
