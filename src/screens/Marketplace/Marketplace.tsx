import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Star,
  Users,
  Zap,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Crown,
  MessageCircle,
  User as UserIcon,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";

export const Marketplace = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const chats = [
    {
      id: 1,
      name: "Expansión Onboarding",
      description:
        "Assistant especializado en creatividad y escritura. Perfecto para generar contenido único y resolver problemas complejos con un enfoque innovador.",
      price: "$29",
      period: "/mes",
      rating: 4.9,
      users: "12.5k",
      category: "Creatividad",
      featured: true,
      gradient: "from-blue-500 to-purple-600",
    },
  ];

  const handleExplore = () => {
    document.getElementById("marketplace")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubscribe = () => {
    navigate("/chatbotonboarding");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-800" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16 relative">
            {/* Logo - positioned absolutely to the left */}
            <div className="absolute left-0 ml-4 flex items-center space-x-2">
              <div className="relative flex items-center">
                <img
                  src="/henko logo.png"
                  alt="Henko AI"
                  className="h-8 w-auto object-contain"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
                AIMarket
              </span>
            </div>

            {/* Centered Navigation */}
            <div className="hidden md:flex absolute inset-x-0 justify-center items-center space-x-12">
              <a
                href="#marketplace"
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Marketplace
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200">
                Contacto
              </a>
            </div>

            {/* User Menu - positioned absolutely to the right */}
            <div className="absolute right-0 mr-4 hidden md:block">
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full px-4 py-2 hover:border-blue-500/50"
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="text-sm">{user?.email || "usuario@email.com"}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-700">
                      <p className="text-sm text-gray-400">Conectado como</p>
                      <p className="text-white font-medium">{user?.email || "usuario@email.com"}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 group"
                      >
                        <LogOut className="h-4 w-4 group-hover:text-red-400 transition-colors duration-200" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
              <div className="px-4 py-4 space-y-4">
                <a
                  href="#marketplace"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Marketplace
                </a>
                <a
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Contacto
                </a>
                <div className="border-t border-slate-700 pt-4">
                  <div className="text-sm text-gray-400 mb-2">{user?.email || "usuario@email.com"}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 bg-slate-800/50 px-4 py-2 rounded-xl"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-pink-600/10 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl animate-float-delayed"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-white to-pink-400 bg-clip-text text-transparent leading-tight">
              Monetiza tu
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-400 via-white to-pink-400 bg-clip-text text-transparent">
                  Inteligencia Artificial
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full transform scale-x-0 animate-scale-x"></div>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Únete al marketplace más avanzado del mundo. Convierte tus chats de IA en una fuente de ingresos pasivos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button
                onClick={handleExplore}
                className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Explorar Marketplace</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button className="bg-transparent border-2 border-pink-500 text-pink-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-500 hover:text-white transition-all duration-300 transform hover:scale-105">
                Crear mi Chat
              </button>
            </div>

            <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 group">
                <Zap className="h-8 w-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-lg font-semibold mb-2">Ingresos Pasivos</h3>
                <p className="text-gray-400 text-sm">Genera dinero 24/7 con tus chats especializados</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300 group">
                <Users className="h-8 w-8 text-pink-400 mb-4 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-lg font-semibold mb-2">Audiencia Global</h3>
                <p className="text-gray-400 text-sm">Conecta con millones de usuarios buscando IA</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 group">
                <Crown className="h-8 w-8 text-yellow-400 mb-4 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-lg font-semibold mb-2">Tecnología Premium</h3>
                <p className="text-gray-400 text-sm">Plataforma de última generación y segura</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Marketplace de IA
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Descubre chats de IA especializados creados por expertos de todo el mundo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chats.map((chat, index) => (
              <div
                key={chat.id}
                className={`group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 animate-fade-in-up`}
                style={{ animationDelay: `${index * 150}ms` as React.CSSProperties["animationDelay"] }}
              >
                {chat.featured && (
                  <div className="absolute -top-3 left-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Crown className="h-4 w-4" />
                    <span>Featured</span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${chat.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-yellow-400 mb-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-semibold">{chat.rating}</span>
                    </div>
                    <div className="text-xs text-gray-400">{chat.users} usuarios</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                      {chat.name}
                    </h3>
                    <span className="inline-block bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg text-xs font-medium mt-1">
                      {chat.category}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed">{chat.description}</p>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <span className="text-3xl font-bold text-white">{chat.price}</span>
                      <span className="text-gray-400 text-sm">{chat.period}</span>
                    </div>
                    <button
                      onClick={handleSubscribe}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 group"
                    >
                      <span>Suscribirse</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}

            {/* Add Your Chat Card */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-2 border-dashed border-slate-600 rounded-3xl p-6 hover:border-pink-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 flex flex-col items-center justify-center text-center min-h-[400px] animate-fade-in-up">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-8 w-8 text-pink-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors duration-200">
                ¿Tienes un Chat de IA?
              </h3>

              <p className="text-gray-300 text-sm mb-6 max-w-xs">
                Únete a nuestro marketplace y comienza a monetizar tu creación hoy mismo
              </p>

              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 group">
                <span>Publicar mi Chat</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="contact" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">¿Por qué elegir AIMarket?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              La plataforma más avanzada para monetizar inteligencia artificial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Setup Instantáneo",
                description: "Publica tu chat en menos de 5 minutos",
                color: "blue",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Audiencia Masiva",
                description: "Accede a nuestra red de +100k usuarios activos",
                color: "pink",
              },
              {
                icon: <Crown className="h-8 w-8" />,
                title: "Comisiones Bajas",
                description: "Solo 5% de comisión, tú te quedas con el 95%",
                color: "yellow",
              },
              {
                icon: <Bot className="h-8 w-8" />,
                title: "Tecnología Avanzada",
                description: "Infraestructura de última generación",
                color: "purple",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 group hover:transform hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` as React.CSSProperties["animationDelay"] }}
              >
                <div className={`text-${(feature as any).color}-400 mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/50 to-pink-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">¿Listo para empezar?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a la revolución de la IA y comienza a generar ingresos con tu creatividad
          </p>
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105">
            Comenzar Ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
                  AIMarket
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                El marketplace del futuro para la inteligencia artificial
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Explorar Chats</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Categorías</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Top Vendedores</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Creadores</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Publicar Chat</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Guías</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Soporte</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Términos</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 AIMarket. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
