import { Cliente } from './cliente.types';
import { Producto } from './producto.types';

export type EstadoPago = 'PENDIENTE' | 'PAGADA' | 'ANULADA';

export interface DetalleFactura {
  id_detalle: string;
  id_factura: string;
  id_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: Producto;
}

export interface Factura {
  id_factura: string;
  numero_factura: string;
  id_cliente: string;
  fecha_emision: string; // ISO string
  subtotal: number;
  iva: number;
  total: number;
  estado_pago: EstadoPago;
  metodo_pago: string;
  createdAt: string;
  updatedAt: string;
  cliente?: Cliente;
  detalles?: DetalleFactura[];
}
