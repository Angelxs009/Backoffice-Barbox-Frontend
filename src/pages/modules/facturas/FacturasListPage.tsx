import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Toast from '../../../components/common/Toast';
import Input from '../../../components/common/Input';
import facturaService from '../../../services/factura.service';
import { Factura } from '../../../types/factura.types';
import './FacturasListPage.css';

const estadoOptions = [
  { value: '', label: 'Todos' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'PAGADA', label: 'Pagada' },
  { value: 'ANULADA', label: 'Anulada' },
];

const FacturasListPage: React.FC = () => {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({ estado_pago: '', fechaDesde: '', fechaHasta: '' });
  const [selected, setSelected] = useState<Factura | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAnularConfirm, setShowAnularConfirm] = useState(false); // F5.2: Confirmación de anulación
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(() => {
    loadFacturas();
  }, []);

  const loadFacturas = async () => {
    try {
      setLoading(true);
      const data = await facturaService.getFacturas();
      setFacturas(data);
    } catch (error: any) {
      setToast({ message: error.message || 'Error cargando facturas', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = async () => {
    try {
      setLoading(true);
      const data = await facturaService.getFacturas({
        estado_pago: filters.estado_pago || undefined,
        fechaDesde: filters.fechaDesde || undefined,
        fechaHasta: filters.fechaHasta || undefined,
      });
      setFacturas(data);
    } catch (error: any) {
      setToast({ message: error.message || 'Error aplicando filtros', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({ estado_pago: '', fechaDesde: '', fechaHasta: '' });
    loadFacturas();
  };

  const handleView = (f: Factura) => {
    setSelected(f);
    setShowModal(true);
  };

  const handleEdit = (f: Factura) => {
    navigate(`/facturas/editar/${f.id_factura}`);
  };

  // Función de eliminar eliminada - usamos anular en su lugar (F5.2)

  const confirmDelete = async () => {
    if (!selected) return;
    try {
      await facturaService.deleteFactura(selected.id_factura);
      setToast({ message: 'Factura eliminada', type: 'success' });
      setShowDeleteConfirm(false);
      loadFacturas();
    } catch (error: any) {
      setToast({ message: error.message || 'Error eliminando factura', type: 'error' });
    }
  };

  /**
   * F5.2: Anular factura (solo PENDIENTE)
   */
  const handleAnular = (f: Factura) => {
    setSelected(f);
    setShowAnularConfirm(true);
  };

  const confirmAnular = async () => {
    if (!selected) return;
    try {
      await facturaService.anularFactura(selected.id_factura);
      setToast({ message: 'Factura anulada exitosamente', type: 'success' });
      setShowAnularConfirm(false);
      setSelected(null);
      loadFacturas();
    } catch (error: any) {
      setToast({ message: error.message || 'Error anulando factura', type: 'error' });
    }
  };

  const handleCreate = () => {
    navigate('/facturas/nueva');
  };

  const columns = [
    { key: 'numero_factura', label: 'Número', width: '160px' },
    { key: 'cliente', label: 'Cliente', width: '200px' },
    { key: 'fecha_emision', label: 'Fecha', width: '140px' },
    { key: 'total', label: 'Total', width: '100px', align: 'right' as const },
    { key: 'estadoBadge', label: 'Estado Pago', width: '120px', align: 'center' as const },
    { key: 'acciones', label: 'Acciones', width: '180px', align: 'center' as const },
  ];

  const tableData = facturas.map((f) => ({
    ...f,
    cliente: f.cliente ? `${f.cliente.nombres} ${f.cliente.apellidos}` : f.id_cliente,
    fecha_emision: new Date(f.fecha_emision).toLocaleDateString(),
    total: `$${f.total.toFixed(2)}`,
    estadoBadge: (
      <span className={`badge ${f.estado_pago === 'PAGADA' ? 'badge--success' : f.estado_pago === 'PENDIENTE' ? 'badge--warning' : 'badge--danger'}`}>
        {f.estado_pago}
      </span>
    ),
    acciones: (
      <div className="facturas-acciones-cell">
        <Button variant="outline" size="small" onClick={() => handleView(f)}>Ver</Button>
        {/* F5.2/F5.3: Solo PENDIENTE puede editarse o anularse */}
        {f.estado_pago === 'PENDIENTE' && (
          <>
            <Button variant="secondary" size="small" onClick={() => handleEdit(f)}>Editar</Button>
            <Button variant="danger" size="small" onClick={() => handleAnular(f)}>Anular</Button>
          </>
        )}
      </div>
    ),
  }));

  return (
    <div className="facturas-list-page">
      <div className="page-header">
        <h1 className="page-header__title">Facturas</h1>
        <p className="page-header__subtitle">Listado y gestión de facturas</p>
      </div>

      <Card>
        <div className="facturas-actions">
          <div className="facturas-filters">
            <select value={filters.estado_pago} onChange={(e) => setFilters({ ...filters, estado_pago: e.target.value })} className="filter-select">
              {estadoOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <Input label="Desde" type="date" value={filters.fechaDesde} onChange={(e) => setFilters({ ...filters, fechaDesde: e.target.value })} />
            <Input label="Hasta" type="date" value={filters.fechaHasta} onChange={(e) => setFilters({ ...filters, fechaHasta: e.target.value })} />

            <Button variant="secondary" onClick={handleClearFilters} size="small">Limpiar</Button>
            <Button variant="primary" onClick={handleFilterApply} size="small">Aplicar</Button>
          </div>

          <Button variant="primary" icon="plus" onClick={handleCreate}>Nueva Factura</Button>
        </div>

        <div className="facturas-table">
          <Table columns={columns} data={tableData} loading={loading} emptyMessage="No hay facturas" />
        </div>
      </Card>

      {showModal && selected && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Factura ${selected.numero_factura}`} size="large">
          <div className="factura-preview">
            <div className="factura-meta">
              <p><strong>Cliente:</strong> {selected.cliente ? `${selected.cliente.nombres} ${selected.cliente.apellidos}` : selected.id_cliente}</p>
              <p><strong>Fecha:</strong> {new Date(selected.fecha_emision).toLocaleString()}</p>
              <p><strong>Método Pago:</strong> {selected.metodo_pago}</p>
              <p><strong>Estado:</strong> {selected.estado_pago}</p>
            </div>

            <div className="factura-items">
              <table className="table-bordered">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.detalles && selected.detalles.length > 0 ? (
                    selected.detalles.map((d) => (
                      <tr key={d.id_detalle}>
                        <td>{d.producto ? d.producto.nombre : d.id_producto}</td>
                        <td>{d.cantidad}</td>
                        <td>$ {d.precio_unitario.toFixed(2)}</td>
                        <td>$ {d.subtotal.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>Sin detalles</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-right"><strong>Subtotal</strong></td>
                    <td>$ {selected.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right"><strong>IVA (12%)</strong></td>
                    <td>$ {selected.iva.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right"><strong>Total</strong></td>
                    <td>$ {selected.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Modal>
      )}

      {showDeleteConfirm && selected && (
        <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirmar eliminación" size="small" footer={<><Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button><Button variant="danger" onClick={confirmDelete}>Eliminar</Button></>}>
          <p>¿Eliminar factura <strong>{selected.numero_factura}</strong>?</p>
        </Modal>
      )}

      {/* F5.2: Modal confirmación de anulación */}
      {showAnularConfirm && selected && (
        <Modal 
          isOpen={showAnularConfirm} 
          onClose={() => setShowAnularConfirm(false)} 
          title="Confirmar anulación" 
          size="small" 
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowAnularConfirm(false)}>Cancelar</Button>
              <Button variant="danger" onClick={confirmAnular}>Anular Factura</Button>
            </>
          }
        >
          <p>¿Está seguro que desea anular la factura <strong>{selected.numero_factura}</strong>?</p>
          <p className="text-muted">Esta acción no se puede deshacer.</p>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} duration={3000} />}
    </div>
  );
};

export default FacturasListPage;
