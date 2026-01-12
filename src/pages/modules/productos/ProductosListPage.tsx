import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import SearchBar from '../../../components/common/SearchBar';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import Modal from '../../../components/common/Modal';
import Toast from '../../../components/common/Toast';
import Input from '../../../components/common/Input';
import { Producto } from '../../../types/producto.types';
import productoService from '../../../services/producto.service';
import './ProductosListPage.css';

const ProductosListPage: React.FC = () => {
  const navigate = useNavigate();

  // Estado
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    categoria: '',
    precioMin: '',
    precioMax: '',
    estado: '', // '' = todos, 'ACT' = activos, 'INA' = inactivos (F6.4.2)
  });
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  // Cargar productos y categorías al montar
  useEffect(() => {
    loadProductos();
    loadCategorias();
  }, []);

  /**
   * Cargar lista de productos
   */
  const loadProductos = async () => {
    try {
      setLoading(true);
      const data = await productoService.getProductos();
      setProductos(data);
    } catch (error: any) {
      setToast({
        message: error.message || 'Error al cargar los productos',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cargar categorías
   */
  const loadCategorias = async () => {
    try {
      const data = await productoService.getCategorias();
      setCategorias(data);
    } catch (error: any) {
      console.error('Error al cargar categorías:', error);
    }
  };

  /**
   * Buscar productos
   * F6.4: Consulta con filtros (categoría, precio, estado)
   */
  const handleSearch = async () => {
    if (!searchQuery.trim() && !filters.categoria && !filters.precioMin && !filters.precioMax && !filters.estado) {
      loadProductos();
      return;
    }

    try {
      setLoading(true);
      
      const productosFilters: any = {
        busqueda: searchQuery || undefined,
        categoria: filters.categoria || undefined,
        precioMin: filters.precioMin ? parseFloat(filters.precioMin) : undefined,
        precioMax: filters.precioMax ? parseFloat(filters.precioMax) : undefined,
      };
      
      // F6.4.2: Filtro por estado
      if (filters.estado === 'ACT') {
        productosFilters.estado = true;
      } else if (filters.estado === 'INA') {
        productosFilters.estado = false;
      }

      const data = await productoService.getProductos(productosFilters);
      setProductos(data);
      
      if (data.length === 0) {
        setToast({
          message: 'No se encontraron productos con ese criterio',
          type: 'info',
        });
      }
    } catch (error: any) {
      setToast({
        message: error.message || 'Error al buscar productos',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpiar filtros
   */
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      categoria: '',
      precioMin: '',
      precioMax: '',
      estado: '',
    });
    loadProductos();
  };

  /**
   * Ver detalles del producto
   */
  const handleView = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowModal(true);
  };

  /**
   * Editar producto
   */
  const handleEdit = (producto: Producto) => {
    navigate(`/productos/editar/${producto.id_producto}`);
  };

  /**
   * Mostrar confirmación de eliminación
   */
  const handleDelete = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowDeleteConfirm(true);
  };

  /**
   * Confirmar eliminación
   */
  const confirmDelete = async () => {
    if (!selectedProducto) return;

    try {
      await productoService.deleteProducto(selectedProducto.id_producto);
      setToast({
        message: 'Producto eliminado exitosamente',
        type: 'success',
      });
      setShowDeleteConfirm(false);
      setSelectedProducto(null);
      loadProductos();
    } catch (error: any) {
      setToast({
        message: error.message || 'Error al eliminar el producto',
        type: 'error',
      });
    }
  };

  /**
   * Crear nuevo producto
   */
  const handleCreate = () => {
    navigate('/productos/nuevo');
  };

  /**
   * Formatear precio
   */
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  /**
   * Preparar datos para la tabla
   */
  const tableData = productos.map((producto) => ({
    ...producto,
    imagenThumb: (
      <img
        src={producto.imagen_url || '/placeholder-product.png'}
        alt={producto.nombre}
        className="producto-thumbnail"
      />
    ),
    precioFormateado: formatPrice(producto.precio),
    stockBadge: (
      <span className={`badge ${producto.stock > 10 ? 'badge--success' : producto.stock > 0 ? 'badge--warning' : 'badge--danger'}`}>
        {producto.stock} unid.
      </span>
    ),
    estadoBadge: (
      <span className={`badge ${producto.estado ? 'badge--success' : 'badge--danger'}`}>
        {producto.estado ? 'Activo' : 'Inactivo'}
      </span>
    ),
  }));

  const tableColumns = [
    { key: 'imagenThumb', label: 'Imagen', width: '80px', align: 'center' as const },
    { key: 'codigo_barras', label: 'Código', width: '130px' },
    { key: 'nombre', label: 'Nombre', width: '200px' },
    { key: 'categoria', label: 'Categoría', width: '130px' },
    { key: 'marca', label: 'Marca', width: '110px' },
    { key: 'precioFormateado', label: 'Precio', width: '90px', align: 'right' as const },
    { key: 'stockBadge', label: 'Stock', width: '90px', align: 'center' as const },
    { key: 'estadoBadge', label: 'Estado', width: '100px', align: 'center' as const },
  ];

  return (
    <div className="productos-list-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Gestión de Productos</h1>
          <p className="page-header__subtitle">
            Administra el inventario de productos de BARBOX
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <Card>
        {/* Barra de búsqueda y acciones */}
        <div className="productos-list__actions">
          <div className="productos-list__search-wrapper">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Buscar por nombre, categoría, marca..."
            />
            <Button
              variant="outline"
              icon="filter"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtros
            </Button>
          </div>
          <Button
            variant="primary"
            icon="plus"
            onClick={handleCreate}
          >
            Nuevo Producto
          </Button>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="productos-list__filters">
            <div className="productos-list__filters-grid">
              <div className="filter-field">
                <label>Categoría</label>
                <select
                  value={filters.categoria}
                  onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
                  className="filter-select"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              {/* F6.4.2: Filtro por estado */}
              <div className="filter-field">
                <label>Estado</label>
                <select
                  value={filters.estado}
                  onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                  className="filter-select"
                >
                  <option value="">Todos los estados</option>
                  <option value="ACT">Activos (ACT)</option>
                  <option value="INA">Inactivos (INA)</option>
                </select>
              </div>
              
              <Input
                label="Precio Mínimo"
                type="number"
                value={filters.precioMin}
                onChange={(e) => setFilters({ ...filters, precioMin: e.target.value })}
                placeholder="0.00"
                icon="dollar-sign"
              />
              
              <Input
                label="Precio Máximo"
                type="number"
                value={filters.precioMax}
                onChange={(e) => setFilters({ ...filters, precioMax: e.target.value })}
                placeholder="999.99"
                icon="dollar-sign"
              />
            </div>
            
            <div className="productos-list__filters-actions">
              <Button variant="secondary" onClick={handleClearFilters} size="small">
                Limpiar
              </Button>
              <Button variant="primary" onClick={handleSearch} size="small">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        )}

        {/* Tabla de productos */}
        <div className="productos-list__table">
          <Table
            columns={tableColumns}
            data={tableData}
            loading={loading}
            emptyMessage="No hay productos registrados"
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Card>

      {/* Modal de detalles del producto */}
      {showModal && selectedProducto && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Detalles del Producto"
          size="large"
        >
          <div className="producto-details">
            <div className="producto-details__image">
              <img
                src={selectedProducto.imagen_url || '/placeholder-product.png'}
                alt={selectedProducto.nombre}
              />
            </div>
            
            <div className="producto-details__info">
              <div className="producto-details__row">
                <div className="producto-details__field">
                  <label>Nombre:</label>
                  <span>{selectedProducto.nombre}</span>
                </div>
                <div className="producto-details__field">
                  <label>Estado:</label>
                  <span className={`badge ${selectedProducto.estado ? 'badge--success' : 'badge--danger'}`}>
                    {selectedProducto.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              <div className="producto-details__row">
                <div className="producto-details__field producto-details__field--full">
                  <label>Descripción:</label>
                  <span>{selectedProducto.descripcion}</span>
                </div>
              </div>

              <div className="producto-details__row">
                <div className="producto-details__field">
                  <label>Categoría:</label>
                  <span>{selectedProducto.categoria}</span>
                </div>
                <div className="producto-details__field">
                  <label>Subcategoría:</label>
                  <span>{selectedProducto.subcategoria}</span>
                </div>
                <div className="producto-details__field">
                  <label>Marca:</label>
                  <span>{selectedProducto.marca}</span>
                </div>
              </div>

              <div className="producto-details__row">
                <div className="producto-details__field">
                  <label>Precio:</label>
                  <span className="producto-details__price">{formatPrice(selectedProducto.precio)}</span>
                </div>
                <div className="producto-details__field">
                  <label>Stock:</label>
                  <span className={selectedProducto.stock > 10 ? '' : 'text-warning'}>
                    {selectedProducto.stock} unidades
                  </span>
                </div>
              </div>

              <div className="producto-details__row">
                <div className="producto-details__field">
                  <label>Fecha de Creación:</label>
                  <span>{new Date(selectedProducto.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="producto-details__field">
                  <label>Última Actualización:</label>
                  <span>{new Date(selectedProducto.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && selectedProducto && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Confirmar Eliminación"
          size="small"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                icon="trash"
                onClick={confirmDelete}
              >
                Eliminar
              </Button>
            </>
          }
        >
          <p>
            ¿Estás seguro de que deseas eliminar el producto{' '}
            <strong>{selectedProducto.nombre}</strong>?
          </p>
          <p className="text-danger">Esta acción no se puede deshacer.</p>
        </Modal>
      )}

      {/* Toast de notificaciones */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default ProductosListPage;
