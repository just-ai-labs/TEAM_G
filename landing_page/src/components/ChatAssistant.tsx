import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface ChatAssistantProps {
  onSendMessage: (message: string) => Promise<string>;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your GitHub assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    const response = await onSendMessage(userMessage);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 rounded-lg p-6 h-[600px] flex flex-col"
    >
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl font-bold">GitHub Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'assistant'
                  ? 'bg-gray-700'
                  : 'bg-purple-600'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about your GitHub repository..."
          className="flex-1 bg-gray-700 rounded px-4 py-2 text-white"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </motion.div>
  );
};