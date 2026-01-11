import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  name: string;
  icon: string;
  route: string;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const menuItems: MenuCategory[] = [
    {
      category: 'GENERAL',
      items: [
        { name: 'Dashboard', icon: 'fa-chart-line', route: '/dashboard' },
      ],
    },
    {
      category: 'VENTAS',
      items: [
        { name: 'Clientes', icon: 'fa-users', route: '/clientes' },
        { name: 'Facturas', icon: 'fa-file-invoice', route: '/facturas' },
      ],
    },
    {
      category: 'INVENTARIO',
      items: [
        { name: 'Productos', icon: 'fa-boxes', route: '/productos' },
        { name: 'Bodegas', icon: 'fa-warehouse', route: '/bodegas' },
      ],
    },
    {
      category: 'COMPRAS',
      items: [
        { name: 'Órdenes de Compra', icon: 'fa-shopping-cart', route: '/ordenes-compra' },
        { name: 'Proveedores', icon: 'fa-truck', route: '/proveedores' },
      ],
    },
    {
      category: 'MARKETING',
      items: [
        { name: 'Promociones', icon: 'fa-tags', route: '/promociones' },
        { name: 'Marcas', icon: 'fa-copyright', route: '/marcas' },
      ],
    },
  ];

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && onClose && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Botón cerrar en móvil */}
        {onClose && (
          <div className="sidebar__close">
            <button
              className="sidebar__close-btn"
              onClick={onClose}
              aria-label="Cerrar menú"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Logo */}
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <i className="fas fa-wine-glass-alt"></i>
          </div>
          <h1 className="sidebar__logo-text">BARBOX</h1>
        </div>

        {/* Navegación */}
        <nav className="sidebar__nav">
          {menuItems.map((category, categoryIndex) => (
            <div key={categoryIndex} className="sidebar__category">
              <h4 className="sidebar__category-title">{category.category}</h4>
              <ul className="sidebar__menu">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="sidebar__menu-item">
                    <NavLink
                      to={item.route}
                      className={({ isActive }) =>
                        `sidebar__menu-link ${isActive ? 'sidebar__menu-link--active' : ''}`
                      }
                      onClick={handleLinkClick}
                    >
                      <i className={`fas ${item.icon} sidebar__menu-icon`}></i>
                      <span className="sidebar__menu-text">{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer del sidebar (opcional) */}
        <div className="sidebar__footer">
          <p className="sidebar__version">Versión 1.0.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
