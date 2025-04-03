import { PartialType } from '@nestjs/swagger';
import { CreateWishDto } from './create-wish.dto';
import { Min, IsInt } from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsInt()
  @Min(1)
  raised: number;
}
