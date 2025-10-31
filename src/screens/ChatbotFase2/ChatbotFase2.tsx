import React from "react";
import { LayoutGeneric } from "../ChatbotGeneric/LayoutGeneric";
import { MessageSquare, Zap, Users } from "lucide-react";

const botConfig = {
  id: "fase2",
  name: "Fase 2",
  description: "Assistant avanzado para la segunda fase de implementación. Optimiza procesos y mejora la eficiencia de tus proyectos en curso.",
  icon: "/fase2.png", // Imagen de fondo
  logo: "/logo_mph.jpg", // Puedes cambiar esto por la imagen que quieras
  welcomeTitle: "Bienvenido a la Fase 2",
  webhookUrl: "https://automation.luminotest.com/webhook/485898e8-4536-4a8b-b709-4956378d5e33", // Cambia por tu webhook real
  storageKey: "chatbot-fase2-history", // Clave única para el historial de Fase 2
  cards: [
    {
      icon: <MessageSquare size={16} className="text-white" />,
      title: "Amigo",
      description: "Puedes contarnos tus problemas",
    },
    {
      icon: <Zap size={16} className="text-white" />,
      title: "Ayuda",
      description: "Te ayudamos con lo que necesites",
    },
    {
      icon: <Users size={16} className="text-white" />,
      title: "Aprendizaje",
      description: "Aprende con nuestra metodología",
    },
  ],
};

export const ChatbotFase2: React.FC = () => {
  return <LayoutGeneric botConfig={botConfig} />;
};

export default ChatbotFase2;
