import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoOrmEntity } from './infrastructure/persistence/pedido.orm-entity';
import { PedidoItemOrmEntity } from './infrastructure/persistence/pedido-item.orm-entity';
import { TypeOrmPedidoRepository } from './infrastructure/persistence/pedido.repository';
import { TypeOrmPedidoItemRepository } from './infrastructure/persistence/pedido-item.repository';
import { PEDIDO_REPOSITORY } from './domain/ports/pedido.repository.port';
import { PEDIDO_ITEM_REPOSITORY } from './domain/ports/pedido-item.repository.port';
import { PedidosController } from './infrastructure/http/pedidos.controller';
import { CrearPedidoUseCase } from './application/crear-pedido.use-case';
import { AgregarItemPedidoUseCase } from './application/agregar-item-pedido.use-case';
import { ActualizarItemPedidoUseCase } from './application/actualizar-item-pedido.use-case';
import { EliminarItemPedidoUseCase } from './application/eliminar-item-pedido.use-case';
import { MarcarItemEntregadoUseCase } from './application/marcar-item-entregado.use-case';
import { EnviarPedidoCocinaUseCase } from './application/enviar-pedido-cocina.use-case';
import { ObtenerPedidoActivoUseCase } from './application/obtener-pedido-activo.use-case';
import { MesasModule } from '../mesas/mesas.module';
import { CatalogoModule } from '../catalogo/catalogo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PedidoOrmEntity, PedidoItemOrmEntity]),
    MesasModule,
    CatalogoModule,
  ],
  controllers: [PedidosController],
  providers: [
    { provide: PEDIDO_REPOSITORY, useClass: TypeOrmPedidoRepository },
    { provide: PEDIDO_ITEM_REPOSITORY, useClass: TypeOrmPedidoItemRepository },
    CrearPedidoUseCase,
    AgregarItemPedidoUseCase,
    ActualizarItemPedidoUseCase,
    EliminarItemPedidoUseCase,
    MarcarItemEntregadoUseCase,
    EnviarPedidoCocinaUseCase,
    ObtenerPedidoActivoUseCase,
  ],
  exports: [PEDIDO_REPOSITORY, PEDIDO_ITEM_REPOSITORY],
})
export class PedidosModule {}
