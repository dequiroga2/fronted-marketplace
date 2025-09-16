import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase-config';
import { collection, doc, getDocs, setDoc, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore"; 
import { useAuth } from '../../contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { Header } from './Header';
import { Message, ChatSession, User } from '../../types';

const N8N_WEBHOOK_URL = "https://automation.luminotest.com/webhook/5c1af535-f331-4966-91fd-0ba082876f37";

export const Layout: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Cambiado el tema predeterminado a 'light'
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
    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        
        const fetchChatSessions = async () => {
            try {
                setIsLoading(true);
                const sessionsCollectionRef = collection(db, 'users', user.uid, 'chatSessions');
                const q = query(sessionsCollectionRef, orderBy('timestamp', 'desc'));
                const querySnapshot = await getDocs(q);
                
                const sessions: ChatSession[] = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Maneja tanto Timestamps de Firestore como fechas normales
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
                console.log(`Cargadas ${sessions.length} sesiones de chat`);
            } catch (error) {
                console.error('Error al cargar las sesiones:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchChatSessions();
    }, [user]);

    // Función mejorada para guardar la sesión en Firestore
    const saveSessionToFirestore = async (session: ChatSession) => {
        if (!user) {
            console.error('No hay usuario autenticado');
            return;
        }
        
        try {
            const sessionDocRef = doc(db, 'users', user.uid, 'chatSessions', session.id);
            
            // Preparar los datos para Firestore
            const sessionData = {
                title: session.title,
                lastMessage: session.lastMessage,
                timestamp: serverTimestamp(), // Usa serverTimestamp para mejor sincronización
                messages: session.messages.map(msg => ({
                    id: msg.id,
                    content: msg.content,
                    role: msg.role,
                    timestamp: msg.timestamp instanceof Date ? Timestamp.fromDate(msg.timestamp) : msg.timestamp
                }))
            };
            
            await setDoc(sessionDocRef, sessionData);
            console.log(`Sesión ${session.id} guardada exitosamente`);
        } catch (error) {
            console.error('Error al guardar la sesión:', error);
        }
    };

    // Función centralizada para actualizar y guardar una sesión
    const updateAndSaveSession = useCallback(async (newMessages: Message[], chatId: string) => {
        if (!chatId || !user) {
            console.error('No se puede guardar: falta chatId o usuario');
            return;
        }

        // Actualiza el estado local inmediatamente
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
            
            // Guarda en Firestore de forma asíncrona
            saveSessionToFirestore(updatedSession);
            
            // Actualiza el array de sesiones con la sesión modificada
            const updatedSessions = [...prevSessions];
            updatedSessions[sessionIndex] = updatedSession;
            
            // Reordena para poner la sesión actualizada al principio
            return [
                updatedSessions[sessionIndex],
                ...updatedSessions.filter((_, i) => i !== sessionIndex)
            ];
        });
    }, [user]);

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
        
        // Añade la nueva sesión al estado local
        setChatSessions(prev => [newSession, ...prev]);
        
        // Guarda la nueva sesión en Firestore
        await saveSessionToFirestore(newSession);
        
        return newId;
    }, [user]);

    // Función principal para manejar el envío de un mensaje
    const handleSendMessage = async (content: string) => {
        if (!user) {
            console.error('Usuario no autenticado');
            return;
        }
        
        let currentChatId = activeChatId;

        // Si no hay chat activo, crea uno nuevo
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

        // Actualiza el estado de los mensajes con la pregunta del usuario
        const newMessagesWithUser = [...messages, userMessage];
        setMessages(newMessagesWithUser);
        setIsTyping(true);

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userInput: content,
                    chatHistory: newMessagesWithUser.map(msg => ({ 
                        role: msg.role, 
                        content: msg.content 
                    })),
                    botId: 'onboarding',
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
            
            // Actualiza el estado con la respuesta del bot
            const finalMessages = [...newMessagesWithUser, botMessage];
            setMessages(finalMessages);
            
            // Guarda la conversación completa
            await updateAndSaveSession(finalMessages, currentChatId);

        } catch (error) {
            console.error("Error en el webhook:", error);
            
            // Añade un mensaje de error al chat
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

    // Carga los mensajes de una sesión existente
    const loadChat = useCallback((sessionId: string) => {
        if (sessionId === activeChatId) return;
        
        const session = chatSessions.find(s => s.id === sessionId);
        if (session) {
            setActiveChatId(sessionId);
            setMessages(session.messages || []);
            console.log(`Cargando chat ${sessionId} con ${session.messages?.length || 0} mensajes`);
        } else {
            console.error(`Sesión ${sessionId} no encontrada`);
        }
    }, [chatSessions, activeChatId]);
    
    // Limpia la pantalla para una nueva conversación
    const startNewChat = useCallback(() => {
        setActiveChatId(null);
        setMessages([]);
        console.log('Iniciando nuevo chat');
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Muestra un indicador de carga mientras se cargan las sesiones
    if (isLoading && user) {
        return (
            <div className={`h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Cargando conversaciones...
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
                    <ChatArea 
                        messages={messages} 
                        onSendMessage={handleSendMessage}
                        isTyping={isTyping}
                        hasMessages={messages.length > 0 || activeChatId !== null}
                    />
                </main>
            </div>
            
            {/* Overlay para cerrar sidebar en móvil */}
            {!sidebarCollapsed && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
                    onClick={() => setSidebarCollapsed(true)} 
                />
            )}
        </div>
    );
};