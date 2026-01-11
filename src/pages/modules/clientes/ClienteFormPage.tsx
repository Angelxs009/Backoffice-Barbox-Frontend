import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import { ClienteFormData } from '../../../types/cliente.types';
import clienteService from '../../../services/cliente.service';
import './ClienteFormPage.css';

interface ClienteFormPageProps {
  mode: 'create' | 'edit';
}

const ClienteFormPage: React.FC<ClienteFormPageProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Estado
  const [formData, setFormData] = useState<ClienteFormData>({
    cedula: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  // Cargar datos del cliente en modo edición
  useEffect(() => {
    if (mode === 'edit' && id) {
      loadCliente(id);
    }
  }, [mode, id]);

  /**
   * Cargar datos del cliente
   */
  const loadCliente = async (clienteId: string) => {
    try {
      setLoading(true);
      const cliente = await clienteService.getClienteById(clienteId);
      setFormData({
        cedula: cliente.cedula,
        nombres: cliente.nombres,
        apellidos: cliente.apellidos,
        correo: cliente.correo,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
      });
    } catch (error: any) {
      setToast({
        message: error.message || 'Error al cargar el cliente',
        type: 'error',
      });
      setTimeout(() => navigate('/clientes'), 2000);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validar formulario
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Cédula: 10 dígitos
    if (!formData.cedula.trim()) {
      newErrors.cedula = 'La cédula es requerida';
    } else if (!/^\d{10}$/.test(formData.cedula)) {
      newErrors.cedula = 'La cédula debe tener exactamente 10 dígitos';
    }

    // Nombres: requerido, solo letras
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son requeridos';
    } else if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(formData.nombres)) {
      newErrors.nombres = 'Los nombres solo pueden contener letras';
    }

    // Apellidos: requerido, solo letras
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    } else if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(formData.apellidos)) {
      newErrors.apellidos = 'Los apellidos solo pueden contener letras';
    }

    // Correo: formato email válido
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El formato del correo no es válido';
    }

    // Teléfono: 10 dígitos
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener exactamente 10 dígitos';
    }

    // Dirección: requerida
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manejar cambios en los inputs
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({
        message: 'Por favor corrige los errores en el formulario',
        type: 'warning',
      });
      return;
    }

    try {
      setSubmitLoading(true);

      if (mode === 'create') {
        await clienteService.createCliente(formData);
        setToast({
          message: 'Cliente creado exitosamente',
          type: 'success',
        });
      } else if (mode === 'edit' && id) {
        await clienteService.updateCliente(id, formData);
        setToast({
          message: 'Cliente actualizado exitosamente',
          type: 'success',
        });
      }

      setTimeout(() => navigate('/clientes'), 1500);
    } catch (error: any) {
      setToast({
        message: error.message || 'Error al guardar el cliente',
        type: 'error',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  /**
   * Cancelar y volver
   */
  const handleCancel = () => {
    navigate('/clientes');
  };

  if (loading) {
    return (
      <div className="cliente-form-page">
        <div className="content-loading">
          <div className="content-loading__spinner"></div>
          <p className="content-loading__text">Cargando datos del cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cliente-form-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-header__title">
          {mode === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}
        </h1>
        <p className="page-header__subtitle">
          {mode === 'create'
            ? 'Completa el formulario para registrar un nuevo cliente'
            : 'Actualiza la información del cliente'}
        </p>
      </div>

      {/* Formulario */}
      <Card>
        <form onSubmit={handleSubmit} className="cliente-form">
          <div className="cliente-form__grid">
            {/* Cédula */}
            <Input
              label="Cédula"
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleInputChange}
              placeholder="1234567890"
              icon="id-card"
              error={errors.cedula}
              required
              disabled={mode === 'edit'}
            />

            {/* Nombres */}
            <Input
              label="Nombres"
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              placeholder="Juan Carlos"
              icon="user"
              error={errors.nombres}
              required
            />

            {/* Apellidos */}
            <Input
              label="Apellidos"
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              placeholder="Pérez García"
              icon="user"
              error={errors.apellidos}
              required
            />

            {/* Correo */}
            <Input
              label="Correo Electrónico"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              placeholder="cliente@example.com"
              icon="envelope"
              error={errors.correo}
              required
            />

            {/* Teléfono */}
            <Input
              label="Teléfono"
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="0987654321"
              icon="phone"
              error={errors.telefono}
              required
            />

            {/* Dirección - Full Width */}
            <div className="cliente-form__full-width">
              <Input
                label="Dirección"
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Av. Principal y Calle Secundaria"
                icon="map-marker-alt"
                error={errors.direccion}
                required
              />
            </div>
          </div>

          {/* Botones */}
          <div className="cliente-form__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={submitLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon="save"
              loading={submitLoading}
              disabled={submitLoading}
            >
              {mode === 'create' ? 'Crear Cliente' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Card>

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

export default ClienteFormPage;
