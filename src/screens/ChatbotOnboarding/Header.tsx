import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Sparkles, Menu, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  user: User;
  hasMessages: boolean;
  sidebarCollapsed: boolean;
  onExpandSidebar: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  theme, 
  onToggleTheme, 
  user, 
  hasMessages, 
  sidebarCollapsed, 
  onExpandSidebar,
  onLogout
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getUserInitial = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <div className="bg-transparent backdrop-blur-md border-b border-gray-200/20 dark:border-transparent px-6 py-4 flex items-center justify-between relative z-40">
      <div className="flex items-center gap-3">
        {sidebarCollapsed && (
          <button
            onClick={onExpandSidebar}
            className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300"
          >
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        )}
        {hasMessages && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <img 
                    src="/public/logo_mph.jpg" // Cambia esta ruta si tu logo está en otro lugar (ej. /images/logo.jpg)
                    alt="Logo de la marca" 
                    className="w-full h-full object-cover rounded-lg" // Asegura que el logo se ajuste y cubra el contenedor
                />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Asistente de Onboarding
            </h1>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button with Floating Shadow */}
        <button
          onClick={onToggleTheme}
          className="relative w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all duration-300 group shadow-lg hover:shadow-xl"
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {theme === 'light' ? (
            <Moon size={18} className="text-gray-600 dark:text-gray-300 relative z-10" />
          ) : (
            <Sun size={18} className="text-gray-600 dark:text-gray-300 relative z-10" />
          )}
        </button>

        {/* User Menu with Floating Shadow */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl"
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm">
                {getUserInitial(user.email)}
              </span>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
                userMenuOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {/* Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {getUserInitial(user.email)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
