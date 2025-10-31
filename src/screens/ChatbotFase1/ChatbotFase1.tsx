import React from "react";
import { LayoutGeneric } from "../ChatbotGeneric/LayoutGeneric";
import { MessageSquare, Zap, Users } from "lucide-react";

const botConfig = {
  id: "fase1",
  name: "Fase 1",
  description: "Chatbot especializado en la primera fase de desarrollo. Ideal para iniciar proyectos y establecer bases sólidas con estrategias efectivas.",
  icon: "/fase1.png", // Imagen de fondo
  logo: "/logo_mph.jpg", // Logo cuadrado que aparece en el centro
  welcomeTitle: "Bienvenido a la Fase 1",
  webhookUrl: "https://automation.luminotest.com/webhook/115918b7-ce27-43e1-828a-6a1197ebc0d4", // Cambia por tu webhook real
  storageKey: "chatbot-fase1-history", // Clave única para el historial de Fase 1
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

export const ChatbotFase1: React.FC = () => {
  return <LayoutGeneric botConfig={botConfig} />;
};

export default ChatbotFase1;
