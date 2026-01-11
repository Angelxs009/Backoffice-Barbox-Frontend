import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import proveedorService from '../../../services/proveedor.service';
import { Proveedor } from '../../../types/proveedor.types';
import './ProveedorFormPage.css';

const ProveedorFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<Proveedor>>({ ruc: '', nombre_comercial: '', contacto: '', telefono: '', email: '', direccion: '' });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(()=>{ if (id) loadProveedor(id); }, [id]);

  const loadProveedor = async (pId: string) => { try { setLoading(true); const data = await proveedorService.getProveedorById(pId); setForm(data); } catch (err:any) { setToast({ message: err.message||'Error cargando proveedor', type:'error' }); setTimeout(()=>navigate('/proveedores'),1200); } finally { setLoading(false); } };

  const validateRUC = (ruc: string) => { return /^[0-9]{10,13}$/.test(ruc); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ruc || !validateRUC(form.ruc)) { setToast({ message: 'RUC inválido', type: 'warning' }); return; }
    if (!form.nombre_comercial) { setToast({ message: 'Nombre comercial requerido', type: 'warning' }); return; }

    try { setSubmitLoading(true); if (id) { await proveedorService.updateProveedor(id, form); setToast({ message: 'Proveedor actualizado', type: 'success' }); } else { await proveedorService.createProveedor(form); setToast({ message: 'Proveedor creado', type: 'success' }); } setTimeout(()=>navigate('/proveedores'),1200); }
    catch (err:any) { setToast({ message: err.message||'Error guardando', type: 'error' }); }
    finally { setSubmitLoading(false); }
  };

  if (loading) return <div className="content-loading">Cargando...</div>;

  return (
    <div className="proveedor-form-page">
      <div className="page-header">
        <h1 className="page-header__title">{id ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="proveedor-form">
          <div className="grid-2">
            <Input label="RUC" name="ruc" value={form.ruc || ''} onChange={(e)=>setForm({ ...form, ruc: e.target.value })} required />
            <Input label="Nombre Comercial" name="nombre_comercial" value={form.nombre_comercial || ''} onChange={(e)=>setForm({ ...form, nombre_comercial: e.target.value })} required />
            <Input label="Contacto" name="contacto" value={form.contacto || ''} onChange={(e)=>setForm({ ...form, contacto: e.target.value })} />
            <Input label="Teléfono" name="telefono" value={form.telefono || ''} onChange={(e)=>setForm({ ...form, telefono: e.target.value })} />
            <Input label="Email" name="email" type="email" value={form.email || ''} onChange={(e)=>setForm({ ...form, email: e.target.value })} />
            <Input label="Dirección" name="direccion" value={form.direccion || ''} onChange={(e)=>setForm({ ...form, direccion: e.target.value })} />
          </div>

          <div className="form-actions">
            <Button variant="secondary" onClick={()=>navigate('/proveedores')}>Cancelar</Button>
            <Button type="submit" variant="primary" loading={submitLoading}>{id ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Card>

      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)} duration={3000} />}
    </div>
  );
};

export default ProveedorFormPage;
