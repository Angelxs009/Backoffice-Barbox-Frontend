import React from 'react';
import './Card.css';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: string;
  actions?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  icon,
  actions,
  className = '',
  onClick,
}) => {
  const cardClasses = [
    'card',
    onClick ? 'card--clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const hasHeader = title || subtitle || icon || actions;

  return (
    <div className={cardClasses} onClick={handleClick}>
      {hasHeader && (
        <div className="card__header">
          <div className="card__header-left">
            {icon && (
              <div className="card__icon">
                <i className={`fas fa-${icon}`}></i>
              </div>
            )}
            <div className="card__header-text">
              {title && <h3 className="card__title">{title}</h3>}
              {subtitle && <p className="card__subtitle">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </div>
      )}
      
      <div className={`card__body ${hasHeader ? '' : 'card__body--no-header'}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
