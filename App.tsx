

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import { AIModel, Message, Conversation } from './types';
import { generateResponse } from './services/geminiService';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth > 768);

  // Inject custom animation styles globally and only once.
  useEffect(() => {
    const animationStyleId = 'app-animations';
    if (document.getElementById(animationStyleId)) return;

    const style = document.createElement('style');
    style.id = animationStyleId;
    style.innerHTML = `
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in {
        animation: fade-in 0.5s ease-out forwards;
      }
      .animate-fade-in-up {
        animation: fade-in-up 0.4s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const welcomeMessages: Record<AIModel, string> = useMemo(() => ({
      [AIModel.Gemini]: "سلام! من Gemini هستم، یک دستیار هوش مصنوعی همه‌کاره. برای شروع، می‌توانید از من بخواهید یک شعر کوتاه درباره بهار بنویسم.",
      [AIModel.Qwen]: "درود بر شما! من Qwen هستم، آماده‌ام تا با خلاقیت به دنیای شما نگاه کنم. چطور است با هم یک داستان کوتاه درباره یک ربات ماجراجو بسازیم؟",
      [AIModel.DeepSeek]: "سلام. من DeepSeek هستم. تخصص من کد و مسائل فنی است. می‌توانید با پرسیدن یک سوال برنامه‌نویسی، مانند «چگونه یک آرایه را در پایتون مرتب کنم؟» من را امتحان کنید.",
      [AIModel.Grok]: "سلام! من Grok هستم. حوصله‌ام سر رفته، بیایید کمی سرگرم شویم! نظرتان چیست که از من بپرسید چرا آسمان آبی است؟... البته با کمی چاشنی طنز!",
  }), []);

  const handleNewChat = useCallback((model: AIModel) => {
    const newConvo: Conversation = {
        id: Date.now().toString(),
        title: 'چت جدید',
        model: model,
        messages: [{ role: 'model', text: welcomeMessages[model] }],
    };
    setConversations(prev => [newConvo, ...prev]);
    setActiveConversationId(newConvo.id);
    setError(null);
    if (window.innerWidth < 768) {
      setIsSidebarVisible(false);
    }
  }, [welcomeMessages]);

  // Load from localStorage on mount
  useEffect(() => {
    let loaded = false;
    try {
        const saved = localStorage.getItem('chatHistory');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                setConversations(parsed);
                setActiveConversationId(parsed[0].id);
                loaded = true;
            }
        }
    } catch (e) {
        console.error("Failed to load history", e);
        localStorage.removeItem('chatHistory');
    }

    if (!loaded) {
        handleNewChat(AIModel.Gemini);
    }

    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = (e: MediaQueryListEvent | MediaQueryList) => setIsSidebarVisible(!e.matches);
    handleResize(mediaQuery);
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, [handleNewChat]);

  // Save to localStorage whenever conversations change
  useEffect(() => {
      if (conversations.length > 0) {
          try {
              localStorage.setItem('chatHistory', JSON.stringify(conversations));
          } catch (e) {
              console.error("Failed to save chat history to localStorage", e);
          }
      }
  }, [conversations]);

  const activeConversation = useMemo(() => 
    conversations.find(c => c.id === activeConversationId),
    [conversations, activeConversationId]
  );
  
  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || !activeConversation) return;

    const userMessage: Message = { role: 'user', text: inputText };
    
    const updatedConversations = conversations.map(c => {
      if (c.id === activeConversationId) {
        const isFirstUserMessage = c.messages.length === 1;
        const newTitle = isFirstUserMessage 
          ? inputText.substring(0, 35) + (inputText.length > 35 ? '...' : '')
          : c.title;
        return { ...c, title: newTitle, messages: [...c.messages, userMessage] };
      }
      return c;
    });

    setConversations(updatedConversations);
    setIsLoading(true);
    setError(null);

    try {
      const currentConvo = updatedConversations.find(c => c.id === activeConversationId);
      if (!currentConvo) throw new Error("Active conversation not found");

      const historyPayload = currentConvo.messages.slice(1).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));
      
      const aiResponseText = await generateResponse(historyPayload, currentConvo.model);
      const aiMessage: Message = { role: 'model', text: aiResponseText };
      setConversations(prev => prev.map(c => 
          c.id === activeConversationId
          ? { ...c, messages: [...c.messages, aiMessage] }
          : c
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'یک خطای ناشناخته رخ داد.';
      setError(errorMessage);
      // FIX: The `setMessages` function does not exist. We need to update the `conversations` state
      // by finding the active conversation and appending the error message to its `messages` array.
      setConversations(prev => prev.map(c => 
          c.id === activeConversationId
          ? { ...c, messages: [...c.messages, {role: 'model', text: `متاسفانه خطایی رخ داد: ${errorMessage}`}] }
          : c
      ));
    } finally {
      setIsLoading(false);
    }
  }, [conversations, activeConversationId, activeConversation]);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    if (window.innerWidth < 768) {
        setIsSidebarVisible(false);
    }
  }, []);

  const handleDeleteConversation = useCallback((id: string) => {
    const remaining = conversations.filter(c => c.id !== id);
    setConversations(remaining);
    if (activeConversationId === id) {
        if (remaining.length > 0) {
            setActiveConversationId(remaining[0].id);
        } else {
            handleNewChat(AIModel.Gemini);
        }
    }
  }, [conversations, activeConversationId, handleNewChat]);

  return (
    <div className="flex h-screen w-full text-gray-800 font-[Vazirmatn,sans-serif] bg-gray-100 overflow-hidden">
      <Sidebar 
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        isVisible={isSidebarVisible}
        onToggleVisibility={() => setIsSidebarVisible(false)}
      />
      <div className="flex-1 flex flex-col h-screen">
        <Header 
          currentModel={activeConversation?.model ?? AIModel.Gemini} 
          onModelChange={handleNewChat} 
          onToggleSidebar={() => setIsSidebarVisible(prev => !prev)}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatWindow 
            key={activeConversationId} 
            messages={activeConversation?.messages ?? []} 
            isLoading={isLoading} 
            model={activeConversation?.model ?? AIModel.Gemini} 
          />
        </main>
        <div className="bg-gray-100 border-t border-gray-200">
            {error && <p className="text-red-500 text-center mb-2 text-sm px-4">{error}</p>}
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;