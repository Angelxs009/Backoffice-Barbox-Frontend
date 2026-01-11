import React from 'react';
import './Input.css';

interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'datetime-local' | 'search';
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  icon?: string;
  className?: string;
  name?: string;
  onEnter?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  icon,
  className = '',
  name,
  onEnter,
}) => {
  const inputWrapperClasses = [
    'input-wrapper',
    error ? 'input-wrapper--error' : '',
    disabled ? 'input-wrapper--disabled' : '',
    readOnly ? 'input-wrapper--readonly' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputClasses = [
    'input',
    icon ? 'input--with-icon' : '',
    error ? 'input--error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={inputWrapperClasses}>
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
          {required && <span className="input-label__required">*</span>}
        </label>
      )}
      
      <div className="input-container">
        {icon && (
          <i className={`fas fa-${icon} input-icon`}></i>
        )}
        
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onEnter) {
              e.preventDefault();
              onEnter();
            }
          }}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      </div>
      
      {error && (
        <span className="input-error" id={`${name}-error`} role="alert">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
