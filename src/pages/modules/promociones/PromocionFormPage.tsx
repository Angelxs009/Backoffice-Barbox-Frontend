import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import promocionService from '../../../services/promocion.service';
import productoService from '../../../services/producto.service';
import { Promocion } from '../../../types/promocion.types';
import { Producto } from '../../../types/producto.types';
import './PromocionFormPage.css';

const PromocionFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [form, setForm] = useState<Partial<Promocion>>({ nombre: '', descripcion: '', descuento_porcentaje: 0, fecha_inicio: new Date().toISOString(), fecha_fin: new Date().toISOString(), productos: [], activo: true });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(()=>{ loadProductos(); if (id) loadPromocion(id); }, [id]);

  const loadProductos = async () => { try { const data = await productoService.getProductos(); setProductos(data); } catch(err){ console.error(err); } };
  const loadPromocion = async (pid:string) => { try { setLoading(true); const data = await promocionService.getPromocionById(pid); setForm(data); } catch(err:any){ setToast({ message: err.message||'Error cargando', type:'error' }); setTimeout(()=>navigate('/promociones'),1200);} finally { setLoading(false); } };

  const toggleProducto = (prodId:string) => {
    const current = form.productos || [];
    if (current.includes(prodId)) setForm({...form, productos: current.filter(p=>p!==prodId)});
    else setForm({...form, productos: [...current, prodId]});
  };

  const validate = () => {
    if (!form.nombre) { setToast({ message: 'Nombre requerido', type:'warning' }); return false; }
    if ((form.descuento_porcentaje||0) <= 0 || (form.descuento_porcentaje||0) > 100) { setToast({ message: 'Descuento inválido', type:'warning' }); return false; }
    if (!form.fecha_inicio || !form.fecha_fin || new Date(form.fecha_inicio) > new Date(form.fecha_fin)) { setToast({ message: 'Fechas inválidas', type:'warning' }); return false; }
    return true;
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try { setSubmitLoading(true); if (id) { await promocionService.updatePromocion(id, form); setToast({ message: 'Promoción actualizada', type:'success' }); } else { await promocionService.createPromocion(form); setToast({ message: 'Promoción creada', type:'success' }); } setTimeout(()=>navigate('/promociones'),1200); } catch(err:any){ setToast({ message: err.message||'Error guardando', type:'error' }); } finally { setSubmitLoading(false); }
  };

  if (loading) return <div className="content-loading">Cargando...</div>;

  return (
    <div className="promocion-form-page">
      <div className="page-header"><h1 className="page-header__title">{id ? 'Editar Promoción' : 'Nueva Promoción'}</h1></div>
      <Card>
        <form onSubmit={handleSubmit} className="promocion-form">
          <div className="grid-2">
            <Input label="Nombre" value={form.nombre||''} onChange={(e)=>setForm({...form, nombre: e.target.value})} required />
            <Input label="Descuento (%)" type="number" value={String(form.descuento_porcentaje||0)} onChange={(e)=>setForm({...form, descuento_porcentaje: parseFloat(e.target.value||'0')})} required />
            <div className="full-width">
              <label className="form-label">Fechas</label>
              <div className="dates-grid">
                <Input type="date" value={form.fecha_inicio?.slice(0,10)||''} onChange={(e)=>setForm({...form, fecha_inicio: new Date(e.target.value).toISOString()})} />
                <Input type="date" value={form.fecha_fin?.slice(0,10)||''} onChange={(e)=>setForm({...form, fecha_fin: new Date(e.target.value).toISOString()})} />
              </div>
            </div>
            <div className="full-width">
              <label className="form-label">Productos aplicables (opcional)</label>
              <div className="productos-list">
                {productos.map(p=> (
                  <label key={p.id_producto} className={`producto-item ${form.productos?.includes(p.id_producto||'') ? 'selected' : ''}`}>
                    <input type="checkbox" checked={form.productos?.includes(p.id_producto||'')||false} onChange={()=>toggleProducto(p.id_producto)} />
                    <span>{p.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button variant="secondary" onClick={()=>navigate('/promociones')}>Cancelar</Button>
            <Button type="submit" variant="primary" loading={submitLoading}>{id ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Card>

      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)} duration={3000} />}
    </div>
  );
};

export default PromocionFormPage;