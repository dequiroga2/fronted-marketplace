import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Send, Mic, Plus } from "lucide-react";

interface Chatbot {
  id: string;
  name: string;
}

const chatbots: Chatbot[] = [
  { id: "marketing", name: "Marketing" },
  { id: "growth", name: "Growth Partner" },
  { id: "legal", name: "Legal Partner" },
  { id: "bot4", name: "Bot #4" },
  { id: "bot5", name: "Bot #5" },
];

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

export const Chatbot = (): JSX.Element => {
  const [selectedBot, setSelectedBot] = useState<Chatbot>(chatbots[0]);
  const [input, setInput] = useState("");
  const [showBotList, setShowBotList] = useState(false);
  const [animatePanel, setAnimatePanel] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const handleSend = async () => {
  if (!input.trim()) return;

  const newUserMessage: Message = {
    id: messages.length + 1,
    sender: "user",
    text: input.trim(),
  };

  setMessages((prev) => [...prev, newUserMessage]);
  setInput("");
  setIsLoading(true);

  try {
    const response = await fetch("https://automation.luminotest.com/webhook/53816d93-2be0-4df2-8dec-031847e0bed1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input.trim(), botId: selectedBot.id }),
    });

    const botText = await response.text();
    console.log("Bot response:", botText);
    setIsLoading(false); 

    const botMessage: Message = {
      id: newUserMessage.id + 1,
      sender: "bot",
      text: botText || "No entendí tu mensaje.",
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("Error al conectar con n8n:", error);
    const errorMessage: Message = {
      id: newUserMessage.id + 1,
      sender: "bot",
      text: "Hubo un error al contactar con el asistente.",
    };
    setMessages((prev) => [...prev, errorMessage]);
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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center p-8 relative font-sans">
      {/* Toggle button for chatbot list */}
      <div className="w-full max-w-4xl mb-4 flex justify-start">
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
          className={`absolute top-14 left-8 bg-white rounded-lg shadow-lg p-4 w-64 z-50 transform transition-all duration-300 ease-in-out
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
      <div className="flex w-full max-w-6xl h-[calc(100vh-4rem)]">

        {/* PANEL IZQUIERDO */}
        <div className="w-64 bg-white rounded-lg shadow-md p-4 mr-4">
          <h2 className="text-lg font-semibold mb-2 text-center">Elige tu coach</h2>
          {/* Cuadrícula de botones */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 1, label: "Coach 1" },
              { id: 2, label: "Coach 2" },
              { id: 3, label: "Coach 3" },
              { id: 4, label: "Coach 4" },
            ].map((item) => (
              <button
                key={item.id}
                className="aspect-square bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 shadow-sm"
              >
                {item.label}
                {/* También podrías usar una imagen en vez del texto aquí */}
                {/* <img src="/ruta/icono.png" alt="Icono" className="h-8 w-8" /> */}
              </button>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="flex-1 bg-gray-50 rounded-lg shadow-md p-8 flex flex-col justify-between max-w-4xl w-full h-[calc(100vh-4rem)]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <p className="text-2xl font-light mb-6 text-center max-w-md">
                Estas en el chatBot de <span className="font-semibold">{selectedBot.name}</span> especialista en el area de Marketing.
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
            <div className="flex flex-col flex-1">
              <div id="message-container"
                className="flex-1 overflow-y-auto flex flex-col space-y-2 p-4 bg-white rounded shadow-inner">
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
                      {msg.text}
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
