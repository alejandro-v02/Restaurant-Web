import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { RolUsuario } from '../../../usuarios/domain/entities/usuario.entity';
import { ListarItemsCocinaUseCase } from '../../application/listar-items-cocina.use-case';

@Controller('cocina')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CocinaController {
  constructor(private readonly listarItems: ListarItemsCocinaUseCase) {}

  @Get('items')
  @Roles(RolUsuario.COCINA, RolUsuario.ADMIN)
  listar() {
    return this.listarItems.execute();
  }
}
