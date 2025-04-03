import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import {
  OfferOwnWishException,
  OfferAlreadyRaisedException,
  OfferOverRaisedException,
} from './offers.exceptions';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private _offerRepository: Repository<Offer>,
    private _wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const wish = await this._wishesService.findOne({
      relations: { owner: true },
      where: { id: createOfferDto.itemId },
    });

    if (wish.owner.id === user.id) {
      throw new OfferOwnWishException();
    }

    if (+wish.raised >= +wish.price) {
      throw new OfferAlreadyRaisedException();
    }

    if (+wish.raised + createOfferDto.amount > wish.price) {
      throw new OfferOverRaisedException();
    }

    this._wishesService.update(wish.id, {
      raised: +wish.raised + createOfferDto.amount,
    });

    return this._offerRepository.save({
      ...createOfferDto,
      user,
    });
  }

  findMany(query: FindManyOptions<Offer>) {
    return this._offerRepository.find(query);
  }

  findOne(query: FindOneOptions<Offer>) {
    return this._offerRepository.findOne(query);
  }
}
