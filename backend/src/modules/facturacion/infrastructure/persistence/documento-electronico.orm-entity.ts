import { EntitySchema } from 'typeorm';
import {
  DocumentoElectronico,
  TipoDocumentoElectronico,
  EstadoDocumento,
} from '../../domain/entities/documento-electronico.entity';

export const DocumentoElectronicoOrmEntity = new EntitySchema<DocumentoElectronico>({
  name: 'DocumentoElectronico',
  tableName: 'documentos_electronicos',
  target: DocumentoElectronico,
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    tipo: { type: 'enum', enum: TipoDocumentoElectronico },
    pedidoId: { type: 'uuid', name: 'pedido_id' },
    clienteId: { type: 'uuid', name: 'cliente_id', nullable: true },
    documentoOrigenId: {
      type: 'uuid',
      name: 'documento_origen_id',
      nullable: true,
    },
    prefijo: { type: 'varchar', length: 10 },
    consecutivo: { type: 'bigint' },
    cufeCude: { type: 'varchar', name: 'cufe_cude', length: 96, nullable: true },
    estado: {
      type: 'enum',
      enum: EstadoDocumento,
      default: EstadoDocumento.PENDIENTE,
    },
    xmlPath: { type: 'varchar', name: 'xml_path', nullable: true },
    pdfPath: { type: 'varchar', name: 'pdf_path', nullable: true },
    jsonEnviado: { type: 'jsonb', name: 'json_enviado', nullable: true },
    respuestaProveedor: {
      type: 'jsonb',
      name: 'respuesta_proveedor',
      nullable: true,
    },
    createdAt: { type: 'timestamptz', name: 'created_at', createDate: true },
    updatedAt: { type: 'timestamptz', name: 'updated_at', updateDate: true },
  },
  indices: [
    { name: 'idx_documento_pedido', columns: ['pedidoId'] },
    {
      name: 'idx_documento_prefijo_consecutivo',
      columns: ['prefijo', 'consecutivo'],
      unique: true,
    },
  ],
});
