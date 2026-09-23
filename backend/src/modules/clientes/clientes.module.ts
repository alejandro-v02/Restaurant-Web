import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteOrmEntity } from './infrastructure/persistence/cliente.orm-entity';
import { TypeOrmClienteRepository } from './infrastructure/persistence/cliente.repository';
import { CLIENTE_REPOSITORY } from './domain/ports/cliente.repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteOrmEntity])],
  providers: [
    { provide: CLIENTE_REPOSITORY, useClass: TypeOrmClienteRepository },
  ],
  exports: [CLIENTE_REPOSITORY],
})
export class ClientesModule {}
