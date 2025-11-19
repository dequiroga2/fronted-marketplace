// src/routes/ProtectedBotRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type BotId = 'onboarding' | 'fase1' | 'fase2' | 'fase3';

interface ProtectedBotRouteProps {
  botId: BotId;
  children: React.ReactElement;
}

export const ProtectedBotRoute: React.FC<ProtectedBotRouteProps> = ({ botId, children }) => {
  const { user, isLoading, botPermissions } = useAuth();
  const location = useLocation();

  // Mientras seguimos cargando sesión/permisos
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Verificando sesión...
      </div>
    );
  }

  // Si no está logueado, lo mandamos al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está logueado pero NO tiene ese bot activo, lo mandamos al marketplace
  if (!botPermissions || !botPermissions[botId]) {
    return <Navigate to="/marketplace" replace />;
  }

  // Tiene permiso → renderizamos el chatbot
  return children;
};
