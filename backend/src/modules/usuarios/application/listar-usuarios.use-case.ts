import { Inject, Injectable } from '@nestjs/common';
import { USUARIO_REPOSITORY } from '../domain/ports/usuario.repository.port';
import type { UsuarioRepository } from '../domain/ports/usuario.repository.port';
import { UsuarioResumen, aUsuarioResumen } from './usuario-resumen';

@Injectable()
export class ListarUsuariosUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async execute(): Promise<UsuarioResumen[]> {
    const usuarios = await this.usuarioRepository.findAll();
    return usuarios.map(aUsuarioResumen);
  }
}
