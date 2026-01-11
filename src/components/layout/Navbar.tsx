import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  onMenuToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Simulación de useAuth - reemplazar con tu contexto real
  // const { user, logout } = useAuth();
  const user = {
    name: 'Admin Usuario',
    email: 'admin@barbox.com',
    avatar: null,
  };

  const notificationsCount = 3; // Simulación - traer de API

  // Generar breadcrumbs desde la ruta actual
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    
    const breadcrumbMap: { [key: string]: string } = {
      dashboard: 'Dashboard',
      clientes: 'Clientes',
      facturas: 'Facturas',
      productos: 'Productos',
      bodegas: 'Bodegas',
      'ordenes-compra': 'Órdenes de Compra',
      proveedores: 'Proveedores',
      promociones: 'Promociones',
      marcas: 'Marcas',
    };

    if (paths.length === 0) {
      return [{ name: 'Dashboard', path: '/dashboard' }];
    }

    return paths.map((path, index) => ({
      name: breadcrumbMap[path] || path.charAt(0).toUpperCase() + path.slice(1),
      path: '/' + paths.slice(0, index + 1).join('/'),
    }));
  };

  const breadcrumbs = generateBreadcrumbs();

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // logout(); // Llamar a la función de logout del contexto
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="navbar">
      {/* Sección izquierda */}
      <div className="navbar__left">
        {/* Botón hamburguesa (solo móvil) */}
        {onMenuToggle && (
          <button
            className="navbar__hamburger"
            onClick={onMenuToggle}
            aria-label="Abrir menú"
          >
            <i className="fas fa-bars"></i>
          </button>
        )}

        {/* Breadcrumbs */}
        <div className="navbar__breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <i className="fas fa-chevron-right navbar__breadcrumb-separator"></i>}
              {index === breadcrumbs.length - 1 ? (
                <span className="navbar__breadcrumb navbar__breadcrumb--active">
                  {crumb.name}
                </span>
              ) : (
                <a
                  href={crumb.path}
                  className="navbar__breadcrumb"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(crumb.path);
                  }}
                >
                  {crumb.name}
                </a>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Sección derecha */}
      <div className="navbar__right">
        {/* Notificaciones */}
        <div className="navbar__notifications" ref={notificationsRef}>
          <button
            className="navbar__icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notificaciones"
          >
            <i className="fas fa-bell"></i>
            {notificationsCount > 0 && (
              <span className="navbar__badge">{notificationsCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="navbar__dropdown navbar__dropdown--notifications">
              <div className="navbar__dropdown-header">
                <h4>Notificaciones</h4>
                <span className="navbar__dropdown-count">{notificationsCount} nuevas</span>
              </div>
              <div className="navbar__dropdown-content">
                <div className="navbar__notification-item">
                  <i className="fas fa-shopping-cart navbar__notification-icon navbar__notification-icon--info"></i>
                  <div className="navbar__notification-text">
                    <p className="navbar__notification-title">Nueva orden de compra</p>
                    <span className="navbar__notification-time">Hace 5 minutos</span>
                  </div>
                </div>
                <div className="navbar__notification-item">
                  <i className="fas fa-exclamation-triangle navbar__notification-icon navbar__notification-icon--warning"></i>
                  <div className="navbar__notification-text">
                    <p className="navbar__notification-title">Stock bajo en Vino Tinto Reserva</p>
                    <span className="navbar__notification-time">Hace 1 hora</span>
                  </div>
                </div>
                <div className="navbar__notification-item">
                  <i className="fas fa-user-plus navbar__notification-icon navbar__notification-icon--success"></i>
                  <div className="navbar__notification-text">
                    <p className="navbar__notification-title">Nuevo cliente registrado</p>
                    <span className="navbar__notification-time">Hace 3 horas</span>
                  </div>
                </div>
              </div>
              <div className="navbar__dropdown-footer">
                <a href="/notificaciones" className="navbar__dropdown-link">
                  Ver todas las notificaciones
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Usuario */}
        <div className="navbar__user" ref={userDropdownRef}>
          <button
            className="navbar__user-btn"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            aria-label="Menú de usuario"
          >
            <div className="navbar__avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{getInitials(user.name)}</span>
              )}
            </div>
            <div className="navbar__user-info">
              <span className="navbar__user-name">{user.name}</span>
              <span className="navbar__user-role">Administrador</span>
            </div>
            <i className="fas fa-chevron-down navbar__user-arrow"></i>
          </button>

          {showUserDropdown && (
            <div className="navbar__dropdown navbar__dropdown--user">
              <div className="navbar__dropdown-header">
                <div className="navbar__dropdown-user-info">
                  <p className="navbar__dropdown-user-name">{user.name}</p>
                  <span className="navbar__dropdown-user-email">{user.email}</span>
                </div>
              </div>
              <div className="navbar__dropdown-content">
                <button
                  className="navbar__dropdown-item"
                  onClick={() => {
                    setShowUserDropdown(false);
                    navigate('/perfil');
                  }}
                >
                  <i className="fas fa-user"></i>
                  <span>Mi perfil</span>
                </button>
                <button
                  className="navbar__dropdown-item"
                  onClick={() => {
                    setShowUserDropdown(false);
                    navigate('/configuracion');
                  }}
                >
                  <i className="fas fa-cog"></i>
                  <span>Configuración</span>
                </button>
                <div className="navbar__dropdown-divider"></div>
                <button
                  className="navbar__dropdown-item navbar__dropdown-item--danger"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
