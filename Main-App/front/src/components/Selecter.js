import React, { useState } from 'react';

const Selecter = ({ min, max, title, onAccept }) => {
  const [selectedNumber, setSelectedNumber] = useState(min);

  const handleChange = (event) => {
    const value = event.target.value;
    if (value === '' || (Number(value) >= min && Number(value) <= max)) { setSelectedNumber(value); }
  };

  const handleAccept = () => {
    const number = Number(selectedNumber);
    if (!isNaN(number) && number >= min && number <= max) { onAccept(number);}
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-lg border-blue-800 m-6">
      <h1 className='font-bold text-xl'>{title}</h1>
      <input
        className='p-6 font-bold'
        type="number"
        value={selectedNumber}
        min={min}
        max={max}
        onChange={handleChange}/>
        <div className="text-center">
        <button
          onClick={handleAccept}
          className="m-4 bg-gradient-to-r from-blue-800 to-red-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-red-500 transition duration-300 font-bold shadow-md">
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default Selecter;
