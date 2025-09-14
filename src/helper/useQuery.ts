import { signal } from '@angular/core';
import { catchError, Observable, Subscription, tap, throwError } from 'rxjs';
import ApiResponse from '../types/response';
import { HttpErrorResponse } from '@angular/common/http';
import { QueryState } from '../types/asyncState';

export type UseQueryOptions<T, TArgs extends any[]> = {
  initialData: T;
  placeholder: T;
  idleOnInit?: boolean;
  onSuccess?: (data: T, ...args: TArgs) => void;
  onError?: (error: string) => void;
};

const useQuery = <TArgs extends any[], TResult>(
  queryFn: (...args: TArgs) => Observable<TResult>,
  options: UseQueryOptions<TResult, TArgs>
) => {
  const initialValue = {
    status: options.idleOnInit ? ('idle' as const) : ('loading' as const),
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
          options?.onSuccess?.(results, ...args);
        }),
        catchError((error: HttpErrorResponse) => {
          const errorObject = error.error;

          let errorMsg = '';
          if (errorObject instanceof ProgressEvent) {
            errorMsg = 'Unable to reach server';
          } else {
            errorMsg = (errorObject as ApiResponse<null>).msg?.[0] ?? 'Something went wrong';
          }

          console.error('Query Error: ', errorMsg, errorObject);

          state.set({
            status: 'error',
            data: options.placeholder,
            error: errorMsg,
          });
          options?.onError?.(errorMsg);
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
