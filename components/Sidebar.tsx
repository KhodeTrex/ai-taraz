
import React from 'react';
import { AIModel } from '../types';

interface SidebarProps {
  currentModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

const modelOptions = [
  { id: AIModel.Gemini, icon: 'fa-solid fa-brain' },
  { id: AIModel.Qwen, icon: 'fa-solid fa-lightbulb' },
  { id: AIModel.DeepSeek, icon: 'fa-solid fa-code' },
  { id: AIModel.Grok, icon: 'fa-solid fa-rocket' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentModel, onModelChange }) => {
  return (
    <aside className="w-64 bg-gray-900/30 backdrop-blur-md border-r border-blue-400/20 p-6 flex flex-col space-y-6">
      <h1 className="text-2xl font-bold text-center text-blue-300">مدل‌ها</h1>
      <div className="flex flex-col space-y-3">
        {modelOptions.map((option) => {
          const isActive = currentModel === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onModelChange(option.id)}
              className={`flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg text-right transition-all duration-300 ease-in-out transform hover:scale-105 ${
                isActive
                  ? 'bg-blue-600/50 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
              }`}
            >
              <i className={`${option.icon} w-6 text-lg text-center ${isActive ? 'text-blue-200' : 'text-gray-400'}`}></i>
              <span className="font-semibold">{option.id}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-auto text-center text-gray-500 text-xs">
        <p>قدرت گرفته از Gemini</p>
        <p>طراحی شده با عشق</p>
      </div>
    </aside>
  );
};
