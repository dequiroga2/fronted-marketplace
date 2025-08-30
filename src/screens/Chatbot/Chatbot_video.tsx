import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebase-config";
import { Button } from "../../components/ui/button";
import { Send, Mic, Plus, Play, Pause } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface Avatar {
  avatar_id: string;
  avatar_name: string;
  gender: string;
  preview_image_url: string;
  preview_video_url: string;
  premium: boolean;
}

interface Voice {
  voice_id: string;
  language: string;
  gender: string;
  name: string;
  preview_audio: string;
  support_pause: boolean;
  emotion_support: boolean;
  support_interactive_avatar: boolean;
  support_locale: boolean;
}

interface Dimension {
    id: 'youtube' | 'instagram' | 'tiktok' | 'square';
    name: string;
    icon: JSX.Element;
    width: number;
    height: number;
}

export interface ChatbotConfig{
  id: string;
  name: string;
  route: string;
}

const chatbots: ChatbotConfig[] = [
  { id: "Video", name: "Video avatar", route: "/chatbotvideo" },
  { id: "Carrusel", name: "Post fotos", route: "/chatbotpost" },
];

const dimensions: Dimension[] = [
    { id: 'youtube',   name: 'YouTube',   width: 1920, height: 1080, icon: <div className="w-14 h-9 bg-gray-200 rounded-md" /> },
    { id: 'instagram', name: 'Instagram', width: 1080, height: 1920, icon: <div className="w-9 h-14 bg-gray-200 rounded-md" /> },
    { id: 'square',    name: 'Cuadrado',  width: 1080, height: 1080, icon: <div className="w-12 h-12 bg-gray-200 rounded-md" /> },
];

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  type: "text" | "video";
}

const API_BASE_URL = "https://backend-marketplace-ia.onrender.com";

