import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';

@Module({
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService],
  imports: [TypeOrmModule.forFeature([Wish])],
})
export class WishesModule {}
