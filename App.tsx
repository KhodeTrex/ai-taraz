import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { AIModel, Message } from './types';
import { generateResponse } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentModel, setCurrentModel] = useState<AIModel>(AIModel.Gemini);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([
        { role: 'model', text: `سلام! من ${currentModel} هستم. آماده‌ام تا به شما کمک کنم. سوالی دارید؟` }
    ]);
  }, [currentModel]);


  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim()) return;

    const userMessage: Message = { role: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Pass only the current conversation history, not the welcome message if it's a new convo
      const historyPayload = [...messages, userMessage].map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));
      
      const aiResponseText = await generateResponse(historyPayload, currentModel);
      const aiMessage: Message = { role: 'model', text: aiResponseText };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'یک خطای ناشناخته رخ داد.';
      setError(errorMessage);
      setMessages(prev => [...prev, {role: 'model', text: `متاسفانه خطایی رخ داد: ${errorMessage}`}]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentModel]);

  const handleModelChange = (model: AIModel) => {
    setCurrentModel(model);
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen w-full text-gray-100 font-[Vazirmatn,sans-serif]">
      <Header currentModel={currentModel} onModelChange={handleModelChange} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow messages={messages} isLoading={isLoading} model={currentModel} />
      </main>
      <div className="bg-gray-900">
          {error && <p className="text-red-400 text-center mb-2 text-sm px-4">{error}</p>}
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;