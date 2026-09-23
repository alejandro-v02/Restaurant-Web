import { IsString, Length } from 'class-validator';

export class LoginPinDto {
  @IsString()
  @Length(1, 30)
  codigo!: string;

  @IsString()
  @Length(4, 8)
  pin!: string;
}
