/* Mock Data - BARBOX */
import { Cliente } from '../types/cliente.types';
import { Producto } from '../types/producto.types';
import { Factura } from '../types/factura.types';

export const MOCK_CLIENTES: Cliente[] = [
  {
    id_cliente: 'cli-001',
    cedula: '0912345675', // Cédula válida según algoritmo Módulo 10
    nombres: 'Juan Carlos',
    apellidos: 'Pérez García',
    correo: 'juan@email.com',
    telefono: '0991234567',
    direccion: 'Av. 9 de Octubre 123',
    fecha_registro: '2025-06-15',
    estado: true,
    createdAt: '2025-06-15T10:00:00Z',
    updatedAt: '2025-06-15T10:00:00Z',
  },
  {
    id_cliente: 'cli-002',
    cedula: '1723456784', // Cédula válida según algoritmo Módulo 10
    nombres: 'María Elena',
    apellidos: 'González López',
    correo: 'maria@email.com',
    telefono: '0982345678',
    direccion: 'Calle Luque 456',
    fecha_registro: '2025-07-20',
    estado: true,
    createdAt: '2025-07-20T14:30:00Z',
    updatedAt: '2025-07-20T14:30:00Z',
  },
  {
    id_cliente: 'cli-003',
    cedula: '1710034065', // Cédula válida según algoritmo Módulo 10
    nombres: 'Roberto',
    apellidos: 'Martínez Vera',
    correo: 'roberto@email.com',
    telefono: '0973456789',
    direccion: 'Av. Francisco de Orellana',
    fecha_registro: '2025-08-10',
    estado: true,
    createdAt: '2025-08-10T09:15:00Z',
    updatedAt: '2025-08-10T09:15:00Z',
  },
  {
    id_cliente: 'cli-004',
    cedula: '1803587680', // Cédula válida según algoritmo Módulo 10
    nombres: 'Ana Lucía',
    apellidos: 'Rodríguez Sánchez',
    correo: 'ana@email.com',
    telefono: '0964567890',
    direccion: 'Vía a la Costa Km 8',
    fecha_registro: '2025-09-05',
    estado: false,
    createdAt: '2025-09-05T15:45:00Z',
    updatedAt: '2025-09-05T15:45:00Z',
  },
  {
    id_cliente: 'cli-005',
    cedula: '2400012346', // Cédula válida (provincia 24 - Galápagos)
    nombres: 'Carlos Eduardo',
    apellidos: 'Fernández Mora',
    correo: 'carlos@email.com',
    telefono: '0975678901',
    direccion: 'Ciudadela Kennedy',
    fecha_registro: '2025-10-12',
    estado: true,
    createdAt: '2025-10-12T11:20:00Z',
    updatedAt: '2025-10-12T11:20:00Z',
  },
];

export const MOCK_PRODUCTOS: Producto[] = [
  {
    id_producto: 'prod-001',
    codigo_barras: '7891234567890',
    nombre: 'Johnnie Walker Red Label 750ml',
    descripcion: 'Whisky escocés blended, 750ml',
    precio: 28.50,
    stock: 45,
    categoria: 'Whisky',
    subcategoria: 'Escocés',
    marca: 'Johnnie Walker',
    imagen_url: '',
    estado: true,
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id_producto: 'prod-002',
    codigo_barras: '7891234567891',
    nombre: 'Johnnie Walker Black Label 750ml',
    descripcion: 'Whisky escocés blended premium, 750ml',
    precio: 45.00,
    stock: 30,
    categoria: 'Whisky',
    subcategoria: 'Escocés',
    marca: 'Johnnie Walker',
    imagen_url: '',
    estado: true,
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id_producto: 'prod-003',
    codigo_barras: '7501234567892',
    nombre: 'Absolut Original 750ml',
    descripcion: 'Vodka sueco premium, 750ml',
    precio: 22.00,
    stock: 60,
    categoria: 'Vodka',
    subcategoria: 'Premium',
    marca: 'Absolut',
    imagen_url: '',
    estado: true,
    createdAt: '2025-02-10T00:00:00Z',
    updatedAt: '2025-02-10T00:00:00Z',
  },
  {
    id_producto: 'prod-004',
    codigo_barras: '7501234567893',
    nombre: 'Bacardí Superior 750ml',
    descripcion: 'Ron blanco caribeño, 750ml',
    precio: 18.50,
    stock: 80,
    categoria: 'Ron',
    subcategoria: 'Blanco',
    marca: 'Bacardí',
    imagen_url: '',
    estado: true,
    createdAt: '2025-02-15T00:00:00Z',
    updatedAt: '2025-02-15T00:00:00Z',
  },
  {
    id_producto: 'prod-005',
    codigo_barras: '7501234567894',
    nombre: 'José Cuervo Especial 750ml',
    descripcion: 'Tequila reposado mexicano, 750ml',
    precio: 24.00,
    stock: 35,
    categoria: 'Tequila',
    subcategoria: 'Reposado',
    marca: 'José Cuervo',
    imagen_url: '',
    estado: true,
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-03-01T00:00:00Z',
  },
];

