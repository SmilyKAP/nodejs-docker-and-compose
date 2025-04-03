import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishList } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private _wishListRepository: Repository<WishList>,
    private _wishesService: WishesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, user: User) {
    const items = await this._wishesService.findMany({
      where: createWishlistDto.itemsId.map((id) => ({ id })),
    });
    return this._wishListRepository.save({
      ...createWishlistDto,
      items,
      owner: user,
    });
  }

  findMany(query: FindManyOptions<WishList>) {
    return this._wishListRepository.find(query);
  }

  findOne(query: FindOneOptions<WishList>) {
    return this._wishListRepository.findOne(query);
  }

  async findById(id: number) {
    const wishList = await this.findOne({
      relations: { items: true },
      where: { id },
    });
    if (!wishList) {
      throw new NotFoundException();
    }

    return wishList;
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto, user: User) {
    const wishList = await this.findOne({
      where: { id, owner: { id: user.id } },
    });
    if (!wishList) {
      throw new NotFoundException();
    }
    const items = await this._wishesService.findMany({
      where: updateWishlistDto.itemsId.map((id) => ({ id })),
    });

    return this._wishListRepository.update(
      { id },
      {
        ...updateWishlistDto,
        items,
      },
    );
  }

  async remove(id: number, user: User) {
    const wishList = await this.findOne({
      where: { id, owner: { id: user.id } },
    });
    if (!wishList) {
      throw new NotFoundException();
    }
    return this._wishListRepository.delete(id);
  }
}
