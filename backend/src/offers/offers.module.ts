import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService],
  imports: [TypeOrmModule.forFeature([Offer]), WishesModule],
})
export class OffersModule {}
