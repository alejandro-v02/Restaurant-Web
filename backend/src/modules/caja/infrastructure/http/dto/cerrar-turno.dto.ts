import { IsNumber, Min } from 'class-validator';

export class CerrarTurnoDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoCierre!: number;
}
