import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Message } from '../../types';
import { MessageBubble } from '../ChatbotOnboarding/MessageBubble';
import { TypingIndicator } from '../ChatbotOnboarding/TypingIndicator';
import { LogoSectionGeneric } from './LogoSectionGeneric';
import type { BotConfig } from './types';

interface ChatAreaGenericProps {
    messages: Message[];
    onSendMessage: (content: string) => void;
    isTyping: boolean;
    hasMessages: boolean;
    botConfig: BotConfig;
    cards?: Array<{
        icon: React.ReactNode;
        title: string;
        description: string;
    }>;
}

export const ChatAreaGeneric: React.FC<ChatAreaGenericProps> = ({ 
    messages, 
    onSendMessage, 
    isTyping,
    hasMessages,
    botConfig,
    cards
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
            onSendMessage(inputValue.trim());
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
        <div className="h-full relative">
            
            {/* Capa de Fondo */}
            <div 
                className="absolute inset-0 bg-center bg-cover bg-no-repeat z-0"
                style={{ backgroundImage: `url('${botConfig.icon}')` }}
            >
                <div className="absolute inset-0 bg-white dark:bg-gray-900 opacity-50 dark:opacity-80"></div>
            </div>

            {/* Capa de Contenido */}
            <div className="relative z-10 h-full grid grid-rows-[1fr_auto] overflow-hidden">
                <div className="min-h-0 overflow-y-auto overscroll-contain px-6 py-6">
                    {!hasMessages ? (
                        <LogoSectionGeneric botConfig={botConfig} cards={cards} />
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

                <div className="px-6 pt-3 pb-[env(safe-area-inset-bottom,0px)] bg-transparent">
                    <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
                        <div
                            className={`relative bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl border transition-all duration-200 ${
                                isFocused
                                    ? 'border-purple-300 dark:border-purple-600 shadow-2xl shadow-purple-500/10'
                                    : 'border-gray-200 dark:border-gray-700 hover:shadow-lg'
                            }`}
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="Escribe tu pregunta..."
                                className="w-full px-6 py-4 pr-16 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg rounded-2xl"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                    inputValue.trim()
                                        ? 'bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    
                        {!hasMessages && (
                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                {/* Sugerencias opcionales */}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};
