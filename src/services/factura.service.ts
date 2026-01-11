import api from '../config/api.config';
import { Factura } from '../types/factura.types';

interface FacturaFilters {
  estado_pago?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  busqueda?: string;
}

class FacturaService {
  async getFacturas(filters?: FacturaFilters): Promise<Factura[]> {
    try {
      const params: Record<string, unknown> = {};
      if (filters?.estado_pago) params.estado_pago = filters.estado_pago;
      if (filters?.fechaDesde) params.fechaDesde = filters.fechaDesde;
      if (filters?.fechaHasta) params.fechaHasta = filters.fechaHasta;
      if (filters?.busqueda) params.busqueda = filters.busqueda;

      const resp = await api.get<Factura[]>('/facturas', { params });
      return resp.data;
    } catch (error: any) {
      console.error('Error al obtener facturas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener facturas');
    }
  }

  async getFacturaById(id: string): Promise<Factura> {
    try {
      const resp = await api.get<Factura>(`/facturas/${id}`);
      return resp.data;
    } catch (error: any) {
      console.error(`Error al obtener factura ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener factura');
    }
  }

  async createFactura(data: Partial<Factura>): Promise<Factura> {
    try {
      const resp = await api.post<Factura>('/facturas', data);
      return resp.data;
    } catch (error: any) {
      console.error('Error al crear factura:', error);
      throw new Error(error.response?.data?.message || 'Error al crear factura');
    }
  }

  async updateFactura(id: string, data: Partial<Factura>): Promise<Factura> {
    try {
      const resp = await api.put<Factura>(`/facturas/${id}`, data);
      return resp.data;
    } catch (error: any) {
      console.error(`Error al actualizar factura ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar factura');
    }
  }

  async deleteFactura(id: string): Promise<void> {
    try {
      await api.delete(`/facturas/${id}`);
    } catch (error: any) {
      console.error(`Error al eliminar factura ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar factura');
    }
  }

  /**
   * Genera un número de factura. Preferible que el backend lo genere realmente; aquí se crea uno temporal: YYYYMMDD-XXXX
   */
  generateNumeroFactura(): string {
    const date = new Date();
    const y = date.getFullYear().toString();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    return `${y}${m}${d}-${random}`;
  }
}

export default new FacturaService();
