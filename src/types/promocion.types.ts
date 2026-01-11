export interface Promocion {
  id_promocion: string;
  nombre: string;
  descripcion: string;
  descuento_porcentaje: number; // 0-100
  fecha_inicio: string; // ISO
  fecha_fin: string; // ISO
  productos?: string[]; // lista de id_producto aplicables
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
