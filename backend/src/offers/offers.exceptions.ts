import { HttpException, HttpStatus } from '@nestjs/common';

export class OfferOwnWishException extends HttpException {
  constructor() {
    super('Can not make for on own wish', HttpStatus.BAD_REQUEST);
  }
}

export class OfferAlreadyRaisedException extends HttpException {
  constructor() {
    super('Wish already raised money', HttpStatus.BAD_REQUEST);
  }
}

export class OfferOverRaisedException extends HttpException {
  constructor() {
    super('Amount is over raised money', HttpStatus.BAD_REQUEST);
  }
}
