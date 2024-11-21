import React, { useState } from "react";

const Slider = ({ min, max, title, onAccept }) => {
  const [value, setValue] = useState(min);

  const handleSliderChange = (event) => {
    setValue(event.target.value);
  };

  const handleAccept = () => {
    if (value !== min) {
      onAccept(value);
    } else {
      onAccept(min);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-lg border-blue-800 m-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="mb-4">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleSliderChange}
          className="w-full accent-blue-800"
        />
        <div className="flex justify-between">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      </div>

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

export default Slider;
