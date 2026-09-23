import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioOrmEntity } from './infrastructure/persistence/usuario.orm-entity';
import { TypeOrmUsuarioRepository } from './infrastructure/persistence/usuario.repository';
import { USUARIO_REPOSITORY } from './domain/ports/usuario.repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioOrmEntity])],
  providers: [
    { provide: USUARIO_REPOSITORY, useClass: TypeOrmUsuarioRepository },
  ],
  exports: [USUARIO_REPOSITORY],
})
export class UsuariosModule {}
