interface MutationState<T> {
  status: 'success' | 'loading' | 'error' | 'idle';
  error: string | null;
  data: T | null;
}

interface QueryState<T> {
  status: 'success' | 'loading' | 'error' | 'idle';
  error: string | null;
  data: T;
}

export type { QueryState, MutationState };
