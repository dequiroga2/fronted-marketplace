import React from 'react';
import { User, Sparkles } from 'lucide-react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (message.role === 'user') {
    return (
      <div className="flex justify-end items-start gap-3 group">
        <div className="flex flex-col items-end max-w-2xl">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white px-6 py-4 rounded-2xl rounded-br-sm shadow-lg">
            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 group">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
        <Sparkles size={16} className="text-white" />
      </div>
      <div className="flex flex-col max-w-2xl">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-4 rounded-2xl rounded-bl-sm shadow-lg">
          <p className="text-sm md:text-base leading-relaxed text-gray-900 dark:text-white whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};