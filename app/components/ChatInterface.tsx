'use client';

import { useState } from 'react';
import { ChatMessage } from '@/app/types';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function ChatInterface({ onSendMessage, messages, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">献立の修正・調整</h3>
      
      <div className="mb-4 h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">
            献立について質問したり、修正を依頼したりできます。<br />
            例: 「朝食を少なくしたい」「魚が嫌い」など
          </p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 ${
                msg.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="text-left">
            <div className="inline-block bg-gray-200 text-gray-800 p-3 rounded-lg">
              考え中...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="献立への要望を入力してください"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          送信
        </button>
      </form>
    </div>
  );
}
