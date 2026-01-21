/* Factura Service - BARBOX Backoffice - INTEGRADO CON BACKEND */

import { Factura, EstadoPago } from '../types/factura.types';
import api from '../config/api.config';

interface FacturaFilters {
  estado_pago?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  busqueda?: string;
}

class FacturaService {
  /**
   * Obtener lista de facturas con filtros opcionales
   */
  async getFacturas(filters?: FacturaFilters): Promise<Factura[]> {
    try {
      const params: any = {};
      
      if (filters?.estado_pago) params.estado_pago = filters.estado_pago;
      if (filters?.fechaDesde) params.fechaDesde = filters.fechaDesde;
      if (filters?.fechaHasta) params.fechaHasta = filters.fechaHasta;
      if (filters?.busqueda) params.busqueda = filters.busqueda;
      
      const response = await api.get<Factura[]>('/facturas', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.message || 'Error al obtener facturas');
    }
  }

  /**
   * Obtener una factura por ID
   */
  async getFacturaById(id: string): Promise<Factura> {
    try {
      const response = await api.get<Factura>(`/facturas/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.message || 'Factura no encontrada');
    }
  }

  /**
   * Crear una nueva factura
   */
  async createFactura(data: Partial<Factura>): Promise<Factura> {
    try {
      const response = await api.post<Factura>('/facturas', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.message || 'Error al crear factura');
    }
  }

  /**
   * Actualizar una factura existente
   */
  async updateFactura(id: string, data: Partial<Factura>): Promise<Factura> {
    try {
      const response = await api.put<Factura>(`/facturas/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.message || 'Error al actualizar factura');
    }
  }

  /**
   * Eliminar/Anular una factura
   */
  async deleteFactura(id: string): Promise<void> {
    try {
      await api.delete(`/facturas/${id}`);
    } catch (error: any) {
      throw new Error(error?.message || 'Error al eliminar factura');
    }
  }

  /**
   * Anular una factura específicamente
   */
  async anularFactura(id: string): Promise<Factura> {
    try {
      const response = await api.patch<Factura>(`/facturas/${id}/anular`);
      return response.data;
    } catch (error: any) {
      // Si el endpoint no existe, usar update estándar
      return this.updateFactura(id, { estado_pago: 'ANULADA' as EstadoPago });
    }
  }

  /**
   * Marcar factura como pagada
   */
  async marcarComoPagada(id: string): Promise<Factura> {
    try {
      const response = await api.patch<Factura>(`/facturas/${id}/pagar`);
      return response.data;
    } catch (error: any) {
      // Si el endpoint no existe, usar update estándar
      return this.updateFactura(id, { estado_pago: 'PAGADA' as EstadoPago });
    }
  }

  /**
   * Genera un número de factura único
   */
  generateNumeroFactura(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `001-001-${year}${month}${day}${random}`;
  }
}

export default new FacturaService();
