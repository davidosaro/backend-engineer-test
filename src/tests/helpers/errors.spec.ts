import { InternalServerError, ConflictError, UnauthorizedError, BadRequestError, ForbiddenError, AlreadyApprovedError, AlreadyProcessedError, NotFoundError, UnprocessableEntityError, ExternalServiceError, InvalidPropertyError, RequiredParameterError, InsufficientPermissions } from "../../helpers/errors";
import { HttpStatus, RESPONSE_MESSAGES } from "../../helpers/constants";

describe("Custom Error Classes", () => {
  it("should create an InternalServerError with correct properties", () => {
    const error = new InternalServerError("Internal server error occurred");
    expect(error.message).toBe("Internal server error occurred");
    expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(error.name).toBe("InternalServerError");
  });

  it("should create a ConflictError with correct properties", () => {
    const error = new ConflictError("Conflict error occurred");
    expect(error.message).toBe("Conflict error occurred");
    expect(error.statusCode).toBe(HttpStatus.CONFLICT);
    expect(error.name).toBe("ConflictError");
  });

  it("should create an UnauthorizedError with correct properties", () => {
    const error = new UnauthorizedError("Unauthorized access");
    expect(error.message).toBe("Unauthorized access");
    expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    expect(error.name).toBe("UnauthorizedError");
  });

  it("should create a BadRequestError with correct properties", () => {
    const error = new BadRequestError("Bad request error");
    expect(error.message).toBe("Bad request error");
    expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(error.name).toBe("BadRequestError");
  });

  it("should create a ForbiddenError with correct properties", () => {
    const error = new ForbiddenError("Forbidden access");
    expect(error.message).toBe("Forbidden access");
    expect(error.statusCode).toBe(HttpStatus.FORBIDDEN);
    expect(error.name).toBe("ForbiddenError");
  });

  it("should create an AlreadyApprovedError with correct properties", () => {
    const error = new AlreadyApprovedError("Already approved error");
    expect(error.message).toBe("Already approved error");
    expect(error.statusCode).toBe(HttpStatus.CONFLICT);
    expect(error.name).toBe("AlreadyApprovedError");
  });

  it("should create an AlreadyProcessedError with correct properties", () => {
    const error = new AlreadyProcessedError("Already processed error");
    expect(error.message).toBe("Already processed error");
    expect(error.statusCode).toBe(HttpStatus.CONFLICT);
    expect(error.name).toBe("AlreadyApprovedError");
  });

  it("should create a NotFoundError with correct properties", () => {
    const error = new NotFoundError("Not found error");
    expect(error.message).toBe("Not found error");
    expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(error.name).toBe("NotFoundError");
  });

  it("should create an UnprocessableEntityError with correct properties", () => {
    const error = new UnprocessableEntityError("Unprocessable entity error");
    expect(error.message).toBe("Unprocessable entity error");
    expect(error.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(error.name).toBe("UnprocessableEntityError");
  });

  it("should create an ExternalServiceError with correct properties", () => {
    const error = new ExternalServiceError("External service error", 503);
    expect(error.message).toBe("External service error");
    expect(error.statusCode).toBe(503);
    expect(error.name).toBe("ExternalServiceError");
  });

  it("should create an InvalidPropertyError with correct properties", () => {
    const error = new InvalidPropertyError("Invalid property error");
    expect(error.message).toBe("Invalid property error");
    expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(error.name).toBe("InvalidPropertyError");
  });

  it("should create a RequiredParameterError with correct properties", () => {
    const error = new RequiredParameterError("Required parameter missing");
    expect(error.message).toBe("Required parameter missing");
    expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(error.name).toBe("RequiredParameterError");
  });

  it("should create an InsufficientPermissions error with default message", () => {
    const error = new InsufficientPermissions();
    expect(error.message).toBe(RESPONSE_MESSAGES.INSUFFICIENT_PERMISSIONS);
    expect(error.statusCode).toBe(HttpStatus.FORBIDDEN);
    expect(error.name).toBe("InsufficientPermissions");
  });

  it("should create an InsufficientPermissions error with custom message", () => {
    const error = new InsufficientPermissions("Custom insufficient permissions message");
    expect(error.message).toBe("Custom insufficient permissions message");
    expect(error.statusCode).toBe(HttpStatus.FORBIDDEN);
    expect(error.name).toBe("InsufficientPermissions");
  });
});
