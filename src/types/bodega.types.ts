import { Producto } from './producto.types';

export interface Bodega {
  id_bodega: string;
  nombre: string;
  direccion: string;
  capacidad: number; // unidades máximas
  responsable: string;
  productos?: Producto[]; // relación opcional con productos almacenados
  createdAt?: string;
  updatedAt?: string;
}
