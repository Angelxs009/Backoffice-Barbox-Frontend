/* Cliente Types - BARBOX Backoffice */

export interface Cliente {
  id_cliente: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  direccion: string;
  fecha_registro: string;
  estado: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClienteFormData {
  cedula: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  direccion: string;
}

export interface ClienteFilters {
  busqueda?: string;
  estado?: boolean;
}
