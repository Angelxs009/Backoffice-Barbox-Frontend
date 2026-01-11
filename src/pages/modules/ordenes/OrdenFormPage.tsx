import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import Modal from '../../../components/common/Modal';
import proveedorService from '../../../services/proveedor.service';
import productoService from '../../../services/producto.service';
import ordenService from '../../../services/orden.service';
import { Proveedor } from '../../../types/proveedor.types';
import { Producto } from '../../../types/producto.types';
import { OrdenCompra, DetalleOrden } from '../../../types/orden.types';
import './OrdenFormPage.css';

const IVA_RATE = 0.12;

const OrdenFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [orden, setOrden] = useState<Partial<OrdenCompra>>({
    numero_orden: ordenService.generateNumeroOrden(),
    id_proveedor: '',
    fecha: new Date().toISOString(),
    subtotal: 0,
    iva: 0,
    total: 0,
    estado: 'PENDIENTE',
    detalles: [],
  });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(()=>{ loadProveedores(); loadProductos(); if (id) loadOrden(id); }, [id]);

  const loadProveedores = async () => { try { const data = await proveedorService.getProveedores(); setProveedores(data); } catch(err){ console.error(err); } };
  const loadProductos = async () => { try { const data = await productoService.getProductos(); setProductos(data); } catch(err){ console.error(err); } };
  const loadOrden = async (ordenId: string) => { try { setLoading(true); const data = await ordenService.getOrdenById(ordenId); setOrden(data); } catch (err:any) { setToast({ message: err.message || 'Error cargando orden', type:'error' }); setTimeout(()=>navigate('/ordenes'),1200); } finally { setLoading(false); } };

  // detalles handling
  const addDetalle = () => {
    const newDet: DetalleOrden = { id_detalle: `tmp-${Date.now()}`, id_orden: orden?.id_orden || 'tmp', id_producto: '', cantidad:1, precio_unitario:0, subtotal:0 };
    setOrden(prev => ({ ...prev, detalles: [...(prev.detalles||[]), newDet] }));
  };
  const removeDetalle = (id_detalle: string) => setOrden(prev => ({ ...prev, detalles: (prev.detalles||[]).filter(d=>d.id_detalle!==id_detalle) }));
  const updateDetalle = (id_detalle:string, patch: Partial<DetalleOrden>) => setOrden(prev=>({ ...prev, detalles: (prev.detalles||[]).map(d=> d.id_detalle===id_detalle? {...d, ...patch}: d) }));

  useEffect(()=>{
    const detalles = orden.detalles || [];
    const subtotal = detalles.reduce((s,d)=> s + (d.subtotal||0), 0);
    const iva = parseFloat((subtotal*IVA_RATE).toFixed(2));
    const total = parseFloat((subtotal+iva).toFixed(2));
    setOrden(prev=>({ ...prev, subtotal, iva, total }));
  }, [orden.detalles]);

  const handleProductoChange = (id_detalle:string, id_producto:string) => {
    const prod = productos.find(p=>p.id_producto===id_producto);
    if (prod) updateDetalle(id_detalle, { id_producto, precio_unitario: prod.precio, cantidad:1, subtotal: prod.precio });
    else updateDetalle(id_detalle, { id_producto, precio_unitario:0, cantidad:1, subtotal:0 });
  };

  const handleCantidadChange = (id_detalle:string, cantidad:number) => {
    const det = (orden.detalles||[]).find(d=>d.id_detalle===id_detalle);
    if (!det) return;
    const subtotal = parseFloat((det.precio_unitario * cantidad).toFixed(2));
    updateDetalle(id_detalle, { cantidad, subtotal });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orden.id_proveedor) { setToast({ message: 'Selecciona un proveedor', type:'warning' }); return; }
    if (!orden.detalles || orden.detalles.length===0) { setToast({ message: 'Agregar al menos un producto', type:'warning' }); return; }
    try { setSubmitLoading(true);
      const payload: Partial<OrdenCompra> = { numero_orden: orden.numero_orden, id_proveedor: orden.id_proveedor, fecha: orden.fecha, subtotal: orden.subtotal, iva: orden.iva, total: orden.total, estado: orden.estado, detalles: orden.detalles };
      if (id) { await ordenService.updateOrden(id, payload); setToast({ message: 'Orden actualizada', type:'success' }); }
      else { await ordenService.createOrden(payload); setToast({ message: 'Orden creada', type:'success' }); }
      setTimeout(()=>navigate('/ordenes'),1200);
    } catch (err:any) { setToast({ message: err.message || 'Error guardando orden', type:'error' }); }
    finally { setSubmitLoading(false); }
  };

  if (loading) return <div className="content-loading">Cargando...</div>;

  return (
    <div className="orden-form-page">
      <div className="page-header">
        <h1 className="page-header__title">{id ? 'Editar Orden' : 'Nueva Orden'}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="orden-form">
          <div className="orden-meta">
            <div>
              <label className="form-label">Número</label>
              <Input type="text" value={orden.numero_orden||''} readOnly />
            </div>
            <div>
              <label className="form-label">Proveedor</label>
              <select className="form-select" value={orden.id_proveedor||''} onChange={(e)=>setOrden({...orden, id_proveedor: e.target.value})}>
                <option value="">Seleccionar proveedor</option>
                {proveedores.map(p=> <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre_comercial}</option> )}
              </select>
            </div>
            <div>
              <label className="form-label">Fecha</label>
              <Input type="datetime-local" value={new Date(orden.fecha||'').toISOString().slice(0,16)} onChange={(e)=>setOrden({...orden, fecha: new Date(e.target.value).toISOString()})} />
            </div>
            <div>
              <label className="form-label">Estado</label>
              <select className="form-select" value={orden.estado||'PENDIENTE'} onChange={(e)=>setOrden({...orden, estado: e.target.value as any})}>
                <option value="PENDIENTE">Pendiente</option>
                <option value="RECIBIDA">Recibida</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="detalles-section">
            <div className="detalles-header">
              <h3>Detalles</h3>
              <Button variant="outline" icon="plus" onClick={addDetalle}>Agregar línea</Button>
            </div>

            <div className="detalles-grid">
              {(orden.detalles||[]).map(d=> (
                <div className="detalle-row" key={d.id_detalle}>
                  <div className="detalle-field">
                    <label>Producto</label>
                    <select value={d.id_producto} onChange={(e)=>handleProductoChange(d.id_detalle, e.target.value)} className="form-select">
                      <option value="">Seleccionar</option>
                      {productos.map(p=> <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>)}
                    </select>
                  </div>
                  <div className="detalle-field">
                    <label>Cantidad</label>
                    <Input type="number" value={String(d.cantidad)} onChange={(e)=>handleCantidadChange(d.id_detalle, parseInt(e.target.value||'0',10))} />
                  </div>
                  <div className="detalle-field">
                    <label>Precio Unit.</label>
                    <Input type="number" value={String(d.precio_unitario)} onChange={(e)=> updateDetalle(d.id_detalle, { precio_unitario: parseFloat(e.target.value||'0'), subtotal: parseFloat(((parseFloat(e.target.value||'0'))*d.cantidad).toFixed(2)) })} />
                  </div>
                  <div className="detalle-field">
                    <label>Subtotal</label>
                    <Input type="text" value={`$ ${d.subtotal.toFixed(2)}`} readOnly />
                  </div>
                  <div className="detalle-actions">
                    <Button variant="danger" icon="trash" onClick={()=>removeDetalle(d.id_detalle)}>Quitar</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="orden-summary">
            <div>
              <p><strong>Subtotal:</strong> $ {orden.subtotal?.toFixed(2) || '0.00'}</p>
              <p><strong>IVA (12%):</strong> $ {orden.iva?.toFixed(2) || '0.00'}</p>
              <p className="orden-total"><strong>Total:</strong> $ {orden.total?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="orden-actions">
              <Button variant="secondary" onClick={()=>navigate('/ordenes')}>Cancelar</Button>
              <Button variant="primary" type="submit" loading={submitLoading}>{id ? 'Guardar' : 'Crear Orden'}</Button>
            </div>
          </div>
        </form>
      </Card>

      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)} duration={3000} />}
    </div>
  );
};

export default OrdenFormPage;
