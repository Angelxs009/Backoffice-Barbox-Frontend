import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import productoService from '../../../services/producto.service';
import bodegaService from '../../../services/bodega.service';
import { Bodega } from '../../../types/bodega.types';
import { Producto } from '../../../types/producto.types';
import './BodegaFormPage.css';

const BodegaFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<Bodega>>({ nombre: '', direccion: '', capacidad: 0, responsable: '', productos: [] });
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(() => { loadProductos(); if (id) loadBodega(id); }, [id]);

  const loadProductos = async () => {
    try { const data = await productoService.getProductos(); setProductos(data); } catch (err) { console.error(err); }
  };
  const loadBodega = async (bId: string) => { try { setLoading(true); const data = await bodegaService.getBodegaById(bId); setForm(data); } catch (err:any) { setToast({ message: err.message || 'Error cargando bodega', type: 'error' }); setTimeout(()=>navigate('/bodegas'),1200);} finally { setLoading(false);} };

  const handleToggleProducto = (prodId: string) => {
    const current = form.productos || [];
    if (current.find(p => p.id_producto === prodId)) {
      setForm({ ...form, productos: current.filter(p => p.id_producto !== prodId) });
    } else {
      const prod = productos.find(p => p.id_producto === prodId);
      if (prod) setForm({ ...form, productos: [...current, prod] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre) { setToast({ message: 'Nombre requerido', type: 'warning' }); return; }
    try { setSubmitLoading(true); if (id) { await bodegaService.updateBodega(id, form); setToast({ message: 'Bodega actualizada', type: 'success' }); } else { await bodegaService.createBodega(form); setToast({ message: 'Bodega creada', type: 'success' }); } setTimeout(()=>navigate('/bodegas'),1200); } catch (err:any) { setToast({ message: err.message || 'Error guardando', type: 'error' }); } finally { setSubmitLoading(false); }
  };

  if (loading) return <div className="content-loading">Cargando...</div>;

  return (
    <div className="bodega-form-page">
      <div className="page-header">
        <h1 className="page-header__title">{id ? 'Editar Bodega' : 'Nueva Bodega'}</h1>
        <p className="page-header__subtitle">Registro de bodegas</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="bodega-form">
          <div className="grid-2">
            <Input label="Nombre" name="nombre" type="text" value={form.nombre || ''} onChange={(e)=>setForm({ ...form, nombre: e.target.value })} required />
            <Input label="Responsable" name="responsable" type="text" value={form.responsable || ''} onChange={(e)=>setForm({ ...form, responsable: e.target.value })} />
            <Input label="Dirección" name="direccion" type="text" value={form.direccion || ''} onChange={(e)=>setForm({ ...form, direccion: e.target.value })} />
            <Input label="Capacidad" name="capacidad" type="number" value={String(form.capacidad || 0)} onChange={(e)=>setForm({ ...form, capacidad: parseInt(e.target.value||'0',10) })} />
          </div>

          <div className="productos-assign">
            <h4>Asignar Productos</h4>
            <div className="productos-list">
              {productos.map(p => (
                <label key={p.id_producto} className={`producto-item ${(form.productos||[]).find(x=>x.id_producto===p.id_producto) ? 'selected' : ''}`}>
                  <input type="checkbox" checked={!!(form.productos||[]).find(x=>x.id_producto===p.id_producto)} onChange={()=>handleToggleProducto(p.id_producto)} />
                  <span>{p.nombre} ({p.stock})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <Button variant="secondary" onClick={()=>navigate('/bodegas')}>Cancelar</Button>
            <Button type="submit" variant="primary" loading={submitLoading}>{id ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Card>

      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)} duration={3000} />}
    </div>
  );
};

export default BodegaFormPage;
