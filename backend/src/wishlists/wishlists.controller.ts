import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly _wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    return this._wishlistsService.create(createWishlistDto, req.user);
  }

  @Get()
  findAll() {
    return this._wishlistsService.findMany({});
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this._wishlistsService.findById(id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this._wishlistsService.update(id, updateWishlistDto, req.user);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this._wishlistsService.remove(id, req.user);
  }
}
