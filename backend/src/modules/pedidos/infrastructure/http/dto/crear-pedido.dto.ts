import { IsInt, IsUUID, Min } from 'class-validator';

export class CrearPedidoDto {
  @IsUUID()
  mesaId!: string;

  @IsInt()
  @Min(1)
  personas!: number;
}
