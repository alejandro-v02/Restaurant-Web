import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USUARIO_REPOSITORY } from '../domain/ports/usuario.repository.port';
import type { UsuarioRepository } from '../domain/ports/usuario.repository.port';
import { UsuarioResumen, aUsuarioResumen } from './usuario-resumen';

const RONDAS_HASH = 10;

export interface ActualizarUsuarioInput {
  nombre?: string;
  activo?: boolean;
  password?: string;
  pin?: string;
}

@Injectable()
export class ActualizarUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async execute(
    id: string,
    input: ActualizarUsuarioInput,
    solicitanteId: string,
  ): Promise<UsuarioResumen> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (input.activo === false && id === solicitanteId) {
      throw new ConflictException('No podés desactivar tu propia cuenta');
    }

    if (input.nombre !== undefined) {
      usuario.nombre = input.nombre.trim();
    }
    if (input.activo !== undefined) {
      usuario.activo = input.activo;
    }
    if (input.password) {
      usuario.passwordHash = await bcrypt.hash(input.password, RONDAS_HASH);
    }
    if (input.pin) {
      usuario.pinHash = await bcrypt.hash(input.pin, RONDAS_HASH);
    }

    await this.usuarioRepository.save(usuario);

    const actualizado = await this.usuarioRepository.findById(id);
    return aUsuarioResumen(actualizado!);
  }
}
