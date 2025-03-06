import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Papa from 'papaparse';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('bateadores');
  const [bateadoresData, setBateadoresData] = useState([]);
  const [pitchersData, setPitchersData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [loading, setLoading] = useState({ bateadores: true, pitchers: true });
  const [error, setError] = useState({ bateadores: null, pitchers: null });
  const [pageSize, setPageSize] = useState(100);

  useEffect(() => {
    // Cargar los archivos CSV automáticamente al iniciar
    cargarCSV('/data/bateadores.csv', 'bateadores');
    cargarCSV('/data/pitchers.csv', 'pitchers');
  }, []);

  const cargarCSV = (rutaArchivo, tipo) => {
    setLoading(prev => ({ ...prev, [tipo]: true }));
    setError(prev => ({ ...prev, [tipo]: null }));

    const baseUrl = process.env.PUBLIC_URL || '';
  const rutaCompleta = `${baseUrl}${rutaArchivo}`;

    Papa.parse(rutaCompleta, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log(`CSV cargado: ${tipo}`, result.data);
        
        // Procesar los datos según el tipo
        const processedData = procesarDatos(result.data, tipo);
        
        if (tipo === 'bateadores') {
          setBateadoresData(processedData);
        } else if (tipo === 'pitchers') {
          setPitchersData(processedData);
        }
        
        setLoading(prev => ({ ...prev, [tipo]: false }));
      },
      error: (error) => {
        console.error(`Error al cargar ${tipo}:`, error);
        setError(prev => ({ ...prev, [tipo]: `Error al cargar el archivo ${rutaArchivo}` }));
        setLoading(prev => ({ ...prev, [tipo]: false }));
      }
    });
  };

  const procesarDatos = (datos, tipo) => {
    if (tipo === 'bateadores') {
      return datos.map(row => {
        const numericFields = ['Rank', 'G', 'PA', 'AB', 'H', '2B', '3B', 'HR', 'R', 'RBI', 
          'BB', 'SO', 'HBP', 'SB', 'CS', 'wRC+'];
        
        const decimalFields = ['BB%', 'K%', 'ISO', 'BABIP', 'AVG', 'OBP', 'SLG', 'OPS', 'wOBA', 'ADP'];
        
        const newRow = { ...row };
        
        numericFields.forEach(field => {
          if (field in newRow && newRow[field] !== null && newRow[field] !== undefined) {
            newRow[field] = parseInt(newRow[field], 10) || 0;
          }
        });
        
        decimalFields.forEach(field => {
          if (field in newRow && newRow[field] !== null && newRow[field] !== undefined) {
            newRow[field] = parseFloat(newRow[field]) || 0;
          }
        });
        
        return newRow;
      });
    } else if (tipo === 'pitchers') {
      return datos.map(row => {
        const numericFields = ['Rank', 'GS', 'G', 'W', 'L', 'QS', 'SV', 'HLD', 'H', 'ER', 'HR', 'SO', 'BB'];
        
        const decimalFields = ['IP', 'K/9', 'BB/9', 'K/BB', 'HR/9', 'AVG', 'WHIP', 'BABIP', 'LOB%', 'ERA', 'FIP', 'ADP'];
        
        const newRow = { ...row };
        
        numericFields.forEach(field => {
          if (field in newRow && newRow[field] !== null && newRow[field] !== undefined) {
            newRow[field] = parseInt(newRow[field], 10) || 0;
          }
        });
        
        decimalFields.forEach(field => {
          if (field in newRow && newRow[field] !== null && newRow[field] !== undefined) {
            newRow[field] = parseFloat(newRow[field]) || 0;
          }
        });
        
        return newRow;
      });
    }
    
    return datos;
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    
    // Ajustar las columnas para ocupar el ancho disponible
    params.api.sizeColumnsToFit();
    
    // Re-ajustar cuando cambie el tamaño de la ventana
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
  };

  // Función para crear columnas automáticamente basadas en los datos
  const getColumnas = (datos) => {
    if (!datos || datos.length === 0) return [];

    return Object.keys(datos[0]).map(key => {
      const esNumerico = typeof datos[0][key] === 'number';
      const esDecimal = esNumerico && datos.some(row => 
        row[key] !== null && 
        row[key] !== undefined && 
        row[key] % 1 !== 0
      );
      
      return {
        headerName: key,
        field: key,
        sortable: true,
        filter: esNumerico ? 'agNumberColumnFilter' : 'agTextColumnFilter',
        filterParams: esNumerico ? {
          filterOptions: [
            'equals',
            'notEqual',
            'lessThan',
            'lessThanOrEqual',
            'greaterThan',
            'greaterThanOrEqual',
            'inRange'
          ],
          buttons: ['apply', 'clear'],
          closeOnApply: true
        } : {
          filterOptions: [
            'contains',
            'notContains',
            'equals',
            'notEqual',
            'startsWith',
            'endsWith'
          ],
          buttons: ['apply', 'clear']
        },
        valueFormatter: esDecimal ? 
          (params) => params.value !== null && params.value !== undefined ? 
            params.value.toFixed(3) : '' : 
          undefined,
        minWidth: key === 'Name' ? 160 : 80, // Columnas más compactas
        maxWidth: key === 'Name' ? 220 : null,
      };
    });
  };

  const exportarCSV = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: `${activeTab}_filtrados.csv`
      });
    }
  };

  const limpiarFiltros = () => {
    if (gridApi) {
      gridApi.setFilterModel(null);
    }
  };

  const getCurrentData = () => {
    return activeTab === 'bateadores' ? bateadoresData : pitchersData;
  };

  const recargarDatos = () => {
    cargarCSV('/data/bateadores.csv', 'bateadores');
    cargarCSV('/data/pitchers.csv', 'pitchers');
  };

  const onPageSizeChanged = (newPageSize) => {
    setPageSize(parseInt(newPageSize));
    if (gridApi) {
      gridApi.paginationSetPageSize(parseInt(newPageSize));
    }
  };

  return (
    <div className="app-container">
      <div className="header-container">
        <h1>Trampas de Manu</h1>
        
        <div className="tabs-section">
          <div className="tabs">
            <button 
              className={activeTab === 'bateadores' ? 'active' : ''} 
              onClick={() => setActiveTab('bateadores')}
              disabled={bateadoresData.length === 0 && !error.bateadores}
            >
              Bateadores {bateadoresData.length > 0 ? `(${bateadoresData.length})` : ''}
              {loading.bateadores && ' (Cargando...)'}
            </button>
            <button 
              className={activeTab === 'pitchers' ? 'active' : ''} 
              onClick={() => setActiveTab('pitchers')}
              disabled={pitchersData.length === 0 && !error.pitchers}
            >
              Pitchers {pitchersData.length > 0 ? `(${pitchersData.length})` : ''}
              {loading.pitchers && ' (Cargando...)'}
            </button>
          </div>
          
          <div className="controls">
            <div className="page-size-control">
              <label>Mostrar: </label>
              <select value={pageSize} onChange={(e) => onPageSizeChanged(e.target.value)}>
                <option value="100">100</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
                <option value="2000">2000</option>
                <option value="10000">10000</option>
              </select>
            </div>
            <button onClick={exportarCSV}>Exportar</button>
            <button onClick={limpiarFiltros}>Limpiar</button>
            <button className="reload-btn" onClick={recargarDatos}>Recargar</button>
          </div>
        </div>
      </div>
      
      {error[activeTab] ? (
        <div className="error-message">
          <p>{error[activeTab]}</p>
          <p>Asegúrate de que los archivos CSV estén en la carpeta 'public/data/'</p>
        </div>
      ) : loading[activeTab] ? (
        <div className="loading">
          <p>Cargando datos...</p>
        </div>
      ) : getCurrentData().length > 0 ? (
        <div className="ag-theme-alpine-dark" style={{ height: 'calc(100vh - 120px)', width: '100%' }}>
          <AgGridReact
            rowData={getCurrentData()}
            columnDefs={getColumnas(getCurrentData())}
            pagination={true}
            paginationPageSize={pageSize}
            defaultColDef={{
              flex: 1,
              minWidth: 80,
              filter: true,
              sortable: true,
              resizable: true,
              floatingFilter: false, // Eliminamos los filtros flotantes
              suppressMovable: false,
              suppressSizeToFit: false,
            }}
            suppressRowHoverHighlight={false}
            columnHoverHighlight={true}
            enableRangeSelection={true}
            rowSelection={'multiple'}
            rowHeight={35} // Filas más compactas
            headerHeight={40} // Headers más compactos
            onGridReady={onGridReady}
            suppressContextMenu={false}
            enableCellTextSelection={true}
            ensureDomOrder={true}
          />
        </div>
      ) : (
        <div className="empty-state">
          <p>No hay datos disponibles.</p>
        </div>
      )}
    </div>
  );
}

export default App;