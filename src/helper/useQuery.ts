import { signal } from '@angular/core';
import { catchError, Observable, Subscription, tap, throwError } from 'rxjs';
import ApiResponse from '../types/response';
import { HttpErrorResponse } from '@angular/common/http';
import { QueryState } from '../types/asyncState';

export type UseQueryOptions<T> = {
  initialData: T;
  placeholder: T;
};

const useQuery = <TArgs extends any[], TResult>(
  queryFn: (...args: TArgs) => Observable<TResult>,
  options: UseQueryOptions<TResult>
) => {
  const initialValue = {
    status: 'loading' as const,
    error: null,
    data: options.initialData,
  };

  const state = signal<QueryState<TResult>>(initialValue);

  let subscription: Subscription | undefined;

  const execute = (...args: TArgs) => {
    state.update((prev) => ({
      ...prev,
      status: 'loading',
      error: null,
    }));

    subscription?.unsubscribe();

    subscription = queryFn(...args)
      .pipe(
        tap((results) => {
          state.set({
            status: 'success',
            data: results ?? options.placeholder,
            error: null,
          });
        }),
        catchError((error: HttpErrorResponse) => {
          const errorObject = error.error;

          let errorMsg = '';
          if (errorObject instanceof ProgressEvent) {
            errorMsg = 'Unable to reach server';
          } else {
            errorMsg = (errorObject as ApiResponse<null>).msg?.[0] ?? 'Something went wrong';
          }
          state.set({
            status: 'error',
            data: options.placeholder,
            error: errorMsg,
          });
          return throwError(() => error);
        })
      )
      .subscribe();
  };

  const destroy = () => {
    subscription?.unsubscribe();
  };

  return { execute, destroy, state };
};

export default useQuery;
