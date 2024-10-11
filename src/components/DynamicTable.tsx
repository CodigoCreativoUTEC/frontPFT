'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

interface TableProps {
  baseEndpoint: string;
  filters: { [key: string]: { value: string, endpoint: string } };
  columns: {
    key: string;
    data?: string;
    label: string;
    filterable?: boolean;
    isDropdown?: boolean;
    isDate?: boolean;
    dropdownOptionsEndpoint?: string;
    dropdownOptions?: Array<{ id: string; nombre: string }>;
  }[];
  token: string;
  actionRoutes?: {
    view?: (id: number) => string;
    edit?: (id: number) => string;
    delete?: (id: number) => string;
  };
  actionsVisibility?: {
    showView?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
  };
  deleteEndpoint?: string;
  useDeleteModal?: boolean;
}

const DynamicTable: React.FC<TableProps> = ({
  baseEndpoint,
  filters,
  columns,
  token,
  actionRoutes,
  actionsVisibility = { showView: true, showEdit: true, showDelete: true },
  deleteEndpoint,
  useDeleteModal = true,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterValues, setFilterValues] = useState<{ [key: string]: string }>({});
  const [dateFilters, setDateFilters] = useState<{ [key: string]: Date | null }>({});
  const [dropdownOptions, setDropdownOptions] = useState<{ [key: string]: any[] }>({});
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [modalMessage, setModalMessage] = useState('');
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Método renderFilterField para manejar la visualización de los filtros
  const renderFilterField = (column: any) => {
    if (column.isDate) {
      return (
        <DatePicker
          selected={dateFilters[column.key] || null}
          onChange={(date) => handleDateFilterChange(column.key, date)}
          className="border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 rounded-md shadow-sm"
          dateFormat="yyyy-MM-dd"
          showYearDropdown
          scrollableYearDropdown
          placeholderText={`Seleccionar ${column.label}`}
        />
      );
    } else if (column.isDropdown) {
      return (
        <select
          className="border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 rounded-md shadow-sm"
          value={filterValues[column.key] || ''}
          onChange={e => handleFilterChange(column.key, e.target.value)}
        >
          <option value="default">Todos</option>
          {dropdownOptions[column.key]?.map(option => (
            <option key={option.id} value={option[column.dropdownLabelKey || 'id']}>
              {option[column.dropdownLabelKey || 'nombre']} {/* Usamos dropdownLabelKey si está definido */}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <input
          type="text"
          className="border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 rounded-md shadow-sm"
          placeholder={`Filtrar por ${column.label}`}
          value={filterValues[column.key] || ''}
          onChange={e => handleFilterChange(column.key, e.target.value)}
        />
      );
    }
  };
  

  const getNestedValue = (row: any, key: string) => {
    return key.split('.').reduce((acc, part) => acc && acc[part], row);
  };

  const formatDateArray = (dateArray: number[]) => {
    if (dateArray.length === 3) {
      const [year, month, day] = dateArray;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return dateArray;
  };

  const formatDate = (dateValue: any) => {
    if (Array.isArray(dateValue)) {
      return formatDateArray(dateValue);
    } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
      const dateStr = dateValue.toString();
      if (dateStr.length === 8) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${year}-${month}-${day}`;
      }
    } else if (dateValue instanceof Date) {
      return format(dateValue, 'yyyy-MM-dd');
    }
    return dateValue;
  };

  const renderCellValue = (row: any, column: any) => {
    const value = column.data ? getNestedValue(row, column.data) : row[column.key];
  
    // Si el valor es un array y tiene formato de fecha [año, mes, día]
    if (Array.isArray(value) && column.isDate && value.length === 3) {
      const [year, month, day] = value;
      // Formateamos la fecha como "día/mes/año"
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }
  
    // Si el valor es un array (como usuariosTelefonos), lo unimos con espacios
    if (Array.isArray(value)) {
      return value.map((item: any) => item.numero).join(' ');
    }
  
    // Si es un campo de fecha y no es un array
    if (column.isDate && value) {
      return formatDate(value);
    }
  
    // Valor por defecto
    return value;
  };
  
  

  const getEndpoint = () => {
    const activeFilters = Object.keys(filterValues).filter(key => filterValues[key]);
    if (activeFilters.length > 0) {
      const filterKey = activeFilters[0];
      const customEndpoint = filters[filterKey]?.endpoint;
      if (customEndpoint) {
        return `${customEndpoint}?${filterKey}=${filterValues[filterKey]}`;
      }
    }
    const query = Object.keys(filterValues).map(key => `${key}=${filterValues[key]}`).join('&');
    return `${baseEndpoint}?${query}`;
  };

  const fetchData = async () => {
    try {
      const endpoint = getEndpoint();
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  
    columns.forEach((column) => {
      if (column.isDropdown && column.dropdownOptionsEndpoint) {
        axios
          .get(column.dropdownOptionsEndpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setDropdownOptions((prev) => ({
              ...prev,
              [column.key]: response.data,
            }));
          })
          .catch((error) => console.error('Error fetching dropdown options:', error));
      } else if (column.isDropdown && column.dropdownOptions) {
        setDropdownOptions((prev) => ({
          ...prev,
          [column.key]: column.dropdownOptions,
        }));
      }
    });
  }, [filterValues, dateFilters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleDateFilterChange = (key: string, date: Date | null) => {
    setDateFilters(prev => ({ ...prev, [key]: date }));
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
    setFilterValues(prev => ({ ...prev, [key]: formattedDate }));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `data_export_${Date.now()}.xlsx`);
  };

  const handleDelete = (id: number) => {
    if (useDeleteModal) {
      setItemToDelete(id);
      setShowModal(true);
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete !== null && deleteEndpoint) {
      setLoadingDelete(true);
      try {
        let response;
        if (deleteEndpoint.includes('/usuarios/inactivar')) {
          let userSeleccionado = await axios.get(
            `http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/seleccionar?id=${itemToDelete}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          let usuario = userSeleccionado.data;
          usuario.estado = 'INACTIVO';

          response = await axios.put(
            `${deleteEndpoint}${itemToDelete}`,
            usuario,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
        } else {
          response = await axios.delete(`${deleteEndpoint}?id=${itemToDelete}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        setFilteredData(filteredData.filter(item => item.id !== itemToDelete));
        setModalMessage(response.data.message || 'Elemento eliminado correctamente');
      } catch (error: any) {
        if (error.response) {
          setModalMessage(error.response.data.message || 'Error al eliminar el elemento');
        } else {
          setModalMessage('Error desconocido al intentar borrar el elemento');
        }
      } finally {
        setLoadingDelete(false);
        setShowModal(false);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {columns.map(column =>
          column.filterable ? (
            <div key={column.key} className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {column.label}:
              </label>
              {renderFilterField(column)}
            </div>
          ) : null
        )}
      </div>

      <div className="mb-4 flex space-x-2">
        <button
          className="bg-green-600 dark:bg-green-900 hover:bg-green-700 dark:hover:bg-green-950 text-white font-bold py-2 px-4 rounded"
          onClick={exportToExcel}
        >
          Exportar a Excel
        </button>
        <button
          className="bg-cyan-500 hover:bg-cyan-700 dark:bg-cyan-900 dark:hover:bg-cyan-950 text-white font-bold py-2 px-4 rounded"
          onClick={() => setFilterValues({})}
        >
          Limpiar Filtros
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-neutral-200 dark:border-neutral-700">
          <thead>
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {(actionsVisibility.showView || actionsVisibility.showEdit || actionsVisibility.showDelete) && (
                <th className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-50 dark:bg-neutral-800'}`}
              >
                {columns.map(column => (
                  <td
                    key={column.key}
                    className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-300"
                  >
                    {renderCellValue(row, column)}
                  </td>
                ))}
                {(actionsVisibility.showView || actionsVisibility.showEdit || actionsVisibility.showDelete) && (
                  <td className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-300 space-x-2">
                    <div className="inline-flex">
                      {actionRoutes?.view && actionsVisibility.showView && (
                        <Link href={actionRoutes.view(row.id)}>
                          <span className="bg-blue-500 p-1 inline-block ml-1 text-black text-xs rounded cursor-pointer">
                            Ver
                          </span>
                        </Link>
                      )}
                      {actionRoutes?.edit && actionsVisibility.showEdit && (
                        <Link href={actionRoutes.edit(row.id)}>
                          <span className="bg-yellow-500 p-1 inline-block ml-1 text-black text-xs rounded cursor-pointer">
                            Editar
                          </span>
                        </Link>
                      )}
                      {actionRoutes?.delete && actionsVisibility.showDelete && (
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(row.id)}
                        >
                          Borrar
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

      {/* Modal para confirmar borrado */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-lg max-w-sm mx-auto">
              <h2 className="text-lg font-medium text-neutral-700 dark:text-neutral-300">¿Estás seguro?</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">{modalMessage || '¿Deseas borrar este elemento?'}</p>
              <div className="flex justify-end space-x-2">
                <button
                  className={`bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded ${
                    loadingDelete ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={confirmDelete}
                  disabled={loadingDelete}
                >
                  {loadingDelete ? 'Eliminando...' : 'Borrar'}
                </button>
                <button
                  className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setShowModal(false)}
                  disabled={loadingDelete}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para mostrar mensajes */}
      {modalMessage && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-lg max-w-sm mx-auto">
              <h2 className="text-lg font-medium text-neutral-700 dark:text-neutral-300">Mensaje</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">{modalMessage}</p>
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setModalMessage('')}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
