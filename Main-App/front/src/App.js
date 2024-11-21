import React, { useState } from 'react';
import VisionBimbot from './pages/VisionBimbot';
import RutasBimbot from './pages/RutasBimbot';
import BimbotChat from './pages/BimbotChat';
import logo from './assets/Logo.png'

function App() {
  const [page, setPage] = useState(null);


  const render = () => {
    if (page === 'Rutas') return <RutasBimbot />;
    if (page === 'Chat') return <BimbotChat />;
    if (page === 'Vision') return <VisionBimbot />;
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-200 via-white to-red-200">
      <nav className="bg-gradient-to-r from-blue-800 via-white to-red-600 w-full shadow-lg rounded-b-2xl">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a className="flex items-center space-x-3">
            <img src={logo} alt="Logo Bimbo" className="h-16" />
            <span className="font-extrabold text-xl text-white tracking-wide">
              Osito <span className="text-white">Bimbot</span>
            </span>
          </a>

          <div className="hidden md:block">
            <ul className="flex flex-row space-x-6 font-medium">
              <li>
                <button
                  onClick={() => setPage('Rutas')}
                  className="text-white py-2 px-4 rounded-lg font-semibold bg-gradient-to-r from-blue-800 to-blue-600 via-blue-700 hover:from-blue-700 hover:to-red-500 transition duration-300 shadow-md focus:ring-2 focus:ring-yellow-300">
                  RUTAS
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPage('Chat')}
                  className="text-white py-2 px-4 rounded-lg font-semibold bg-gradient-to-r from-blue-800 to-blue-600 via-blue-700 hover:from-blue-700 hover:to-red-500 transition duration-300 shadow-md focus:ring-2 focus:ring-yellow-300">
                  CHAT
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPage('Vision')}
                  className="text-white py-2 px-4 rounded-lg font-semibold bg-gradient-to-r from-blue-800 to-blue-600 via-blue-700 hover:from-blue-700 hover:to-red-500 transition duration-300 shadow-md focus:ring-2 focus:ring-yellow-300">
                  VISIÓN
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center justify-start">
        <div className='p-4'></div>
        <div className="p-6">{page == null ? <></> : <>{render()}</>}</div>
        <div></div>
      </div>
      
      <footer className="w-full bg-gray-100 text-center py-4 text-sm text-gray-600">
        © 2024 Bimbo. Todos los derechos reservados.
      </footer>
    </div>

  );
}  

export default App;
