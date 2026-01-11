import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Toast from '../../../components/common/Toast';
import Input from '../../../components/common/Input';
import proveedorService from '../../../services/proveedor.service';
import { Proveedor } from '../../../types/proveedor.types';
import './ProveedoresListPage.css';

const ProveedoresListPage: React.FC = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Proveedor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(()=>{ loadProveedores(); }, []);

  const loadProveedores = async () => { try { setLoading(true); const data = await proveedorService.getProveedores(); setProveedores(data); } catch (err:any) { setToast({ message: err.message||'Error cargando proveedores', type:'error' }); } finally { setLoading(false); } };

  const handleSearch = async () => { if (!search.trim()) { loadProveedores(); return; } try { setLoading(true); const data = await proveedorService.searchByRUCOrName(search); setProveedores(data); } catch (err:any) { setToast({ message: err.message||'Error buscando', type:'error' }); } finally { setLoading(false); } };

  const handleView = (p: Proveedor) => { setSelected(p); setShowModal(true); };
  const handleEdit = (p: Proveedor) => navigate(`/proveedores/editar/${p.id_proveedor}`);
  const handleDelete = (p: Proveedor) => { setSelected(p); setShowDelete(true); };

  const confirmDelete = async () => { if (!selected) return; try { await proveedorService.deleteProveedor(selected.id_proveedor); setToast({ message: 'Proveedor eliminado', type:'success' }); setShowDelete(false); loadProveedores(); } catch (err:any) { setToast({ message: err.message||'Error eliminando', type:'error' }); } };

  const handleCreate = () => navigate('/proveedores/nuevo');

  const columns = [ { key: 'ruc', label: 'RUC', width: '160px' }, { key: 'nombre_comercial', label: 'Nombre Comercial', width: '260px' }, { key: 'contacto', label: 'Contacto', width: '180px' }, { key: 'telefono', label: 'Teléfono', width: '140px' }, { key: 'email', label: 'Email', width: '200px' } ];

  const tableData = proveedores.map(p => ({ ...p }));

  return (
    <div className="proveedores-list-page">
      <div className="page-header">
        <h1 className="page-header__title">Proveedores</h1>
        <p className="page-header__subtitle">Gestiona los proveedores</p>
      </div>

      <Card>
        <div className="proveedores-actions">
          <div className="proveedores-search">
            <Input placeholder="Buscar por RUC o nombre" value={search} onChange={(e) => setSearch(e.target.value)} onEnter={handleSearch} />
            <Button variant="secondary" onClick={()=>{ setSearch(''); loadProveedores(); }} size="small">Limpiar</Button>
            <Button variant="primary" onClick={handleSearch} size="small">Buscar</Button>
          </div>

          <Button variant="primary" icon="plus" onClick={handleCreate}>Nuevo Proveedor</Button>
        </div>

        <div className="proveedores-table">
          <Table columns={columns} data={tableData} loading={loading} emptyMessage="No hay proveedores" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </Card>

      {showModal && selected && (
        <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={selected.nombre_comercial} size="small">
          <p><strong>RUC:</strong> {selected.ruc}</p>
          <p><strong>Contacto:</strong> {selected.contacto}</p>
          <p><strong>Teléfono:</strong> {selected.telefono}</p>
          <p><strong>Email:</strong> {selected.email}</p>
          <p><strong>Dirección:</strong> {selected.direccion}</p>
        </Modal>
      )}

      {showDelete && selected && (
        <Modal isOpen={showDelete} onClose={()=>setShowDelete(false)} title="Confirmar eliminación" size="small" footer={<><Button variant="secondary" onClick={()=>setShowDelete(false)}>Cancelar</Button><Button variant="danger" onClick={confirmDelete}>Eliminar</Button></>}>
          <p>¿Eliminar proveedor <strong>{selected.nombre_comercial}</strong>?</p>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)} duration={3000} />}
    </div>
  );
};

export default ProveedoresListPage;
