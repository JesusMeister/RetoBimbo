import React from 'react';
import '../index.css';
import BimboChatBot from '../components/ChatBot';

const BimbotChat = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-red-600 text-white p-6 rounded-t-lg shadow-md">
        <h1 className="text-3xl font-extrabold">
          <span className="text-white">Chat</span>{" "}
          <span className="text-yellow-300">Bimbot</span>
        </h1>
        <p className="text-sm text-blue-100 mt-2">
          Haz cualquier pregunta sobre el almacén.
        </p>
      </header>
      <div className="bg-white shadow-md rounded-b-lg p-6 max-w-md mx-auto">
        <BimboChatBot />
      </div>
    </div>
  );
};

export default BimbotChat