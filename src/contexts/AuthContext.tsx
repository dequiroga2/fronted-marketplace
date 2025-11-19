// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase-config';

// --- tipos auxiliares ---

// Permisos por bot, ejemplo:
// { onboarding: true, fase1: false, fase2: true, fase3: false }
export type BotPermissions = Record<string, boolean>;

// Define la forma de los datos que compartirá el contexto
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  authToken: string | null;
  botPermissions: BotPermissions | null;
}

// Crea el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// URL de tu webhook en n8n (USA LA DE PRODUCCIÓN, no la -test)
const BOT_PERMISSIONS_WEBHOOK_URL =
  'https://automation.luminotest.com/webhook/579448fe-c907-4e38-a612-00d7660cf90e';
// si tu URL de producción es otra, cámbiala aquí 👆


// Crea el "Proveedor" del contexto, que es el componente que envolverá tu app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [botPermissions, setBotPermissions] = useState<BotPermissions | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // cada vez que cambia la sesión, volvemos a estado "cargando"
      setIsLoading(true);
      setUser(firebaseUser);

      if (firebaseUser) {
        // token de Firebase por si lo necesitas más adelante
        const token = await firebaseUser.getIdToken();
        setAuthToken(token);

        // --------- cargar permisos de bots desde n8n ----------
        let bots: BotPermissions = {};

        if (firebaseUser.email) {
          try {
            const res = await fetch(BOT_PERMISSIONS_WEBHOOK_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: firebaseUser.email }),
            });

            if (!res.ok) {
              console.error('Error HTTP al cargar permisos de bots:', res.status, await res.text());
            } else {
              const raw = await res.json();
              const data = Array.isArray(raw) ? raw[0] : raw; // tu webhook devuelve [ { ... } ]

              if (data && data.found !== false && data.bots) {
                bots = data.bots as BotPermissions;
              } else {
                console.warn('Usuario sin permisos de bots en la hoja:', firebaseUser.email);
              }
            }
          } catch (e) {
            console.error('Error de red al cargar permisos de bots:', e);
          }
        } else {
          console.warn('Usuario de Firebase sin email definido');
        }

        setBotPermissions(bots);
        // ------------------------------------------------------
      } else {
        // no hay usuario logueado
        setAuthToken(null);
        setBotPermissions(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = { user, isLoading, authToken, botPermissions };

  // Muestra "Cargando..." mientras Firebase + permisos verifican la sesión
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Verificando sesión...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
