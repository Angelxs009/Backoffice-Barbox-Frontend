import React from 'react';
import './Table.css';

interface Column {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps {
  columns: Column[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  loading = false,
  emptyMessage = 'No hay datos para mostrar',
}) => {
  const hasActions = onEdit || onDelete || onView;

  // Skeleton Loader
  if (loading) {
    return (
      <div className="table-wrapper">
        <table className="table">
          <thead className="table__header">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`table__header-cell table__header-cell--${column.align || 'left'}`}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              {hasActions && (
                <th className="table__header-cell table__header-cell--center">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="table__body">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="table__row">
                {columns.map((column) => (
                  <td key={column.key} className="table__cell">
                    <div className="skeleton skeleton--text"></div>
                  </td>
                ))}
                {hasActions && (
                  <td className="table__cell table__cell--center">
                    <div className="skeleton skeleton--actions"></div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Empty State
  if (data.length === 0) {
    return (
      <div className="table-wrapper">
        <table className="table">
          <thead className="table__header">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`table__header-cell table__header-cell--${column.align || 'left'}`}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              {hasActions && (
                <th className="table__header-cell table__header-cell--center">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="table__body">
            <tr>
              <td
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="table__empty"
              >
                <i className="fas fa-inbox table__empty-icon"></i>
                <p className="table__empty-message">{emptyMessage}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead className="table__header">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`table__header-cell table__header-cell--${column.align || 'left'}`}
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
            {hasActions && (
              <th className="table__header-cell table__header-cell--center">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="table__body">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="table__row">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`table__cell table__cell--${column.align || 'left'}`}
                >
                  {row[column.key] !== null && row[column.key] !== undefined
                    ? row[column.key]
                    : '-'}
                </td>
              ))}
              {hasActions && (
                <td className="table__cell table__cell--center">
                  <div className="table__actions">
                    {onView && (
                      <button
                        className="table__action-btn table__action-btn--view"
                        onClick={() => onView(row)}
                        title="Ver"
                        aria-label="Ver"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    )}
                    {onEdit && (
                      <button
                        className="table__action-btn table__action-btn--edit"
                        onClick={() => onEdit(row)}
                        title="Editar"
                        aria-label="Editar"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="table__action-btn table__action-btn--delete"
                        onClick={() => onDelete(row)}
                        title="Eliminar"
                        aria-label="Eliminar"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
