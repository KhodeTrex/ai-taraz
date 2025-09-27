import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const UserIcon: React.FC = () => (
    <div className="w-10 h-10 bg-sky-500 flex items-center justify-center text-white font-bold text-lg rounded-full flex-shrink-0 shadow-md">
        <i className="fa-solid fa-user"></i>
    </div>
);

const ModelIcon: React.FC = () => (
    <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-sky-500 rounded-full flex-shrink-0 shadow-md">
        <i className="fa-solid fa-robot"></i>
    </div>
);


export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex items-start gap-4 animate-fade-in-up ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && <ModelIcon />}
      <div
        className={`max-w-xl p-4 rounded-2xl shadow-lg ${
          isUser
            ? 'bg-sky-500 rounded-br-none text-white'
            : 'bg-white rounded-bl-none text-gray-800 border border-gray-200'
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
      </div>
      {isUser && <UserIcon />}
    </div>
  );
};

// Add keyframes for animation in tailwind config if possible, or use a style tag for simplicity here.
// Since we can't edit tailwind.config.js, let's inject it via a style element.
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out;
}
`;
document.head.appendChild(style);