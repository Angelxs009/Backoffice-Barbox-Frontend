import api from '../config/api.config';
import { Bodega, Recepcion } from '../types/bodega.types';

// El módulo de bodega maneja RECEPCIONES de productos
class BodegaService {
  async getBodegas(): Promise<Recepcion[]> {
    try {
      const resp = await api.get<Recepcion[]>('/bodega/recepciones');
      return resp.data;
    } catch (error: any) {
      console.error('Error al obtener recepciones', error);
      throw new Error(error.response?.data?.message || 'Error al obtener recepciones');
    }
  }

  async getBodegaById(id: string): Promise<Recepcion> {
    try {
      const resp = await api.get<Recepcion>(`/bodega/recepciones/${id}`);
      return resp.data;
    } catch (error: any) {
      console.error(`Error al obtener recepción ${id}`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener recepción');
    }
  }

  async createBodega(data: Partial<Recepcion>): Promise<Recepcion> {
    try {
      const resp = await api.post<Recepcion>('/bodega/recepciones', data);
      return resp.data;
    } catch (error: any) {
      console.error('Error al crear recepción', error);
      throw new Error(error.response?.data?.message || 'Error al crear recepción');
    }
  }

  async updateBodega(id: string, data: Partial<Recepcion>): Promise<Recepcion> {
    try {
      const resp = await api.put<Recepcion>(`/bodega/recepciones/${id}`, data);
      return resp.data;
    } catch (error: any) {
      console.error(`Error al actualizar recepción ${id}`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar recepción');
    }
  }

  async deleteBodega(id: string): Promise<void> {
    try {
      await api.delete(`/bodega/recepciones/${id}`);
    } catch (error: any) {
      console.error(`Error al eliminar recepción ${id}`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar recepción');
    }
  }

  // Búsqueda con filtros
  async searchRecepciones(compra?: string, fecha?: string): Promise<Recepcion[]> {
    try {
      const params = new URLSearchParams();
      if (compra) params.append('compra', compra);
      if (fecha) params.append('fecha', fecha);
      
      const resp = await api.get<Recepcion[]>(`/bodega/recepciones/buscar?${params.toString()}`);
      return resp.data;
    } catch (error: any) {
      console.error('Error al buscar recepciones', error);
      throw new Error(error.response?.data?.message || 'Error al buscar recepciones');
    }
  }
}

export default new BodegaService();
