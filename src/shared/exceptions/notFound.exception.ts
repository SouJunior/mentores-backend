import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomNotFoundException extends HttpException {
  constructor(message: string) {
    super(`Not Found: ${message}`, HttpStatus.NOT_FOUND);
  }
}
