import { IsString, Length, IsInt } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  link: string;

  @IsString()
  image: string;

  @IsInt()
  price: number;

  @IsString()
  description: string;
}
