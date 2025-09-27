import React, { useState } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-4xl mx-auto bg-gray-800 rounded-xl p-2 border border-gray-700/50">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="پیام خود را اینجا بنویسید..."
          rows={1}
          className="flex-1 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none resize-none px-2 py-2 h-auto max-h-48"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-sky-500 text-white rounded-lg transition-all duration-300 transform hover:bg-sky-600 hover:scale-110 disabled:bg-gray-600 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <i className="fas fa-paper-plane"></i>
          )}
        </button>
      </form>
    </div>
  );
};