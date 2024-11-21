import React, { useState } from 'react';

const TextInput = ({ onSubmit }) => {
  const [texts, setTexts] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const textArray = texts.split('\n').map(text => text.trim()).filter(text => text);
    onSubmit(textArray);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto rounded-lg">
      <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
        Lista de Ubicaciones
      </h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Ingresa las ubicaciones a revisar, separadas por línea.
      </p>
      <textarea
        value={texts}
        onChange={(e) => setTexts(e.target.value)}
        className="p-3 w-full border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-700"
        rows="8"/>
      <div className="text-center mt-6">
        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-blue-800 to-blue-600 via-blue-700 text-white rounded-lg font-bold shadow-md hover:from-blue-700 hover:to-red-500 focus:ring-2 focus:ring-blue-400">
          Enviar
        </button>
      </div>
    </form>

  );
};

export default TextInput;