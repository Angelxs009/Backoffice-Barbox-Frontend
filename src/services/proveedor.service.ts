import api from '../config/api.config';
import { Proveedor } from '../types/proveedor.types';

class ProveedorService {
  async getProveedores(): Promise<Proveedor[]> {
    try { const resp = await api.get<Proveedor[]>('/proveedores'); return resp.data; }
    catch (error: any) { console.error('Error al obtener proveedores', error); throw new Error(error.response?.data?.message || 'Error al obtener proveedores'); }
  }

  async getProveedorById(id: string): Promise<Proveedor> {
    try { const resp = await api.get<Proveedor>(`/proveedores/${id}`); return resp.data; }
    catch (error: any) { console.error(`Error al obtener proveedor ${id}`, error); throw new Error(error.response?.data?.message || 'Error al obtener proveedor'); }
  }

  async createProveedor(data: Partial<Proveedor>): Promise<Proveedor> {
    try { const resp = await api.post<Proveedor>('/proveedores', data); return resp.data; }
    catch (error: any) { console.error('Error al crear proveedor', error); throw new Error(error.response?.data?.message || 'Error al crear proveedor'); }
  }

  async updateProveedor(id: string, data: Partial<Proveedor>): Promise<Proveedor> {
    try { const resp = await api.put<Proveedor>(`/proveedores/${id}`, data); return resp.data; }
    catch (error: any) { console.error(`Error al actualizar proveedor ${id}`, error); throw new Error(error.response?.data?.message || 'Error al actualizar proveedor'); }
  }

  async deleteProveedor(id: string): Promise<void> {
    try { await api.delete(`/proveedores/${id}`); }
    catch (error: any) { console.error(`Error al eliminar proveedor ${id}`, error); throw new Error(error.response?.data?.message || 'Error al eliminar proveedor'); }
  }

  async searchByRUCOrName(q: string): Promise<Proveedor[]> {
    try { const resp = await api.get<Proveedor[]>('/proveedores/buscar', { params: { q } }); return resp.data; }
    catch (error: any) { console.error('Error buscando proveedores', error); throw new Error(error.response?.data?.message || 'Error buscando proveedores'); }
  }
}

export default new ProveedorService();
