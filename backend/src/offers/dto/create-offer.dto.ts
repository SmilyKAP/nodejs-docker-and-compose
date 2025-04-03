import { IsBoolean, IsInt, Min } from 'class-validator';

export class CreateOfferDto {
  @IsInt()
  @Min(1)
  itemId: number;

  @IsInt()
  @Min(1)
  amount: number;

  @IsBoolean()
  hidden?: boolean;
}
