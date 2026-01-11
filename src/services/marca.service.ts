import api from '../config/api.config';
import { Marca } from '../types/marca.types';

class MarcaService {
  async getMarcas(): Promise<Marca[]> { try { const resp = await api.get<Marca[]>('/marcas'); return resp.data; } catch (error:any) { console.error('Error al obtener marcas', error); throw new Error(error.response?.data?.message || 'Error al obtener marcas'); } }
  async getMarcaById(id:string): Promise<Marca> { try { const resp = await api.get<Marca>(`/marcas/${id}`); return resp.data; } catch (error:any) { console.error(`Error al obtener marca ${id}`, error); throw new Error(error.response?.data?.message || 'Error al obtener marca'); } }
  async createMarca(data: Partial<Marca>): Promise<Marca> { try { const resp = await api.post<Marca>('/marcas', data); return resp.data; } catch (error:any) { console.error('Error al crear marca', error); throw new Error(error.response?.data?.message || 'Error al crear marca'); } }
  async updateMarca(id:string, data: Partial<Marca>): Promise<Marca> { try { const resp = await api.put<Marca>(`/marcas/${id}`, data); return resp.data; } catch (error:any) { console.error(`Error al actualizar marca ${id}`, error); throw new Error(error.response?.data?.message || 'Error al actualizar marca'); } }
  async deleteMarca(id:string): Promise<void> { try { await api.delete(`/marcas/${id}`); } catch (error:any) { console.error(`Error al eliminar marca ${id}`, error); throw new Error(error.response?.data?.message || 'Error al eliminar marca'); } }
  async uploadLogo(file: File): Promise<string> { try { const fd = new FormData(); fd.append('logo', file); const resp = await api.post<{url:string}>('/marcas/upload-logo', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); return resp.data.url; } catch (error:any) { console.error('Error al subir logo', error); throw new Error(error.response?.data?.message || 'Error al subir logo'); } }
}

export default new MarcaService();