import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentoElectronicoOrmEntity } from './infrastructure/persistence/documento-electronico.orm-entity';
import { ResolucionNumeracionOrmEntity } from './infrastructure/persistence/resolucion-numeracion.orm-entity';
import { TypeOrmDocumentoElectronicoRepository } from './infrastructure/persistence/documento-electronico.repository';
import { TypeOrmResolucionNumeracionRepository } from './infrastructure/persistence/resolucion-numeracion.repository';
import { DOCUMENTO_ELECTRONICO_REPOSITORY } from './domain/ports/documento-electronico.repository.port';
import { RESOLUCION_NUMERACION_REPOSITORY } from './domain/ports/resolucion-numeracion.repository.port';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentoElectronicoOrmEntity,
      ResolucionNumeracionOrmEntity,
    ]),
  ],
  providers: [
    {
      provide: DOCUMENTO_ELECTRONICO_REPOSITORY,
      useClass: TypeOrmDocumentoElectronicoRepository,
    },
    {
      provide: RESOLUCION_NUMERACION_REPOSITORY,
      useClass: TypeOrmResolucionNumeracionRepository,
    },
  ],
  exports: [DOCUMENTO_ELECTRONICO_REPOSITORY, RESOLUCION_NUMERACION_REPOSITORY],
})
export class FacturacionModule {}
