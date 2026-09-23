import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoOrmEntity } from './infrastructure/persistence/pedido.orm-entity';
import { PedidoItemOrmEntity } from './infrastructure/persistence/pedido-item.orm-entity';
import { TypeOrmPedidoRepository } from './infrastructure/persistence/pedido.repository';
import { TypeOrmPedidoItemRepository } from './infrastructure/persistence/pedido-item.repository';
import { PEDIDO_REPOSITORY } from './domain/ports/pedido.repository.port';
import { PEDIDO_ITEM_REPOSITORY } from './domain/ports/pedido-item.repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([PedidoOrmEntity, PedidoItemOrmEntity])],
  providers: [
    { provide: PEDIDO_REPOSITORY, useClass: TypeOrmPedidoRepository },
    { provide: PEDIDO_ITEM_REPOSITORY, useClass: TypeOrmPedidoItemRepository },
  ],
  exports: [PEDIDO_REPOSITORY, PEDIDO_ITEM_REPOSITORY],
})
export class PedidosModule {}
