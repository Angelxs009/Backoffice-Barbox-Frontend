import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import BackofficeLayout from './components/layout/BackofficeLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Clientes
import ClientesListPage from './pages/modules/clientes/ClientesListPage';
import ClienteFormPage from './pages/modules/clientes/ClienteFormPage';

// Productos
import ProductosListPage from './pages/modules/productos/ProductosListPage';
import ProductoFormPage from './pages/modules/productos/ProductoFormPage';

// Facturas
import FacturasListPage from './pages/modules/facturas/FacturasListPage';
import FacturaFormPage from './pages/modules/facturas/FacturaFormPage';

// Bodegas
import BodegasListPage from './pages/modules/bodegas/BodegasListPage';
import BodegaFormPage from './pages/modules/bodegas/BodegaFormPage';

// Órdenes
import OrdenesListPage from './pages/modules/ordenes/OrdenesListPage';
import OrdenFormPage from './pages/modules/ordenes/OrdenFormPage';

// Proveedores
import ProveedoresListPage from './pages/modules/proveedores/ProveedoresListPage';
import ProveedorFormPage from './pages/modules/proveedores/ProveedorFormPage';

// Promociones
import PromocionesListPage from './pages/modules/promociones/PromocionesListPage';
import PromocionFormPage from './pages/modules/promociones/PromocionFormPage';

// Marcas
import MarcasListPage from './pages/modules/marcas/MarcasListPage';
import MarcaFormPage from './pages/modules/marcas/MarcaFormPage';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <DashboardPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />

          {/* Clientes */}
          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <ClientesListPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes/nuevo"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <ClienteFormPage mode="create" />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes/editar/:id"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <ClienteFormPage mode="edit" />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />

          {/* Productos */}
          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <ProductosListPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos/nuevo"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <ProductoFormPage mode="create" />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos/editar/:id"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <ProductoFormPage mode="edit" />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />

          {/* Facturas */}
          <Route
            path="/facturas"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <FacturasListPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/facturas/nueva"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <FacturaFormPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/facturas/editar/:id"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <FacturaFormPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />

          {/* Bodegas */}
          <Route
            path="/bodegas"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <BodegasListPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bodegas/nueva"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <BodegaFormPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bodegas/editar/:id"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <BodegaFormPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />

          {/* Órdenes */}
          <Route
            path="/ordenes"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <OrdenesListPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ordenes/nueva"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <OrdenFormPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ordenes/editar/:id"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <OrdenFormPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />

          {/* Proveedores */}
          <Route
            path="/proveedores"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <ProveedoresListPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/proveedores/nuevo"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <ProveedorFormPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/proveedores/editar/:id"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <ProveedorFormPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />

          {/* Promociones */}
          <Route
            path="/promociones"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <PromocionesListPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/promociones/nueva"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <PromocionFormPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/promociones/editar/:id"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <PromocionFormPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />

          {/* Marcas */}
          <Route
            path="/marcas"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <MarcasListPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/marcas/nueva"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <MarcaFormPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/marcas/editar/:id"
            element={
              <ProtectedRoute>
                <BackofficeLayout>
                  <MarcaFormPage />
                </BackofficeLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
