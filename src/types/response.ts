interface ApiResponse<T> {
  success: boolean;
  msg: string[];
  results: T | undefined;
}

export default ApiResponse;
