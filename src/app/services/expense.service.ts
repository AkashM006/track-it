import { inject, Injectable, Signal } from '@angular/core';
import { IExpense } from '../../types/expense';
import ApiResponse from '../../types/response';
import { API_LINK } from '../api.config';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, startWith, throwError } from 'rxjs';
import ResourceState from '../../types/resourceState';
import { toSignal } from '@angular/core/rxjs-interop';

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
      // Todo: The logic to handle amount must change
      map((result) => {
        if (result.results) {
          const expenses = result.results!.map((expense) => ({
            ...expense,
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
      expense: {
        name,
        amount,
        date,
        categoryId,
      },
    };

    return this.http
      .post<ApiResponse<IExpense>>(`${API_LINK}${this.expenseRoute}`, requestBody)
      .pipe(
        map((response) => response.results),
        catchError((error) => {
          const errorObject = error.error;

          if (errorObject instanceof ProgressEvent) {
            return throwError(() => 'Unable to reach server');
          }

          const apiError = errorObject as ApiResponse<null>;

          return throwError(() => apiError.msg);
        })
      );
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
