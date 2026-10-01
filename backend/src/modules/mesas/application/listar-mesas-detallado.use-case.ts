import { Inject, Injectable } from '@nestjs/common';
import { MESA_REPOSITORY } from '../domain/ports/mesa.repository.port';
import type { MesaRepository } from '../domain/ports/mesa.repository.port';
import { USUARIO_REPOSITORY } from '../../usuarios/domain/ports/usuario.repository.port';
import type { UsuarioRepository } from '../../usuarios/domain/ports/usuario.repository.port';
import { RolUsuario } from '../../usuarios/domain/entities/usuario.entity';
import { EstadoMesa } from '../domain/entities/mesa.entity';

export interface MesaDetallada {
  id: string;
  numero: number;
  capacidad: number;
  estado: EstadoMesa;
  meseroId: string | null;
  meseroNombre: string | null;
}

@Injectable()
export class ListarMesasDetalladoUseCase {
  constructor(
    @Inject(MESA_REPOSITORY) private readonly mesaRepository: MesaRepository,
    @Inject(USUARIO_REPOSITORY) private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async execute(): Promise<MesaDetallada[]> {
    const [mesas, meseros] = await Promise.all([
      this.mesaRepository.findAll(),
      this.usuarioRepository.findByRol(RolUsuario.MESERO),
    ]);

    const meserosPorId = new Map(meseros.map((mesero) => [mesero.id, mesero]));

    return mesas
      .sort((a, b) => a.numero - b.numero)
      .map((mesa) => ({
        id: mesa.id,
        numero: mesa.numero,
        capacidad: mesa.capacidad,
        estado: mesa.estado,
        meseroId: mesa.meseroId ?? null,
        meseroNombre: mesa.meseroId ? (meserosPorId.get(mesa.meseroId)?.nombre ?? '—') : null,
      }));
  }
}
