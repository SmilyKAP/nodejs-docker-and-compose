import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { WishAlreadyCopiedException } from './wishes.exceptions';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private _wishRepository: Repository<Wish>,
  ) {}

  create(user: User, createWishDto: CreateWishDto) {
    return this._wishRepository.save({
      ...createWishDto,
      owner: user,
    });
  }

  findMany(query: FindManyOptions<Wish>) {
    return this._wishRepository.find(query);
  }

  findOne(query: FindOneOptions<Wish>) {
    return this._wishRepository.findOne(query);
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return this._wishRepository.update({ id }, updateWishDto);
  }

  async findById(id: number) {
    const wish = await this.findOne({
      relations: { owner: true },
      where: { id },
    });
    if (!wish) {
      throw new NotFoundException();
    }

    return wish;
  }

  async updateWish(id: number, updateWishDto: UpdateWishDto, user: User) {
    const wish = await this.findOne({
      where: { id, owner: { id: user.id } },
    });
    if (!wish) {
      throw new NotFoundException();
    }
    if (wish.raised) {
      delete updateWishDto.price;
    }
    delete updateWishDto.raised;
    return this.update(id, updateWishDto);
  }

  async delete(id: number, user: User) {
    const wish = await this.findOne({
      where: { id, owner: { id: user.id } },
    });
    if (!wish) {
      throw new NotFoundException();
    }
    return this._wishRepository.delete({ id });
  }

  async copyWish(id: number, user: User) {
    const wish = await this.findOne({ where: { id } });
    if (!wish) {
      throw new NotFoundException();
    }

    const alreadyExistWish = await this.findOne({
      where: {
        owner: { id: user.id },
        copiedWishId: wish.id,
      },
    });
    if (alreadyExistWish) {
      throw new WishAlreadyCopiedException();
    }

    return this._wishRepository.save({
      copiedWishId: wish.id,
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: user,
    });
  }
}
