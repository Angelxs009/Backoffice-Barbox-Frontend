/* Cliente Service - BARBOX Backoffice - INTEGRADO CON BACKEND */

import { Cliente, ClienteFormData, ClienteFilters } from '../types/cliente.types';
import api from '../config/api.config';

// Mapear datos del backend al formato del frontend
function mapClienteFromBackend(backendCliente: any): Cliente {
  return {
    id_cliente: backendCliente.id_cliente?.toString() || '',
    cedula: backendCliente.ruc_cedula || '',
    nombres: [backendCliente.nombre1, backendCliente.nombre2].filter(Boolean).join(' '),
    apellidos: [backendCliente.apellido1, backendCliente.apellido2].filter(Boolean).join(' '),
    correo: backendCliente.email || '',
    telefono: backendCliente.telefono || '',
    direccion: backendCliente.direccion || '',
    fecha_registro: backendCliente.fecha_creacion || new Date().toISOString(),
    estado: backendCliente.estado === 'ACT',
    createdAt: backendCliente.fecha_creacion || new Date().toISOString(),
    updatedAt: backendCliente.fecha_actualizacion || new Date().toISOString(),
  };
}

// Mapear datos del frontend al formato del backend
function mapClienteToBackend(frontendCliente: any): any {
  const backendData: any = {};
  
  if (frontendCliente.cedula !== undefined) backendData.ruc_cedula = frontendCliente.cedula;
  if (frontendCliente.correo !== undefined) backendData.email = frontendCliente.correo;
  
  // Separar nombres en nombre1 y nombre2
  if (frontendCliente.nombres !== undefined) {
    const nombres = frontendCliente.nombres.trim().split(/\s+/);
    backendData.nombre1 = nombres[0] || '';
    backendData.nombre2 = nombres.slice(1).join(' ') || '';
  }
  
  // Separar apellidos en apellido1 y apellido2
  if (frontendCliente.apellidos !== undefined) {
    const apellidos = frontendCliente.apellidos.trim().split(/\s+/);
    backendData.apellido1 = apellidos[0] || '';
    backendData.apellido2 = apellidos.slice(1).join(' ') || '';
  }
  
  if (frontendCliente.telefono !== undefined) backendData.telefono = frontendCliente.telefono;
  if (frontendCliente.direccion !== undefined) backendData.direccion = frontendCliente.direccion;
  if (frontendCliente.estado !== undefined) backendData.estado = frontendCliente.estado ? 'ACT' : 'INA';
  
  return backendData;
}

class ClienteService {
  /**
   * Obtener lista de clientes con filtros opcionales
   */
  async getClientes(filters?: ClienteFilters): Promise<Cliente[]> {
    try {
      const params: any = {};
      
      if (filters?.busqueda) params.busqueda = filters.busqueda;
      if (filters?.estado !== undefined) params.estado = filters.estado ? 'ACT' : 'INA';
      
      const response = await api.get<any[]>('/clientes', { params });
      return response.data.map(mapClienteFromBackend);
    } catch (error: any) {
      throw new Error(error?.message || 'Error al obtener clientes');
    }
  }

  /**
   * Obtener un cliente por ID
   */
  async getClienteById(id: string): Promise<Cliente> {
    try {
      const response = await api.get<any>(`/clientes/buscar?id=${id}`);
      return mapClienteFromBackend(response.data);
    } catch (error: any) {
      throw new Error(error?.message || 'Cliente no encontrado');
    }
  }

  /**
   * Crear un nuevo cliente
   */
  async createCliente(data: ClienteFormData): Promise<Cliente> {
    try {
      const backendData = mapClienteToBackend(data);
      const response = await api.post<any>('/clientes', backendData);
      return mapClienteFromBackend(response.data);
    } catch (error: any) {
      throw new Error(error?.message || 'Error al crear cliente');
    }
  }

  /**
   * Actualizar un cliente existente
   */
  async updateCliente(id: string, data: Partial<ClienteFormData>): Promise<Cliente> {
    try {
      const backendData = mapClienteToBackend(data);
      const response = await api.put<any>(`/clientes/${id}`, backendData);
      return mapClienteFromBackend(response.data);
    } catch (error: any) {
      throw new Error(error?.message || 'Error al actualizar cliente');
    }
  }

  /**
   * Eliminar un cliente (ELIMINACIÓN LÓGICA)
   */
  async deleteCliente(id: string): Promise<void> {
    try {
      await api.delete(`/clientes/${id}`);
    } catch (error: any) {
      throw new Error(error?.message || 'Error al eliminar cliente');
    }
  }

  /**
   * Buscar clientes por término de búsqueda
   */
  async searchClientes(query: string): Promise<Cliente[]> {
    return this.getClientes({ busqueda: query });
  }

  /**
   * Reactivar un cliente inactivo
   */
  async reactivarCliente(id: string): Promise<Cliente> {
    try {
      const response = await api.patch<any>(`/clientes/${id}/reactivar`);
      return mapClienteFromBackend(response.data);
    } catch (error: any) {
      // Si el endpoint no existe, usar update estándar
      return this.updateCliente(id, { estado: true } as any);
    }
  }
}

export default new ClienteService();
