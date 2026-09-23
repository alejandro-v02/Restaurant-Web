import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../domain/entities/usuario.entity';
import { UsuarioRepository } from '../../domain/ports/usuario.repository.port';
import { UsuarioOrmEntity } from './usuario.orm-entity';

@Injectable()
export class TypeOrmUsuarioRepository implements UsuarioRepository {
  constructor(
    @InjectRepository(UsuarioOrmEntity)
    private readonly repo: Repository<Usuario>,
  ) {}

  findById(id: string): Promise<Usuario | null> {
    return this.repo.findOneBy({ id });
  }

  findByEmail(email: string): Promise<Usuario | null> {
    return this.repo.findOneBy({ email });
  }

  findByCodigo(codigo: string): Promise<Usuario | null> {
    return this.repo.findOneBy({ codigo });
  }

  findAll(): Promise<Usuario[]> {
    return this.repo.find();
  }

  findByRol(rol: Usuario['rol']): Promise<Usuario[]> {
    return this.repo.find({ where: { rol } });
  }

  save(usuario: Usuario): Promise<Usuario> {
    return this.repo.save(usuario);
  }
}
