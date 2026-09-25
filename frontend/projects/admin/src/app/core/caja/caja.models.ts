export type MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'OTRO';

export const METODOS_PAGO: { value: MetodoPago; label: string }[] = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'TARJETA', label: 'Tarjeta' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
  { value: 'OTRO', label: 'Otro' },
];

export interface Turno {
  id: string;
  cajeroId: string;
  fechaApertura: string;
  fechaCierre?: string;
  montoApertura: number;
  montoCierre?: number;
  estado: 'ABIERTO' | 'CERRADO';
}

export interface ItemCaja {
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
}

export interface PedidoCaja {
  pedidoId: string;
  mesaNumero: number;
  meseroNombre: string;
  personas: number;
  items: ItemCaja[];
  total: number;
  actualizadoEn: string;
}
