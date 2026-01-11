import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    correo: '',
    password: '',
    recordarme: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!validateEmail(formData.correo)) {
      newErrors.correo = 'Correo inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await login(formData.correo, formData.password);

      // Guardar preferencia de recordarme
      if (formData.recordarme) {
        localStorage.setItem('rememberEmail', formData.correo);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      showToast('¡Sesión iniciada correctamente!', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      showToast('Error al iniciar sesión. Verifica tus credenciales.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Cargar email recordado
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        correo: savedEmail,
        recordarme: true,
      }));
    }
  }, []);

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Logo */}
          <div className="login-logo">
            <div className="logo-icon">
              <i className="fas fa-box"></i>
            </div>
          </div>

          {/* Título */}
          <h1 className="login-title">BARBOX</h1>
          <p className="login-subtitle">Backoffice de Gestión</p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email */}
            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  id="correo"
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  disabled={loading}
                  className={errors.correo ? 'input-error' : ''}
                />
              </div>
              {errors.correo && <span className="error-message">{errors.correo}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  className={errors.password ? 'input-error' : ''}
                />
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* Remember & Forgot Password */}
            <div className="form-footer">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="recordarme"
                  checked={formData.recordarme}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Recordarme en este dispositivo</span>
              </label>
              <Link to="/forgot-password" className="forgot-password-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <i className="fas fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="login-footer">
            © 2026 BARBOX. Todos los derechos reservados.
          </p>
        </div>

        {/* Decoración */}
        <div className="login-decoration login-decoration-1"></div>
        <div className="login-decoration login-decoration-2"></div>
      </div>
    </div>
  );
};

export default LoginPage;
