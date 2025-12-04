import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2, Sparkles, WifiOff } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useData } from '../contexts/DataContext';

const GeminiAssistant: React.FC = () => {
  const { buses, locations } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', text: 'Hi! I am your Dhaka transit assistant. Ask me about routes, fares, or traffic tips!' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !isOnline) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    
    // Pass dynamic data to service
    const responseText = await sendMessageToGemini(input, history, buses, locations);

    const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText || "Sorry, I couldn't process that." };
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  if (!isOnline && !isOpen) {
    return (
       <button 
        disabled
        className="fixed bottom-6 right-6 w-14 h-14 bg-slate-400 rounded-full shadow-xl flex items-center justify-center text-white cursor-not-allowed opacity-50 z-40"
        title="AI Assistant unavailable offline"
      >
        <WifiOff size={24} />
      </button>
    )
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-blue-600 to-teal-500 rounded-full shadow-xl shadow-blue-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform z-40"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[90vw] sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-yellow-300" />
          <h3 className="font-semibold">Transit AI</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-slate-700 border border-slate-200 shadow-sm rounded-bl-none'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm">
              <Loader2 size={16} className="animate-spin text-blue-500" />
            </div>
          </div>
        )}
        {!isOnline && (
           <div className="flex justify-center my-4">
            <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
              <WifiOff size={10} /> You are offline. AI is disabled.
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isOnline ? "Ask about buses..." : "Offline"}
          disabled={!isOnline}
          className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim() || !isOnline}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default GeminiAssistant;