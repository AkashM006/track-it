interface ResourceState<T> {
  status: 'success' | 'error' | 'loading';
  data: T | null;
  error: string | null;
}

export default ResourceState;
