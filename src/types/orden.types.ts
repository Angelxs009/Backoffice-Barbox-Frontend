import { Producto } from './producto.types';
import { Proveedor } from './proveedor.types';

export type EstadoOrden = 'PENDIENTE' | 'RECIBIDA' | 'CANCELADA';

export interface DetalleOrden {
  id_detalle: string;
  id_orden: string;
  id_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: Producto;
}

export interface OrdenCompra {
  id_orden: string;
  numero_orden: string;
  id_proveedor: string;
  fecha: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: EstadoOrden;
  createdAt?: string;
  updatedAt?: string;
  proveedor?: Proveedor;
  detalles?: DetalleOrden[];
}
