import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnoOrmEntity } from './infrastructure/persistence/turno.orm-entity';
import { PagoOrmEntity } from './infrastructure/persistence/pago.orm-entity';
import { TypeOrmTurnoRepository } from './infrastructure/persistence/turno.repository';
import { TypeOrmPagoRepository } from './infrastructure/persistence/pago.repository';
import { TURNO_REPOSITORY } from './domain/ports/turno.repository.port';
import { PAGO_REPOSITORY } from './domain/ports/pago.repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([TurnoOrmEntity, PagoOrmEntity])],
  providers: [
    { provide: TURNO_REPOSITORY, useClass: TypeOrmTurnoRepository },
    { provide: PAGO_REPOSITORY, useClass: TypeOrmPagoRepository },
  ],
  exports: [TURNO_REPOSITORY, PAGO_REPOSITORY],
})
export class CajaModule {}
