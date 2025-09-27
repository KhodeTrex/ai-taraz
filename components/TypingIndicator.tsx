import React from 'react';

export const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-start gap-4 justify-start animate-fade-in-up">
             <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-sky-500 rounded-full flex-shrink-0 shadow-md">
                <i className="fa-solid fa-robot"></i>
            </div>
            <div className="p-4 rounded-2xl rounded-bl-none bg-white border border-gray-200 flex items-center space-x-2 rtl:space-x-reverse h-[52px] shadow-lg">
                <div className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-bounce"></div>
            </div>
        </div>
    );
};