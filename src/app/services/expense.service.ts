import { Injectable } from '@angular/core';
import { IExpense } from '../types/expense';
import ApiResponse from '../types/response';
import { API_LINK } from '../api.config';

@Injectable({ providedIn: 'root' })
class ExpenseService {
  async getAllExpenses(): Promise<ApiResponse<IExpense[]>> {
    const response = await fetch(`${API_LINK}/expenses`);
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

  async addExpense(newExpense: IExpense) {
    const { name, amount, date } = newExpense;
    const categoryId = newExpense.category.id;
    const response = await fetch(`${API_LINK}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expense: { name, amount, date, categoryId },
      }),
    });
  }

  deleteExpense(id: IExpense['id']) {
    // TODO
  }
}

export default ExpenseService;
