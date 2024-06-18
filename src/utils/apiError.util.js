class ApiError extends Error {
  constructor(
    statusCode,
    message = "somthing went wrong",
    error = [],
    stack = ""
  ) {
    super(message);
    (this.statusCode = statusCode),
      (this.message = message),
      (this.error = error),
      (this.success = statusCode < 400);
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
