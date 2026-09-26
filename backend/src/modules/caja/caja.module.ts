import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnoOrmEntity } from './infrastructure/persistence/turno.orm-entity';
import { PagoOrmEntity } from './infrastructure/persistence/pago.orm-entity';
import { TypeOrmTurnoRepository } from './infrastructure/persistence/turno.repository';
import { TypeOrmPagoRepository } from './infrastructure/persistence/pago.repository';
import { TURNO_REPOSITORY } from './domain/ports/turno.repository.port';
import { PAGO_REPOSITORY } from './domain/ports/pago.repository.port';
import { CajaController } from './infrastructure/http/caja.controller';
import { AbrirTurnoUseCase } from './application/abrir-turno.use-case';
import { ObtenerTurnoActivoUseCase } from './application/obtener-turno-activo.use-case';
import { CerrarTurnoUseCase } from './application/cerrar-turno.use-case';
import { ListarPedidosServidosUseCase } from './application/listar-pedidos-servidos.use-case';
import { CobrarPedidoUseCase } from './application/cobrar-pedido.use-case';
import { PedidosModule } from '../pedidos/pedidos.module';
import { MesasModule } from '../mesas/mesas.module';
import { CatalogoModule } from '../catalogo/catalogo.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TurnoOrmEntity, PagoOrmEntity]),
    PedidosModule,
    MesasModule,
    CatalogoModule,
    UsuariosModule,
  ],
  controllers: [CajaController],
  providers: [
    { provide: TURNO_REPOSITORY, useClass: TypeOrmTurnoRepository },
    { provide: PAGO_REPOSITORY, useClass: TypeOrmPagoRepository },
    AbrirTurnoUseCase,
    ObtenerTurnoActivoUseCase,
    CerrarTurnoUseCase,
    ListarPedidosServidosUseCase,
    CobrarPedidoUseCase,
  ],
  exports: [TURNO_REPOSITORY, PAGO_REPOSITORY],
})
export class CajaModule {}
