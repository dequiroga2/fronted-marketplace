import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Login } from "./screens/Login";
import { Marketplace } from "./screens/Marketplace";
import { Chatbot } from "./screens/Chatbot/Chatbot";
import { Chatbot_post } from "./screens/Chatbot/Chatbot_post";
import { Chatbot_video } from "./screens/Chatbot/Chatbot_video";
import { Layout as ChatbotLayout } from "./screens/ChatbotOnboarding/Layout";
import { ChatbotFase1 } from "./screens/ChatbotFase1/ChatbotFase1";
import { ChatbotFase2 } from "./screens/ChatbotFase2/ChatbotFase2";
import { ChatbotFase3 } from "./screens/ChatbotFase3/ChatbotFase3";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedBotRoute } from "./components/ProtectedRoute";

const App = () => (
  <Routes>
    {/* raíz → login; el login ya redirige al marketplace si el user está logueado */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    <Route path="/login" element={<Login />} />
    <Route path="/marketplace" element={<Marketplace />} />

    <Route
      path="/chatbotonboarding"
      element={
        <ProtectedBotRoute botId="onboarding">
          {/* aquí uso ChatbotLayout, que sí tienes importado */}
          <ChatbotLayout />
        </ProtectedBotRoute>
      }
    />

    <Route
      path="/fase1"
      element={
        <ProtectedBotRoute botId="fase1">
          <ChatbotFase1 />
        </ProtectedBotRoute>
      }
    />

    <Route
      path="/fase2"
      element={
        <ProtectedBotRoute botId="fase2">
          <ChatbotFase2 />
        </ProtectedBotRoute>
      }
    />

    <Route
      path="/fase3"
      element={
        <ProtectedBotRoute botId="fase3">
          <ChatbotFase3 />
        </ProtectedBotRoute>
      }
    />

    {/* Rutas “sueltas” que ya tenías */}
    <Route path="/chatbot" element={<Chatbot />} />
    <Route path="/chatbotpost" element={<Chatbot_post />} />
    <Route path="/chatbotvideo" element={<Chatbot_video />} />
  </Routes>
);

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
