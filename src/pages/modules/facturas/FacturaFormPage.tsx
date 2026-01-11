import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import Modal from '../../../components/common/Modal';
import clienteService from '../../../services/cliente.service';
import productoService from '../../../services/producto.service';
import facturaService from '../../../services/factura.service';
import { Cliente } from '../../../types/cliente.types';
import { Producto } from '../../../types/producto.types';
import { Factura, DetalleFactura } from '../../../types/factura.types';
import './FacturaFormPage.css';

const IVA_RATE = 0.12;

const metodoOptions = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'TARJETA', label: 'Tarjeta' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
];

const FacturaFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  const [factura, setFactura] = useState<Partial<Factura>>({
    numero_factura: facturaService.generateNumeroFactura(),
    id_cliente: '',
    fecha_emision: new Date().toISOString(),
    subtotal: 0,
    iva: 0,
    total: 0,
    estado_pago: 'PENDIENTE',
    metodo_pago: 'EFECTIVO',
    detalles: [],
  });

  useEffect(() => {
    loadClientes();
    loadProductos();
    if (id) loadFactura(id);
  }, [id]);

  const loadClientes = async () => {
    try {
      const data = await clienteService.getClientes();
      setClientes(data);
    } catch (error) {
      console.error('Error cargando clientes', error);
    }
  };

  const loadProductos = async () => {
    try {
      const data = await productoService.getProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos', error);
    }
  };

  const loadFactura = async (facturaId: string) => {
    try {
      setLoading(true);
      const data = await facturaService.getFacturaById(facturaId);
      setFactura({ ...data });
    } catch (error: any) {
      setToast({ message: error.message || 'Error cargando factura', type: 'error' });
      setTimeout(() => navigate('/facturas'), 1500);
    } finally {
      setLoading(false);
    }
  };

  // Operaciones con líneas de detalle
  const addDetalle = () => {
    const newDetalle: DetalleFactura = {
      id_detalle: `tmp-${Date.now()}`,
      id_factura: factura?.id_factura || 'tmp',
      id_producto: '',
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0,
    };
    setFactura((prev) => ({ ...prev, detalles: [...(prev.detalles || []), newDetalle] }));
  };

  const removeDetalle = (id_detalle: string) => {
    setFactura((prev) => ({ ...prev, detalles: (prev.detalles || []).filter((d) => d.id_detalle !== id_detalle) }));
  };

  const updateDetalle = (id_detalle: string, patch: Partial<DetalleFactura>) => {
    setFactura((prev) => ({
      ...prev,
      detalles: (prev.detalles || []).map((d) => (d.id_detalle === id_detalle ? { ...d, ...patch } : d)),
    }));
  };

  // Recalcular totales
  useEffect(() => {
    const detalles = factura.detalles || [];
    const subtotal = detalles.reduce((sum, d) => sum + (d.subtotal || 0), 0);
    const iva = parseFloat((subtotal * IVA_RATE).toFixed(2));
    const total = parseFloat((subtotal + iva).toFixed(2));
    setFactura((prev) => ({ ...prev, subtotal, iva, total }));
  }, [factura.detalles]);

  const handleProductoChange = (id_detalle: string, id_producto: string) => {
    const prod = productos.find((p) => p.id_producto === id_producto);
    if (prod) {
      updateDetalle(id_detalle, { id_producto, precio_unitario: prod.precio, cantidad: 1, subtotal: prod.precio * 1 });
    } else {
      updateDetalle(id_detalle, { id_producto, precio_unitario: 0, cantidad: 1, subtotal: 0 });
    }
  };

  const handleCantidadChange = (id_detalle: string, cantidad: number) => {
    const detalle = (factura.detalles || []).find((d) => d.id_detalle === id_detalle);
    if (!detalle) return;
    const subtotal = parseFloat((detalle.precio_unitario * cantidad).toFixed(2));
    updateDetalle(id_detalle, { cantidad, subtotal });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validaciones mínimas
    if (!factura.id_cliente) {
      setToast({ message: 'Selecciona un cliente', type: 'warning' });
      return;
    }
    if (!factura.detalles || factura.detalles.length === 0) {
      setToast({ message: 'Agrega al menos un producto', type: 'warning' });
      return;
    }

    try {
      setSubmitLoading(true);
      const payload: Partial<Factura> = {
        numero_factura: factura.numero_factura,
        id_cliente: factura.id_cliente,
        fecha_emision: factura.fecha_emision,
        subtotal: factura.subtotal || 0,
        iva: factura.iva || 0,
        total: factura.total || 0,
        estado_pago: factura.estado_pago as any,
        metodo_pago: factura.metodo_pago,
        detalles: factura.detalles,
      };

      if (id) {
        await facturaService.updateFactura(id, payload);
        setToast({ message: 'Factura actualizada', type: 'success' });
      } else {
        await facturaService.createFactura(payload);
        setToast({ message: 'Factura creada', type: 'success' });
      }

      setTimeout(() => navigate('/facturas'), 1200);
    } catch (error: any) {
      setToast({ message: error.message || 'Error guardando factura', type: 'error' });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div className="content-loading">Cargando...</div>;
  }

  return (
    <div className="factura-form-page">
      <div className="page-header">
        <h1 className="page-header__title">{id ? 'Editar Factura' : 'Nueva Factura'}</h1>
        <p className="page-header__subtitle">Crea o edita facturas</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="factura-form">
          <div className="factura-meta-row">
            <div>
              <label className="form-label">Número</label>
              <Input type="text" value={factura.numero_factura || ''} readOnly />
            </div>

            <div>
              <label className="form-label">Cliente</label>
              <select className="form-select" value={factura.id_cliente || ''} onChange={(e) => setFactura({ ...factura, id_cliente: e.target.value })}>
                <option value="">Seleccionar cliente</option>
                {clientes.map((c) => (
                  <option key={c.id_cliente} value={c.id_cliente}>{`${c.nombres} ${c.apellidos} - ${c.correo}`}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Fecha Emisión</label>
              <Input type="datetime-local" value={new Date(factura.fecha_emision || '').toISOString().slice(0,16)} onChange={(e) => setFactura({ ...factura, fecha_emision: new Date(e.target.value).toISOString() })} />
            </div>

            <div>
              <label className="form-label">Método de Pago</label>
              <select className="form-select" value={factura.metodo_pago || 'EFECTIVO'} onChange={(e) => setFactura({ ...factura, metodo_pago: e.target.value })}>
                {metodoOptions.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="detalles-section">
            <div className="detalles-header">
              <h3>Detalles</h3>
              <Button variant="outline" onClick={addDetalle} icon="plus">Agregar línea</Button>
            </div>

            <div className="detalles-grid">
              {(factura.detalles || []).map((d) => (
                <div className="detalle-row" key={d.id_detalle}>
                  <div className="detalle-field">
                    <label>Producto</label>
                    <select value={d.id_producto} onChange={(e) => handleProductoChange(d.id_detalle, e.target.value)} className="form-select">
                      <option value="">Seleccionar producto</option>
                      {productos.map((p) => (
                        <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="detalle-field">
                    <label>Cantidad</label>
                    <Input type="number" value={String(d.cantidad)} onChange={(e) => handleCantidadChange(d.id_detalle, parseInt(e.target.value || '0', 10))} />
                  </div>

                  <div className="detalle-field">
                    <label>Precio Unit.</label>
                    <Input type="number" value={String(d.precio_unitario)} onChange={(e) => updateDetalle(d.id_detalle, { precio_unitario: parseFloat(e.target.value || '0'), subtotal: parseFloat(((parseFloat(e.target.value || '0')) * d.cantidad).toFixed(2)) })} />
                  </div>

                  <div className="detalle-field">
                    <label>Subtotal</label>
                    <Input type="text" value={`$ ${d.subtotal.toFixed(2)}`} readOnly />
                  </div>

                  <div className="detalle-actions">
                    <Button variant="danger" icon="trash" onClick={() => removeDetalle(d.id_detalle)}>Quitar</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="factura-summary">
            <div>
              <p><strong>Subtotal:</strong> $ {factura.subtotal?.toFixed(2) || '0.00'}</p>
              <p><strong>IVA (12%):</strong> $ {factura.iva?.toFixed(2) || '0.00'}</p>
              <p className="factura-total"><strong>Total:</strong> $ {factura.total?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="factura-actions">
              <Button variant="secondary" onClick={() => navigate('/facturas')}>Cancelar</Button>
              <Button variant="primary" type="submit" loading={submitLoading}>{id ? 'Guardar' : 'Crear Factura'}</Button>
            </div>
          </div>
        </form>
      </Card>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} duration={3000} />}
    </div>
  );
};

export default FacturaFormPage;
