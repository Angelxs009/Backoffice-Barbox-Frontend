import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import SearchBar from '../../../components/common/SearchBar';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import Toast from '../../../components/common/Toast';
import { Cliente } from '../../../types/cliente.types';
import clienteService from '../../../services/cliente.service';
import './ClientesListPage.css';

const ClientesListPage: React.FC = () => {
  const navigate = useNavigate();

  // Estado
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadClientes();
  }, []);

  /**
   * Cargar lista de clientes
   */
  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getClientes();
      setClientes(data);
    } catch (error: any) {
      setToast({
        message: error.message || 'Error al cargar los clientes',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Buscar clientes
   */
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadClientes();
      return;
    }

    try {
      setLoading(true);
      const data = await clienteService.searchClientes(searchQuery);
      setClientes(data);
      
      if (data.length === 0) {
        setToast({
          message: 'No se encontraron clientes con ese criterio',
          type: 'info',
        });
      }
    } catch (error: any) {
      setToast({
        message: error.message || 'Error al buscar clientes',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ver detalles del cliente
   */
  const handleView = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  /**
   * Editar cliente
   */
  const handleEdit = (cliente: Cliente) => {
    navigate(`/clientes/editar/${cliente.id_cliente}`);
  };

  /**
   * Mostrar confirmación de eliminación
   */
  const handleDelete = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowDeleteConfirm(true);
  };

  /**
   * Confirmar eliminación
   */
  const confirmDelete = async () => {
    if (!selectedCliente) return;

    try {
      await clienteService.deleteCliente(selectedCliente.id_cliente);
      setToast({
        message: 'Cliente eliminado exitosamente',
        type: 'success',
      });
      setShowDeleteConfirm(false);
      setSelectedCliente(null);
      loadClientes();
    } catch (error: any) {
      setToast({
        message: error.message || 'Error al eliminar el cliente',
        type: 'error',
      });
    }
  };

  /**
   * Crear nuevo cliente
   */
  const handleCreate = () => {
    navigate('/clientes/nuevo');
  };

  /**
   * Preparar datos para la tabla
   */
  const tableData = clientes.map((cliente) => ({
    ...cliente,
    nombreCompleto: `${cliente.nombres} ${cliente.apellidos}`,
    estadoBadge: (
      <span className={`badge ${cliente.estado ? 'badge--success' : 'badge--danger'}`}>
        {cliente.estado ? 'Activo' : 'Inactivo'}
      </span>
    ),
  }));

  const tableColumns = [
    { key: 'cedula', label: 'Cédula', width: '120px' },
    { key: 'nombres', label: 'Nombres', width: '180px' },
    { key: 'apellidos', label: 'Apellidos', width: '180px' },
    { key: 'correo', label: 'Correo', width: '220px' },
    { key: 'telefono', label: 'Teléfono', width: '130px' },
    { key: 'estadoBadge', label: 'Estado', width: '110px', align: 'center' as const },
  ];

  return (
    <div className="clientes-list-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Gestión de Clientes</h1>
          <p className="page-header__subtitle">
            Administra los clientes de BARBOX
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <Card>
        {/* Barra de búsqueda y acciones */}
        <div className="clientes-list__actions">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="Buscar por cédula, nombre, correo..."
          />
          <Button
            variant="primary"
            icon="plus"
            onClick={handleCreate}
          >
            Nuevo Cliente
          </Button>
        </div>

        {/* Tabla de clientes */}
        <div className="clientes-list__table">
          <Table
            columns={tableColumns}
            data={tableData}
            loading={loading}
            emptyMessage="No hay clientes registrados"
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Card>

      {/* Modal de detalles del cliente */}
      {showModal && selectedCliente && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Detalles del Cliente"
          size="medium"
        >
          <div className="cliente-details">
            <div className="cliente-details__row">
              <div className="cliente-details__field">
                <label>Cédula:</label>
                <span>{selectedCliente.cedula}</span>
              </div>
              <div className="cliente-details__field">
                <label>Estado:</label>
                <span className={`badge ${selectedCliente.estado ? 'badge--success' : 'badge--danger'}`}>
                  {selectedCliente.estado ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className="cliente-details__row">
              <div className="cliente-details__field">
                <label>Nombres:</label>
                <span>{selectedCliente.nombres}</span>
              </div>
              <div className="cliente-details__field">
                <label>Apellidos:</label>
                <span>{selectedCliente.apellidos}</span>
              </div>
            </div>

            <div className="cliente-details__row">
              <div className="cliente-details__field">
                <label>Correo:</label>
                <span>{selectedCliente.correo}</span>
              </div>
              <div className="cliente-details__field">
                <label>Teléfono:</label>
                <span>{selectedCliente.telefono}</span>
              </div>
            </div>

            <div className="cliente-details__row">
              <div className="cliente-details__field cliente-details__field--full">
                <label>Dirección:</label>
                <span>{selectedCliente.direccion}</span>
              </div>
            </div>

            <div className="cliente-details__row">
              <div className="cliente-details__field">
                <label>Fecha de Registro:</label>
                <span>{new Date(selectedCliente.fecha_registro).toLocaleDateString()}</span>
              </div>
              <div className="cliente-details__field">
                <label>Última Actualización:</label>
                <span>{new Date(selectedCliente.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && selectedCliente && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Confirmar Eliminación"
          size="small"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                icon="trash"
                onClick={confirmDelete}
              >
                Eliminar
              </Button>
            </>
          }
        >
          <p>
            ¿Estás seguro de que deseas eliminar al cliente{' '}
            <strong>{selectedCliente.nombres} {selectedCliente.apellidos}</strong>?
          </p>
          <p className="text-danger">Esta acción no se puede deshacer.</p>
        </Modal>
      )}

      {/* Toast de notificaciones */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default ClientesListPage;
