import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../../application/auth.service';
import { JwtPayload } from '../../domain/jwt-payload.interface';
import { AppConfig } from '../../../../shared/config/configuration';
import { Usuario } from '../../../usuarios/domain/entities/usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<AppConfig>('app')!.jwt.secret,
    });
  }

  validate(payload: JwtPayload): Promise<Usuario> {
    return this.authService.validarUsuarioPorPayload(payload);
  }
}