export const Chatbot_video = (): JSX.Element => {
  const [avatarsLoading, setAvatarsLoading] = useState(true);
  const [voicesLoading, setVoicesLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedBot, setSelectedBot] = useState<ChatbotConfig>(chatbots[0]);

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
  const [showModal, setShowModal] = useState(false);

  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  // Genera un ID de usuario único para esta sesión del navegador.

  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(null);

  const { authToken, isLoading: isAuthLoading } = useAuth(); // Obtén el token del contexto
  const [isDataLoading, setIsDataLoading] = useState(true);


  //VOCES
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    if (authToken) {
      const fetchAppData = async () => {
        setAvatarsLoading(true);
        setVoicesLoading(true);
        setIsDataLoading(true);
        try {
          const headers = {
            'Authorization': `Bearer ${authToken}`
          };

          const [avatarsRes, voicesRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/avatars`, { headers }),
            fetch(`${API_BASE_URL}/api/voices`, { headers })
          ]);

          if (!avatarsRes.ok || !voicesRes.ok) {
            throw new Error("Error al obtener los datos del backend.");
          }

          const avatarsData = await avatarsRes.json();
          const voicesData = await voicesRes.json();

          setAvatars(avatarsData.data?.avatars || []);

          const rawVoices = voicesData.data?.voices || [];
          const cleanedVoices = rawVoices
            .map((voice: Voice) => ({ ...voice, gender: voice.gender.toLowerCase() }))
            .filter((voice: Voice) => voice.gender === 'male' || voice.gender === 'female');
          setVoices(cleanedVoices);

        } catch (error) {
          console.error("Fallo la carga de datos:", error);
          // Opcional: manejar el error, quizás mostrar un mensaje
        } finally {
          setIsDataLoading(false);
          setAvatarsLoading(false);
          setVoicesLoading(false);
        }
      };
      
      fetchAppData();
    }
  }, [authToken, isAuthLoading]);




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

      if (data.videoUrl) {
        // Creamos el mensaje de video para mostrarlo en el chat
        const videoMessage: Message = {
          id: Date.now(),
          sender: "bot",
          text: data.videoUrl,
          type: "video",
        };
        // Actualizamos el estado para que el video aparezca en la interfaz
        setMessages((prev) => [...prev, videoMessage]);
      }
    };

    // Esto maneja errores de conexión
    eventSource.onerror = (err) => {
      console.error("Error en la conexión SSE, se cerrará.", err);
      eventSource.close();
    };

    // Esto asegura que la conexión se cierre cuando el usuario abandona la página
    return () => {
      eventSource.close();
    };
  }, [authToken]); // Se ejecuta solo una vez cuando el componente se monta


  // --- LÓGICA DE FILTRADO Y MANEJADORES ---

  // NUEVO: Extraer listas únicas para los filtros de voz
  const availableLanguages = useMemo(() => ["all", ...new Set(voices.map(v => v.language))], [voices]);
  const availableGenders = useMemo(() => ["all", ...new Set(voices.map(v => v.gender))], [voices]);

  // NUEVO: Aplicar filtros a las voces
  const filteredVoices = useMemo(() => {
    return voices.filter(voice => {
      const languageMatch = languageFilter === 'all' || voice.language === languageFilter;
      const genderMatch = genderFilter === 'all' || voice.gender === genderFilter;
      return languageMatch && genderMatch;
    });
  }, [voices, languageFilter, genderFilter]);

  // NUEVO: Manejador para reproducir/pausar audio de voz
  const handlePlayVoice = (voice: Voice) => {
    if (playingVoiceId === voice.voice_id) {
        audioPlayer.current?.pause();
        setPlayingVoiceId(null);
    } else {
        if (audioPlayer.current) {
            audioPlayer.current.pause();
        }
        audioPlayer.current = new Audio(voice.preview_audio);
        audioPlayer.current.play();
        setPlayingVoiceId(voice.voice_id);
        audioPlayer.current.onended = () => {
            setPlayingVoiceId(null);
        };
    }
  };


// --- REEMPLAZA TU FUNCIÓN handleSend ACTUAL CON ESTA VERSIÓN ---

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
        avatarId: selectedAvatar?.avatar_id,
        voiceId: selectedVoice?.voice_id,
        width: selectedDimension?.width,
        height: selectedDimension?.height,
        type: "video"
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
              type: botText.startsWith("http") ? "video" : "text",
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
            { id: 1, title: "Elige tu coach", items: [ 
                { label: "Coach 1"},
                { label: "Coach 2"},
                { label: "Coach 3"},
                { label: "Coach 4"},

            ] },
            { id: 2, title: "Elige tu avatar" },
            { id: 4, title: "Elige tu voz" },
            { id: 5, title: "Elige las dimensiones" },
            { id: 3, title: "Elige tu diseño", items: [ 
                { label: "Design 1"},
                { label: "Design 2"},
                { label: "Design 3"},
                { label: "Design 4"},
             ] },
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {openSectionId === section.id && (
                <div className="pl-2 pr-2 pt-2">
                  {section.id === 2 ? (
                    // Si es la sección de avatares, mapea sobre el estado `avatars`
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {avatarsLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
                      ))
                    ) : (
                      avatars.map((avatar) => (
                        <button
                          key={avatar.avatar_id}
                          onClick={() => {
                            setSelectedAvatar(avatar);
                            setShowModal(true);
                          }}
                          className={`aspect-square rounded-2xl overflow-hidden flex items-center justify-center shadow-sm
                            ${selectedAvatar?.avatar_id === avatar.avatar_id
                              ? "border-4 border-blue-700"
                              : "border border-gray-200 hover:border-blue-500"
                            }`}
                        >
                          <img src={avatar.preview_image_url} alt={avatar.avatar_name} className="h-full w-full object-cover" />
                        </button>
                      ))
                    )}
                    </div>
                  ) : section.id === 4 ? (
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500">
                          {availableLanguages.map(lang => (<option key={lang} value={lang}>{lang === 'all' ? 'Todos los idiomas' : lang}</option>))}
                        </select>
                        <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500">
                          {availableGenders.map(gender => (<option key={gender} value={gender}>{gender === 'all' ? 'Todos los generos' : gender.charAt(0).toUpperCase() + gender.slice(1)}</option>))}
                        </select>
                      </div>
                      <div className="space-y-1 max-h-60 overflow-y-auto px-2">
                        {voicesLoading ? (
                          // Si está cargando, muestra 5 filas del esqueleto
                          Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg mb-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                            </div>
                          ))
                        ) : (
                          filteredVoices.length > 0 ? filteredVoices.map((voice) => (
                            <div
                              key={voice.voice_id}
                              onClick={() => setSelectedVoice(voice)}
                              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${selectedVoice?.voice_id === voice.voice_id ? 'bg-blue-100 ring-2 ring-blue-300' : 'hover:bg-gray-100'}`}
                            >
                              <span className="text-sm font-medium text-gray-800">{voice.name}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handlePlayVoice(voice); }}
                                disabled={!voice.preview_audio}
                                className="p-1 rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {playingVoiceId === voice.voice_id ? <Pause size={16} /> : <Play size={16} />}
                              </button>
                            </div>
                          )) : (
                            <p className="text-sm text-gray-500 text-center py-4">No se encontraron voces.</p>
                          )
                        )}
                      </div>
                    </div>
                  ) : section.id === 5 ? (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {dimensions.map((dim) => (
                        <button
                          key={dim.id}
                          onClick={() => setSelectedDimension(dim)}
                          className={`flex flex-col items-center justify-center p-3 space-y-2 rounded-lg shadow-sm transition-all
                            ${selectedDimension?.id === dim.id
                              ? 'border-2 border-blue-700 bg-blue-50'
                              : 'border border-gray-200 hover:border-blue-500 hover:bg-gray-50'
                            }`}
                        >
                          {dim.icon}
                          <span className="text-sm font-medium text-gray-700">{dim.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    // Para otras secciones, usa la lógica original
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {section.items?.map((item, index) => (
                        <button
                          key={index}
                          className="aspect-square rounded-2xl overflow-hidden flex items-center justify-center shadow-sm border border-gray-200"
                        >
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        </button>
                    ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {showModal && selectedAvatar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold mb-4">Has seleccionado: {selectedAvatar.avatar_name}</h2>
              <video
                src={selectedAvatar.preview_video_url} // URL dinámica del video
                className="w-full rounded-lg bg-gray-200"
                autoPlay
                loop
                muted
                playsInline
              />
              <p className="text-gray-600 mt-4">
                Este es un video de previsualización de {selectedAvatar.avatar_name}.
              </p>
            </div>
          </div>
        )}


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
                        {msg.type === "video" ? (
                            <video controls className="rounded-lg w-full h-auto max-w-xs">
                            <source src={msg.text} type="video/mp4" />
                            Tu navegador no soporta la reproducción de video.
                            </video>
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
