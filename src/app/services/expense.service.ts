import { Injectable } from '@angular/core';
import { IExpense } from '../types/expense';
import ApiResponse from '../types/response';
import { API_LINK } from '../api.config';

@Injectable({ providedIn: 'root' })
class ExpenseService {
  expenseRoute = '/expenses';
  requestHeaders = {
    'Content-Type': 'application/json',
  };

  async getAllExpenses(): Promise<ApiResponse<IExpense[]>> {
    const response = await fetch(`${API_LINK}${this.expenseRoute}`);
    const result: ApiResponse<IExpense[]> = await response.json();
    // Todo: Change this logic later
    if (result.results) {
      result.results = result.results.map((expense) => ({
        ...expense,
        amount: Number(expense.amount),
        date: new Date(expense.date),
      }));
    }
    return result;
  }

  async addExpense(newExpense: IExpense) {
    const { name, amount, date } = newExpense;
    const categoryId = newExpense.category.id;

    const requestBody = {
      expense: {
        name,
        amount,
        date,
        categoryId,
      },
    };

    const response = await fetch(`${API_LINK}${this.expenseRoute}`, {
      method: 'POST',
      headers: this.requestHeaders,
      body: JSON.stringify(requestBody),
    });
  }

  async updateExpense(newExpense: IExpense) {
    const { name, amount, date } = newExpense;
    const categoryId = newExpense.category.id;

    const requestBody = {
      expense: {
        name,
        amount,
        date,
        categoryId,
      },
    };

    const response = await fetch(`${API_LINK}${this.expenseRoute}?id=${newExpense.id}`, {
      method: 'PUT',
      headers: this.requestHeaders,
      body: JSON.stringify(requestBody),
    });
  }

  async deleteExpense(id: IExpense['id']) {
    const response = await fetch(`${API_LINK}${this.expenseRoute}?id=${id}`, {
      method: 'DELETE',
    });
  }
}

export default ExpenseService;
