import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserAlreadyExistException } from './auth.exceptions';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private _jwtService: JwtService,
    private _usersService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { id: user.id };

    return { access_token: this._jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this._usersService.findOne({ where: { username } });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return user;
      }
    }

    return null;
  }

  async signup(createUserDto: CreateUserDto) {
    let user = await this._usersService.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (user) {
      throw new UserAlreadyExistException();
    }
    user = await this._usersService.create(createUserDto);

    return this.auth(user);
  }
}
