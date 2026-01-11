/* Producto Service - BARBOX Backoffice */

import api from '../config/api.config';
import { Producto, ProductoFormData, ProductoFilters } from '../types/producto.types';

class ProductoService {
  /**
   * Obtener lista de productos con filtros opcionales
   */
  async getProductos(filters?: ProductoFilters): Promise<Producto[]> {
    try {
      const params: Record<string, unknown> = {};
      
      if (filters?.busqueda) {
        params.busqueda = filters.busqueda;
      }
      
      if (filters?.categoria) {
        params.categoria = filters.categoria;
      }
      
      if (filters?.precioMin !== undefined) {
        params.precioMin = filters.precioMin;
      }
      
      if (filters?.precioMax !== undefined) {
        params.precioMax = filters.precioMax;
      }
      
      if (filters?.estado !== undefined) {
        params.estado = filters.estado;
      }

      const response = await api.get<Producto[]>('/productos', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener productos:', error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener la lista de productos'
      );
    }
  }

  /**
   * Obtener un producto por ID
   */
  async getProductoById(id: string): Promise<Producto> {
    try {
      const response = await api.get<Producto>(`/productos/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener producto ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener el producto'
      );
    }
  }

  /**
   * Crear un nuevo producto
   */
  async createProducto(data: ProductoFormData): Promise<Producto> {
    try {
      const response = await api.post<Producto>('/productos', data);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear producto:', error);
      throw new Error(
        error.response?.data?.message || 'Error al crear el producto'
      );
    }
  }

  /**
   * Actualizar un producto existente
   */
  async updateProducto(id: string, data: ProductoFormData): Promise<Producto> {
    try {
      const response = await api.put<Producto>(`/productos/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error(`Error al actualizar producto ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 'Error al actualizar el producto'
      );
    }
  }

  /**
   * Eliminar un producto (eliminación lógica)
   */
  async deleteProducto(id: string): Promise<void> {
    try {
      await api.delete(`/productos/${id}`);
    } catch (error: any) {
      console.error(`Error al eliminar producto ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 'Error al eliminar el producto'
      );
    }
  }

  /**
   * Buscar productos por término de búsqueda
   */
  async searchProductos(query: string): Promise<Producto[]> {
    try {
      const response = await api.get<Producto[]>('/productos/buscar', {
        params: { q: query },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al buscar productos:', error);
      throw new Error(
        error.response?.data?.message || 'Error al buscar productos'
      );
    }
  }

  /**
   * Obtener categorías disponibles
   */
  async getCategorias(): Promise<string[]> {
    try {
      const response = await api.get<string[]>('/productos/categorias');
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener categorías:', error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener categorías'
      );
    }
  }

  /**
   * Subir imagen de producto
   */
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post<{ url: string }>(
        '/productos/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.url;
    } catch (error: any) {
      console.error('Error al subir imagen:', error);
      throw new Error(
        error.response?.data?.message || 'Error al subir la imagen'
      );
    }
  }
}

export default new ProductoService();
