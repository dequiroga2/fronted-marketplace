/*  */import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase-config';
import { collection, doc, getDocs, setDoc, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore"; 
import { useAuth } from '../../contexts/AuthContext';
import { Sidebar } from '../ChatbotOnboarding/Sidebar';
import { ChatAreaGeneric } from './ChatAreaGeneric';
import { Header } from '../ChatbotOnboarding/Header';
import { Message, ChatSession, User } from '../../types';
import type { BotConfig } from './types';

interface LayoutGenericProps {
    botConfig: BotConfig;
}

export const LayoutGeneric: React.FC<LayoutGenericProps> = ({ botConfig }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const [messages, setMessages] = useState<Message[]>([]);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const currentUser: User = useMemo(() => ({
        name: user?.displayName || user?.email?.split('@')[0] || 'Usuario',
        email: user?.email || 'usuario@ejemplo.com'
    }), [user]);

    // Carga las sesiones desde Firestore cuando el usuario se autentica
    // Usa una colección específica para cada bot basada en botConfig.id
    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        
        const fetchChatSessions = async () => {
            try {
                setIsLoading(true);
                // Usa una colección específica para este bot
                const sessionsCollectionRef = collection(db, 'users', user.uid, `chatSessions_${botConfig.id}`);
                const q = query(sessionsCollectionRef, orderBy('timestamp', 'desc'));
                const querySnapshot = await getDocs(q);
                
                const sessions: ChatSession[] = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const loadedMessages = (data.messages || []).map((msg: any) => ({
                        ...msg,
                        timestamp: msg.timestamp instanceof Timestamp 
                            ? msg.timestamp.toDate() 
                            : new Date(msg.timestamp)
                    }));
                    
                    return {
                        id: doc.id,
                        title: data.title || 'Nueva Conversación',
                        lastMessage: data.lastMessage || '',
                        timestamp: data.timestamp instanceof Timestamp 
                            ? data.timestamp.toDate() 
                            : new Date(data.timestamp || Date.now()),
                        messages: loadedMessages,
                    };
                });
                
                setChatSessions(sessions);
                console.log(`[${botConfig.name}] Cargadas ${sessions.length} sesiones de chat`);
            } catch (error) {
                console.error(`[${botConfig.name}] Error al cargar las sesiones:`, error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchChatSessions();
    }, [user, botConfig.id, botConfig.name]);

    // Función mejorada para guardar la sesión en Firestore
    const saveSessionToFirestore = async (session: ChatSession) => {
        if (!user) {
            console.error('No hay usuario autenticado');
            return;
        }
        
        try {
            // Usa una colección específica para este bot
            const sessionDocRef = doc(db, 'users', user.uid, `chatSessions_${botConfig.id}`, session.id);
            
            const sessionData = {
                title: session.title,
                lastMessage: session.lastMessage,
                timestamp: serverTimestamp(),
                messages: session.messages.map(msg => ({
                    id: msg.id,
                    content: msg.content,
                    role: msg.role,
                    timestamp: msg.timestamp instanceof Date ? Timestamp.fromDate(msg.timestamp) : msg.timestamp
                }))
            };
            
            await setDoc(sessionDocRef, sessionData);
            console.log(`[${botConfig.name}] Sesión ${session.id} guardada exitosamente`);
        } catch (error) {
            console.error(`[${botConfig.name}] Error al guardar la sesión:`, error);
        }
    };

    // Función centralizada para actualizar y guardar una sesión
    const updateAndSaveSession = useCallback(async (newMessages: Message[], chatId: string) => {
        if (!chatId || !user) {
            console.error('No se puede guardar: falta chatId o usuario');
            return;
        }

        setChatSessions(prevSessions => {
            const sessionIndex = prevSessions.findIndex(s => s.id === chatId);
            
            if (sessionIndex === -1) {
                console.error(`Sesión ${chatId} no encontrada`);
                return prevSessions;
            }
            
            const updatedSession: ChatSession = {
                ...prevSessions[sessionIndex],
                messages: newMessages,
                lastMessage: newMessages.length > 0 ? newMessages[newMessages.length - 1].content : '',
                timestamp: new Date(),
                title: prevSessions[sessionIndex].title === 'Nueva Conversación' && newMessages.length > 0
                    ? newMessages[0].content.slice(0, 50) + (newMessages[0].content.length > 50 ? '...' : '')
                    : prevSessions[sessionIndex].title,
            };
            
            saveSessionToFirestore(updatedSession);
            
            const updatedSessions = [...prevSessions];
            updatedSessions[sessionIndex] = updatedSession;
            
            return [
                updatedSessions[sessionIndex],
                ...updatedSessions.filter((_, i) => i !== sessionIndex)
            ];
        });
    }, [user, botConfig]);

    // Función para crear una nueva sesión de chat
    const createNewChatSession = useCallback(async () => {
        if (!user) return null;
        
        const newId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newSession: ChatSession = {
            id: newId,
            title: 'Nueva Conversación',
            lastMessage: '',
            timestamp: new Date(),
            messages: []
        };
        
        setChatSessions(prev => [newSession, ...prev]);
        await saveSessionToFirestore(newSession);
        
        return newId;
    }, [user, botConfig]);

    // Función principal para manejar el envío de un mensaje
    const handleSendMessage = async (content: string) => {
        if (!user) {
            console.error('Usuario no autenticado');
            return;
        }
        
        let currentChatId = activeChatId;

        if (!currentChatId) {
            currentChatId = await createNewChatSession();
            if (!currentChatId) {
                console.error('No se pudo crear una nueva sesión');
                return;
            }
            setActiveChatId(currentChatId);
            setMessages([]);
        }

        const userMessage: Message = {
            id: `msg-${Date.now()}-user`,
            content: content.trim(),
            role: 'user',
            timestamp: new Date(),
        };

        const newMessagesWithUser = [...messages, userMessage];
        setMessages(newMessagesWithUser);
        setIsTyping(true);

        try {
            const response = await fetch(botConfig.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userInput: content,
                    chatHistory: newMessagesWithUser.map(msg => ({ 
                        role: msg.role, 
                        content: msg.content 
                    })),
                    botId: botConfig.id,
                }),
            });

            if (!response.ok) {
                throw new Error(`Webhook response was not ok: ${response.status}`);
            }

            const botData = await response.text();
            const match = botData.match(/srcdoc="([^"]*)"/);
            const innerText = match ? match[1] : (botData || "No he podido procesar tu solicitud.");

            const botMessage: Message = {
                id: `msg-${Date.now()}-bot`,
                content: innerText,
                role: 'assistant',
                timestamp: new Date(),
            };
            
            const finalMessages = [...newMessagesWithUser, botMessage];
            setMessages(finalMessages);
            await updateAndSaveSession(finalMessages, currentChatId);

        } catch (error) {
            console.error(`[${botConfig.name}] Error en el webhook:`, error);
            
            const errorMessage: Message = {
                id: `msg-${Date.now()}-error`,
                content: "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta de nuevo.",
                role: 'assistant',
                timestamp: new Date(),
            };
            
            const finalMessages = [...newMessagesWithUser, errorMessage];
            setMessages(finalMessages);
            await updateAndSaveSession(finalMessages, currentChatId);
        } finally {
            setIsTyping(false);
        }
    };

    const loadChat = useCallback((sessionId: string) => {
        if (sessionId === activeChatId) return;
        
        const session = chatSessions.find(s => s.id === sessionId);
        if (session) {
            setActiveChatId(sessionId);
            setMessages(session.messages || []);
            console.log(`[${botConfig.name}] Cargando chat ${sessionId} con ${session.messages?.length || 0} mensajes`);
        } else {
            console.error(`Sesión ${sessionId} no encontrada`);
        }
    }, [chatSessions, activeChatId, botConfig.name]);
    
    const startNewChat = useCallback(() => {
        setActiveChatId(null);
        setMessages([]);
        console.log(`[${botConfig.name}] Iniciando nuevo chat`);
    }, [botConfig.name]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    if (isLoading && user) {
        return (
            <div className={`h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Cargando conversaciones de {botConfig.name}...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-screen flex overflow-hidden ${theme === 'dark' ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
            <Sidebar 
                chatSessions={chatSessions}
                user={currentUser}
                onNewChat={startNewChat}
                onLoadChat={loadChat}
                activeChatId={activeChatId}
                onCollapse={() => setSidebarCollapsed(true)}
                collapsed={sidebarCollapsed}
                onLogout={handleLogout}
            />
            
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'ml-0' : 'ml-80'}`}>
                <Header 
                    theme={theme} 
                    onToggleTheme={toggleTheme} 
                    user={currentUser}
                    hasMessages={messages.length > 0}
                    sidebarCollapsed={sidebarCollapsed}
                    onExpandSidebar={() => setSidebarCollapsed(false)}
                    onLogout={handleLogout}
                />
                
                <main className="flex-1 overflow-hidden">
                    <ChatAreaGeneric 
                        messages={messages} 
                        onSendMessage={handleSendMessage}
                        isTyping={isTyping}
                        hasMessages={messages.length > 0 || activeChatId !== null}
                        botConfig={botConfig}
                        cards={botConfig.cards}
                    />
                </main>
            </div>
            
            {!sidebarCollapsed && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
                    onClick={() => setSidebarCollapsed(true)} 
                />
            )}
        </div>
    );
};
