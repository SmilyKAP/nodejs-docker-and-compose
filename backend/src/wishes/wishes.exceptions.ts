import { HttpException, HttpStatus } from '@nestjs/common';

export class WishAlreadyCopiedException extends HttpException {
  constructor() {
    super('User already copy this wish', HttpStatus.BAD_REQUEST);
  }
}
