import { ResolucionNumeracion } from '../entities/resolucion-numeracion.entity';
import { TipoDocumentoElectronico } from '../entities/documento-electronico.entity';

export const RESOLUCION_NUMERACION_REPOSITORY = Symbol(
  'RESOLUCION_NUMERACION_REPOSITORY',
);

export interface ResolucionNumeracionRepository {
  findById(id: string): Promise<ResolucionNumeracion | null>;
  findActivaPorTipo(
    tipoDocumento: TipoDocumentoElectronico,
  ): Promise<ResolucionNumeracion | null>;
  save(resolucion: ResolucionNumeracion): Promise<ResolucionNumeracion>;
}
