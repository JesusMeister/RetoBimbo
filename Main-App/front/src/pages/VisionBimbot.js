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
    <div>
      <div className="text-2xl font-bold text-left rounded-t-lg text-white bg-blue-800 p-4">Vision Bimbot</div>
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