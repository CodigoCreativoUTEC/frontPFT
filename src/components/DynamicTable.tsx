import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface TableProps {
  baseEndpoint: string; // URL base del endpoint
  filters: { [key: string]: { value: string, endpoint: string } }; // Filtros iniciales con su respectivo endpoint
  columns: { key: string, data?: string, label: string, filterable?: boolean, isDropdown?: boolean, dropdownOptionsEndpoint?: string }[]; // Esquema de columnas dinámico
  token: string; // Token Bearer para las solicitudes
}

const DynamicTable: React.FC<TableProps> = ({ baseEndpoint, filters, columns, token }) => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterValues, setFilterValues] = useState<{ [key: string]: string }>({});
  const [dropdownOptions, setDropdownOptions] = useState<{ [key: string]: any[] }>({});

  // Función para construir el endpoint dinámico
  const getEndpoint = () => {
    const activeFilters = Object.keys(filterValues).filter(key => filterValues[key]);
    if (activeFilters.length > 0) {
      const filterKey = activeFilters[0]; // Toma el primer filtro activo (por simplicidad)
      const customEndpoint = filters[filterKey]?.endpoint;
      if (customEndpoint) {
        return `${customEndpoint}?${filterKey}=${filterValues[filterKey]}`;
      }
    }
    const query = Object.keys(filterValues).map(key => `${key}=${filterValues[key]}`).join('&');
    return `${baseEndpoint}?${query}`;
  };

  // Función para obtener datos según los filtros aplicados
  const fetchData = async () => {
    try {
      const endpoint = getEndpoint(); // Obtener el endpoint dinámico
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token Bearer en los headers
        }
      });
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Efecto para cargar los datos iniciales y las opciones de dropdown
  useEffect(() => {
    fetchData();

    // Cargar opciones de dropdown si alguna columna tiene `isDropdown`
    columns.forEach(column => {
      if (column.isDropdown && column.dropdownOptionsEndpoint) {
        axios.get(column.dropdownOptionsEndpoint, {
          headers: {
            Authorization: `Bearer ${token}` // Agregar el token Bearer en los headers
          }
        })
          .then(response => {
            setDropdownOptions(prev => ({ ...prev, [column.key]: response.data }));
          })
          .catch(error => console.error('Error fetching dropdown options:', error));
      }
    });
  }, [filterValues]); // Fetch new data when filter values change

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `data_export_${Date.now()}.xlsx`);
  };

  // Función para manejar los campos anidados
  const getNestedValue = (row: any, key: string) => {
    return key.split('.').reduce((acc, part) => acc && acc[part], row);
  };

  return (
    <div>
      <div>
        {/* Renderizar filtros dinámicos */}
        {columns.map(column => (
          column.filterable ? (
            <div key={column.key}>
              <label>{column.label}:</label>
              {column.isDropdown ? (
                // Lista desplegable para los filtros que dependen de un endpoint
                <select
                  value={filterValues[column.key] || ''}
                  onChange={e => handleFilterChange(column.key, e.target.value)}
                >
                  <option value="">Todos</option>
                  {dropdownOptions[column.key]?.map(option => (
                    <option key={option.id} value={option.nombre}>{option.nombre}</option> // Usar `option.id` como value y `option.nombre` como texto visible
                  ))}
                </select>
              ) : (
                // Campo de texto para los demás filtros
                <input
                  type="text"
                  placeholder={`Filtrar por ${column.label}`}
                  value={filterValues[column.key] || ''}
                  onChange={e => handleFilterChange(column.key, e.target.value)}
                />
              )}
            </div>
          ) : null
        ))}
      </div>

      <button onClick={exportToExcel}>Exportar a Excel</button>

      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              {columns.map(column => (
                <td key={column.key}>
                  {column.data ? getNestedValue(row, column.data) : row[column.key]} {/* Usar column.data si está disponible */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
