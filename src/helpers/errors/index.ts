import { HttpStatus, RESPONSE_MESSAGES } from "../constants";

import AppError from "./app-error";

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = "InternalServerError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
    this.name = "UnauthorizedError";
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
    this.name = "BadRequestError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
    this.name = "ForbiddenError";
  }
}

export class AlreadyApprovedError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
    this.name = "AlreadyApprovedError";
  }
}

export class AlreadyProcessedError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
    this.name = "AlreadyApprovedError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
    this.name = "NotFoundError";
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
    this.name = "UnprocessableEntityError";
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
    this.name = "ExternalServiceError";
  }
}

export class InvalidPropertyError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
    this.name = "InvalidPropertyError";
  }
}

export class RequiredParameterError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
    this.name = "RequiredParameterError";
  }
}

export class InsufficientPermissions extends AppError {
  constructor(message = RESPONSE_MESSAGES.INSUFFICIENT_PERMISSIONS) {
    super(message, HttpStatus.FORBIDDEN);
    this.name = "InsufficientPermissions";
  }
}
