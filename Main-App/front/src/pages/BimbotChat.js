import React from 'react';
import '../index.css';
import BimboChatbot from '../components/chatbot';

const BimbotChat = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <BimboChatbot />
    </div>
  );
};

export default BimbotChat