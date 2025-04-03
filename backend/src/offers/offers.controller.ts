import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('offers')
export class OffersController {
  constructor(private readonly _offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return this._offersService.create(createOfferDto, req.user);
  }

  @Get()
  @UseGuards(JwtGuard)
  findAll(@Req() req) {
    return this._offersService.findMany({ where: { user: req.user } });
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this._offersService.findOne({ where: { user: req.user, id } });
  }
}
