import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../config/api.config';
import './DashboardPage.css';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  format?: (val: number) => string;
}

interface VentaMes {
  mes: string;
  ventas: number;
}

interface ProductoVendido {
  nombre: string;
  cantidad: number;
}

interface FacturaReciente {
  id_factura: string;
  numero_factura: string;
  cliente: string;
  fecha: string;
  total: number;
  estado: string;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<StatCard[]>([
    { label: 'Total Clientes', value: 0, icon: 'fa-users', color: 'var(--color-secundario)' },
    { label: 'Total Productos', value: 0, icon: 'fa-boxes', color: 'var(--color-success)' },
    { label: 'Ventas del Mes', value: 0, icon: 'fa-dollar-sign', color: 'var(--color-warning)', format: (v) => `$${v.toFixed(2)}` },
    { label: 'Facturas Pendientes', value: 0, icon: 'fa-file-invoice', color: 'var(--color-danger)' },
  ]);

  const [ventasMes, setVentasMes] = useState<VentaMes[]>([]);
  const [topProductos, setTopProductos] = useState<ProductoVendido[]>([]);
  const [facturasRecientes, setFacturasRecientes] = useState<FacturaReciente[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Llamadas a APIs en paralelo
        const [
          clientesRes,
          productosRes,
          ventasRes,
          pendientesRes,
          ventasLineRes,
          topProductosRes,
          facturasRes,
        ] = await Promise.all([
          api.get('/clientes/count').catch(() => ({ data: { count: 0 } })),
          api.get('/productos/count').catch(() => ({ data: { count: 0 } })),
          api.get('/facturas/ventas-mes').catch(() => ({ data: { total: 0 } })),
          api.get('/facturas/pendientes/count').catch(() => ({ data: { count: 0 } })),
          api.get('/dashboard/ventas-mes').catch(() => ({ data: [] })),
          api.get('/dashboard/top-productos').catch(() => ({ data: [] })),
          api.get('/facturas/recientes?limit=5').catch(() => ({ data: [] })),
        ]);

        // Actualizar stats
        setStats((prev) =>
          prev.map((stat) => {
            if (stat.label === 'Total Clientes') return { ...stat, value: clientesRes.data.count || 0 };
            if (stat.label === 'Total Productos') return { ...stat, value: productosRes.data.count || 0 };
            if (stat.label === 'Ventas del Mes') return { ...stat, value: ventasRes.data.total || 0 };
            if (stat.label === 'Facturas Pendientes') return { ...stat, value: pendientesRes.data.count || 0 };
            return stat;
          })
        );

        // Actualizar gráficos
        setVentasMes(ventasLineRes.data || []);
        setTopProductos(topProductosRes.data || []);
        setFacturasRecientes(facturasRes.data || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bienvenido al panel de control de BarBox</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ borderTopColor: stat.color }}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div className="stat-content">
              <h3>{stat.label}</h3>
              <p className="stat-value" style={{ color: stat.color }}>
                {stat.format ? stat.format(stat.value) : stat.value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Ventas por Mes */}
        <div className="chart-card">
          <h2>Ventas por Mes</h2>
          {ventasMes.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ventasMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="mes" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '6px' }}
                  formatter={(value) => value != null ? `$${Number(value).toFixed(2)}` : ''}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="var(--color-secundario)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-secundario)', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No hay datos disponibles</p>
          )}
        </div>

        {/* Top Productos */}
        <div className="chart-card">
          <h2>Top 5 Productos Vendidos</h2>
          {topProductos.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="nombre" stroke="#666" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '6px' }}
                  formatter={(value) => value != null ? `${value} unidades` : ''}
                />
                <Legend />
                <Bar dataKey="cantidad" fill="var(--color-success)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No hay datos disponibles</p>
          )}
        </div>
      </div>

      {/* Últimas Facturas */}
      <div className="facturas-section">
        <h2>Últimas Facturas</h2>
        {facturasRecientes.length > 0 ? (
          <div className="table-wrapper">
            <table className="facturas-table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {facturasRecientes.map((factura) => (
                  <tr key={factura.id_factura}>
                    <td className="font-mono">{factura.numero_factura}</td>
                    <td>{factura.cliente}</td>
                    <td>{new Date(factura.fecha).toLocaleDateString('es-ES')}</td>
                    <td className="text-right">${factura.total.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${factura.estado.toLowerCase()}`}>
                        {factura.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">No hay facturas registradas</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
