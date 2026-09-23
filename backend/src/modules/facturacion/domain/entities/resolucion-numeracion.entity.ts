import { TipoDocumentoElectronico } from './documento-electronico.entity';

export class ResolucionNumeracion {
  id!: string;
  tipoDocumento!: TipoDocumentoElectronico;
  prefijo!: string;
  rangoDesde!: number;
  rangoHasta!: number;
  consecutivoActual!: number;
  fechaVencimiento!: Date;
  activo: boolean = true;

  constructor(partial?: Partial<ResolucionNumeracion>) {
    if (partial) Object.assign(this, partial);
  }
}
