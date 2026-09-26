import { IsNumber, Min } from 'class-validator';

export class AbrirTurnoDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoApertura!: number;
}
