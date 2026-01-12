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
   * F6.1: Valida codigo_barras único y precio positivo
   */
  async createProducto(data: ProductoFormData): Promise<Producto> {
    await simulateDelay();
    ensureDataExists();
    
    const productos = getFromStorage<Producto>(STORAGE_KEYS.PRODUCTOS);
    
    // F6.1 E3: Validar campos obligatorios
    if (!data.codigo_barras || !data.nombre || data.precio === undefined) {
      throw new Error('Complete todos los campos requeridos.');
    }
    
    // F6.1 E4: Validar precio positivo
    if (data.precio <= 0) {
      throw new Error('El precio debe ser un valor numérico positivo.');
    }
    
    // F6.1 E2: Validar codigo_barras único (solo entre productos ACT)
    const existente = productos.find(p => p.codigo_barras === data.codigo_barras && p.estado === true);
    if (existente) {
      throw new Error('El identificador del producto ya existe.');
    }
    
    const nuevoProducto: Producto = {
      id_producto: generateId('prod'),
      codigo_barras: data.codigo_barras,
      nombre: data.nombre,
      descripcion: data.descripcion || '',
      precio: data.precio,
      stock: data.stock || 0,
      categoria: data.categoria || '',
      subcategoria: data.subcategoria || '',
      marca: data.marca || '',
      imagen_url: data.imagen_url || '',
      estado: true, // ACT
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    productos.push(nuevoProducto);
    saveToStorage(STORAGE_KEYS.PRODUCTOS, productos);
    
    return nuevoProducto;
  }

  /**
   * Actualizar un producto existente
   * F6.2: Solo productos ACT, codigo_barras no modificable
   */
  async updateProducto(id: string, data: ProductoFormData): Promise<Producto> {
    await simulateDelay();
    ensureDataExists();
    
    const productos = getFromStorage<Producto>(STORAGE_KEYS.PRODUCTOS);
    const index = productos.findIndex(p => p.id_producto === id);
    
    // F6.2 E2: Producto no encontrado
    if (index === -1) {
      throw new Error('El producto especificado no existe.');
    }
    
    // F6.2: Solo productos ACT pueden modificarse
    if (!productos[index].estado) {
      throw new Error('El producto se encuentra deshabilitado y no puede modificarse.');
    }
    
    // F6.2 E4: Validar precio positivo
    if (data.precio !== undefined && data.precio <= 0) {
      throw new Error('El precio debe ser un valor numérico positivo.');
    }
    
    // F6.2: Mantener codigo_barras original (no modificable)
    productos[index] = {
      ...productos[index],
      nombre: data.nombre || productos[index].nombre,
      descripcion: data.descripcion ?? productos[index].descripcion,
      precio: data.precio ?? productos[index].precio,
      stock: data.stock ?? productos[index].stock,
      categoria: data.categoria || productos[index].categoria,
      subcategoria: data.subcategoria || productos[index].subcategoria,
      marca: data.marca || productos[index].marca,
      imagen_url: data.imagen_url ?? productos[index].imagen_url,
      updatedAt: new Date().toISOString(),
    };
    
    saveToStorage(STORAGE_KEYS.PRODUCTOS, productos);
    return productos[index];
  }

  /**
   * Eliminar un producto (ELIMINACIÓN LÓGICA - cambia estado a INA)
   * F6.3: Cambio de estado ACT -> INA
   */
  async deleteProducto(id: string): Promise<void> {
    await simulateDelay();
    ensureDataExists();
    
    const productos = getFromStorage<Producto>(STORAGE_KEYS.PRODUCTOS);
    const index = productos.findIndex(p => p.id_producto === id);
    
    // F6.3 E2: Producto no encontrado
    if (index === -1) {
      throw new Error('El producto no existe.');
    }
    
    // F6.3 E3: Producto ya inactivo
    if (!productos[index].estado) {
      throw new Error('El producto ya se encuentra deshabilitado.');
    }
    
    // ELIMINACIÓN LÓGICA: Cambiar estado a INA (false)
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
