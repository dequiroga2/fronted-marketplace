import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Menu,
  Settings,
  MoreHorizontal,
  Send,
  Mic,
  Search,
  Plus,
  MessageSquare,
  ChevronDown,
  User as LucideUser,
  Loader2,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  Bot,
  History,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

/**
 * Types (unified)
 */
type ChatMessage = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

type BotDef = {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or text
};

type ChatThread = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
};

/**
 * Data (unified)
 */
const bots: BotDef[] = [
  {
    id: "onboarding",
    name: "OnBoarding EXPANSION",
    description:
      "Asistente que te ayudara en tu camino por nuestra mentoria personalizada para sacar la mejor versión de ti.",
    icon: "/expansion.png",
  },
  {
    id: "general-ai",
    name: "General AI Assistant",
    description: "Asistente general para múltiples tareas y consultas",
    icon: "/expansion.png",
  },
  {
    id: "code-helper",
    name: "Code Helper",
    description: "Especialista en programación y desarrollo de software",
    icon: "/expansion.png",
  },
];
const defaultBot: BotDef = bots[0];

/**
 * Hooks (unified)
 */

const N8N_WEBHOOK_URL = "https://automation.luminotest.com/webhook/485898e8-4536-4a8b-b709-4956378d5e33"; //FASE 2
const useChat = (selectedBotId: string) => {
  const [chats, setChats] = useState<ChatThread[]>([
    {
      id: "temp-chat",
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    },
  ]);
  const [currentChatId, setCurrentChatId] = useState<string>("temp-chat");
  const [isTyping, setIsTyping] = useState(false);

  const currentChat = useMemo(
    () => chats.find((c) => c.id === currentChatId),
    [chats, currentChatId]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        content: content.trim(),
        role: "user",
        timestamp: new Date(),
      };
      
      const currentMessages = chats.find(c => c.id === currentChatId)?.messages || [];

      // Añade el mensaje del usuario a la UI inmediatamente
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, userMessage],
                lastActivity: new Date(),
                title:
                  (chat.title === "New Chat" || chat.title === "Temporary Chat") && chat.messages.length === 0
                    ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
                    : chat.title,
              }
            : chat
        )
      );

      // Muestra el indicador de "escribiendo..."
      setIsTyping(true);

      try {
        // --- INICIO DE LA LÓGICA DEL WEBHOOK ---
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userInput: content,
                chatHistory: currentMessages.map(msg => ({ role: msg.role, content: msg.content })),
                botId: selectedBotId,
            }),
        });

        if (!response.ok) {
            throw new Error(`Webhook response was not ok: ${response.statusText}`);
        }
        const botData = await response.text();
        const match = botData.match(/srcdoc="([^"]*)"/);
        const innerText = match ? match[1] : "";
        console.log("respuesta recibida", innerText);
        
        // n8n debe devolver un JSON con la clave "reply"
        const botResponseContent = innerText || "No he podido procesar tu solicitud.";
        // --- FIN DE LA LÓGICA DEL WEBHOOK ---

        const botMessage: ChatMessage = {
          id: `msg-${Date.now()}-bot`,
          content: botResponseContent,
          role: "assistant",
          timestamp: new Date(),
        };
        
        // Añade la respuesta del bot a la UI
        setChats((prev) =>
            prev.map((chat) =>
              chat.id === currentChatId
                ? {
                    ...chat,
                    messages: [...chat.messages, botMessage],
                    lastActivity: new Date(),
                  }
                : chat
            )
        );

      } catch (error) {
        console.error("Error connecting to the webhook:", error);
        // Opcional: Muestra un mensaje de error en el chat
        const errorMessage: ChatMessage = {
            id: `msg-${Date.now()}-error`,
            content: "Lo siento, tuve un problema para conectarme. Por favor, intenta de nuevo.",
            role: "assistant",
            timestamp: new Date(),
        };
        setChats((prev) =>
            prev.map((chat) =>
              chat.id === currentChatId
                ? { ...chat, messages: [...chat.messages, errorMessage] }
                : chat
            )
        );
      } finally {
        // Oculta el indicador de "escribiendo..."
        setIsTyping(false);
      }
    },
    [currentChatId, chats, selectedBotId] // Asegúrate de que las dependencias estén actualizadas
  );

  const createNewChat = useCallback(() => {
    const newChat: ChatThread = {
      id: `chat-${Date.now()}`,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  }, []);

  const selectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
  }, []);

  const deleteChat = useCallback(
    (chatId: string) => {
      setChats((prev) => {
        const filtered = prev.filter((c) => c.id !== chatId);
        if (currentChatId === chatId && filtered.length > 0) {
          setCurrentChatId(filtered[0].id);
        }
        return filtered;
      });
    },
    [currentChatId]
  );

  return {
    chats,
    currentChat,
    currentChatId,
    isTyping,
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat,
  };
};

