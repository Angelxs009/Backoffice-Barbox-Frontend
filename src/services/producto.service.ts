/* Producto Service - BARBOX Backoffice - INTEGRADO CON BACKEND */

import { Producto, ProductoFormData, ProductoFilters } from '../types/producto.types';
import api from '../config/api.config';

// Mapear datos del backend al formato del frontend
function mapProductoFromBackend(backendProducto: any): Producto {
  return {
    id_producto: backendProducto.id_producto?.toString() || '',
    codigo_barras: backendProducto.codigo_barras || '',
    nombre: backendProducto.descripcion || '',
    descripcion: backendProducto.descripcion || '',
    precio: parseFloat(backendProducto.precio_venta) || 0,
    stock: parseInt(backendProducto.saldo_actual) || 0,
    categoria: backendProducto.categoria_producto?.nombre || '',
    subcategoria: backendProducto.subcategoria || '',
    marca: backendProducto.marca?.nombre || '',
    imagen_url: backendProducto.imagen_url || '',
    estado: backendProducto.estado === 'ACT',
    createdAt: backendProducto.fecha_creacion || new Date().toISOString(),
    updatedAt: backendProducto.fecha_actualizacion || new Date().toISOString(),
  };
}

// Mapear datos del frontend al formato del backend
function mapProductoToBackend(frontendProducto: any): any {
  const backendData: any = {};
  
  if (frontendProducto.codigo_barras !== undefined) backendData.codigo_barras = frontendProducto.codigo_barras;
  if (frontendProducto.nombre !== undefined) backendData.descripcion = frontendProducto.nombre;
  if (frontendProducto.precio !== undefined) backendData.precio_venta = frontendProducto.precio;
  if (frontendProducto.stock !== undefined) backendData.saldo_actual = frontendProducto.stock;
  if (frontendProducto.categoria !== undefined) backendData.id_categoria = frontendProducto.categoria;
  if (frontendProducto.marca !== undefined) backendData.id_marca = frontendProducto.marca;
  if (frontendProducto.imagen_url !== undefined) backendData.imagen_url = frontendProducto.imagen_url;
  if (frontendProducto.estado !== undefined) backendData.estado = frontendProducto.estado ? 'ACT' : 'INA';
  
  return backendData;
}

class ProductoService {
  /**
   * Obtener lista de productos con filtros opcionales
   */
  async getProductos(filters?: ProductoFilters): Promise<Producto[]> {
    try {
      const params: any = {};
      
      if (filters?.busqueda) params.busqueda = filters.busqueda;
      if (filters?.categoria) params.categoria = filters.categoria;
      if (filters?.precioMin !== undefined) params.precioMin = filters.precioMin;
      if (filters?.precioMax !== undefined) params.precioMax = filters.precioMax;
      if (filters?.estado !== undefined) params.estado = filters.estado ? 'ACT' : 'INA';
      
      const response = await api.get<any[]>('/productos', { params });
      return response.data.map(mapProductoFromBackend);
    } catch (error: any) {
      throw new Error(error?.message || 'Error al obtener productos');
    }
  }

  /**
   * Obtener un producto por ID
   */
  async getProductoById(id: string): Promise<Producto> {
    try {
      const response = await api.get<any>(`/productos/buscar?id=${id}`);
      return mapProductoFromBackend(response.data);
    } catch (error: any) {
      throw new Error(error?.message || 'Producto no encontrado');
    }
  }

  /**
   * Crear un nuevo producto
   */
  async createProducto(data: ProductoFormData): Promise<Producto> {
    try {
      const backendData = mapProductoToBackend(data);
      const response = await api.post<any>('/productos', backendData);
      return mapProductoFromBackend(response.data);
    } catch (error: any) {
      throw new Error(error?.message || 'Error al crear producto');
    }
  }

  /**
   * Actualizar un producto existente
   */
  async updateProducto(id: string, data: Partial<ProductoFormData>): Promise<Producto> {
    try {
      const backendData = mapProductoToBackend(data);
      const response = await api.put<any>(`/productos/${id}`, backendData);
      return mapProductoFromBackend(response.data);
    } catch (error: any) {
      throw new Error(error?.message || 'Error al actualizar producto');
    }
  }

  /**
   * Eliminar un producto (ELIMINACIÓN LÓGICA)
   */
  async deleteProducto(id: string): Promise<void> {
    try {
      await api.delete(`/productos/${id}`);
    } catch (error: any) {
      throw new Error(error?.message || 'Error al eliminar producto');
    }
  }

  /**
   * Buscar productos por término de búsqueda
   */
  async searchProductos(query: string): Promise<Producto[]> {
    return this.getProductos({ busqueda: query });
  }

  /**
   * Obtener categorías disponibles
   */
  async getCategorias(): Promise<string[]> {
    try {
      const productos = await this.getProductos();
      const categoriasSet = new Set<string>();
      productos.forEach(p => {
        if (p.categoria) categoriasSet.add(p.categoria);
      });
      return Array.from(categoriasSet);
    } catch (error: any) {
      throw new Error(error?.message || 'Error al obtener categorías');
    }
  }

  /**
   * Subir imagen de producto
   */
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('imagen', file);
      
      const response = await api.post<{ url: string }>('/productos/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.url;
    } catch (error: any) {
      // Fallback: crear URL local si el backend no soporta upload
      return URL.createObjectURL(file);
    }
  }

  /**
   * Reactivar un producto inactivo
   */
  async reactivarProducto(id: string): Promise<Producto> {
    try {
      const response = await api.patch<any>(`/productos/${id}/reactivar`);
      return mapProductoFromBackend(response.data);
    } catch (error: any) {
      // Si el endpoint no existe, usar update estándar
      return this.updateProducto(id, { estado: true } as any);
    }
  }
}

export default new ProductoService();
