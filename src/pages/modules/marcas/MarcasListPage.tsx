import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Toast from '../../../components/common/Toast';
import marcaService from '../../../services/marca.service';
import { Marca } from '../../../types/marca.types';
import './MarcasListPage.css';

const MarcasListPage: React.FC = () => {
  const navigate = useNavigate();
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Marca | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(()=>{ loadMarcas(); }, []);
  const loadMarcas = async () => { try { setLoading(true); const data = await marcaService.getMarcas(); setMarcas(data); } catch(err:any){ setToast({ message: err.message||'Error cargando marcas', type:'error' }); } finally { setLoading(false); } };

  const handleCreate = () => navigate('/marcas/nueva');
  const handleEdit = (m: Marca) => navigate(`/marcas/editar/${m.id_marca}`);
  const handleView = (m: Marca) => { setSelected(m); setShowModal(true); };
  const handleDelete = async (m: Marca) => { try { await marcaService.deleteMarca(m.id_marca); setToast({ message: 'Marca eliminada', type:'success' }); loadMarcas(); } catch(err:any){ setToast({ message: err.message||'Error eliminando', type:'error' }); } };

  const columns = [ { key: 'nombre', label: 'Nombre', width: '220px' }, { key: 'pais_origen', label: 'País', width: '140px' }, { key: 'descripcion', label: 'Descripción', width: '360px' } ];
  const tableData = marcas.map(m=> ({ ...m }));

  return (
    <div className="marcas-list-page">
      <div className="page-header"><h1 className="page-header__title">Marcas</h1><p className="page-header__subtitle">Gestiona las marcas</p></div>
      <Card>
        <div className="marcas-actions"><div></div><Button variant="primary" icon="plus" onClick={handleCreate}>Nueva Marca</Button></div>
        <div className="marcas-table"><Table columns={columns} data={tableData} loading={loading} emptyMessage="No hay marcas" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} /></div>
      </Card>

      {showModal && selected && (
        <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={selected.nombre} size="small">
          <p><strong>País:</strong> {selected.pais_origen}</p>
          <p><strong>Descripción:</strong> {selected.descripcion}</p>
          {selected.logo_url && <div className="marca-logo"><img src={selected.logo_url} alt={selected.nombre} /></div>}
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)} duration={3000} />}
    </div>
  );
};

export default MarcasListPage;