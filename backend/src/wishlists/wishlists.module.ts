import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishList } from './entities/wishlist.entity';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  controllers: [WishlistsController],
  providers: [WishlistsService],
  exports: [WishlistsService],
  imports: [TypeOrmModule.forFeature([WishList]), WishesModule],
})
export class WishlistsModule {}
