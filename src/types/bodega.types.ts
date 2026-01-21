// Bodega maneja RECEPCIONES de productos, no bodegas físicas

export interface Recepcion {
  id_recepcion: number;
  id_compra: string;
  id_empleado: number;
  descripcion: string;
  fecha_hora: string;
  estado: 'ACT' | 'APR' | 'ANU';
  observaciones?: string;
  motivo_anulacion?: string | null;
  fecha_anulacion?: string | null;
}

// Alias para compatibilidad con nombres de componentes
export type Bodega = Recepcion;
