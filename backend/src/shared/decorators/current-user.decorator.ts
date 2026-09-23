import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Usuario } from '../../modules/usuarios/domain/entities/usuario.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Usuario => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
