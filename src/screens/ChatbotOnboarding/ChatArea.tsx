import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Message } from '../../types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { LogoSection } from './LogoSection';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (content: string, isUser: boolean) => void;
  isTyping: boolean;
  hasMessages: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ 
  messages, 
  onSendMessage, 
  isTyping,
  hasMessages 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim(), true);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="h-full grid grid-rows-[1fr_auto] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Messages Area */}
      <div className="min-h-0 overflow-y-auto overscroll-contain px-6 py-6">
        {!hasMessages ? (
          <LogoSection />
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-6 pt-3 pb-[env(safe-area-inset-bottom,0px)] bg-transparent">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <div
            className={`relative bg-white/95 dark:bg-gray-800/95 rounded-full shadow-xl border transition-all duration-300 ${
              isFocused
                ? 'border-purple-300 dark:border-purple-600 shadow-2xl shadow-purple-500/20'
                : 'border-gray-200 dark:border-gray-700 hover:shadow-lg'
            }`}
            style={{ paddingBottom: 'max(0rem, env(safe-area-inset-bottom))' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Escribe tu pregunta sobre nuestros servicios..."
              className="w-full px-6 py-4 pr-16 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg rounded-full"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                inputValue.trim()
                  ? 'bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl scale-100 hover:scale-105 active:scale-95'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
      
          {/* Sugerencias con bordes más redondeados */}
          {!hasMessages && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {['¿Qué servicios ofrecen?', '¿Cuáles son los precios?', '¿Tienen clases o tutoriales?'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInputValue(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
