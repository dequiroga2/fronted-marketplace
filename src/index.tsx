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
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/marketplace" replace />} />
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/chatbotpost" element={<Chatbot_post />} />
      <Route path="/chatbotvideo" element={<Chatbot_video />} />
      <Route path="/chatbotonboarding" element={<ChatbotLayout />} />
      <Route path="/fase1" element={<ChatbotFase1 />} />
      <Route path="/fase2" element={<ChatbotFase2 />} />
      <Route path="/fase3" element={<ChatbotFase3 />} />
    </Route>
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
