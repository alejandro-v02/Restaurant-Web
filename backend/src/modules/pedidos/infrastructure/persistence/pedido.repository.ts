import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from '../../domain/entities/pedido.entity';
import { PedidoRepository } from '../../domain/ports/pedido.repository.port';
import { PedidoOrmEntity } from './pedido.orm-entity';

@Injectable()
export class TypeOrmPedidoRepository implements PedidoRepository {
  constructor(
    @InjectRepository(PedidoOrmEntity)
    private readonly repo: Repository<Pedido>,
  ) {}

  findById(id: string): Promise<Pedido | null> {
    return this.repo.findOneBy({ id });
  }

  findByMesa(mesaId: string): Promise<Pedido[]> {
    return this.repo.find({ where: { mesaId } });
  }

  save(pedido: Pedido): Promise<Pedido> {
    return this.repo.save(pedido);
  }
}
