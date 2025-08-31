import { signal } from '@angular/core';
import { catchError, Observable, Subscription, tap, throwError } from 'rxjs';
import { MutationState } from '../types/asyncState';
import { HttpErrorResponse } from '@angular/common/http';
import ApiResponse from '../types/response';

export type UseMutationOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
};

const useMutation = <TArgs extends any[], TResult>(
  mutationFn: (...args: TArgs) => Observable<TResult>,
  options: UseMutationOptions<TResult> = {}
) => {
  const initialValue = {
    status: 'idle' as const,
    error: null,
    data: null,
  };

  const state = signal<MutationState<TResult>>(initialValue);

  let subscription: Subscription | undefined;

  const mutate = (...args: TArgs) => {
    state.set({
      error: null,
      data: null,
      status: 'loading',
    });

    subscription?.unsubscribe();

    subscription = mutationFn(...args)
      .pipe(
        tap((data) => {
          state.set({
            error: null,
            data,
            status: 'success',
          });
          options?.onSuccess?.(data);
        }),
        catchError((error: HttpErrorResponse) => {
          const errorObject = error.error;

          let errorMsg = '';
          if (errorObject instanceof ProgressEvent) {
            errorMsg = 'Unable to reach server';
          } else {
            errorMsg = (errorObject as ApiResponse<null>).msg;
          }

          state.set({
            error: errorMsg,
            data: null,
            status: 'error',
          });
          options?.onError?.(errorMsg);
          return throwError(() => errorMsg);
        })
      )
      .subscribe();
  };

  const destroy = () => {
    subscription?.unsubscribe();
  };

  return { mutate, state, destroy };
};

export default useMutation;
