import React, { useEffect, useState } from 'react';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Toast from '../../../components/common/Toast';
import promocionService from '../../../services/promocion.service';
import { Promocion } from '../../../types/promocion.types';
import './PromocionesListPage.css';
import { useNavigate } from 'react-router-dom';

const PromocionesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Promocion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(()=>{ loadPromociones(); }, []);

  const loadPromociones = async () => { try { setLoading(true); const data = await promocionService.getPromociones(); setPromociones(data); } catch (err:any) { setToast({ message: err.message||'Error cargando promociones', type:'error' }); } finally { setLoading(false); } };

  const handleCreate = () => navigate('/promociones/nueva');
  const handleEdit = (p: Promocion) => navigate(`/promociones/editar/${p.id_promocion}`);
  const handleView = (p: Promocion) => { setSelected(p); setShowModal(true); };
  const handleDelete = async (p: Promocion) => { try { await promocionService.deletePromocion(p.id_promocion); setToast({ message: 'Promoción eliminada', type:'success' }); loadPromociones(); } catch (err:any) { setToast({ message: err.message||'Error eliminando', type:'error' }); } };

  const columns = [ { key:'nombre', label:'Nombre', width:'220px' }, { key:'descuento', label:'Descuento', width:'120px' }, { key:'fechas', label:'Vigencia', width:'260px' }, { key:'activo', label:'Estado', width:'120px', align:'center' as const } ];

  const tableData = promociones.map(p=> ({ ...p, descuento: `${p.descuento_porcentaje}%`, fechas: `${new Date(p.fecha_inicio).toLocaleDateString()} - ${new Date(p.fecha_fin).toLocaleDateString()}`, activo: p.activo ? <span className="badge badge--success">Vigente</span> : <span className="badge badge--danger">Inactiva</span> }));

  return (
    <div className="promociones-list-page">
      <div className="page-header"><h1 className="page-header__title">Promociones</h1><p className="page-header__subtitle">Gestiona promociones y descuentos</p></div>
      <Card>
        <div className="promociones-actions">
          <div></div>
          <Button variant="primary" icon="plus" onClick={handleCreate}>Nueva Promoción</Button>
        </div>
        <div className="promociones-table">
          <Table columns={columns} data={tableData} loading={loading} emptyMessage="No hay promociones" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </Card>

      {showModal && selected && (
        <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={selected.nombre} size="small">
          <p><strong>Descripción:</strong> {selected.descripcion}</p>
          <p><strong>Descuento:</strong> {selected.descuento_porcentaje}%</p>
          <p><strong>Vigencia:</strong> {new Date(selected.fecha_inicio).toLocaleDateString()} - {new Date(selected.fecha_fin).toLocaleDateString()}</p>
          <p><strong>Productos aplicables:</strong> {selected.productos && selected.productos.length>0 ? selected.productos.join(', ') : 'Todos'}</p>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)} duration={3000} />}
    </div>
  );
};

export default PromocionesListPage;
