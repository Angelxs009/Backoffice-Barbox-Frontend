/* Producto Types - BARBOX Backoffice */

export interface Producto {
  id_producto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  subcategoria: string;
  marca: string;
  imagen_url: string;
  estado: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductoFormData {
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
