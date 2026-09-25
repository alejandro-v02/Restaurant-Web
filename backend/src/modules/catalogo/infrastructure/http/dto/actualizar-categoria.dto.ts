import { IsBoolean, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class ActualizarCategoriaDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombre?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  orden?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
