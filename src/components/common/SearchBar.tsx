import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  onSearch,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-bar__container">
        <i className="fas fa-search search-bar__icon"></i>
        
        <input
          type="text"
          className="search-bar__input"
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          aria-label="Campo de búsqueda"
        />
        
        {value && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
            title="Limpiar"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      
      {onSearch && (
        <button
          type="button"
          className="search-bar__button"
          onClick={handleSearch}
          aria-label="Buscar"
        >
          <span className="search-bar__button-text">Buscar</span>
          <i className="fas fa-search search-bar__button-icon"></i>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
