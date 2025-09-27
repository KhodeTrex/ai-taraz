
import React, { useState, useRef, useEffect } from 'react';
import { AIModel } from '../types';

interface HeaderProps {
  currentModel: AIModel;
  onModelChange: (model: AIModel) => void;
  onToggleSidebar: () => void;
}

const modelOptions = [
  { id: AIModel.Gemini, icon: 'fa-solid fa-brain' },
  { id: AIModel.Qwen, icon: 'fa-solid fa-lightbulb' },
  { id: AIModel.DeepSeek, icon: 'fa-solid fa-code' },
  { id: AIModel.Grok, icon: 'fa-solid fa-rocket' },
];

export const Header: React.FC<HeaderProps> = ({ currentModel, onModelChange, onToggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/80 p-4 flex justify-between items-center flex-shrink-0 z-10">
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="md:hidden text-gray-600 hover:text-gray-900 ml-4 rtl:ml-0 rtl:mr-4" aria-label="باز کردن منو">
            <i className="fas fa-bars text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-900">چت‌بات هوشمند</h1>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="flex items-center gap-2 rtl:gap-2 bg-gray-100 border border-transparent text-gray-700 px-4 py-2 rounded-lg transition-all hover:bg-gray-200 hover:border-sky-500/50"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span>{currentModel}</span>
          <i className={`fas fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
        </button>
        {isOpen && (
          <div className="absolute left-0 rtl:left-auto rtl:right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg animate-fade-in-up origin-top-left rtl:origin-top-right">
            <div className="p-2" role="menu" aria-orientation="vertical">
              <p className="px-3 py-2 text-xs text-gray-500">شروع چت جدید با:</p>
              {modelOptions.map(option => (
                <button 
                  key={option.id} 
                  onClick={() => { onModelChange(option.id); setIsOpen(false); }} 
                  className="w-full flex items-center gap-3 rtl:gap-3 p-3 rounded-md text-right rtl:text-right text-gray-700 hover:bg-sky-500/10 transition-colors"
                  role="menuitem"
                >
                  <i className={`${option.icon} w-6 text-lg text-center text-sky-500`}></i>
                  <span className="font-semibold">{option.id}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
