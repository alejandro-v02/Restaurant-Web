import { Module } from '@nestjs/common';
import { MesasModule } from '../mesas/mesas.module';
import { CatalogoModule } from '../catalogo/catalogo.module';
import { PedidosModule } from '../pedidos/pedidos.module';
import { CocinaController } from './infrastructure/http/cocina.controller';
import { ListarItemsCocinaUseCase } from './application/listar-items-cocina.use-case';
import { ActualizarEstadoItemCocinaUseCase } from './application/actualizar-estado-item.use-case';

@Module({
  imports: [MesasModule, CatalogoModule, PedidosModule],
  controllers: [CocinaController],
  providers: [ListarItemsCocinaUseCase, ActualizarEstadoItemCocinaUseCase],
})
export class CocinaModule {}
