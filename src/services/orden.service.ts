import api from '../config/api.config';
import { OrdenCompra } from '../types/orden.types';

class OrdenService {
  async getOrdenes(params?: Record<string, unknown>): Promise<OrdenCompra[]> {
    try { const resp = await api.get<OrdenCompra[]>('/compras', { params }); return resp.data; }
    catch (error: any) { console.error('Error al obtener ordenes', error); throw new Error(error.response?.data?.message || 'Error al obtener ordenes'); }
  }

  async getOrdenById(id: string): Promise<OrdenCompra> {
    try { const resp = await api.get<OrdenCompra>(`/compras/${id}`); return resp.data; }
    catch (error: any) { console.error(`Error al obtener orden ${id}`, error); throw new Error(error.response?.data?.message || 'Error al obtener orden'); }
  }

  async createOrden(data: Partial<OrdenCompra>): Promise<OrdenCompra> {
    try { const resp = await api.post<OrdenCompra>('/compras', data); return resp.data; }
    catch (error: any) { console.error('Error al crear orden', error); throw new Error(error.response?.data?.message || 'Error al crear orden'); }
  }

  async updateOrden(id: string, data: Partial<OrdenCompra>): Promise<OrdenCompra> {
    try { const resp = await api.put<OrdenCompra>(`/compras/${id}`, data); return resp.data; }
    catch (error: any) { console.error(`Error al actualizar orden ${id}`, error); throw new Error(error.response?.data?.message || 'Error al actualizar orden'); }
  }

  async deleteOrden(id: string): Promise<void> {
    try { await api.delete(`/compras/${id}`); }
    catch (error: any) { console.error(`Error al eliminar orden ${id}`, error); throw new Error(error.response?.data?.message || 'Error al eliminar orden'); }
  }

  generateNumeroOrden(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    const rand = Math.floor(1000 + Math.random()*9000);
    return `${y}${m}${day}-${rand}`;
  }
}

export default new OrdenService();
