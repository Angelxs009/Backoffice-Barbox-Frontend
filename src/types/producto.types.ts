/* Producto Types - BARBOX Backoffice */

export interface Producto {
  id_producto: string;
  codigo_barras: string; // Identificador único del producto (F6)
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  subcategoria: string;
  marca: string;
  imagen_url: string;
  estado: boolean; // true = ACT, false = INA
  createdAt: string;
  updatedAt: string;
}

export interface ProductoFormData {
  codigo_barras: string; // Requerido y único
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  subcategoria: string;
  marca: string;
  imagen_url: string;
}

export interface ProductoFilters {
  busqueda?: string;
  categoria?: string;
  precioMin?: number;
  precioMax?: number;
  estado?: boolean;
}
