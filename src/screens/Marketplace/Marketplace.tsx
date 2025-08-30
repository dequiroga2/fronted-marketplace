import React, { useRef, useState, useEffect } from "react";
import { 
  Search, Filter, Star, TrendingUp, Zap, Brain, MessageSquare, 
  Image, Code, Music,ShoppingCart,User,Bell,Settings,LogOut,
  ChevronDown,Play,Download,Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";

import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";

export const Marketplace = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleTryClick = () => {
    navigate("/chatbotvideo"); // redirige a la página deseada
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // No necesitas redirigir. El ProtectedRoute lo hará automáticamente.
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    // Añade el listener cuando el menú está abierto
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    // Limpia el listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const categories = [
    { id: "all", name: "Todos", icon: Zap },
    { id: "chat", name: "Chatbots", icon: MessageSquare },
    { id: "image", name: "Imágenes", icon: Image },
    { id: "code", name: "Código", icon: Code },
    { id: "music", name: "Música", icon: Music },
    { id: "analytics", name: "Analytics", icon: TrendingUp },
  ];

  const featuredAgents = [
    {
      id: 1,
      name: "ChatBot Pro",
      description: "Asistente conversacional avanzado con IA",
      price: "$29.99",
      rating: 4.8,
      reviews: 1234,
      category: "chat",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400",
      trending: true,
      downloads: "10k+"
    },
    {
      id: 2,
      name: "Video Generator AI",
      description: "Genera videos únicos con inteligencia artificial",
      price: "$49.99",
      rating: 4.9,
      reviews: 856,
      category: "image",
      image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400",
      trending: false,
      downloads: "5k+"
    },
    {
      id: 3,
      name: "Code Assistant",
      description: "Asistente de programación inteligente",
      price: "$39.99",
      rating: 4.7,
      reviews: 2341,
      category: "code",
      image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400",
      trending: true,
      downloads: "15k+"
    },
    {
      id: 4,
      name: "Music Composer AI",
      description: "Crea música original con IA",
      price: "$59.99",
      rating: 4.6,
      reviews: 432,
      category: "music",
      image: "https://images.pexels.com/photos/6686445/pexels-photo-6686445.jpeg?auto=compress&cs=tinysrgb&w=400",
      trending: false,
      downloads: "3k+"
    },
    {
      id: 5,
      name: "Analytics Master",
      description: "Análisis de datos avanzado con IA",
      price: "$79.99",
      rating: 4.9,
      reviews: 678,
      category: "analytics",
      image: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400",
      trending: true,
      downloads: "8k+"
    },
    {
      id: 6,
      name: "Smart Translator",
      description: "Traductor inteligente multiidioma",
      price: "$24.99",
      rating: 4.5,
      reviews: 1567,
      category: "chat",
      image: "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=400",
      trending: false,
      downloads: "12k+"
    }
  ];

  const filteredAgents = featuredAgents.filter(agent => {
    const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0e10] via-[#1e1e2f] to-[#15151e]">
        {/* Header */}
        <header className="bg-black/50 backdrop-blur-sm border-b border-[#2a2a40] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex items-center space-x-4">
                <img
                    className="h-10 w-auto object-contain"
                    alt="Henko Logo"
                    src="/henko logo.png"
                />
                </div>
            {/* Title */}
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-['Poppins'] font-semibold text-white">
                Henko AI Marketplace
              </h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border-white/20 text-white placeholder-gray-300 rounded-full focus:bg-white/20 focus:border-[#0c21c1] transition-all"
                  placeholder="Buscar agentes de IA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ShoppingCart className="w-5 h-5" />
              </Button>
              <div className="relative" ref={menuRef}>
                    {/* Botón que abre/cierra el menú */}
                    <button 
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-[#0c21c1] to-[#4c6ef5] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <ChevronDown className={`w-4 h-4 text-white transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Menú desplegable (se muestra condicionalmente) */}
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-[#1e1e2f] border border-[#2a2a40] rounded-lg shadow-lg py-2 z-50">
                        <div className="px-4 py-2 border-b border-[#2a2a40]">
                          <p className="text-sm font-medium text-white">
                            {user?.displayName || "Usuario"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {user?.email}
                          </p>
                        </div>
                        <ul>
                          <li>
                            <button 
                              onClick={handleLogout}
                              className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Cerrar Sesión
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-6xl font-['Poppins'] font-bold text-white mb-4">
            Descubre el Futuro de la
            <span className="bg-gradient-to-r from-[#4c6ef5] to-[#0c21c1] bg-clip-text text-transparent"> IA</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explora, compra y monetiza los agentes de inteligencia artificial más avanzados del mercado
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300
                  ${selectedCategory === category.id 
                    ? "bg-gradient-to-r from-[#0c21c1] to-[#4c6ef5] text-white shadow-lg shadow-[#0c21c1]/30" 
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="font-['Poppins']">{category.name}</span>
              </Button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0c21c1] to-[#4c6ef5] rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">500+</h3>
              <p className="text-gray-300">Agentes de IA</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0c21c1] to-[#4c6ef5] rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">100k+</h3>
              <p className="text-gray-300">Descargas</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0c21c1] to-[#4c6ef5] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">4.8</h3>
              <p className="text-gray-300">Rating Promedio</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {agent.trending && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-[#0c21c1] to-[#4c6ef5] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Trending</span>
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-['Poppins'] font-semibold text-white">{agent.name}</h3>
                    <span className="text-lg font-bold text-[#4c6ef5]">{agent.price}</span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{agent.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-medium">{agent.rating}</span>
                      </div>
                      <span className="text-gray-400 text-sm">({agent.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400 text-sm">
                      <Download className="w-3 h-3" />
                      <span>{agent.downloads}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={handleTryClick}
                        className="flex-1 bg-gradient-to-r from-[#0c21c1] to-[#4c6ef5] hover:from-[#0a1da8] hover:to-[#3b5bdb] text-white font-['Poppins'] rounded-full">
                      <Play className="w-4 h-4 mr-2" />
                      Probar
                    </Button>
                    <Button variant="outline" className="border-white/20 text-black hover:text-[#0c21c1] hover:bg-white/10 rounded-full">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button className="bg-gradient-to-r from-[#0c21c1] to-[#4c6ef5] hover:from-[#0a1da8] hover:to-[#3b5bdb] text-white px-8 py-3 rounded-full font-['Poppins'] font-medium">
            Cargar Más Agentes
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#000741]/90 backdrop-blur-md border-t border-[#0c21c1]/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#0c21c1] to-[#4c6ef5] rounded-lg flex items-center justify-center">
                <img
                    className="h-10 w-auto object-contain"
                    alt="Henko Logo"
                    src="/henko logo.png"
                />
              </div>
              <span className="text-xl font-['Poppins'] font-semibold text-white">Henko AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Henko AI Marketplace. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};