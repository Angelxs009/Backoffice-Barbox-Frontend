import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Toast from '../../../components/common/Toast';
import bodegaService from '../../../services/bodega.service';
import { Bodega } from '../../../types/bodega.types';
import './BodegasListPage.css';

const BodegasListPage: React.FC = () => {
  const navigate = useNavigate();
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Bodega | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(() => { loadBodegas(); }, []);

  const loadBodegas = async () => {
    try {
      setLoading(true);
      const data = await bodegaService.getBodegas();
      setBodegas(data);
    } catch (err: any) {
      setToast({ message: err.message || 'Error cargando bodegas', type: 'error' });
    } finally { setLoading(false); }
  };

  const handleView = (b: Bodega) => { setSelected(b); setShowModal(true); };
  const handleEdit = (b: Bodega) => { navigate(`/bodegas/editar/${b.id_bodega}`); };
  const handleDelete = (b: Bodega) => { setSelected(b); setShowDelete(true); };

  const confirmDelete = async () => {
    if (!selected) return;
    try { await bodegaService.deleteBodega(selected.id_bodega); setToast({ message: 'Bodega eliminada', type: 'success' }); setShowDelete(false); loadBodegas(); }
    catch (err: any) { setToast({ message: err.message || 'Error eliminando bodega', type: 'error' }); }
  };

  const handleCreate = () => navigate('/bodegas/nueva');

  const columns = [
    { key: 'nombre', label: 'Nombre', width: '220px' },
    { key: 'direccion', label: 'Dirección', width: '280px' },
    { key: 'capacidad', label: 'Capacidad', width: '120px', align: 'center' as const },
    { key: 'responsable', label: 'Responsable', width: '180px' },
  ];

  const tableData = bodegas.map((b) => ({ ...b }));

  return (
    <div className="bodegas-list-page">
      <div className="page-header">
        <h1 className="page-header__title">Bodegas</h1>
        <p className="page-header__subtitle">Gestión de bodegas e inventario</p>
      </div>

      <Card>
        <div className="bodegas-actions">
          <div></div>
          <Button variant="primary" icon="plus" onClick={handleCreate}>Nueva Bodega</Button>
        </div>

        <div className="bodegas-table">
          <Table columns={columns} data={tableData} loading={loading} emptyMessage="No hay bodegas" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </Card>

      {showModal && selected && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selected.nombre} size="large">
          <p><strong>Dirección:</strong> {selected.direccion}</p>
          <p><strong>Capacidad:</strong> {selected.capacidad}</p>
          <p><strong>Responsable:</strong> {selected.responsable}</p>
          <div>
            <h4>Productos asignados</h4>
            <ul>
              {selected.productos && selected.productos.length > 0 ? selected.productos.map(p => <li key={p.id_producto}>{p.nombre} ({p.stock} u.)</li>) : <li>No hay productos asignados</li>}
            </ul>
          </div>
        </Modal>
      )}

      {showDelete && selected && (
        <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Confirmar eliminación" size="small" footer={<><Button variant="secondary" onClick={() => setShowDelete(false)}>Cancelar</Button><Button variant="danger" onClick={confirmDelete}>Eliminar</Button></>}>
          <p>¿Eliminar bodega <strong>{selected.nombre}</strong>?</p>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} duration={3000} />}
    </div>
  );
};

export default BodegasListPage;
