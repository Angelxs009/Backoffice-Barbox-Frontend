/* Cliente Service - BARBOX Backoffice - SIMULACIÓN CON LOCALSTORAGE */

import { Cliente, ClienteFormData, ClienteFilters } from '../types/cliente.types';
import {
  STORAGE_KEYS,
  getFromStorage,
  saveToStorage,
  generateId,
  simulateDelay,
  initializeMockData,
  MOCK_CLIENTES,
} from '../utils/mockData';

// Inicializar datos mock si no existen
const ensureDataExists = () => {
  const data = localStorage.getItem(STORAGE_KEYS.CLIENTES);
  if (!data || JSON.parse(data).length === 0) {
    initializeMockData();
  }
};

class ClienteService {
  /**
   * Obtener lista de clientes con filtros opcionales
   * RETORNA TODOS (incluyendo inactivos) para mostrar estado
   */
  async getClientes(filters?: ClienteFilters): Promise<Cliente[]> {
    await simulateDelay();
    ensureDataExists();
    
    let clientes = getFromStorage<Cliente>(STORAGE_KEYS.CLIENTES);
    
    // Aplicar filtros
    if (filters?.busqueda) {
      const search = filters.busqueda.toLowerCase();
      clientes = clientes.filter(c =>
        c.nombres.toLowerCase().includes(search) ||
        c.apellidos.toLowerCase().includes(search) ||
        c.cedula.includes(search) ||
        c.correo.toLowerCase().includes(search)
      );
    }
    
    // Solo filtrar por estado si se especifica explícitamente
    if (filters?.estado !== undefined) {
      clientes = clientes.filter(c => c.estado === filters.estado);
    }
    
    return clientes;
  }

  /**
   * Obtener un cliente por ID
   */
  async getClienteById(id: string): Promise<Cliente> {
    await simulateDelay();
    ensureDataExists();
    
    const clientes = getFromStorage<Cliente>(STORAGE_KEYS.CLIENTES);
    const cliente = clientes.find(c => c.id_cliente === id);
    
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    
    return cliente;
  }

  /**
   * Crear un nuevo cliente
   */
  async createCliente(data: ClienteFormData): Promise<Cliente> {
    await simulateDelay();
    ensureDataExists();
    
    const clientes = getFromStorage<Cliente>(STORAGE_KEYS.CLIENTES);
    
    // Validar cédula única
    if (clientes.some(c => c.cedula === data.cedula)) {
      throw new Error('Ya existe un cliente con esa cédula');
    }
    
    const nuevoCliente: Cliente = {
      id_cliente: generateId('cli'),
      cedula: data.cedula,
      nombres: data.nombres,
      apellidos: data.apellidos,
      correo: data.correo,
      telefono: data.telefono,
      direccion: data.direccion,
      fecha_registro: new Date().toISOString().split('T')[0],
      estado: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    clientes.push(nuevoCliente);
    saveToStorage(STORAGE_KEYS.CLIENTES, clientes);
    
    return nuevoCliente;
  }

  /**
   * Actualizar un cliente existente
   */
  async updateCliente(id: string, data: ClienteFormData): Promise<Cliente> {
    await simulateDelay();
    ensureDataExists();
    
    const clientes = getFromStorage<Cliente>(STORAGE_KEYS.CLIENTES);
    const index = clientes.findIndex(c => c.id_cliente === id);
    
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    
    // Validar cédula única (excluyendo el cliente actual)
    if (clientes.some(c => c.cedula === data.cedula && c.id_cliente !== id)) {
      throw new Error('Ya existe otro cliente con esa cédula');
    }
    
    clientes[index] = {
      ...clientes[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    saveToStorage(STORAGE_KEYS.CLIENTES, clientes);
    return clientes[index];
  }

  /**
   * Eliminar un cliente (ELIMINACIÓN LÓGICA - cambia estado a false)
   * El cliente NO se elimina, solo se marca como inactivo
   */
  async deleteCliente(id: string): Promise<void> {
    await simulateDelay();
    ensureDataExists();
    
    const clientes = getFromStorage<Cliente>(STORAGE_KEYS.CLIENTES);
    const index = clientes.findIndex(c => c.id_cliente === id);
    
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    
    // ELIMINACIÓN LÓGICA: Solo cambiar estado a false
    clientes[index].estado = false;
    clientes[index].updatedAt = new Date().toISOString();
    
    saveToStorage(STORAGE_KEYS.CLIENTES, clientes);
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
    await simulateDelay();
    ensureDataExists();
    
    const clientes = getFromStorage<Cliente>(STORAGE_KEYS.CLIENTES);
    const index = clientes.findIndex(c => c.id_cliente === id);
    
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    
    clientes[index].estado = true;
    clientes[index].updatedAt = new Date().toISOString();
    
    saveToStorage(STORAGE_KEYS.CLIENTES, clientes);
    return clientes[index];
  }
}

export default new ClienteService();
