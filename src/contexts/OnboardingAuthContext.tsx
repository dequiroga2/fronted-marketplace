// src/contexts/OnboardingAuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase-config';

// Define la forma de los datos que compartirá el contexto
interface OnboardingAuthContextType {
  user: User | null;
  isLoading: boolean;
  authToken: string | null;
}

// Crea el contexto
const OnboardingAuthContext = createContext<OnboardingAuthContextType | undefined>(undefined);

// Crea el "Proveedor" del contexto para onboarding
export const OnboardingAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Verifica si hay una sesión de onboarding activa
    const onboardingSession = localStorage.getItem('onboarding_session');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Solo establece el usuario si hay una sesión de onboarding activa
      if (firebaseUser && onboardingSession === 'active') {
        setUser(firebaseUser);
        const token = await firebaseUser.getIdToken();
        setAuthToken(token);
      } else {
        setUser(null);
        setAuthToken(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, isLoading, authToken };

  // Muestra "Cargando..." mientras Firebase verifica la sesión
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] text-white">Verificando sesión...</div>;
  }

  return (
    <OnboardingAuthContext.Provider value={value}>
      {children}
    </OnboardingAuthContext.Provider>
  );
};

// Crea un "hook" personalizado para usar el contexto fácilmente en cualquier componente
export const useOnboardingAuth = () => {
  const context = useContext(OnboardingAuthContext);
  if (context === undefined) {
    throw new Error('useOnboardingAuth debe ser usado dentro de un OnboardingAuthProvider');
  }
  return context;
};
