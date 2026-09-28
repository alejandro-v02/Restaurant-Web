import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USUARIO_REPOSITORY } from '../domain/ports/usuario.repository.port';
import type { UsuarioRepository } from '../domain/ports/usuario.repository.port';
import { RolUsuario, Usuario } from '../domain/entities/usuario.entity';
import { UsuarioResumen, aUsuarioResumen } from './usuario-resumen';

const RONDAS_HASH = 10;

export interface CrearUsuarioInput {
  nombre: string;
  rol: RolUsuario;
  email?: string;
  password?: string;
  codigo?: string;
  pin?: string;
}

@Injectable()
export class CrearUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async execute(input: CrearUsuarioInput): Promise<UsuarioResumen> {
    if (input.rol === RolUsuario.MESERO) {
      if (!input.codigo || !input.pin) {
        throw new ConflictException('El mesero necesita código y PIN');
      }
      const existente = await this.usuarioRepository.findByCodigo(input.codigo);
      if (existente) {
        throw new ConflictException('Ya existe un usuario con ese código');
      }
    } else {
      if (!input.email || !input.password) {
        throw new ConflictException('Este rol necesita correo y contraseña');
      }
      const existente = await this.usuarioRepository.findByEmail(input.email);
      if (existente) {
        throw new ConflictException('Ya existe un usuario con ese correo');
      }
    }

    const esMesero = input.rol === RolUsuario.MESERO;

    const usuario = new Usuario({
      nombre: input.nombre,
      rol: input.rol,
      email: esMesero ? undefined : input.email,
      codigo: esMesero ? input.codigo : undefined,
      passwordHash: !esMesero && input.password ? await bcrypt.hash(input.password, RONDAS_HASH) : undefined,
      pinHash: esMesero && input.pin ? await bcrypt.hash(input.pin, RONDAS_HASH) : undefined,
    });

    const guardado = await this.usuarioRepository.save(usuario);
    return aUsuarioResumen(guardado);
  }
}
