export class HttpException extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = 'HttpException';
  }
}

// 400 - bad request
export class BadRequestException extends HttpException {
  constructor(message: string = 'Bad request') {
    super(message, 400);
    this.name = 'BadRequestException';
  }
}

// 401 - Unauthenticate
export class UnauthenticateException extends HttpException {
  constructor(message: string = 'Unauthenticate') {
    super(message, 401);
    this.name = 'UnauthenticateException';
  }
}

// 403 - Unauthorized
export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(message, 403);
    this.name = 'UnauthorizedException';
  }
}

// 404 - Not found
export class NotFoundException extends HttpException {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundException';
  }
}

// 409 - Duplicate content
export class DuplicateException extends HttpException {
  constructor(message: string = 'Duplicate content') {
    super(message, 409);
    this.name = 'DuplicateException';
  }
}

// 500 - Server error
export class InternalServerException extends HttpException {
  constructor(message: string = 'Internal server error occurred') {
    super(message, 500);
    this.name = 'InternalServerException';
  }
}
export class DatabaseException extends HttpException {
  constructor(message: string = 'Database error occurred') {
    super(message, 500);
    this.name = 'DatabaseException';
  }
}
