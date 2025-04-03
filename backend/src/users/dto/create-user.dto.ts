import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @Length(2, 200)
  about: string;

  @IsString()
  avatar?: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
