import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Toast from '../../../components/common/Toast';
import Input from '../../../components/common/Input';
import ordenService from '../../../services/orden.service';
import { OrdenCompra } from '../../../types/orden.types';
import './OrdenesListPage.css';

const OrdenesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ estado: '', fechaDesde: '', fechaHasta: '' });
  const [selected, setSelected] = useState<OrdenCompra | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(()=>{ loadOrdenes(); }, []);

  const loadOrdenes = async () => { try { setLoading(true); const data = await ordenService.getOrdenes(); setOrdenes(data); } catch (err:any) { setToast({ message: err.message||'Error cargando ordenes', type: 'error' }); } finally { setLoading(false); } };

  const handleCreate = () => navigate('/ordenes/nueva');
  const handleView = (o: OrdenCompra) => { setSelected(o); setShowModal(true); };
  const handleEdit = (o: OrdenCompra) => navigate(`/ordenes/editar/${o.id_orden}`);
  const handleDelete = (o: OrdenCompra) => { setSelected(o); setShowDelete(true); };

  const confirmDelete = async () => { if (!selected) return; try { await ordenService.deleteOrden(selected.id_orden); setToast({ message: 'Orden eliminada', type:'success' }); setShowDelete(false); loadOrdenes(); } catch (err:any) { setToast({ message: err.message||'Error eliminando orden', type:'error' }); } };

  const applyFilters = async () => { try { setLoading(true); const data = await ordenService.getOrdenes({ estado: filters.estado || undefined, fechaDesde: filters.fechaDesde || undefined, fechaHasta: filters.fechaHasta || undefined }); setOrdenes(data); } catch (err:any) { setToast({ message: err.message || 'Error aplicando filtros', type: 'error' }); } finally { setLoading(false); } };
  const clearFilters = () => { setFilters({ estado:'', fechaDesde:'', fechaHasta:'' }); loadOrdenes(); };

  const columns = [ { key: 'numero_orden', label: 'Número', width: '160px' }, { key: 'proveedor', label: 'Proveedor', width: '260px' }, { key: 'fecha', label: 'Fecha', width: '140px' }, { key: 'total', label: 'Total', width: '120px', align: 'right' as const }, { key: 'estado', label: 'Estado', width: '120px', align: 'center' as const } ];

  const tableData = ordenes.map(o => ({ ...o, proveedor: o.proveedor ? o.proveedor.nombre_comercial : o.id_proveedor, fecha: new Date(o.fecha).toLocaleDateString(), total: `$${o.total.toFixed(2)}` }));

  return (
    <div className="ordenes-list-page">
      <div className="page-header">
        <h1 className="page-header__title">Órdenes de Compra</h1>
        <p className="page-header__subtitle">Gestiona las órdenes a proveedores</p>
      </div>

      <Card>
        <div className="ordenes-actions">
          <div className="ordenes-filters">
            <select value={filters.estado} onChange={(e)=>setFilters({...filters, estado: e.target.value})} className="filter-select">
              <option value="">Todos</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="RECIBIDA">Recibida</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
            <Input type="date" value={filters.fechaDesde} onChange={(e)=>setFilters({...filters, fechaDesde: e.target.value})} />
            <Input type="date" value={filters.fechaHasta} onChange={(e)=>setFilters({...filters, fechaHasta: e.target.value})} />
            <Button variant="secondary" size="small" onClick={clearFilters}>Limpiar</Button>
            <Button variant="primary" size="small" onClick={applyFilters}>Aplicar</Button>
          </div>

          <Button variant="primary" icon="plus" onClick={handleCreate}>Nueva Orden</Button>
        </div>

        <div className="ordenes-table">
          <Table columns={columns} data={tableData} loading={loading} emptyMessage="No hay órdenes" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </Card>

      {showModal && selected && (
        <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={`Orden ${selected.numero_orden}`} size="large">
          <p><strong>Proveedor:</strong> {selected.proveedor ? selected.proveedor.nombre_comercial : selected.id_proveedor}</p>
          <p><strong>Fecha:</strong> {new Date(selected.fecha).toLocaleString()}</p>
          <div>
            <h4>Detalles</h4>
            <table className="table-bordered">
              <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead>
              <tbody>
                {selected.detalles && selected.detalles.length>0 ? selected.detalles.map(d=> (
                  <tr key={d.id_detalle}><td>{d.producto?d.producto.nombre:d.id_producto}</td><td>{d.cantidad}</td><td>$ {d.precio_unitario.toFixed(2)}</td><td>$ {d.subtotal.toFixed(2)}</td></tr>
                )) : <tr><td colSpan={4}>Sin detalles</td></tr>}
              </tbody>
              <tfoot>
                <tr><td colSpan={3} className="text-right"><strong>Subtotal</strong></td><td>$ {selected.subtotal.toFixed(2)}</td></tr>
                <tr><td colSpan={3} className="text-right"><strong>IVA</strong></td><td>$ {selected.iva.toFixed(2)}</td></tr>
                <tr><td colSpan={3} className="text-right"><strong>Total</strong></td><td>$ {selected.total.toFixed(2)}</td></tr>
              </tfoot>
            </table>
          </div>
        </Modal>
      )}

      {showDelete && selected && (
        <Modal isOpen={showDelete} onClose={()=>setShowDelete(false)} title="Confirmar eliminación" size="small" footer={<><Button variant="secondary" onClick={()=>setShowDelete(false)}>Cancelar</Button><Button variant="danger" onClick={confirmDelete}>Eliminar</Button></>}>
          <p>¿Eliminar orden <strong>{selected.numero_orden}</strong>?</p>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)} duration={3000} />}
    </div>
  );
};

export default OrdenesListPage;
