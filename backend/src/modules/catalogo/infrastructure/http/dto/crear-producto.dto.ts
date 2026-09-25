import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Length, Min } from 'class-validator';
import { TipoImpuesto } from '../../../domain/entities/producto.entity';

export class CrearProductoDto {
  @IsUUID()
  categoriaId!: string;

  @IsString()
  @Length(1, 150)
  nombre!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  descripcion?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio!: number;

  @IsOptional()
  @IsEnum(TipoImpuesto)
  tipoImpuesto?: TipoImpuesto;

  @IsOptional()
  @IsBoolean()
  enviarACocina?: boolean;
}
