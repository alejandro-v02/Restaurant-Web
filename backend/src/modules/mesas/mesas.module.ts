import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MesaOrmEntity } from './infrastructure/persistence/mesa.orm-entity';
import { TypeOrmMesaRepository } from './infrastructure/persistence/mesa.repository';
import { MESA_REPOSITORY } from './domain/ports/mesa.repository.port';
import { MesasController } from './infrastructure/http/mesas.controller';
import { ListarMesasUseCase } from './application/listar-mesas.use-case';
import { AsignarMeseroUseCase } from './application/asignar-mesero.use-case';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [TypeOrmModule.forFeature([MesaOrmEntity]), UsuariosModule],
  controllers: [MesasController],
  providers: [
    { provide: MESA_REPOSITORY, useClass: TypeOrmMesaRepository },
    ListarMesasUseCase,
    AsignarMeseroUseCase,
  ],
  exports: [MESA_REPOSITORY],
})
export class MesasModule {}
