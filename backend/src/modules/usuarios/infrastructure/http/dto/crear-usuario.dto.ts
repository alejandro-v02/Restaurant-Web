import { IsEmail, IsEnum, IsString, Length, ValidateIf } from 'class-validator';
import { RolUsuario } from '../../../domain/entities/usuario.entity';

export class CrearUsuarioDto {
  @IsString()
  @Length(1, 150)
  nombre!: string;

  @IsEnum(RolUsuario)
  rol!: RolUsuario;

  @ValidateIf((dto: CrearUsuarioDto) => dto.rol !== RolUsuario.MESERO)
  @IsEmail()
  email?: string;

  @ValidateIf((dto: CrearUsuarioDto) => dto.rol !== RolUsuario.MESERO)
  @IsString()
  @Length(8, 100)
  password?: string;

  @ValidateIf((dto: CrearUsuarioDto) => dto.rol === RolUsuario.MESERO)
  @IsString()
  @Length(1, 30)
  codigo?: string;

  @ValidateIf((dto: CrearUsuarioDto) => dto.rol === RolUsuario.MESERO)
  @IsString()
  @Length(4, 12)
  pin?: string;
}
