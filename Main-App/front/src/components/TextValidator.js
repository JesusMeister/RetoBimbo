import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TextValidator = ({ texts, onComplete }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= texts.length) {
      onComplete();
    }
  }, [currentIndex]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validateNextText = async () => {
    setLoading(true);
    const text = texts[currentIndex];
    const formData = new FormData();
    formData.append('text', text);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('http://localhost:8080/check_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      var isEqual = response.data.isEqual;
      setResults((prevResults) => [...prevResults, { text, isEqual }]);
    } catch (error) {
      setResults((prevResults) => [...prevResults, { text, error: 'Error al validar' }]);
    } finally {
      setLoading(false);
      if (isEqual == true){setCurrentIndex((prevIndex) => prevIndex + 1);}
    }
  };

  return (
    <div className="p-4 flex flex-col w-96">
      <input type="file" onChange={handleImageChange} className="mb-4 p-4" />
      <button onClick={validateNextText} className="mb-4 p-2 bg-blue-800 text-white rounded" disabled={loading}>
        {loading ? 'Validando...' : 'Validar Siguiente Ubicación'}
      </button>
      <ul>
        {results.map((result, index) => (
          <li key={index} className="mb-2">
            {result.text}: {result.isEqual ? 'Ubicación valida' : 'Ubicación no válida'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TextValidator;