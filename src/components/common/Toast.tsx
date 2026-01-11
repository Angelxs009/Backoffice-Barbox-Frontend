import React, { useEffect, useState } from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Auto cerrar después de duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    // Esperar a que termine la animación antes de llamar onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Iconos según tipo
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-exclamation-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'info':
        return 'fa-info-circle';
      default:
        return 'fa-info-circle';
    }
  };

  return (
    <div className={`toast toast--${type} ${isClosing ? 'toast--closing' : ''}`}>
      <div className="toast__content">
        <i className={`fas ${getIcon()} toast__icon`}></i>
        <p className="toast__message">{message}</p>
        <button
          className="toast__close-btn"
          onClick={handleClose}
          aria-label="Cerrar notificación"
          type="button"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div
        className="toast__progress"
        style={{
          animationDuration: `${duration}ms`,
        }}
      ></div>
    </div>
  );
};

export default Toast;
