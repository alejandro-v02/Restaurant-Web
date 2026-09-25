import { Module } from '@nestjs/common';
import { MesasModule } from '../mesas/mesas.module';
import { CatalogoModule } from '../catalogo/catalogo.module';
import { PedidosModule } from '../pedidos/pedidos.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { CocinaController } from './infrastructure/http/cocina.controller';
import { ListarItemsCocinaUseCase } from './application/listar-items-cocina.use-case';

@Module({
  imports: [MesasModule, CatalogoModule, PedidosModule, UsuariosModule],
  controllers: [CocinaController],
  providers: [ListarItemsCocinaUseCase],
})
export class CocinaModule {}
