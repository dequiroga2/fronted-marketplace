import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebase-config";
import { Button } from "../../components/ui/button";
import { Send, Mic, Plus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";


export interface ChatbotConfig{
  id: string;
  name: string;
  route: string;
}

const chatbots: ChatbotConfig[] = [
  { id: "Video", name: "Video avatar", route: "/chatbotvideo" },
  { id: "Carrusel", name: "Post fotos", route: "/chatbotpost" },
];

interface ImageDimension {
  id: 'story' | 'feed' | 'square';
  name: string;
  icon: JSX.Element;
  width: number;
  height: number;
}

const imageDimensions: ImageDimension[] = [
    { id: 'story',  name: 'Story (9:16)', width: 1024, height: 1536, icon: <div className="w-9 h-14 bg-gray-200 rounded-md" /> },
    { id: 'feed',   name: 'Feed (4:5)',  width: 1536, height: 1024, icon: <div className="w-10 h-12 bg-gray-200 rounded-md" /> },
    { id: 'square', name: 'Cuadrado (1:1)', width: 1024, height: 1024, icon: <div className="w-12 h-12 bg-gray-200 rounded-md" /> },
];

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  type: "text" | "image";
}

const API_BASE_URL = "https://backend-marketplace-ia.onrender.com";

export const Chatbot_post = (): JSX.Element => {
  const navigate = useNavigate();
  const [selectedBot, setSelectedBot] = useState<ChatbotConfig>(() => 
    chatbots.find(c => c.route === window.location.pathname) || chatbots[1]
  );

  useEffect(() => {
    if (selectedBot.route && selectedBot.route !== window.location.pathname) {
      navigate(selectedBot.route);
    }
  }, [selectedBot, navigate]);



  const [input, setInput] = useState("");
  const [showBotList, setShowBotList] = useState(false);
  const [animatePanel, setAnimatePanel] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openSectionId, setOpenSectionId] = useState<number | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<ImageDimension | null>(null);
  // Genera un ID de usuario único para esta sesión del navegador.

  const { authToken, isLoading: isAuthLoading } = useAuth(); // Obtén el token del contexto


  useEffect(() => {
    if (!authToken) return;
    // La URL pública de tu servidor de notificaciones desplegado en Render
    const sseUrl = `https://servidor-notificaciones-henko.onrender.com/events?token=${authToken}`;
    
    console.log(`Conectando a SSE en: ${sseUrl}`);
    const eventSource = new EventSource(sseUrl);

    // Esto se ejecuta cada vez que el servidor envía un mensaje
    eventSource.onmessage = (event) => {
      console.log("¡Mensaje recibido del servidor!", event.data);
      const data = JSON.parse(event.data);

      if (data.imageUrl) {
        // Creamos el mensaje de video para mostrarlo en el chat
        const imageMessage: Message = {
          id: Date.now(),
          sender: "bot",
          text: data.imageUrl,
          type: "image",
        };
        // Actualizamos el estado para que el video aparezca en la interfaz
        setMessages((prev) => [...prev, imageMessage]);
      }
    };
    eventSource.onerror = (err) => {
      console.error("Error en la conexión SSE, se cerrará.", err);
      eventSource.close();
    };

    // Esto asegura que la conexión se cierre cuando el usuario abandona la página
    return () => {
      eventSource.close();
    };
  }, [authToken]); // Se ejecuta solo una vez cuando el componente se monta


  const handleSend = async () => {
    if (!input.trim() || isLoading || !auth.currentUser) return;

    const userMessageText = input.trim();
    const newUserMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: userMessageText,
      type: "text"
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/n8n`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Envías el token para que el backend sepa quién eres
      },
      body: JSON.stringify({ 
        message: userMessageText,
        botId: selectedBot.id,
        type: "post",
        width: selectedDimension?.width,
        height: selectedDimension?.height
      }),
    });

      if (!response.ok) {
          throw new Error(`La petición al backend falló: ${response.status}`)
      }

      const rawResponse = await response.text();
      const botText = JSON.parse(rawResponse); 

      // Importante: Solo añadimos el mensaje si la respuesta no está vacía.
      // Si n8n no responde nada, no añadimos un mensaje de bot vacío.
      if (botText) {
          const botMessage: Message = {
              id: Date.now() + 1,
              sender: "bot",
              text: botText,
              // Asumimos que si la respuesta directa es una URL, es un video. 
              // Esto es poco probable en este flujo, pero es una buena salvaguarda.
              type: botText.startsWith("http") ? "image" : "text",
          };
          setMessages((prev) => [...prev, botMessage]);
      }
      
    } catch (error) {
      console.error("Error al conectar con n8n:", error);
      setIsLoading(false);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Hubo un error con el servidor. Por favor intentalo en unos minutos.",
        type: "text",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };


  // Handle animation state on showBotList change
  useEffect(() => {
    if (showBotList) {
      setAnimatePanel(true);
    } else {
      // Delay unmount for animation
      const timeout = setTimeout(() => setAnimatePanel(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [showBotList]);

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-screen bg-gray-50 text-gray-900 flex flex-col items-center px-8 py-6 relative font-sans">
      {/* Toggle button for chatbot list */}
      <div className="w-full mb-4 flex justify-end">
        <button
          onClick={() => setShowBotList(!showBotList)}
          aria-label="Toggle chatbot list"
          className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <div
            className={`transform transition-transform duration-300 ${
              showBotList ? "rotate-180" : "rotate-0"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <span className="font-medium select-none">Chatbots disponibles</span>
        </button>
      </div>

      {/* Chatbot list panel as floating dropdown with animation */}
      {(showBotList || animatePanel) && (
        <div
          className={`absolute top-14 right-8 bg-white rounded-lg shadow-lg p-4 w-64 z-50 transform transition-all duration-300 ease-in-out
            ${showBotList ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg text-gray-900">Chatbots disponibles</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close chatbot list"
              onClick={() => setShowBotList(false)}
            >
              &times;
            </button>
          </div>
          <p className="mb-4 text-sm text-gray-700">
            Estas en el GPT de {selectedBot.name} actualmente
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {chatbots.map((bot) => (
              <Button
                key={bot.id}
                onClick={() => {
                  setSelectedBot(bot);
                  setShowBotList(false);
                  setMessages([]);
                }}
                variant={selectedBot.id === bot.id ? "default" : "outline"}
                className="w-full text-sm"
              >
                {bot.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex w-full flex-1 min-h-0">

        {/* PANEL IZQUIERDO */}
        <div className="w-96 bg-white rounded-lg shadow-md p-4 mr-4 space-y-4 overflow-y-auto">
        {[
            {
            id: 1,
            title: "Elige tu coach",
            items: [
                { label: "Coach 1" },
                { label: "Coach 2" },
                { label: "Coach 3" },
                { label: "Coach 4" },
            ],
            },
            { id: 2, title: "Elige las dimensiones" },
            {
            id: 3,
            title: "Elige tu diseño",
            items: [
                { label: "Design 1" },
                { label: "Design 2" },
                { label: "Design 3" },
                { label: "Design 4" },
            ],
            },
        ].map((section) => (
            <div key={section.id}>
            <button
                className="flex items-center justify-between w-full text-left text-gray-800 font-semibold mb-2 focus:outline-none"
                onClick={() =>
                setOpenSectionId(openSectionId === section.id ? null : section.id)
                }
            >
                <span>{section.title}</span>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transform transition-transform ${
                    openSectionId === section.id ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                />
                </svg>
            </button>

            {openSectionId === section.id && (
                <div className="pl-2 pr-2 pt-2">
                {section.id === 2 ? ( // Renderizado de la nueva sección de Dimensiones
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {imageDimensions.map((dim) => (
                        <button
                          key={dim.id}
                          onClick={() => setSelectedDimension(dim)}
                          className={`flex flex-col items-center justify-center p-2 space-y-2 rounded-lg shadow-sm transition-all ${
                            selectedDimension?.id === dim.id
                              ? 'border-2 border-blue-700 bg-blue-50'
                              : 'border border-gray-200 hover:border-blue-500'
                          }`}
                        >
                          {dim.icon}
                          <span className="text-xs text-center font-medium text-gray-700">{dim.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : ( // Renderizado para Coach y Diseño
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {section.items?.map((item, index) => (
                        <button key={index} className="aspect-square rounded-2xl shadow-sm border border-gray-200">
                          <span className="text-sm font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

            


        {/* PANEL DERECHO */}
        <div className="flex-1 bg-gray-50 rounded-lg shadow-md p-8 flex flex-col w-full min-h-0 max-h-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <p className="text-2xl font-light mb-6 text-center max-w-md">
                Estas en el chatBot de Henko especialista en el area de <span className="font-semibold">{selectedBot.name}</span>.
              </p>
              <p className="text-lg text-gray-600 mb-12">¿Como puedo ayudarte hoy?</p>
              <div className="flex w-full max-w-md space-x-4">
                <input
                  type="text"
                  placeholder="Ask anything"
                  className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                />
                <button
                  onClick={handleSend}
                  className="rounded-full bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 flex items-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 max-h-full">
              <div id="message-container"
                className="flex-1 overflow-y-auto flex flex-col space-y-2 p-4 bg-white rounded shadow-inner min-h-0 max-h-full">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex w-full mb-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                        className={`rounded-lg p-2 max-w-[70%] ${
                            msg.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        >
                        {msg.type === "image" ? (
                            <img 
                              src={msg.text} 
                              alt="Contenido generado" 
                              className="rounded-lg max-w-sm" 
                            />
                        ) : (
                            msg.text
                        )}
                        </div>
                    </div>
                    ))}


                {isLoading && (
                  <div className="flex justify-start w-full mb-2">
                    <div className="bg-gray-200 text-black rounded-lg p-2 max-w-[70%]">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-600 rounded-full animate-bounce" />
                        <div className="h-2 w-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="h-2 w-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}

              </div>
              <div className="flex w-full space-x-4">
                <input
                  type="text"
                  placeholder="Ask anything"
                  className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                />
                <button
                  onClick={handleSend}
                  className="rounded-full bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 flex items-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send</span>
                </button>
                <button
                  aria-label="Voice input"
                  className="rounded-full bg-gray-200 px-4 py-3 text-gray-900 hover:bg-gray-300 flex items-center"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  aria-label="Add options"
                  className="rounded-full bg-gray-200 px-4 py-3 text-gray-900 hover:bg-gray-300 flex items-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
