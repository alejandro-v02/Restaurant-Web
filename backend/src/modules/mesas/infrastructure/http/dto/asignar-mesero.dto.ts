import { IsOptional, IsUUID } from 'class-validator';

export class AsignarMeseroDto {
  @IsOptional()
  @IsUUID()
  meseroId?: string;
}
