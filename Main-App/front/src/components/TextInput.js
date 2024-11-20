import React, { useState } from 'react';

const TextInput = ({ onSubmit }) => {
  const [texts, setTexts] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const textArray = texts.split('\n').map(text => text.trim()).filter(text => text);
    onSubmit(textArray);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 w-96">
      <textarea
        value={texts}
        onChange={(e) => setTexts(e.target.value)}
        placeholder="Ingresa la lista de ubicaciones a revisar, una por línea"
        className="p-2 w-full border rounded bg-gray-100"
        rows="10"
      />
      <div className='text-center'>
      <button type="submit" className="mt-2 p-2 bg-blue-800 text-white rounded font-bold">Enviar</button>
      </div>
    </form>
  );
};

export default TextInput;