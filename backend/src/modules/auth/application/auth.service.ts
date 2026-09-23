import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { USUARIO_REPOSITORY } from '../../usuarios/domain/ports/usuario.repository.port';
import type { UsuarioRepository } from '../../usuarios/domain/ports/usuario.repository.port';
import { Usuario } from '../../usuarios/domain/entities/usuario.entity';
import { JwtPayload } from '../domain/jwt-payload.interface';

export interface SesionIniciada {
  accessToken: string;
  usuario: {
    id: string;
    nombre: string;
    rol: string;
    email?: string;
    codigo?: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
    private readonly jwtService: JwtService,
  ) {}

  async loginConCredenciales(
    email: string,
    password: string,
  ): Promise<SesionIniciada> {
    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario?.passwordHash || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valido = await bcrypt.compare(password, usuario.passwordHash);
    if (!valido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.emitirSesion(usuario);
  }

  async loginConPin(codigo: string, pin: string): Promise<SesionIniciada> {
    const usuario = await this.usuarioRepository.findByCodigo(codigo);
    if (!usuario?.pinHash || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valido = await bcrypt.compare(pin, usuario.pinHash);
    if (!valido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.emitirSesion(usuario);
  }

  async validarUsuarioPorPayload(payload: JwtPayload): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findById(payload.sub);
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Usuario inválido o inactivo');
    }
    return usuario;
  }

  private emitirSesion(usuario: Usuario): SesionIniciada {
    const payload: JwtPayload = {
      sub: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        email: usuario.email,
        codigo: usuario.codigo,
      },
    };
  }
}
