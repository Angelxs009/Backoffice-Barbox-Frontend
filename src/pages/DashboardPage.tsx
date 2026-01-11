import React from 'react';
import './DashboardPage.css';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Clientes', value: '0', color: '#667eea' },
    { label: 'Productos', value: '0', color: '#764ba2' },
    { label: 'Facturas', value: '0', color: '#f093fb' },
    { label: 'Órdenes', value: '0', color: '#4facfe' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bienvenido, {user?.nombre || 'Usuario'}!</p>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
            <h3>{stat.label}</h3>
            <p className="stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="info-card">
          <h2>Información del Sistema</h2>
          <p>Este es el panel de control de tu aplicación backoffice.</p>
          <ul>
            <li>Gestiona clientes, productos y facturas</li>
            <li>Controla el inventario de bodegas</li>
            <li>Administra órdenes de compra</li>
            <li>Gestiona proveedores y promociones</li>
          </ul>
        </div>

        <div className="info-card">
          <h2>Últimas Actividades</h2>
          <p>No hay actividades registradas aún.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
