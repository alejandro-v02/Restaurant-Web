import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidoItem } from '../../domain/entities/pedido-item.entity';
import { PedidoItemRepository } from '../../domain/ports/pedido-item.repository.port';
import { PedidoItemOrmEntity } from './pedido-item.orm-entity';

@Injectable()
export class TypeOrmPedidoItemRepository implements PedidoItemRepository {
  constructor(
    @InjectRepository(PedidoItemOrmEntity)
    private readonly repo: Repository<PedidoItem>,
  ) {}

  findById(id: string): Promise<PedidoItem | null> {
    return this.repo.findOneBy({ id });
  }

  findByPedido(pedidoId: string): Promise<PedidoItem[]> {
    return this.repo.find({ where: { pedidoId } });
  }

  save(item: PedidoItem): Promise<PedidoItem> {
    return this.repo.save(item);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
