import { IsInt, IsOptional, IsString, IsUUID, Length, Min } from 'class-validator';

export class AgregarItemDto {
  @IsUUID()
  productoId!: string;

  @IsInt()
  @Min(1)
  cantidad!: number;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  notas?: string;
}
