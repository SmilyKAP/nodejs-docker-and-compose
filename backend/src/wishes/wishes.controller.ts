import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
@UseGuards(JwtGuard)
export class WishesController {
  constructor(private readonly _wishesService: WishesService) {}

  @Post()
  async create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this._wishesService.create(req.user, createWishDto);
  }

  @Get('last')
  findLast() {
    return this._wishesService.findMany({
      take: 40,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  @Get('top')
  findTop() {
    return this._wishesService.findMany({
      take: 20,
      order: {
        copied: 'DESC',
      },
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this._wishesService.findById(id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Body() updateWishDto: UpdateWishDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this._wishesService.updateWish(id, updateWishDto, req.user);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this._wishesService.delete(id, req.user);
  }

  @Post(':id/copy')
  copyWish(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this._wishesService.copyWish(id, req.user);
  }
}
