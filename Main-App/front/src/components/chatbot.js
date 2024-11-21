import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'

const BimboChatBot = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([{ role: 'bot', content: '¡Hola! Soy Bimbot, tu asistente digital de inventaio. ¿En qué puedo ayudarte hoy?' }]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://127.0.0.1:8080/reset_memory');
      console.log(response.data)
    } catch (error) {}
    setMessages([{ role: 'bot', content: '¡Hola! Soy Bimbot, tu asistente digital de inventaio. ¿En qué puedo ayudarte hoy?' }])
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
  
    const newMessages = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);
    setQuestion('');
    setIsLoading(true);
  
    try {
      const response = await axios.post('http://127.0.0.1:8080/ask', {
        'question': question,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = response.data;
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'bot', content: data.answer },
      ]);
    } catch (error) {
      console.error('Error fetching answer:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'bot', content: 'Hubo un error al obtener la respuesta. Por favor intenta de nuevo.' },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto rounded-lg p-4">
      <div className="bg-gray-50 p-4 h-64 overflow-y-auto rounded-md shadow-inner">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} my-2`}>
            <div
              className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-black'
              }`}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 text-sm italic text-center mt-2">
            Escribiendo...
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex mt-4">
        <input
          type="text"
          value={question}
          onChange={handleInputChange}
          placeholder="Haz una pregunta..."
          className="w-full border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-800 to-blue-600 via-blue-700 text-white px-4 rounded-r-lg hover:from-blue-700 hover:to-red-500 transition duration-300 font-bold"
          disabled={isLoading}>
          Enviar
        </button>
      </form>
      
      <div className="text-center mt-4">
        <button
          className="bg-gradient-to-r from-blue-800 to-blue-600 via-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-red-500 transition duration-300 font-bold shadow-md"
          onClick={handleReset}>
          Reiniciar Chat
        </button>
      </div>
    </div>
  );
};

export default BimboChatBot;