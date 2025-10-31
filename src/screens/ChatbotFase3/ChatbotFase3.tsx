import React from "react";
import { LayoutGeneric } from "../ChatbotGeneric/LayoutGeneric";
import { MessageSquare, Zap, Users } from "lucide-react";

const botConfig = {
  id: "fase3",
  name: "Fase 3",
  description: "Chatbot experto en la fase final de consolidación. Perfecto para escalar y maximizar resultados con análisis profundos y estrategias avanzadas.",
  icon: "/fase3.png", // Imagen de fondo
  logo: "/logo_mph.jpg", // Puedes cambiar esto por la imagen que quieras
  welcomeTitle: "Bienvenido a la Fase 3",
  webhookUrl: "https://automation.luminotest.com/webhook/a92ccc0b-000e-4ced-8643-3e8f601420c6", // Cambia por tu webhook real
  storageKey: "chatbot-fase3-history", // Clave única para el historial de Fase 3
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

export const ChatbotFase3: React.FC = () => {
  return <LayoutGeneric botConfig={botConfig} />;
};

export default ChatbotFase3;
