import api from '../config/api.config';
import { Bodega } from '../types/bodega.types';

class BodegaService {
  async getBodegas(): Promise<Bodega[]> {
    try {
      const resp = await api.get<Bodega[]>('/bodegas');
      return resp.data;
    } catch (error: any) {
      console.error('Error al obtener bodegas', error);
      throw new Error(error.response?.data?.message || 'Error al obtener bodegas');
    }
  }

  async getBodegaById(id: string): Promise<Bodega> {
    try {
      const resp = await api.get<Bodega>(`/bodegas/${id}`);
      return resp.data;
    } catch (error: any) {
      console.error(`Error al obtener bodega ${id}`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener bodega');
    }
  }

  async createBodega(data: Partial<Bodega>): Promise<Bodega> {
    try {
      const resp = await api.post<Bodega>('/bodegas', data);
      return resp.data;
    } catch (error: any) {
      console.error('Error al crear bodega', error);
      throw new Error(error.response?.data?.message || 'Error al crear bodega');
    }
  }

  async updateBodega(id: string, data: Partial<Bodega>): Promise<Bodega> {
    try {
      const resp = await api.put<Bodega>(`/bodegas/${id}`, data);
      return resp.data;
    } catch (error: any) {
      console.error(`Error al actualizar bodega ${id}`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar bodega');
    }
  }

  async deleteBodega(id: string): Promise<void> {
    try {
      await api.delete(`/bodegas/${id}`);
    } catch (error: any) {
      console.error(`Error al eliminar bodega ${id}`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar bodega');
    }
  }
}

export default new BodegaService();
