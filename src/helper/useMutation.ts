import { signal } from '@angular/core';
import { catchError, Observable, of, Subscription, tap } from 'rxjs';

export type MutationState<T> = {
  status: 'success' | 'loading' | 'error' | 'idle';
  error: string | null;
  data: T | null;
};

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
        catchError((err: string) => {
          state.set({
            error: err,
            data: null,
            status: 'error',
          });
          options?.onError?.(err);
          return of(null);
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
