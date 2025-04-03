import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WishesService } from '../wishes/wishes.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private _userRepository: Repository<User>,
    private _wishesService: WishesService,
  ) {}

  async create(user: CreateUserDto) {
    const hash = await bcrypt.hash(user.password, 10);
    return this._userRepository.save({
      ...user,
      password: hash,
    });
  }

  findMany(query: FindManyOptions<User>) {
    return this._userRepository.find(query);
  }

  findOne(query: FindOneOptions<User>) {
    return this._userRepository.findOne(query);
  }

  async updateOne(id: number, user: UpdateUserDto) {
    if (user.password) {
      const hash = await bcrypt.hash(user.password, 10);
      return this._userRepository.update(
        { id },
        {
          ...user,
          password: hash,
        },
      );
    }

    return this._userRepository.update({ id }, user);
  }

  async findUsers(username: string) {
    const user = await this.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getWishes(username: string) {
    const user = await this.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return this._wishesService.findMany({
      where: {
        owner: { id: user.id },
      },
    });
  }
}
