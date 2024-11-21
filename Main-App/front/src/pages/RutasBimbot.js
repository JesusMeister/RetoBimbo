import React from 'react';
import DataFramePlot from '../components/DataFramePlot';

function RutasBimbot() {
  return (
<div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
  <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-red-600 text-white p-6 rounded-t-lg shadow-md">
    <h1 className="text-3xl font-extrabold">
      <span className="text-white">Rutas</span>{" "}
      <span className="text-yellow-300">Bimbot</span>
    </h1>
    <p className="text-sm text-blue-100 mt-2">
      Divide el almacén en zonas y encuentra la ruta más corta posible.
    </p>
  </header>

  <div className="p-6 bg-white">
    <DataFramePlot />
  </div>
</div>

  );
}

export default RutasBimbot;
