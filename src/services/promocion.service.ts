import api from '../config/api.config';
import { Promocion } from '../types/promocion.types';

class PromocionService {
  async getPromociones(): Promise<Promocion[]> {
    try { const resp = await api.get<Promocion[]>('/promociones'); return resp.data; } catch (error:any) { console.error('Error al obtener promociones', error); throw new Error(error.response?.data?.message || 'Error al obtener promociones'); }
  }

  async getPromocionById(id: string): Promise<Promocion> { try { const resp = await api.get<Promocion>(`/promociones/${id}`); return resp.data; } catch (error:any) { console.error(`Error al obtener promocion ${id}`, error); throw new Error(error.response?.data?.message || 'Error al obtener promocion'); } }

  async createPromocion(data: Partial<Promocion>): Promise<Promocion> { try { const resp = await api.post<Promocion>('/promociones', data); return resp.data; } catch (error:any) { console.error('Error al crear promocion', error); throw new Error(error.response?.data?.message || 'Error al crear promocion'); } }

  async updatePromocion(id: string, data: Partial<Promocion>): Promise<Promocion> { try { const resp = await api.put<Promocion>(`/promociones/${id}`, data); return resp.data; } catch (error:any) { console.error(`Error al actualizar promocion ${id}`, error); throw new Error(error.response?.data?.message || 'Error al actualizar promocion'); } }

  async deletePromocion(id: string): Promise<void> { try { await api.delete(`/promociones/${id}`); } catch (error:any) { console.error(`Error al eliminar promocion ${id}`, error); throw new Error(error.response?.data?.message || 'Error al eliminar promocion'); } }

  async getProductosAplicables(): Promise<string[]> { try { const resp = await api.get<string[]>('/promociones/productos'); return resp.data; } catch (error:any) { console.error('Error al obtener productos aplicables', error); return []; } }
}

export default new PromocionService();