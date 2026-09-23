import { DocumentoElectronico } from '../entities/documento-electronico.entity';

export const DOCUMENTO_ELECTRONICO_REPOSITORY = Symbol(
  'DOCUMENTO_ELECTRONICO_REPOSITORY',
);

export interface DocumentoElectronicoRepository {
  findById(id: string): Promise<DocumentoElectronico | null>;
  findByPedido(pedidoId: string): Promise<DocumentoElectronico[]>;
  save(documento: DocumentoElectronico): Promise<DocumentoElectronico>;
}
