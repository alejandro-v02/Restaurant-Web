export enum TipoDocumentoElectronico {
  TIQUETE_POS = 'TIQUETE_POS',
  FACTURA_VENTA = 'FACTURA_VENTA',
  NOTA_CREDITO = 'NOTA_CREDITO',
}

export enum EstadoDocumento {
  PENDIENTE = 'PENDIENTE',
  ENVIADO = 'ENVIADO',
  ACEPTADO = 'ACEPTADO',
  RECHAZADO = 'RECHAZADO',
}

export class DocumentoElectronico {
  id!: string;
  tipo!: TipoDocumentoElectronico;
  pedidoId!: string;
  clienteId?: string;
  documentoOrigenId?: string;
  prefijo!: string;
  consecutivo!: number;
  cufeCude?: string;
  estado: EstadoDocumento = EstadoDocumento.PENDIENTE;
  xmlPath?: string;
  pdfPath?: string;
  jsonEnviado?: Record<string, unknown>;
  respuestaProveedor?: Record<string, unknown>;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial?: Partial<DocumentoElectronico>) {
    if (partial) Object.assign(this, partial);
  }
}
