import React from 'react';
import { MessageSquare, Plus, Settings, LogOut, User, Clock, ChevronLeft } from 'lucide-react';
import { ChatSession, User as UserType } from '../../types';

interface SidebarProps {
  chatSessions: ChatSession[];
  user: UserType;
  onNewChat: () => void;
  onLoadChat: (sessionId: string) => void;
  activeChatId: string | null;
  onCollapse: () => void;
  collapsed: boolean;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  chatSessions, 
  user, 
  onNewChat, 
  onLoadChat, 
  activeChatId,
  onCollapse,
  collapsed,
  onLogout
}) => {
  const getUserInitial = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `${days} días`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-2xl transition-all duration-500 ease-in-out z-50 ${
      collapsed ? 'w-0 -translate-x-full opacity-0 pointer-events-none' : 'w-80 translate-x-0 opacity-100'
    }`}>
      {/* Header del Sidebar */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat</h2>
          <button
            onClick={onCollapse}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <ChevronLeft size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={20} />
          Nueva Conversación
        </button>
      </div>

      {/* Lista de Chats */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-3 mb-3 flex items-center gap-2">
            <Clock size={16} />
            Historial de Chats
          </h3>
          
          {chatSessions.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No hay conversaciones aún
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Inicia una nueva conversación arriba
              </p>
            </div>
          ) : (
            chatSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onLoadChat(session.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                  activeChatId === session.id 
                    ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800' 
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <MessageSquare size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {session.title}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs truncate mt-1">
                      {session.lastMessage}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                      {formatDate(session.timestamp)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {getUserInitial(user.email)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              {user.name}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
              {user.email}
            </p>
          </div>
        </div>
        
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-all duration-300 text-sm">
            <Settings size={16} />
            Configuración
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-all duration-300 text-sm"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};