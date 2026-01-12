/* Producto Service - BARBOX Backoffice - SIMULACIÓN CON LOCALSTORAGE */

import { Producto, ProductoFormData, ProductoFilters } from '../types/producto.types';
import {
  STORAGE_KEYS,
  getFromStorage,
  saveToStorage,
  generateId,
  simulateDelay,
  initializeMockData,
} from '../utils/mockData';

// Inicializar datos mock si no existen
const ensureDataExists = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTOS);
  if (!data || JSON.parse(data).length === 0) {
    initializeMockData();
  }
};

class ProductoService {
  /**
   * Obtener lista de productos con filtros opcionales
   * RETORNA TODOS (incluyendo inactivos) para mostrar estado
   */
  async getProductos(filters?: ProductoFilters): Promise<Producto[]> {
    await simulateDelay();
    ensureDataExists();
    
    let productos = getFromStorage<Producto>(STORAGE_KEYS.PRODUCTOS);
    
    // Aplicar filtros
    if (filters?.busqueda) {
      const search = filters.busqueda.toLowerCase();
      productos = productos.filter(p =>
        p.nombre.toLowerCase().includes(search) ||
        p.descripcion?.toLowerCase().includes(search) ||
        p.categoria?.toLowerCase().includes(search) ||
        p.marca?.toLowerCase().includes(search)
      );
    }
    
    if (filters?.categoria) {
      productos = productos.filter(p => p.categoria === filters.categoria);
    }
    
    if (filters?.precioMin !== undefined) {
      productos = productos.filter(p => p.precio >= filters.precioMin!);
    }
    
    if (filters?.precioMax !== undefined) {
      productos = productos.filter(p => p.precio <= filters.precioMax!);
    }
    
    // Solo filtrar por estado si se especifica explícitamente
    if (filters?.estado !== undefined) {
      productos = productos.filter(p => p.estado === filters.estado);
    }
    
    return productos;
  }

  /**
   * Obtener un producto por ID
   */
  async getProductoById(id: string): Promise<Producto> {
    await simulateDelay();
    ensureDataExists();
    
    const productos = getFromStorage<Producto>(STORAGE_KEYS.PRODUCTOS);
    const producto = productos.find(p => p.id_producto === id);
    
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    
    return producto;
  }

  /**
   * Crear un nuevo producto
   */
  async createProducto(data: ProductoFormData): Promise<Producto> {
    await simulateDelay();
    ensureDataExists();
    
    const productos = getFromStorage<Producto>(STORAGE_KEYS.PRODUCTOS);
    
    const nuevoProducto: Producto = {
      id_producto: generateId('prod'),
      nombre: data.nombre,
      descripcion: data.descripcion || '',
      precio: data.precio,
      stock: data.stock || 0,
      categoria: data.categoria || '',
      subcategoria: data.subcategoria || '',
      marca: data.marca || '',
      imagen_url: data.imagen_url || '',
      estado: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    productos.push(nuevoProducto);
    saveToStorage(STORAGE_KEYS.PRODUCTOS, productos);
    
    return nuevoProducto;
  }

  /**
   * Actualizar un producto existente
   */
  async updateProducto(id: string, data: ProductoFormData): Promise<Producto> {
    await simulateDelay();
    ensureDataExists();
    
    const productos = getFromStorage<Producto>(STORAGE_KEYS.PRODUCTOS);
    const index = productos.findIndex(p => p.id_producto === id);
    
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    
    productos[index] = {
      ...productos[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    saveToStorage(STORAGE_KEYS.PRODUCTOS, productos);
    return productos[index];
  }

  /**
   * Eliminar un producto (ELIMINACIÓN LÓGICA - cambia estado a false)
   * El producto NO se elimina, solo se marca como inactivo
   */
  async deleteProducto(id: string): Promise<void> {
    await simulateDelay();
    ensureDataExists();
    
    const productos = getFromStorage<Producto>(STORAGE_KEYS.PRODUCTOS);
    const index = productos.findIndex(p => p.id_producto === id);
    
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    
    // ELIMINACIÓN LÓGICA: Solo cambiar estado a false
    productos[index].estado = false;
    productos[index].updatedAt = new Date().toISOString();
    
    saveToStorage(STORAGE_KEYS.PRODUCTOS, productos);
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
    await simulateDelay();
    ensureDataExists();
    
    const productos = getFromStorage<Producto>(STORAGE_KEYS.PRODUCTOS);
    const categoriasSet = new Set<string>();
    productos.forEach(p => {
      if (p.categoria) categoriasSet.add(p.categoria);
    });
    return Array.from(categoriasSet);
  }

  /**
   * Subir imagen de producto (simulado)
   */
  async uploadImage(file: File): Promise<string> {
    await simulateDelay();
    // Simular URL de imagen
    return URL.createObjectURL(file);
  }

  /**
   * Reactivar un producto inactivo
   */
  async reactivarProducto(id: string): Promise<Producto> {
    await simulateDelay();
    ensureDataExists();
    
    const productos = getFromStorage<Producto>(STORAGE_KEYS.PRODUCTOS);
    const index = productos.findIndex(p => p.id_producto === id);
    
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    
    productos[index].estado = true;
    productos[index].updatedAt = new Date().toISOString();
    
    saveToStorage(STORAGE_KEYS.PRODUCTOS, productos);
    return productos[index];
  }
}

export default new ProductoService();
