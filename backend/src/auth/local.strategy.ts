import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private _authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this._authService.validatePassword(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
