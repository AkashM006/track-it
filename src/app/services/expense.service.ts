import { inject, Injectable, Signal } from '@angular/core';
import { IExpense } from '../../types/expense';
import ApiResponse from '../../types/response';
import { API_LINK } from '../api.config';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import ResourceState from '../../types/resourceState';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
class ExpenseService {
  expenseRoute = '/expenses';
  requestHeaders = {
    'Content-Type': 'application/json',
  };

  private http = inject(HttpClient);

  getAllExpenses(): Signal<ResourceState<IExpense[]>> {
    const expenses$ = this.http
      .get<ApiResponse<IExpense[]>>(`${API_LINK}${this.expenseRoute}`)
      .pipe(
        // Transforming Data
        // Todo: The logic to handle amount must change
        map((result) => {
          if (result.results) {
            const expenses = result.results!.map((expense) => ({
              ...expense,
              amount: Number(expense.amount),
              date: new Date(expense.date),
            }));
            return {
              status: 'success' as const,
              data: expenses,
              error: null,
            };
          }
          return {
            status: 'success' as const,
            data: [],
            error: null,
          };
        }),
        // Handling error
        catchError((error: HttpErrorResponse) => {
          const errorObject = error.error;

          if (errorObject instanceof ProgressEvent) {
            return of({
              status: 'error' as const,
              error: 'Unable to reach server',
              data: null,
            });
          }

          const apiError = errorObject as ApiResponse<null>;

          return of({
            status: 'error' as const,
            error: apiError.msg,
            data: null,
          });
        }),
        // Starting with a loading state
        startWith({ status: 'loading' as const, data: null, error: null })
      );

    type ExpenseResourceState = ResourceState<IExpense[]>;

    return toSignal<ExpenseResourceState, ExpenseResourceState>(expenses$, {
      initialValue: {
        status: 'loading',
        data: null,
        error: null,
      },
    });
  }

  // async getAllExpenses(): Promise<ApiResponse<IExpense[]>> {
  //   const response = await fetch(`${API_LINK}${this.expenseRoute}`);
  //   const result: ApiResponse<IExpense[]> = await response.json();
  //   // Todo: Change this logic later
  //   if (result.results) {
  //     result.results = result.results.map((expense) => ({
  //       ...expense,
  //       amount: Number(expense.amount),
  //       date: new Date(expense.date),
  //     }));
  //   }
  //   return result;
  // }

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
