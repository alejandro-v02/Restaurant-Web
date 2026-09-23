import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MESA_REPOSITORY } from '../domain/ports/mesa.repository.port';
import type { MesaRepository } from '../domain/ports/mesa.repository.port';
import { USUARIO_REPOSITORY } from '../../usuarios/domain/ports/usuario.repository.port';
import type { UsuarioRepository } from '../../usuarios/domain/ports/usuario.repository.port';
import { Mesa } from '../domain/entities/mesa.entity';
import { RolUsuario } from '../../usuarios/domain/entities/usuario.entity';

@Injectable()
export class AsignarMeseroUseCase {
  constructor(
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: MesaRepository,
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async execute(mesaId: string, meseroId: string | null): Promise<Mesa> {
    const mesa = await this.mesaRepository.findById(mesaId);
    if (!mesa) {
      throw new NotFoundException('Mesa no encontrada');
    }

    if (meseroId) {
      const mesero = await this.usuarioRepository.findById(meseroId);
      if (!mesero || mesero.rol !== RolUsuario.MESERO || !mesero.activo) {
        throw new BadRequestException('El usuario indicado no es un mesero activo');
      }
    }

    mesa.meseroId = meseroId ?? undefined;
    await this.mesaRepository.save(mesa);

    return (await this.mesaRepository.findById(mesaId))!;
  }
}
