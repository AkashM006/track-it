import { inject, Injectable, Signal } from '@angular/core';
import { IExpense } from '../../types/expense';
import ApiResponse from '../../types/response';
import { API_LINK } from '../api.config';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
class ExpenseService {
  expenseRoute = '/expenses';
  requestHeaders = {
    'Content-Type': 'application/json',
  };

  private http = inject(HttpClient);

  getAllExpenses(): Observable<IExpense[]> {
    return this.http.get<ApiResponse<IExpense[]>>(`${API_LINK}${this.expenseRoute}`).pipe(
      // Transforming Data
      map((result) => {
        if (result.results) {
          const expenses = result.results!.map((expense) => ({
            ...expense,
            // Todo: The logic to handle amount must change
            amount: Number(expense.amount),
            date: new Date(expense.date),
          }));
          return expenses;
        }
        return [];
      })
    );
  }

  addExpense(newExpense: IExpense): Observable<IExpense | undefined> {
    const { name, amount, date } = newExpense;
    const categoryId = newExpense.category.id;

    const requestBody = {
      name,
      amount,
      date,
      categoryId,
    };

    return this.http
      .post<ApiResponse<IExpense>>(`${API_LINK}${this.expenseRoute}`, requestBody)
      .pipe(
        map((response) => {
          const expense = response.results;

          if (expense) {
            return {
              ...expense,
              // Todo: The logic to handle amount must change
              amount: Number(expense.amount),
              date: new Date(expense.date),
            };
          }

          return undefined;
        })
      );
  }

  updateExpense(newExpense: IExpense): Observable<IExpense | undefined> {
    const { name, amount, date } = newExpense;
    const categoryId = newExpense.category.id;

    const requestBody = {
      name,
      amount,
      date,
      categoryId,
    };

    return this.http
      .put<ApiResponse<IExpense>>(
        `${API_LINK}${this.expenseRoute}?id=${newExpense.id}`,
        requestBody
      )
      .pipe(
        map((response) => {
          const expense = response.results;

          if (expense) {
            return {
              ...expense,
              amount: Number(expense.amount),
              date: new Date(expense.date),
            };
          }
          return undefined;
        })
      );
  }

  deleteExpense(id: IExpense['id']): Observable<unknown> {
    return this.http.delete(`${API_LINK}${this.expenseRoute}?id=${id}`);
  }
}

export default ExpenseService;
