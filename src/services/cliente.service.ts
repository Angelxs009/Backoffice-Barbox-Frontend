/* Cliente Service - BARBOX Backoffice */

import api from '../config/api.config';
import { Cliente, ClienteFormData, ClienteFilters } from '../types/cliente.types';

class ClienteService {
  /**
   * Obtener lista de clientes con filtros opcionales
   */
  async getClientes(filters?: ClienteFilters): Promise<Cliente[]> {
    try {
      const params: Record<string, unknown> = {};
      
      if (filters?.busqueda) {
        params.busqueda = filters.busqueda;
      }
      
      if (filters?.estado !== undefined) {
        params.estado = filters.estado;
      }

      const response = await api.get<Cliente[]>('/clientes', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener clientes:', error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener la lista de clientes'
      );
    }
  }

  /**
   * Obtener un cliente por ID
   */
  async getClienteById(id: string): Promise<Cliente> {
    try {
      const response = await api.get<Cliente>(`/clientes/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener cliente ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener el cliente'
      );
    }
  }

  /**
   * Crear un nuevo cliente
   */
  async createCliente(data: ClienteFormData): Promise<Cliente> {
    try {
      const response = await api.post<Cliente>('/clientes', data);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear cliente:', error);
      throw new Error(
        error.response?.data?.message || 'Error al crear el cliente'
      );
    }
  }

  /**
   * Actualizar un cliente existente
   */
  async updateCliente(id: string, data: ClienteFormData): Promise<Cliente> {
    try {
      const response = await api.put<Cliente>(`/clientes/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error(`Error al actualizar cliente ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 'Error al actualizar el cliente'
      );
    }
  }

  /**
   * Eliminar un cliente (eliminación lógica)
   */
  async deleteCliente(id: string): Promise<void> {
    try {
      await api.delete(`/clientes/${id}`);
    } catch (error: any) {
      console.error(`Error al eliminar cliente ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 'Error al eliminar el cliente'
      );
    }
  }

  /**
   * Buscar clientes por término de búsqueda
   */
  async searchClientes(query: string): Promise<Cliente[]> {
    try {
      const response = await api.get<Cliente[]>('/clientes/buscar', {
        params: { q: query },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al buscar clientes:', error);
      throw new Error(
        error.response?.data?.message || 'Error al buscar clientes'
      );
    }
  }
}

export default new ClienteService();
