import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Toast from '../../../components/common/Toast';
import { ProductoFormData } from '../../../types/producto.types';
import productoService from '../../../services/producto.service';
import './ProductoFormPage.css';

interface ProductoFormPageProps {
  mode: 'create' | 'edit';
}

const ProductoFormPage: React.FC<ProductoFormPageProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Estado
  const [formData, setFormData] = useState<ProductoFormData>({
    codigo_barras: '', // F6: Identificador único del producto
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: '',
    subcategoria: '',
    marca: '',
    imagen_url: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // F6.2: codigo_barras no editable
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  // Cargar datos del producto en modo edición y categorías
  useEffect(() => {
    loadCategorias();
    if (mode === 'edit' && id) {
      loadProducto(id);
    }
  }, [mode, id]);

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
   * Cargar datos del producto
   */
  const loadProducto = async (productoId: string) => {
    try {
      setLoading(true);
      const producto = await productoService.getProductoById(productoId);
      setFormData({
        codigo_barras: producto.codigo_barras || '', // F6.2: No editable
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoria: producto.categoria,
        subcategoria: producto.subcategoria,
        marca: producto.marca,
        imagen_url: producto.imagen_url,
      });
      setIsEditMode(true); // F6.2: Marcar como modo edición
    } catch (error: any) {
      setToast({
        message: error.message || 'Error al cargar el producto',
        type: 'error',
      });
      setTimeout(() => navigate('/productos'), 2000);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validar formulario
   * F6.1: Validaciones de campos requeridos
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // F6.1: Código de barras requerido (solo en creación)
    if (!isEditMode && !formData.codigo_barras.trim()) {
      newErrors.codigo_barras = 'El código de barras es requerido';
    }

    // Nombre: requerido
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    // Descripción: requerida
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    // F6.1 E4: Precio: mayor a 0
    if (formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser un valor numérico positivo';
    }

    // Stock: mayor o igual a 0
    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    // Categoría: requerida
    if (!formData.categoria.trim()) {
      newErrors.categoria = 'La categoría es requerida';
    }

    // Subcategoría: requerida
    if (!formData.subcategoria.trim()) {
      newErrors.subcategoria = 'La subcategoría es requerida';
    }

    // Marca: requerida
    if (!formData.marca.trim()) {
      newErrors.marca = 'La marca es requerida';
    }

    // Imagen URL: opcional (removida validación requerida)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manejar cambios en los inputs
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let processedValue: string | number = value;
    
    // Convertir a número para campos numéricos
    if (name === 'precio' || name === 'stock') {
      processedValue = value === '' ? 0 : parseFloat(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
    
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Subir imagen
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setToast({
        message: 'El archivo debe ser una imagen',
        type: 'error',
      });
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({
        message: 'La imagen no debe superar los 5MB',
        type: 'error',
      });
      return;
    }

    try {
      setUploadingImage(true);
      const imageUrl = await productoService.uploadImage(file);
      setFormData((prev) => ({ ...prev, imagen_url: imageUrl }));
      setToast({
        message: 'Imagen subida exitosamente',
        type: 'success',
      });
    } catch (error: any) {
      setToast({
        message: error.message || 'Error al subir la imagen',
        type: 'error',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({
        message: 'Por favor corrige los errores en el formulario',
        type: 'warning',
      });
      return;
    }

    try {
      setSubmitLoading(true);

      if (mode === 'create') {
        await productoService.createProducto(formData);
        setToast({
          message: 'Producto creado exitosamente',
          type: 'success',
        });
      } else if (mode === 'edit' && id) {
        await productoService.updateProducto(id, formData);
        setToast({
          message: 'Producto actualizado exitosamente',
          type: 'success',
        });
      }

      setTimeout(() => navigate('/productos'), 1500);
    } catch (error: any) {
      setToast({
        message: error.message || 'Error al guardar el producto',
        type: 'error',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  /**
   * Cancelar y volver
   */
  const handleCancel = () => {
    navigate('/productos');
  };

  if (loading) {
    return (
      <div className="producto-form-page">
        <div className="content-loading">
          <div className="content-loading__spinner"></div>
          <p className="content-loading__text">Cargando datos del producto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="producto-form-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-header__title">
          {mode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}
        </h1>
        <p className="page-header__subtitle">
          {mode === 'create'
            ? 'Completa el formulario para registrar un nuevo producto'
            : 'Actualiza la información del producto'}
        </p>
      </div>

      {/* Formulario */}
      <Card>
        <form onSubmit={handleSubmit} className="producto-form">
          <div className="producto-form__grid">
            {/* F6: Código de Barras - Solo editable en creación */}
            <Input
              label="Código de Barras"
              type="text"
              name="codigo_barras"
              value={formData.codigo_barras}
              onChange={handleInputChange}
              placeholder="Ej: 7891234567890"
              icon="barcode"
              error={errors.codigo_barras}
              disabled={isEditMode} // F6.2: No editable en modo edición
              required={!isEditMode}
            />

            {/* Nombre */}
            <Input
              label="Nombre del Producto"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Vino Tinto Reserva"
              icon="tag"
              error={errors.nombre}
              required
            />

            {/* Marca */}
            <Input
              label="Marca"
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleInputChange}
              placeholder="Ej: Casillero del Diablo"
              icon="copyright"
              error={errors.marca}
              required
            />

            {/* Categoría */}
            <div className="form-field">
              <label className="form-label">
                Categoría <span className="required">*</span>
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className={`form-select ${errors.categoria ? 'form-select--error' : ''}`}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.categoria && (
                <span className="form-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.categoria}
                </span>
              )}
            </div>

            {/* Subcategoría */}
            <Input
              label="Subcategoría"
              type="text"
              name="subcategoria"
              value={formData.subcategoria}
              onChange={handleInputChange}
              placeholder="Ej: Tinto Seco"
              icon="list"
              error={errors.subcategoria}
              required
            />

            {/* Precio */}
            <Input
              label="Precio (USD)"
              type="number"
              name="precio"
              value={formData.precio.toString()}
              onChange={handleInputChange}
              placeholder="0.00"
              icon="dollar-sign"
              error={errors.precio}
              required
            />

            {/* Stock */}
            <Input
              label="Stock (Unidades)"
              type="number"
              name="stock"
              value={formData.stock.toString()}
              onChange={handleInputChange}
              placeholder="0"
              icon="boxes"
              error={errors.stock}
              required
            />

            {/* Descripción - Full Width */}
            <div className="producto-form__full-width">
              <label className="form-label">
                Descripción <span className="required">*</span>
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Describe las características del producto..."
                className={`form-textarea ${errors.descripcion ? 'form-textarea--error' : ''}`}
                rows={4}
              />
              {errors.descripcion && (
                <span className="form-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.descripcion}
                </span>
              )}
            </div>

            {/* Imagen - Full Width */}
            <div className="producto-form__full-width">
              <label className="form-label">
                Imagen del Producto <span className="required">*</span>
              </label>
              
              <div className="producto-form__image-upload">
                {formData.imagen_url && (
                  <div className="producto-form__image-preview">
                    <img src={formData.imagen_url} alt="Preview" />
                  </div>
                )}
                
                <div className="producto-form__image-input">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="form-file-input"
                    id="image-upload"
                    disabled={uploadingImage}
                  />
                  <label htmlFor="image-upload" className="form-file-label">
                    <i className="fas fa-cloud-upload-alt"></i>
                    {uploadingImage ? 'Subiendo...' : 'Subir Imagen'}
                  </label>
                  
                  <Input
                    label="O ingresa una URL"
                    type="text"
                    name="imagen_url"
                    value={formData.imagen_url}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    icon="link"
                    error={errors.imagen_url}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="producto-form__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={submitLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon="save"
              loading={submitLoading}
              disabled={submitLoading || uploadingImage}
            >
              {mode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Card>

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

export default ProductoFormPage;
