/* Factura Service - BARBOX Backoffice - SIMULACIÓN CON LOCALSTORAGE */

import { Factura, EstadoPago } from '../types/factura.types';
import {
  STORAGE_KEYS,
  getFromStorage,
  saveToStorage,
  generateId,
  simulateDelay,
  initializeMockData,
} from '../utils/mockData';

interface FacturaFilters {
  estado_pago?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  busqueda?: string;
}

// Inicializar datos mock si no existen
const ensureDataExists = () => {
  const data = localStorage.getItem(STORAGE_KEYS.FACTURAS);
  if (!data || JSON.parse(data).length === 0) {
    initializeMockData();
  }
};

class FacturaService {
  /**
   * Obtener lista de facturas con filtros opcionales
   * RETORNA TODAS (incluyendo anuladas) para mostrar estado
   */
  async getFacturas(filters?: FacturaFilters): Promise<Factura[]> {
    await simulateDelay();
    ensureDataExists();
    
    let facturas = getFromStorage<Factura>(STORAGE_KEYS.FACTURAS);
    
    // Aplicar filtros
    if (filters?.estado_pago) {
      facturas = facturas.filter(f => f.estado_pago === filters.estado_pago);
    }
    
    if (filters?.fechaDesde) {
      const desde = new Date(filters.fechaDesde);
      facturas = facturas.filter(f => new Date(f.fecha_emision) >= desde);
    }
    
    if (filters?.fechaHasta) {
      const hasta = new Date(filters.fechaHasta);
      facturas = facturas.filter(f => new Date(f.fecha_emision) <= hasta);
    }
    
    if (filters?.busqueda) {
      const search = filters.busqueda.toLowerCase();
      facturas = facturas.filter(f =>
        f.numero_factura.toLowerCase().includes(search) ||
        f.id_cliente.toLowerCase().includes(search)
      );
    }
    
    return facturas;
  }

  /**
   * Obtener una factura por ID
   */
  async getFacturaById(id: string): Promise<Factura> {
    await simulateDelay();
    ensureDataExists();
    
    const facturas = getFromStorage<Factura>(STORAGE_KEYS.FACTURAS);
    const factura = facturas.find(f => f.id_factura === id);
    
    if (!factura) {
      throw new Error('Factura no encontrada');
    }
    
    return factura;
  }

  /**
   * Crear una nueva factura
   */
  async createFactura(data: Partial<Factura>): Promise<Factura> {
    await simulateDelay();
    ensureDataExists();
    
    const facturas = getFromStorage<Factura>(STORAGE_KEYS.FACTURAS);
    
    const nuevaFactura: Factura = {
      id_factura: generateId('fac'),
      numero_factura: this.generateNumeroFactura(),
      id_cliente: data.id_cliente || '',
      fecha_emision: new Date().toISOString(),
      subtotal: data.subtotal || 0,
      iva: data.iva || 0,
      total: data.total || 0,
      estado_pago: 'PENDIENTE' as EstadoPago,
      metodo_pago: data.metodo_pago || 'Efectivo',
      detalles: data.detalles || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    facturas.push(nuevaFactura);
    saveToStorage(STORAGE_KEYS.FACTURAS, facturas);
    
    return nuevaFactura;
  }

  /**
   * Actualizar una factura existente
   * SOLO se puede modificar si está PENDIENTE
   */
  async updateFactura(id: string, data: Partial<Factura>): Promise<Factura> {
    await simulateDelay();
    ensureDataExists();
    
    const facturas = getFromStorage<Factura>(STORAGE_KEYS.FACTURAS);
    const index = facturas.findIndex(f => f.id_factura === id);
    
    if (index === -1) {
      throw new Error('Factura no encontrada');
    }
    
    // Solo permitir modificar facturas PENDIENTES
    if (facturas[index].estado_pago !== 'PENDIENTE') {
      throw new Error('Solo se pueden modificar facturas en estado PENDIENTE');
    }
    
    facturas[index] = {
      ...facturas[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    saveToStorage(STORAGE_KEYS.FACTURAS, facturas);
    return facturas[index];
  }

  /**
   * Eliminar/Anular una factura (ELIMINACIÓN LÓGICA - cambia estado a ANULADA)
   * La factura NO se elimina, solo se marca como ANULADA
   */
  async deleteFactura(id: string): Promise<void> {
    await simulateDelay();
    ensureDataExists();
    
    const facturas = getFromStorage<Factura>(STORAGE_KEYS.FACTURAS);
    const index = facturas.findIndex(f => f.id_factura === id);
    
    if (index === -1) {
      throw new Error('Factura no encontrada');
    }
    
    // ELIMINACIÓN LÓGICA: Cambiar estado a ANULADA
    facturas[index].estado_pago = 'ANULADA' as EstadoPago;
    facturas[index].updatedAt = new Date().toISOString();
    
    saveToStorage(STORAGE_KEYS.FACTURAS, facturas);
  }

  /**
   * Anular una factura específicamente
   */
  async anularFactura(id: string): Promise<Factura> {
    await simulateDelay();
    ensureDataExists();
    
    const facturas = getFromStorage<Factura>(STORAGE_KEYS.FACTURAS);
    const index = facturas.findIndex(f => f.id_factura === id);
    
    if (index === -1) {
      throw new Error('Factura no encontrada');
    }
    
    if (facturas[index].estado_pago === 'ANULADA') {
      throw new Error('La factura ya está anulada');
    }
    
    facturas[index].estado_pago = 'ANULADA' as EstadoPago;
    facturas[index].updatedAt = new Date().toISOString();
    
    saveToStorage(STORAGE_KEYS.FACTURAS, facturas);
    return facturas[index];
  }

  /**
   * Marcar factura como pagada
   */
  async marcarComoPagada(id: string): Promise<Factura> {
    await simulateDelay();
    ensureDataExists();
    
    const facturas = getFromStorage<Factura>(STORAGE_KEYS.FACTURAS);
    const index = facturas.findIndex(f => f.id_factura === id);
    
    if (index === -1) {
      throw new Error('Factura no encontrada');
    }
    
    if (facturas[index].estado_pago === 'ANULADA') {
      throw new Error('No se puede pagar una factura anulada');
    }
    
    facturas[index].estado_pago = 'PAGADA' as EstadoPago;
    facturas[index].updatedAt = new Date().toISOString();
    
    saveToStorage(STORAGE_KEYS.FACTURAS, facturas);
    return facturas[index];
  }

  /**
   * Genera un número de factura único
   */
  generateNumeroFactura(): string {
    const facturas = getFromStorage<Factura>(STORAGE_KEYS.FACTURAS);
    const nextNum = facturas.length + 1;
    return `001-001-${String(nextNum).padStart(9, '0')}`;
  }
}

export default new FacturaService();
