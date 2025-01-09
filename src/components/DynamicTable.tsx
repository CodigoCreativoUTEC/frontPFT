'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
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
    return key.split('.').reduce((acc, part) => {
      if (Array.isArray(acc)) {
        // Si es un array de objetos, intentamos acceder a la propiedad específica
        return acc.map(item => item && item[part]).filter(Boolean).join(', ');
      }
      return acc && acc[part];
    }, row);
  };
  
  

  const formatDateArray = (dateArray: number[]) => {
    if (dateArray.length === 3) {
      const [year, month, day] = dateArray;
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }
    return dateArray;
  };
  
  const formatDate = (dateValue: any) => {
    if (Array.isArray(dateValue) && dateValue.length === 3) {
      return formatDateArray(dateValue); // Si es un array de [año, mes, día]
    } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
      const dateStr = dateValue.toString();
      if (dateStr.length === 8) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${day}/${month}/${year}`; // Si es una cadena de 8 dígitos en formato YYYYMMDD
      }
    } else if (dateValue instanceof Date) {
      return format(dateValue, 'dd/MM/yyyy');
    }
    return dateValue;
  };
  

  const renderCellValue = (row: any, column: any) => {
    const value = column.data ? getNestedValue(row, column.data) : row[column.key];
  
    // Si el valor es un array de objetos, ya lo hemos manejado en `getNestedValue`
    if (Array.isArray(value)) {
      return value.join(', ');
    }
  
    // Si es un campo de fecha y no es un array
    if (column.isDate && value) {
      return formatDate(value);
    }
  
    // Valor por defecto
    return value;
  };
  

  
  

  const getEndpoint = useCallback(() => {
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
  }, [filterValues, filters, baseEndpoint]);

  const fetchData = useCallback(async () => {
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
  }, [getEndpoint, token]);

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
          [column.key]: column.dropdownOptions || [],
        }));
      }
    });
  }, [filterValues, dateFilters, fetchData, columns, token]);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleDateFilterChange = (key: string, date: Date | null) => {
    setDateFilters(prev => ({ ...prev, [key]: date }));
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
    setFilterValues(prev => ({ ...prev, [key]: formattedDate }));
  };

  const handleDelete = (id: number) => {
    if (useDeleteModal) {
      setItemToDelete(id);
      setShowModal(true);
    }else{
      setItemToDelete(id);
      confirmDelete();
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete !== null && deleteEndpoint) {
      setLoadingDelete(true);
      try {
        let response;
        if (deleteEndpoint.includes('/usuarios/inactivar')) {
          const userSeleccionado = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/usuarios/seleccionar?id=${itemToDelete}`,
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
              "Content-Type": "application/json",
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
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
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
                    <div className="inline-flex dark:bg-opacity-80">
                      {actionRoutes?.view && actionsVisibility.showView && (
                        <Link href={actionRoutes.view(row.id)}>
                          <span className="bg-blue-500 p-1 inline-block ml-1 text-black text-xs rounded cursor-pointer">
                          <svg width="20" height="20" viewBox="0 0 25 24" fill="#343C54" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0234 7.625C9.60719 7.625 7.64844 9.58375 7.64844 12C7.64844 14.4162 9.60719 16.375 12.0234 16.375C14.4397 16.375 16.3984 14.4162 16.3984 12C16.3984 9.58375 14.4397 7.625 12.0234 7.625ZM9.14844 12C9.14844 10.4122 10.4356 9.125 12.0234 9.125C13.6113 9.125 14.8984 10.4122 14.8984 12C14.8984 13.5878 13.6113 14.875 12.0234 14.875C10.4356 14.875 9.14844 13.5878 9.14844 12Z" fill="#343C54"/>
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0234 4.5C7.71145 4.5 3.99772 7.05632 2.30101 10.7351C1.93091 11.5375 1.93091 12.4627 2.30101 13.2652C3.99772 16.9439 7.71145 19.5002 12.0234 19.5002C16.3353 19.5002 20.049 16.9439 21.7458 13.2652C22.1159 12.4627 22.1159 11.5375 21.7458 10.7351C20.049 7.05633 16.3353 4.5 12.0234 4.5ZM3.66311 11.3633C5.12472 8.19429 8.32017 6 12.0234 6C15.7266 6 18.922 8.19429 20.3836 11.3633C20.5699 11.7671 20.5699 12.2331 20.3836 12.6369C18.922 15.8059 15.7266 18.0002 12.0234 18.0002C8.32017 18.0002 5.12472 15.8059 3.66311 12.6369C3.47688 12.2331 3.47688 11.7671 3.66311 11.3633Z" fill="#343C54"/>
                          </svg>

                          </span>
                        </Link>
                      )}
                      {actionRoutes?.edit && actionsVisibility.showEdit && (
                        <Link href={actionRoutes.edit(row.id)}>
                          <span className="bg-yellow-500 p-1 inline-block ml-1 text-black text-xs rounded cursor-pointer">
                          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3028 3.7801C18.4241 2.90142 16.9995 2.90142 16.1208 3.7801L14.3498 5.5511C14.3442 5.55633 14.3387 5.56166 14.3333 5.5671C14.3279 5.57253 14.3225 5.57803 14.3173 5.58359L5.83373 14.0672C5.57259 14.3283 5.37974 14.6497 5.27221 15.003L4.05205 19.0121C3.9714 19.2771 4.04336 19.565 4.23922 19.7608C4.43508 19.9567 4.72294 20.0287 4.98792 19.948L8.99703 18.7279C9.35035 18.6203 9.67176 18.4275 9.93291 18.1663L20.22 7.87928C21.0986 7.0006 21.0986 5.57598 20.22 4.6973L19.3028 3.7801ZM14.8639 7.15833L6.89439 15.1278C6.80735 15.2149 6.74306 15.322 6.70722 15.4398L5.8965 18.1036L8.56029 17.2928C8.67806 17.257 8.7852 17.1927 8.87225 17.1057L16.8417 9.13619L14.8639 7.15833ZM17.9024 8.07553L19.1593 6.81862C19.4522 6.52572 19.4522 6.05085 19.1593 5.75796L18.2421 4.84076C17.9492 4.54787 17.4743 4.54787 17.1814 4.84076L15.9245 6.09767L17.9024 8.07553Z" fill="#343C54"/>
                            </svg>

                          </span>
                        </Link>
                      )}
                      {actionRoutes?.delete && actionsVisibility.showDelete && (
                        
                        <button
                          className="text-rose-500 hover:text-rose-700"
                          onClick={() => handleDelete(row.id)}
                        ><span className="bg-rose-500 p-1 inline-block ml-1 text-black text-xs rounded cursor-pointer">

                          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
                              <path d="M14.7223 12.7585C14.7426 12.3448 14.4237 11.9929 14.01 11.9726C13.5963 11.9522 13.2444 12.2711 13.2241 12.6848L12.9999 17.2415C12.9796 17.6552 13.2985 18.0071 13.7122 18.0274C14.1259 18.0478 14.4778 17.7289 14.4981 17.3152L14.7223 12.7585Z" fill="#343C54"/>
                              <path d="M9.98802 11.9726C9.5743 11.9929 9.25542 12.3448 9.27577 12.7585L9.49993 17.3152C9.52028 17.7289 9.87216 18.0478 10.2859 18.0274C10.6996 18.0071 11.0185 17.6552 10.9981 17.2415L10.774 12.6848C10.7536 12.2711 10.4017 11.9522 9.98802 11.9726Z" fill="#343C54"/>
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.249 2C9.00638 2 7.99902 3.00736 7.99902 4.25V5H5.5C4.25736 5 3.25 6.00736 3.25 7.25C3.25 8.28958 3.95503 9.16449 4.91303 9.42267L5.54076 19.8848C5.61205 21.0729 6.59642 22 7.78672 22H16.2113C17.4016 22 18.386 21.0729 18.4573 19.8848L19.085 9.42267C20.043 9.16449 20.748 8.28958 20.748 7.25C20.748 6.00736 19.7407 5 18.498 5H15.999V4.25C15.999 3.00736 14.9917 2 13.749 2H10.249ZM14.499 5V4.25C14.499 3.83579 14.1632 3.5 13.749 3.5H10.249C9.83481 3.5 9.49902 3.83579 9.49902 4.25V5H14.499ZM5.5 6.5C5.08579 6.5 4.75 6.83579 4.75 7.25C4.75 7.66421 5.08579 8 5.5 8H18.498C18.9123 8 19.248 7.66421 19.248 7.25C19.248 6.83579 18.9123 6.5 18.498 6.5H5.5ZM6.42037 9.5H17.5777L16.96 19.7949C16.9362 20.191 16.6081 20.5 16.2113 20.5H7.78672C7.38995 20.5 7.06183 20.191 7.03807 19.7949L6.42037 9.5Z" fill="#343C54"/>
                              </svg>
                              </span>
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
    </div>
  );
};

export default DynamicTable;
