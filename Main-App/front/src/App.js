import React, { useState } from 'react';
import VisionBimbot from './pages/VisionBimbot';
import RutasBimbot from './pages/RutasBimbot';
import BimbotChat from './pages/BimbotChat';
import background from './assets/FONDO_CEDIS.jpg'

function App() {
  const [page, setPage] = useState(null);

  const render = () => {
    if (page === 'Rutas') return <RutasBimbot />;
    if (page === 'Chat') return <BimbotChat />;
    if (page === 'Vision') return <VisionBimbot />;
  };

  const fondo = {
    backgroundImage: `url(${background})`,
  };

  return (
    <div className="min-h-screen flex flex-col items-center" style={fondo}>
      <nav className="w-full p-4 flex justify-around font-bold rounded-b-lg bg-blue-800">
        <button onClick={() => setPage('Rutas')} className="text-red-600 bg-white p-3 rounded-lg">RUTAS</button>
        <button onClick={() => setPage('Chat')} className="text-red-600 bg-white p-3 rounded-lg">CHAT</button>
        <button onClick={() => setPage('Vision')} className="text-red-600 bg-white p-3 rounded-lg">VISIÓN</button>
      </nav>
      <div className='p-6'></div>
      <div className="flex-grow flex items-start">
        {page == null ? <></> : <>{render()}</>}
      </div>
    </div>
  );
}

export default App;
