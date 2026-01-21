import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import bodegaService from '../../../services/bodega.service';
import { Recepcion } from '../../../types/bodega.types';
import './BodegaFormPage.css';

const BodegaFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<Recepcion>>({ 
    id_compra: '', 
    descripcion: '', 
    estado: 'ACT', 
    observaciones: '' 
  });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(() => { if (id) loadRecepcion(id); }, [id]);

  const loadRecepcion = async (recId: string) => { 
    try { 
      setLoading(true); 
      const data = await bodegaService.getBodegaById(recId); 
      setForm(data); 
    } catch (err:any) { 
      setToast({ message: err.message || 'Error cargando recepción', type: 'error' }); 
      setTimeout(()=>navigate('/bodegas'),1200);
    } finally { 
      setLoading(false);
    } 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_compra || !form.descripcion) { 
      setToast({ message: 'ID Compra y Descripción son requeridos', type: 'warning' }); 
      return; 
    }
    try { 
      setSubmitLoading(true); 
      if (id) { 
        await bodegaService.updateBodega(id, form); 
        setToast({ message: 'Recepción actualizada', type: 'success' }); 
      } else { 
        await bodegaService.createBodega(form); 
        setToast({ message: 'Recepción creada', type: 'success' }); 
      } 
      setTimeout(()=>navigate('/bodegas'),1200); 
    } catch (err:any) { 
      setToast({ message: err.message || 'Error guardando recepción', type: 'error' }); 
    } finally { 
      setSubmitLoading(false); 
    }
  };

  if (loading) return <div className="content-loading">Cargando...</div>;

  return (
    <div className="bodega-form-page">
      <div className="page-header">
        <h1 className="page-header__title">{id ? 'Editar Recepción' : 'Nueva Recepción'}</h1>
        <p className="page-header__subtitle">Registro de recepciones de productos</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="bodega-form">
          <div className="grid-2">
            <Input 
              label="ID Compra" 
              name="id_compra" 
              type="text" 
              value={form.id_compra || ''} 
              onChange={(e)=>setForm({ ...form, id_compra: e.target.value })} 
              required 
            />
            <Input 
              label="Descripción" 
              name="descripcion" 
              type="text" 
              value={form.descripcion || ''} 
              onChange={(e)=>setForm({ ...form, descripcion: e.target.value })} 
              required 
            />
            <div className="input-group">
              <label>Estado</label>
              <select 
                value={form.estado || 'ACT'} 
                onChange={(e)=>setForm({ ...form, estado: e.target.value as 'ACT' | 'APR' | 'ANU' })}
                className="input-select"
              >
                <option value="ACT">Activo</option>
                <option value="APR">Aprobado</option>
                <option value="ANU">Anulado</option>
              </select>
            </div>
            <Input 
              label="Fecha y Hora" 
              name="fecha_hora" 
              type="datetime-local" 
              value={form.fecha_hora ? new Date(form.fecha_hora).toISOString().slice(0, 16) : ''} 
              onChange={(e)=>setForm({ ...form, fecha_hora: new Date(e.target.value).toISOString() })} 
            />
          </div>

          <div className="full-width">
            <label>Observaciones</label>
            <textarea 
              name="observaciones"
              value={form.observaciones || ''} 
              onChange={(e)=>setForm({ ...form, observaciones: e.target.value })}
              rows={4}
              className="input-textarea"
            />
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