/**
 * Components (unified)
 */

// BotSelectorModal - Modern Purple Design
const BotSelectorModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    bots: BotDef[];
    currentBotId: string;
    onSelectBot: (bot: BotDef) => void;
}> = ({ isOpen, onClose, bots, currentBotId, onSelectBot }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in-up" onClick={onClose}>
            <div className="glass-dark rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-cosmic animate-slide-in-left" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-purple-500/20 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-purple rounded-full flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Selecciona tu Especialista</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full text-purple-300 hover:bg-purple-500/20 hover:text-white transition-all duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                    {bots.map((bot) => (
                        <button
                            key={bot.id}
                            onClick={() => {
                                onSelectBot(bot);
                                onClose();
                            }}
                            className={`w-full text-left p-5 rounded-2xl transition-all duration-300 flex items-start space-x-4 border floating-card ${
                                bot.id === currentBotId
                                ? 'bg-gradient-purple/20 border-purple-400 shadow-purple'
                                : 'glass border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10'
                            }`}
                        >
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-violet rounded-xl flex items-center justify-center shadow-violet">
                               {bot.icon.startsWith('/') || bot.icon.startsWith('http') ? (
                                    <img src={bot.icon} alt={bot.name} className="w-full h-full object-contain p-1 rounded-xl" />
                                ) : (
                                    <span className="text-2xl">{bot.icon}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-bold text-white text-lg">{bot.name}</p>
                                    {bot.id === currentBotId && (
                                        <div className="flex items-center space-x-1">
                                            <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                            <span className="text-xs text-purple-300 font-medium">Activo</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-purple-200 leading-relaxed">{bot.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// MessageBubble - Modern Purple Design
const MessageBubble: React.FC<{ message: ChatMessage; botIcon: string }> = ({ message, botIcon }) => {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-start space-x-4 mb-6 animate-fade-in-up ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-purple rounded-full flex items-center justify-center overflow-hidden shadow-purple animate-bounce-gentle">
            {botIcon.startsWith('/') || botIcon.startsWith('http') ? (
              <img src={botIcon} alt="Bot Icon" className="w-full h-full object-contain p-1" />
            ) : (
              <span className="text-lg">{botIcon}</span>
            )}
          </div>
        </div>
      )}
      <div
        className={`max-w-[80%] p-5 rounded-3xl shadow-lg transition-all duration-300 floating-card ${
          isUser 
            ? "bg-gradient-purple text-white ml-auto shadow-purple" 
            : "glass-dark text-white border border-purple-500/20"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <div className={`text-xs mt-3 opacity-70 flex items-center space-x-1 ${
          isUser ? "text-purple-100" : "text-purple-300"
        }`}>
          <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {isUser && <Zap className="w-3 h-3" />}
        </div>
      </div>
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-violet rounded-full flex items-center justify-center shadow-violet">
            <LucideUser className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};


// InputArea - Modern Purple Design with floating effect, no dark box
const InputArea: React.FC<{
  onSendMessage: (m: string) => void;
  disabled?: boolean;
  placeholder?: string;
  placement?: "hero" | "footer";
  sidebarOpen?: boolean;
  onHeightChange?: (h: number) => void; // 👈 NUEVO
}> = ({
  onSendMessage,
  disabled = false,
  placeholder = "How can I help you today?",
  placement = "footer",
  sidebarOpen = false,
  onHeightChange,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null); // 👈 contenedor FIXED

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // 👉 Observa cambios de tamaño y reporta altura (solo cuando es footer)
  useEffect(() => {
    if (placement !== "footer" || !wrapperRef.current) return;
    const el = wrapperRef.current;
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight;     // altura visual de la barra
      const gap = 24;                // bottom gap por el "bottom-6" (1.5rem ≈ 24px)
      onHeightChange?.(h + gap);     // reporta altura + separación inferior
    });
    ro.observe(el);
    // reporta una vez de entrada
    onHeightChange?.(el.offsetHeight + 24);
    return () => ro.disconnect();
  }, [placement, onHeightChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const containerClasses =
    placement === "footer"
      ? "fixed bottom-6 left-0 right-0 z-50 px-6"
      : "w-full max-w-3xl mx-auto p-4";

  return (
    <div
      ref={wrapperRef} // 👈 importante
      className={containerClasses}
      style={{ paddingLeft: placement === "footer" && sidebarOpen ? "20rem" : undefined }}
    >
      <div className="mx-auto max-w-3xl rounded-3xl shadow-[0_12px_50px_rgba(0,0,0,0.45)]">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative w-full">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full bg-transparent border border-purple-500/50 rounded-3xl pl-6 pr-20 py-4 text-white placeholder-purple-300 resize-none focus:outline-none focus:border-purple-400 transition-all duration-300 min-h-[56px] max-h-32 [&::-webkit-scrollbar]:hidden"
              rows={1}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-3">
              <button
                type="submit"
                disabled={!message.trim() || disabled}
                className="p-3 rounded-2xl hover:bg-purple-500/10 transition-[background] duration-150 focus:outline-none focus:ring-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};




// Sidebar
type ChatMinimal = ChatThread;
const formatDate = (date: Date) => {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};
// Sidebar - Modern Purple Design with Bot Selector
const Sidebar: React.FC<{
  isOpen: boolean;
  chats: ChatMinimal[];
  currentChatId: string;
  selectedBot: BotDef;
  onChatSelect: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onOpenBotSelector?: () => void;
  userEmail?: string;
  onLogout?: () => void;
}> = ({ isOpen, chats, currentChatId, selectedBot, onChatSelect, onNewChat, onDeleteChat, onOpenBotSelector, userEmail, onLogout }) => {
  const grouped = chats.reduce((acc: Record<string, ChatMinimal[]>, chat) => {
    const key = formatDate(chat.lastActivity);
    acc[key] = acc[key] || [];
    acc[key].push(chat);
    return acc;
  }, {});
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-[#1a1a1a] border-r border-gray-700 z-50 transition-all duration-300 ease-in-out ${
        isOpen ? "w-80" : "w-0 overflow-hidden"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onOpenBotSelector}
              className="flex items-center space-x-2 flex-1 p-2 rounded-xl hover:bg-purple-500/10 transition-all duration-200 group"
            >
              <div className="w-8 h-8 bg-gradient-purple rounded-full flex items-center justify-center shadow-purple">
                {selectedBot.icon.startsWith('/') || selectedBot.icon.startsWith('http') ? (
                  <img src={selectedBot.icon} alt="Bot Icon" className="w-full h-full object-contain p-1 rounded-full" />
                ) : (
                  <span className="text-lg">{selectedBot.icon}</span>
                )}
              </div>
              <span className="text-white font-medium truncate">{selectedBot.name}</span>
              <ChevronDown className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={onNewChat}
              className="p-2 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all duration-200 floating-card"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              className="w-full glass-dark border border-purple-500/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:shadow-purple transition-all duration-300"
            />
          </div>
        </div>
        
        {/* Chat History Section */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-purple-900/5">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <History className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-purple-200 uppercase tracking-wider">Historial de Chat</h3>
            </div>
          </div>
          {Object.entries(grouped).map(([group, groupChats]) => (
            <div key={group} className="px-4 pb-4">
              <h4 className="text-xs text-purple-300 uppercase tracking-wider mb-3 font-medium flex items-center space-x-2">
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                <span>{group}</span>
              </h4>
              <div className="space-y-2">
                {groupChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onChatSelect(chat.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 group floating-card ${
                      currentChatId === chat.id 
                        ? "bg-gradient-purple/20 border border-purple-400 text-white shadow-purple" 
                        : "glass-dark border border-purple-500/20 text-purple-100 hover:border-purple-400 hover:bg-purple-500/10"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        currentChatId === chat.id ? "bg-purple-400" : "bg-purple-500/30"
                      }`}>
                        <MessageSquare className="w-3 h-3 flex-shrink-0" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold">{chat.title}</p>
                        {chat.messages.length > 0 && (
                          <p className="truncate text-xs opacity-70 mt-1">
                            {chat.messages[chat.messages.length - 1].content}
                          </p>
                        )}
                      </div>
                      {currentChatId === chat.id && (
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-glow-pulse"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* User Profile Section */}
        <div className="p-4 border-t border-purple-500/20 bg-gradient-to-r from-purple-900/10 to-transparent">
          <div className="flex items-center justify-between space-x-3 group">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 bg-gradient-violet rounded-full flex items-center justify-center flex-shrink-0 shadow-violet">
                <span className="text-white font-bold">
                  {userEmail ? userEmail[0].toUpperCase() : <LucideUser className="w-5 h-5" />}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{userEmail || "Usuario"}</p>
                <p className="text-xs text-purple-300">Conectado</p>
              </div>
            </div>
            {onLogout && (
              <button 
                onClick={onLogout} 
                className="p-2 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 floating-card"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Header - Transparent and Larger Logo
const HeaderBar: React.FC<{
  selectedBot: BotDef;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  userEmail?: string;
  onLogout?: () => void;
  onOpenBotSelector?: () => void;
}> = ({ selectedBot, onToggleSidebar, sidebarOpen, userEmail, onLogout, onOpenBotSelector }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  const initial = userEmail ? userEmail[0].toUpperCase() : "U";

  return (
    <header
      className={`bg-transparent border-b border-purple-700/30 p-4 flex items-center justify-between transition-all duration-300 ease-in-out ${
        sidebarOpen ? "ml-80" : "ml-0"
      }`}
    >
      <div className="flex items-center space-x-6">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-purple-300 hover:text-white hover:bg-purple-600/20 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-3">
          {selectedBot.icon.startsWith('/') || selectedBot.icon.startsWith('http') ? (
            <img src={selectedBot.icon} alt="Bot Icon" className="w-10 h-10 rounded-full object-contain" />
          ) : (
            <span className="text-2xl">{selectedBot.icon}</span>
          )}
          <span className="text-white font-semibold text-lg">{selectedBot.name}</span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button className="p-2 text-purple-300 hover:text-white hover:bg-purple-600/20 rounded-lg transition-colors">
          <Settings className="w-6 h-6" />
        </button>
        <button className="p-2 text-purple-300 hover:text-white hover:bg-purple-600/20 rounded-lg transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
        <div className="relative ml-2" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center space-x-2 p-2 text-purple-300 hover:text-white hover:bg-purple-600/20 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 bg-gradient-purple rounded-full flex items-center justify-center shadow-purple">
              <span className="text-white text-sm font-medium">{initial}</span>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] border border-purple-700/30 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-purple-700/30">
                <p className="text-xs text-purple-400">Conectado como</p>
                <p className="text-sm text-white truncate">{userEmail || "Usuario"}</p>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout && onLogout();
                }}
                className="w-full text-left px-4 py-3 text-purple-300 hover:bg-purple-700/20"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// ChatInterface - Adjusted margins and floating input area with input between logo and description, no dark box
const ChatInterface: React.FC<{
  messages: ChatMessage[];
  isTyping: boolean;
  selectedBot: BotDef;
  onSendMessage: (msg: string) => void;
  sidebarOpen: boolean;
}> = ({ messages, isTyping, selectedBot, onSendMessage, sidebarOpen }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const [bottomPad, setBottomPad] = useState<number>(120); // valor por defecto

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Fade superior */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 z-10 bg-gradient-to-b from-[#0f0f23] to-transparent" />

      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <div className="h-full flex flex-col justify-center items-center p-8">
            <div className="max-w-2xl text-center">
              <div className="mb-20">
                {selectedBot.icon.startsWith('/') || selectedBot.icon.startsWith('http') ? (
                  <img src={selectedBot.icon} alt="Bot Icon" className="w-48 h-48 rounded-full mx-auto object-contain p-2" />
                ) : (
                  <span className="text-7xl">{selectedBot.icon}</span>
                )}
              </div>
              <div className="mb-10">
                <InputArea
                  onSendMessage={onSendMessage}
                  disabled={isTyping}
                  placeholder="How can I help you today?"
                  placement="hero"
                  sidebarOpen={sidebarOpen}
                  // no hace falta onHeightChange en hero
                />
              </div>
              <h1 className="text-4xl font-semibold text-white mt-40 mb-10">{selectedBot.name}</h1>
              <p className="text-gray-300 text-lg leading-relaxed mt-28">{selectedBot.description}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Usa paddingBottom dinámico para no tapar mensajes */}
            <div className="p-6" style={{ paddingBottom: bottomPad }}>
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} botIcon={selectedBot.icon} />
              ))}
              {isTyping && (
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-purple rounded-full flex items-center justify-center shadow-purple animate-bounce-gentle">
                      <span className="text-lg">{selectedBot.icon}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl glass-dark shadow-purple backdrop-blur-md">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                      <span className="text-purple-300 text-sm">Escribiendo...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <InputArea
              onSendMessage={onSendMessage}
              disabled={isTyping}
              placeholder="Escribe tu mensaje…"
              placement="footer"
              sidebarOpen={sidebarOpen}
              onHeightChange={setBottomPad} // 👈 clave
            />
          </>
        )}
      </div>
    </div>
  );
};



/**
 * Page component - Modern Purple Design with Functional Bot Selection
 */
export const ChatbotOnboarding: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedBot, setSelectedBot] = useState<BotDef>(defaultBot);
  const [botSelectorOpen, setBotSelectorOpen] = useState(false);
  const { chats, currentChat, currentChatId, isTyping, sendMessage, createNewChat, selectChat, deleteChat } =
    useChat(selectedBot.id);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      console.log("Sesión cerrada exitosamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleBotSelect = (bot: BotDef) => {
    setSelectedBot(bot);
    // Create a new chat when switching bots
    createNewChat();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] text-white flex flex-col overflow-hidden">
      <HeaderBar
        selectedBot={selectedBot}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
        userEmail={user?.email || ""}
        onLogout={handleLogout}
        onOpenBotSelector={() => setBotSelectorOpen(true)}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          chats={chats}
          currentChatId={currentChatId}
          selectedBot={selectedBot}
          onChatSelect={selectChat}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
          onOpenBotSelector={() => setBotSelectorOpen(true)}
          userEmail={user?.email || ""}
          onLogout={handleLogout}
        />
        <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? "ml-80" : "ml-0"}`}>
          <ChatInterface
            messages={currentChat?.messages || []}
            isTyping={isTyping}
            selectedBot={selectedBot}
            onSendMessage={sendMessage}
            sidebarOpen={sidebarOpen}
          />
        </main>
      </div>
      
      <BotSelectorModal
        isOpen={botSelectorOpen}
        onClose={() => setBotSelectorOpen(false)}
        bots={bots}
        currentBotId={selectedBot.id}
        onSelectBot={handleBotSelect}
      />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default ChatbotOnboarding;