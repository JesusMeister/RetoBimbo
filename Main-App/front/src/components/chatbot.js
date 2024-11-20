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
    <div>
    <div className="text-2xl font-bold text-left rounded-t-lg text-white bg-blue-800 p-4">Chat Bimbot</div>
    <div className="bg-white shadow-md rounded-b-lg p-6 max-w-md mx-auto">
      <div className="bg-gray-100 p-4 mt-4 h-64 overflow-y-auto rounded-md">
        {messages.map((message, index) => (
          <div key={index} className={`my-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-black'}`}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 text-sm italic">Escribiendo...</div>
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <form onSubmit={handleSubmit} className="flex mt-4">
        <input
          type="text"
          value={question}
          onChange={handleInputChange}
          placeholder="Haz una pregunta..."
          className="w-full border rounded-l-lg p-2 focus:outline-none"/>
        <button
          type="submit"
          className="bg-blue-800 text-white px-4 rounded-r-lg hover:bg-blue-600 transition duration-300 font-bold"
          disabled={isLoading}>
          Enviar
        </button>
      </form>
      <div className='p-4 text-center'>
        <button className="bg-blue-800 text-white px-4 p-2 rounded-lg hover:bg-blue-600 transition duration-300 font-bold" onClick={handleReset}>
        Reiniciar chat
        </button>
      </div>
    </div>
    </div>
  );
};

export default BimboChatBot;