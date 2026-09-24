import { IsBoolean, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class CrearCategoriaDto {
  @IsString()
  @Length(1, 100)
  nombre!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  orden?: number;

  @IsOptional()
  @IsBoolean()
  enviarACocina?: boolean;
}
