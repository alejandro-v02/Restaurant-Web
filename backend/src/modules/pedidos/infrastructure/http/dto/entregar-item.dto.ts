import { IsInt, IsOptional, Min } from 'class-validator';

export class EntregarItemDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  cantidad?: number;
}
