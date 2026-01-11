import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2>Página no encontrada</h2>
        <p>La página que buscas no existe o ha sido movida.</p>
        <button className="not-found-button" onClick={() => navigate('/dashboard')}>
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
