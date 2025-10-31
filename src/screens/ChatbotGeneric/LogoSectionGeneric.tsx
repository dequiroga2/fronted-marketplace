import React from 'react';
import { Sparkles, MessageSquare, Users, Zap } from 'lucide-react';
import type { BotConfig } from './types';

interface LogoSectionGenericProps {
  botConfig: BotConfig;
  cards?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

export const LogoSectionGeneric: React.FC<LogoSectionGenericProps> = ({ 
  botConfig,
  cards 
}) => {
  // Cards por defecto si no se proporcionan
  const defaultCards = [
    {
      icon: <MessageSquare size={16} className="text-white" />,
      title: "Servicios",
      description: "Descubre todas nuestras funcionalidades"
    },
    {
      icon: <Zap size={16} className="text-white" />,
      title: "Precios",
      description: "Planes flexibles para todas las necesidades"
    },
    {
      icon: <Users size={16} className="text-white" />,
      title: "Soporte",
      description: "Recursos y ayuda personalizada"
    }
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center px-6">
      <div className="max-w-xl mx-auto">
        {/* Logo Principal */}
        <div className="mb-4 relative">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25 mb-4">
            <img 
              src={botConfig.logo}
              alt={botConfig.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          
          {/* Elementos decorativos flotantes */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center opacity-80 animate-pulse">
            <MessageSquare size={12} className="text-white" />
          </div>
          <div className="absolute -bottom-1 -left-4 w-5 h-5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center opacity-60 animate-bounce delay-300">
            <Users size={10} className="text-white" />
          </div>
          <div className="absolute top-6 -left-6 w-3 h-3 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full opacity-50 animate-ping"></div>
        </div>

        {/* Título y descripción */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
          {botConfig.welcomeTitle}
        </h1>
        
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {botConfig.description}
        </p>

        {/* Cards de características */}
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          {displayCards.map((card, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                {card.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">{card.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">{card.description}</p>
            </div>
          ))}
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-xs">
          💡 <strong>Tip:</strong> Puedes preguntarme sobre precios, servicios incluidos, tutoriales y más
        </p>
      </div>
    </div>
  );
};
