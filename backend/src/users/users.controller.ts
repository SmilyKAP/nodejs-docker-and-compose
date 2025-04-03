import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { WishesService } from '../wishes/wishes.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _wishesService: WishesService,
  ) {}

  @Get('me')
  findOwn(@Req() req) {
    return req.user;
  }

  @Get('me/wishes')
  getOwnWishes(@Req() req) {
    const user = req.user;
    return this._wishesService.findMany({
      where: {
        owner: { id: user.id },
      },
    });
  }

  @Patch('me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this._usersService.updateOne(+req.user.id, updateUserDto);
  }

  @Get(':name')
  findOne(@Param('name') username: string) {
    return this._usersService.findUsers(username);
  }

  @Get(':name/wishes')
  getWishes(@Param('name') username: string) {
    return this._usersService.getWishes(username);
  }

  @Post('find')
  findMany(@Body() { query }: { query: string }) {
    return this._usersService.findMany({
      where: [{ username: query }, { email: query }],
    });
  }
}
