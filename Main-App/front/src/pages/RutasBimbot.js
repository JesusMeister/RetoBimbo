import React from 'react';
import DataFramePlot from '../components/DataFramePlot';

function RutasBimbot() {
  return (
    <div style={{ width: '800px'}}>
      <header className="text-2xl font-bold text-left rounded-t-lg text-white bg-blue-800 p-4">
      <h1 className="text-3xl w-96">Rutas Bimbot</h1>  
      </header>
      <div className="bg-white shadow-md rounded-b-lg p-2 mx-auto">
      <div>
        <DataFramePlot />
      </div>
      </div>
    </div>
  );
}

export default RutasBimbot;
