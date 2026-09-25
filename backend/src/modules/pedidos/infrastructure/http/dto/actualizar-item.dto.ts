import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class ActualizarItemDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  cantidad?: number;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  notas?: string;
}
