import api from '../config/api.config';
import { Proveedor } from '../types/proveedor.types';

// Mapear del backend al frontend
function mapProveedorFromBackend(backendProveedor: any): Proveedor {
  return {
    id_proveedor: backendProveedor.id_proveedor,
    ruc: backendProveedor.ruc_cedula,
    nombre_comercial: backendProveedor.razon_social,
    contacto: backendProveedor.contacto || '',
    telefono: backendProveedor.telefono || '',
    email: backendProveedor.email || '',
    direccion: backendProveedor.direccion || '',
    createdAt: backendProveedor.fecha_creacion || new Date().toISOString(),
    updatedAt: backendProveedor.fecha_actualizacion || new Date().toISOString(),
  };
}

// Mapear del frontend al backend
function mapProveedorToBackend(frontendProveedor: any): any {
  const backendData: any = {};
  
  if (frontendProveedor.ruc !== undefined) backendData.ruc_cedula = frontendProveedor.ruc;
  if (frontendProveedor.nombre_comercial !== undefined) backendData.razon_social = frontendProveedor.nombre_comercial;
  if (frontendProveedor.contacto !== undefined) backendData.contacto = frontendProveedor.contacto;
  if (frontendProveedor.telefono !== undefined) backendData.telefono = frontendProveedor.telefono;
  if (frontendProveedor.email !== undefined) backendData.email = frontendProveedor.email;
  if (frontendProveedor.direccion !== undefined) backendData.direccion = frontendProveedor.direccion;
  
  return backendData;
}

class ProveedorService {
  async getProveedores(): Promise<Proveedor[]> {
    try { 
      const resp = await api.get<any[]>('/proveedores'); 
      return resp.data.map(mapProveedorFromBackend);
    }
    catch (error: any) { console.error('Error al obtener proveedores', error); throw new Error(error.response?.data?.message || 'Error al obtener proveedores'); }
  }

  async getProveedorById(id: string): Promise<Proveedor> {
    try { 
      const resp = await api.get<any>(`/proveedores/${id}`); 
      return mapProveedorFromBackend(resp.data);
    }
    catch (error: any) { console.error(`Error al obtener proveedor ${id}`, error); throw new Error(error.response?.data?.message || 'Error al obtener proveedor'); }
  }

  async createProveedor(data: Partial<Proveedor>): Promise<Proveedor> {
    try { 
      const backendData = mapProveedorToBackend(data);
      const resp = await api.post<any>('/proveedores', backendData); 
      return mapProveedorFromBackend(resp.data);
    }
    catch (error: any) { console.error('Error al crear proveedor', error); throw new Error(error.response?.data?.message || 'Error al crear proveedor'); }
  }

  async updateProveedor(id: string, data: Partial<Proveedor>): Promise<Proveedor> {
    try { 
      const backendData = mapProveedorToBackend(data);
      const resp = await api.put<any>(`/proveedores/${id}`, backendData); 
      return mapProveedorFromBackend(resp.data);
    }
    catch (error: any) { console.error(`Error al actualizar proveedor ${id}`, error); throw new Error(error.response?.data?.message || 'Error al actualizar proveedor'); }
  }

  async deleteProveedor(id: string): Promise<void> {
    try { await api.delete(`/proveedores/${id}`); }
    catch (error: any) { console.error(`Error al eliminar proveedor ${id}`, error); throw new Error(error.response?.data?.message || 'Error al eliminar proveedor'); }
  }

  async searchByRUCOrName(q: string): Promise<Proveedor[]> {
    try { 
      const resp = await api.get<any[]>('/proveedores/buscar', { params: { q } }); 
      return resp.data.map(mapProveedorFromBackend);
    }
    catch (error: any) { console.error('Error buscando proveedores', error); throw new Error(error.response?.data?.message || 'Error buscando proveedores'); }
  }
}

export default new ProveedorService();
