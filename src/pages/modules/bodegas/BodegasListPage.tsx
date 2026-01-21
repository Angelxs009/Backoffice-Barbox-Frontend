import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Toast from '../../../components/common/Toast';
import bodegaService from '../../../services/bodega.service';
import { Recepcion } from '../../../types/bodega.types';
import './BodegasListPage.css';

const BodegasListPage: React.FC = () => {
  const navigate = useNavigate();
  const [recepciones, setRecepciones] = useState<Recepcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Recepcion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(() => { loadRecepciones(); }, []);

  const loadRecepciones = async () => {
    try {
      setLoading(true);
      const data = await bodegaService.getBodegas();
      setRecepciones(data);
    } catch (err: any) {
      setToast({ message: err.message || 'Error cargando recepciones', type: 'error' });
    } finally { setLoading(false); }
  };

  const handleView = (r: Recepcion) => { setSelected(r); setShowModal(true); };
  const handleEdit = (r: Recepcion) => { navigate(`/bodegas/editar/${r.id_recepcion}`); };
  const handleDelete = (r: Recepcion) => { setSelected(r); setShowDelete(true); };

  const confirmDelete = async () => {
    if (!selected) return;
    try { 
      await bodegaService.deleteBodega(String(selected.id_recepcion)); 
      setToast({ message: 'Recepción eliminada', type: 'success' }); 
      setShowDelete(false); 
      loadRecepciones(); 
    }
    catch (err: any) { setToast({ message: err.message || 'Error eliminando recepción', type: 'error' }); }
  };

  const handleCreate = () => navigate('/bodegas/nueva');

  const formatEstado = (estado: string) => {
    const estados: Record<string, string> = {
      'ACT': 'Activo',
      'APR': 'Aprobado',
      'ANU': 'Anulado'
    };
    return estados[estado] || estado;
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-EC', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const columns = [
    { key: 'id_recepcion', label: 'ID', width: '80px' },
    { key: 'id_compra', label: 'Compra', width: '120px' },
    { key: 'descripcion', label: 'Descripción', width: '280px' },
    { 
      key: 'fecha_hora', 
      label: 'Fecha', 
      width: '180px',
      render: (value: any) => value ? formatFecha(value) : '-'
    },
    { 
      key: 'estado', 
      label: 'Estado', 
      width: '120px', 
      align: 'center' as const,
      render: (value: any) => formatEstado(value)
    },
  ];

  const tableData = recepciones.map((r) => ({ ...r }));

  return (
    <div className="bodegas-list-page">
      <div className="page-header">
        <h1 className="page-header__title">Recepciones de Bodega</h1>
        <p className="page-header__subtitle">Gestión de recepciones de productos</p>
      </div>

      <Card>
        <div className="bodegas-actions">
          <div></div>
          <Button variant="primary" icon="plus" onClick={handleCreate}>Nueva Recepción</Button>
        </div>

        <div className="bodegas-table">
          <Table 
            columns={columns} 
            data={tableData} 
            loading={loading} 
            emptyMessage="No hay recepciones" 
            onView={handleView} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </div>
      </Card>

      {showModal && selected && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Recepción #${selected.id_recepcion}`} size="large">
          <p><strong>ID Compra:</strong> {selected.id_compra}</p>
          <p><strong>Descripción:</strong> {selected.descripcion}</p>
          <p><strong>Estado:</strong> {formatEstado(selected.estado)}</p>
          <p><strong>Fecha y Hora:</strong> {selected.fecha_hora ? formatFecha(selected.fecha_hora) : '-'}</p>
          <p><strong>ID Empleado:</strong> {selected.id_empleado || '-'}</p>
          {selected.observaciones && (
            <p><strong>Observaciones:</strong> {selected.observaciones}</p>
          )}
          {selected.motivo_anulacion && (
            <>
              <p><strong>Motivo Anulación:</strong> {selected.motivo_anulacion}</p>
              <p><strong>Fecha Anulación:</strong> {selected.fecha_anulacion ? formatFecha(selected.fecha_anulacion) : '-'}</p>
            </>
          )}
        </Modal>
      )}

      {showDelete && selected && (
        <Modal 
          isOpen={showDelete} 
          onClose={() => setShowDelete(false)} 
          title="Confirmar eliminación" 
          size="small" 
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancelar</Button>
              <Button variant="danger" onClick={confirmDelete}>Eliminar</Button>
            </>
          }
        >
          <p>¿Eliminar recepción <strong>#{selected.id_recepcion}</strong>?</p>
          <p className="text-sm text-gray-600">{selected.descripcion}</p>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} duration={3000} />}
    </div>
  );
};

export default BodegasListPage;
