/* Cliente Service - BARBOX Backoffice - SIMULACIÓN CON LOCALSTORAGE */

import { Cliente, ClienteFormData, ClienteFilters } from '../types/cliente.types';
import {
  STORAGE_KEYS,
  getFromStorage,
  saveToStorage,
  generateId,
  simulateDelay,
  initializeMockData,
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
   * F4.1: Validación de cédula única y campos obligatorios
   */
  async createCliente(data: ClienteFormData): Promise<Cliente> {
    await simulateDelay();
    ensureDataExists();
    
    const clientes = getFromStorage<Cliente>(STORAGE_KEYS.CLIENTES);
    
    // F4.1 E4: Validar campos obligatorios
    if (!data.cedula || !data.nombres || !data.apellidos) {
      throw new Error('Complete todos los campos requeridos.');
    }
    
    // F4.1 E3: Validar formato de cédula (10 dígitos)
    if (!/^\d{10}$/.test(data.cedula)) {
      throw new Error('La cédula ingresada no es válida.');
    }
    
    // F4.1 E2: Validar cédula única
    if (clientes.some(c => c.cedula === data.cedula && c.estado === true)) {
      throw new Error('La cédula ya está registrada.');
    }
    
    const nuevoCliente: Cliente = {
      id_cliente: generateId('cli'),
      cedula: data.cedula,
      nombres: data.nombres,
      apellidos: data.apellidos,
      correo: data.correo || '',
      telefono: data.telefono || '',
      direccion: data.direccion || '',
      fecha_registro: new Date().toISOString().split('T')[0],
      estado: true, // ACT
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    clientes.push(nuevoCliente);
    saveToStorage(STORAGE_KEYS.CLIENTES, clientes);
    
    return nuevoCliente;
  }

  /**
   * Actualizar un cliente existente
   * F4.2: Solo clientes ACT pueden modificarse, cédula no modificable
   */
  async updateCliente(id: string, data: ClienteFormData): Promise<Cliente> {
    await simulateDelay();
    ensureDataExists();
    
    const clientes = getFromStorage<Cliente>(STORAGE_KEYS.CLIENTES);
    const index = clientes.findIndex(c => c.id_cliente === id);
    
    // F4.2 E2: Cliente no encontrado
    if (index === -1) {
      throw new Error('El cliente especificado no existe.');
    }
    
    // F4.2: Solo clientes ACT pueden modificarse
    if (!clientes[index].estado) {
      throw new Error('El cliente se encuentra deshabilitado y no puede modificarse.');
    }
    
    // F4.2: Mantener cédula original (no modificable)
    clientes[index] = {
      ...clientes[index],
      nombres: data.nombres || clientes[index].nombres,
      apellidos: data.apellidos || clientes[index].apellidos,
      correo: data.correo ?? clientes[index].correo,
      telefono: data.telefono ?? clientes[index].telefono,
      direccion: data.direccion ?? clientes[index].direccion,
      updatedAt: new Date().toISOString(),
    };
    
    saveToStorage(STORAGE_KEYS.CLIENTES, clientes);
    return clientes[index];
  }

  /**
   * Eliminar un cliente (ELIMINACIÓN LÓGICA - cambia estado a INA)
   * F4.3: Cambio de estado ACT -> INA
   */
  async deleteCliente(id: string): Promise<void> {
    await simulateDelay();
    ensureDataExists();
    
    const clientes = getFromStorage<Cliente>(STORAGE_KEYS.CLIENTES);
    const index = clientes.findIndex(c => c.id_cliente === id);
    
    // F4.3 E2: Cliente no encontrado
    if (index === -1) {
      throw new Error('El cliente no existe.');
    }
    
    // F4.3 E3: Cliente ya inactivo
    if (!clientes[index].estado) {
      throw new Error('El cliente ya se encuentra deshabilitado.');
    }
    
    // ELIMINACIÓN LÓGICA: Cambiar estado a INA (false)
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
