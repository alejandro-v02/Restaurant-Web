import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioOrmEntity } from './infrastructure/persistence/usuario.orm-entity';
import { TypeOrmUsuarioRepository } from './infrastructure/persistence/usuario.repository';
import { USUARIO_REPOSITORY } from './domain/ports/usuario.repository.port';
import { UsuariosController } from './infrastructure/http/usuarios.controller';
import { CrearUsuarioUseCase } from './application/crear-usuario.use-case';
import { ListarUsuariosUseCase } from './application/listar-usuarios.use-case';
import { ActualizarUsuarioUseCase } from './application/actualizar-usuario.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioOrmEntity])],
  controllers: [UsuariosController],
  providers: [
    { provide: USUARIO_REPOSITORY, useClass: TypeOrmUsuarioRepository },
    CrearUsuarioUseCase,
    ListarUsuariosUseCase,
    ActualizarUsuarioUseCase,
  ],
  exports: [USUARIO_REPOSITORY],
})
export class UsuariosModule {}
