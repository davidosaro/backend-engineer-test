export default class AppError extends Error {
  statusCode: number;

  // The constructor method sets the error message and status code.
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
