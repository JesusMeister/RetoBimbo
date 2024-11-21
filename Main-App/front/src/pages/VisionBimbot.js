import React, { useState } from 'react';
import TextInput from '../components/TextInput';
import TextValidator from '../components/TextValidator';

const VisionBimbot = () => {
  const [texts, setTexts] = useState([]);
  const [validated, setValidated] = useState(false);

  const handleTextsSubmit = (texts) => {
    setTexts(texts);
    setValidated(false);
  };

  const handleValidationComplete = () => {
    setValidated(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-red-600 text-white p-6 rounded-t-lg shadow-md">
        <h1 className="text-3xl font-extrabold">
          <span className="text-white">Visión</span>{" "}
          <span className="text-yellow-300">Bimbot</span>
        </h1>
        <p className="text-sm text-blue-100 mt-2">
          Valida ubicaciones.
        </p>
      </header>
      <div className="bg-white shadow-md rounded-b-lg p-4 max-w-lg mx-auto">
      {!validated ? (
        <div className='flex flex-col'>
          {texts.length == 0 && <TextInput onSubmit={handleTextsSubmit} />}
          {texts.length > 0 && <TextValidator texts={texts} onComplete={handleValidationComplete} />}
        </div>
      ) : (
        <p className="text-green-500 font-bold">¡Todos las ubicaciones han sido validadas!</p>
      )}
      </div>
    </div>
  );
};

export default VisionBimbot