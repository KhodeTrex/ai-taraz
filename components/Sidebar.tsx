
import React from 'react';
import { Conversation, AIModel } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: (model: AIModel) => void;
  onDeleteConversation: (id: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ conversations, activeConversationId, onSelectConversation, onNewChat, onDeleteConversation, isVisible, onToggleVisibility }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-10 md:hidden transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggleVisibility}
        aria-hidden="true"
      ></div>
      <aside className={`fixed md:relative z-20 flex flex-col h-full bg-gray-800 text-white transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'} w-72 shrink-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">تاریخچه گفتگو</h1>
          <button onClick={onToggleVisibility} className="md:hidden text-gray-400 hover:text-white" aria-label="بستن نوار کناری">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <div className="p-4">
          <button
            onClick={() => onNewChat(AIModel.Gemini)}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-sky-500 hover:bg-sky-600 transition-colors duration-200 text-white font-semibold"
          >
            <i className="fas fa-plus"></i>
            <span>چت جدید</span>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {conversations.map((convo) => {
            const isActive = activeConversationId === convo.id;
            return (
              <div key={convo.id} className="group relative rounded-lg">
                <button
                  onClick={() => onSelectConversation(convo.id)}
                  className={`w-full text-right p-3 rounded-lg truncate transition-all duration-200 flex items-center gap-3 ${
                    isActive
                      ? 'bg-gray-900/80 shadow-inner'
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  <i className="fa-regular fa-message text-gray-400 w-5 text-center"></i>
                  <span className="flex-1">{convo.title}</span>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`آیا از حذف "${convo.title}" مطمئن هستید؟`)) {
                          onDeleteConversation(convo.id);
                        }
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    aria-label={`حذف ${convo.title}`}
                  >
                    <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700 text-center text-gray-500 text-xs">
          <p>قدرت گرفته از Gemini</p>
        </div>
      </aside>
    </>
  );
};
