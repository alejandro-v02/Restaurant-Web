import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './shared/config/configuration';
import { envValidationSchema } from './shared/config/env.validation';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { CatalogoModule } from './modules/catalogo/catalogo.module';
import { MesasModule } from './modules/mesas/mesas.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { CajaModule } from './modules/caja/caja.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { FacturacionModule } from './modules/facturacion/facturacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    DatabaseModule,
    AuthModule,
    UsuariosModule,
    CatalogoModule,
    MesasModule,
    PedidosModule,
    CajaModule,
    ClientesModule,
    FacturacionModule,
  ],
})
export class AppModule {}