export const MOCK_FACTURAS: Factura[] = [
  {
    id_factura: 'fac-001',
    numero_factura: '001-001-000000001',
    id_cliente: 'cli-001',
    fecha_emision: '2025-11-15T10:30:00Z',
    subtotal: 85.50,
    iva: 10.26,
    total: 95.76,
    estado_pago: 'PAGADA',
    metodo_pago: 'Efectivo',
    createdAt: '2025-11-15T10:30:00Z',
    updatedAt: '2025-11-15T10:30:00Z',
    detalles: [{id_detalle: 'det-001', id_factura: 'fac-001', id_producto: 'prod-001', cantidad: 3, precio_unitario: 28.50, subtotal: 85.50}],
  },
  {
    id_factura: 'fac-002',
    numero_factura: '001-001-000000002',
    id_cliente: 'cli-002',
    fecha_emision: '2025-11-20T14:45:00Z',
    subtotal: 132.00,
    iva: 15.84,
    total: 147.84,
    estado_pago: 'PENDIENTE',
    metodo_pago: 'Transferencia',
    createdAt: '2025-11-20T14:45:00Z',
    updatedAt: '2025-11-20T14:45:00Z',
    detalles: [{id_detalle: 'det-002', id_factura: 'fac-002', id_producto: 'prod-003', cantidad: 6, precio_unitario: 22.00, subtotal: 132.00}],
  },
  {
    id_factura: 'fac-003',
    numero_factura: '001-001-000000003',
    id_cliente: 'cli-003',
    fecha_emision: '2025-12-01T09:15:00Z',
    subtotal: 225.00,
    iva: 27.00,
    total: 252.00,
    estado_pago: 'PAGADA',
    metodo_pago: 'Tarjeta',
    createdAt: '2025-12-01T09:15:00Z',
    updatedAt: '2025-12-01T09:15:00Z',
    detalles: [{id_detalle: 'det-003', id_factura: 'fac-003', id_producto: 'prod-002', cantidad: 5, precio_unitario: 45.00, subtotal: 225.00}],
  },
  {
    id_factura: 'fac-004',
    numero_factura: '001-001-000000004',
    id_cliente: 'cli-005',
    fecha_emision: '2025-12-10T16:00:00Z',
    subtotal: 74.00,
    iva: 8.88,
    total: 82.88,
    estado_pago: 'PENDIENTE',
    metodo_pago: 'Efectivo',
    createdAt: '2025-12-10T16:00:00Z',
    updatedAt: '2025-12-10T16:00:00Z',
    detalles: [{id_detalle: 'det-004', id_factura: 'fac-004', id_producto: 'prod-004', cantidad: 4, precio_unitario: 18.50, subtotal: 74.00}],
  },
  {
    id_factura: 'fac-005',
    numero_factura: '001-001-000000005',
    id_cliente: 'cli-001',
    fecha_emision: '2025-12-15T11:30:00Z',
    subtotal: 48.00,
    iva: 5.76,
    total: 53.76,
    estado_pago: 'ANULADA',
    metodo_pago: 'Transferencia',
    createdAt: '2025-12-15T11:30:00Z',
    updatedAt: '2025-12-15T11:30:00Z',
    detalles: [{id_detalle: 'det-005', id_factura: 'fac-005', id_producto: 'prod-005', cantidad: 2, precio_unitario: 24.00, subtotal: 48.00}],
  },
];

export const STORAGE_KEYS = {
  CLIENTES: 'barbox_clientes',
  PRODUCTOS: 'barbox_productos',
  FACTURAS: 'barbox_facturas',
};

export const initializeMockData = () => {
  localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(MOCK_CLIENTES));
  localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(MOCK_PRODUCTOS));
  localStorage.setItem(STORAGE_KEYS.FACTURAS, JSON.stringify(MOCK_FACTURAS));
};

export const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
