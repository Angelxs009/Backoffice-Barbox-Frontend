import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import marcaService from '../../../services/marca.service';
import { Marca } from '../../../types/marca.types';
import './MarcaFormPage.css';

const MarcaFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<Marca>>({ nombre: '', descripcion: '', pais_origen: '', logo_url: '' });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(()=>{ if (id) loadMarca(id); }, [id]);
  const loadMarca = async (mId:string) => { try { setLoading(true); const data = await marcaService.getMarcaById(mId); setForm(data); } catch(err:any){ setToast({ message: err.message||'Error cargando', type:'error' }); setTimeout(()=>navigate('/marcas'),1200); } finally { setLoading(false); } };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith('image/')) { setToast({ message: 'Archivo debe ser imagen', type:'error' }); return; }
    try { setUploading(true); const url = await marcaService.uploadLogo(file); setForm({...form, logo_url: url}); setToast({ message: 'Logo subido', type:'success' }); } catch(err:any){ setToast({ message: err.message||'Error subiendo', type:'error' }); } finally { setUploading(false); }
  };

  const handleSubmit = async (e:React.FormEvent) => { e.preventDefault(); if (!form.nombre) { setToast({ message:'Nombre requerido', type:'warning' }); return; } try { setSubmitLoading(true); if (id) { await marcaService.updateMarca(id, form); setToast({ message:'Marca actualizada', type:'success' }); } else { await marcaService.createMarca(form); setToast({ message:'Marca creada', type:'success' }); } setTimeout(()=>navigate('/marcas'),1200); } catch(err:any){ setToast({ message: err.message||'Error guardando', type:'error' }); } finally { setSubmitLoading(false); } };

  if (loading) return <div className="content-loading">Cargando...</div>;

  return (
    <div className="marca-form-page">
      <div className="page-header"><h1 className="page-header__title">{id ? 'Editar Marca' : 'Nueva Marca'}</h1></div>
      <Card>
        <form onSubmit={handleSubmit} className="marca-form">
          <div className="grid-2">
            <Input label="Nombre" value={form.nombre||''} onChange={(e)=>setForm({...form, nombre: e.target.value})} required />
            <Input label="País de Origen" value={form.pais_origen||''} onChange={(e)=>setForm({...form, pais_origen: e.target.value})} />
            <Input label="Descripción" value={form.descripcion||''} onChange={(e)=>setForm({...form, descripcion: e.target.value})} />
            <div className="logo-field">
              <label className="form-label">Logo</label>
              {form.logo_url && <div className="logo-preview"><img src={form.logo_url} alt="logo" /></div>}
              <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
            </div>
          </div>

          <div className="form-actions">
            <Button variant="secondary" onClick={()=>navigate('/marcas')}>Cancelar</Button>
            <Button type="submit" variant="primary" loading={submitLoading}>{id ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Card>

      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)} duration={3000} />}
    </div>
  );
};

export default MarcaFormPage;