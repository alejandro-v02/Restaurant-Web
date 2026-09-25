import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { MetodoPago } from '../../../domain/entities/pago.entity';

export class CobrarPedidoDto {
  @IsEnum(MetodoPago)
  metodo!: MetodoPago;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  propina?: number;
}
