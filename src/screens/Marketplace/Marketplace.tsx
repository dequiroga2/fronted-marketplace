import React, { useRef, useState, useEffect } from "react";
import { 
  Search, Filter, Star, TrendingUp, Zap, Brain, MessageSquare, 
  Image, Code, Music, ShoppingCart, User, Bell, Settings, LogOut,
  ChevronDown, Play, Download, Heart, Sparkles, Rocket, Globe,
  Shield, Award, Users, Activity
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
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  const { user } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleTryClick = () => {
    navigate("/chatbotvideo");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const categories = [
    { id: "all", name: "Todos", icon: Sparkles, color: "from-cyan-400 to-blue-500" },
    { id: "chat", name: "Chatbots", icon: MessageSquare, color: "from-blue-400 to-purple-500" },
    { id: "image", name: "Imágenes", icon: Image, color: "from-purple-400 to-pink-500" },
    { id: "code", name: "Código", icon: Code, color: "from-green-400 to-cyan-500" },
    { id: "music", name: "Música", icon: Music, color: "from-pink-400 to-red-500" },
    { id: "analytics", name: "Analytics", icon: TrendingUp, color: "from-yellow-400 to-orange-500" },
  ];

  const featuredAgents = [
    {
      id: 1,
      name: "ChatBot Pro",
      description: "Asistente conversacional avanzado con IA de última generación",
      price: "$29.99",
      rating: 4.8,
      reviews: 1234,
      category: "chat",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: true,
      downloads: "10k+",
      badge: "Popular"
    },
    {
      id: 2,
      name: "Video Generator AI",
      description: "Genera videos únicos con inteligencia artificial avanzada",
      price: "$49.99",
      rating: 4.9,
      reviews: 856,
      category: "image",
      image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: false,
      downloads: "5k+",
      badge: "Nuevo"
    },
    {
      id: 3,
      name: "Code Assistant",
      description: "Asistente de programación inteligente para desarrolladores",
      price: "$39.99",
      rating: 4.7,
      reviews: 2341,
      category: "code",
      image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: true,
      downloads: "15k+",
      badge: "Trending"
    },
    {
      id: 4,
      name: "Music Composer AI",
      description: "Crea música original con inteligencia artificial",
      price: "$59.99",
      rating: 4.6,
      reviews: 432,
      category: "music",
      image: "https://images.pexels.com/photos/6686445/pexels-photo-6686445.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: false,
      downloads: "3k+",
      badge: "Premium"
    },
    {
      id: 5,
      name: "Analytics Master",
      description: "Análisis de datos avanzado con machine learning",
      price: "$79.99",
      rating: 4.9,
      reviews: 678,
      category: "analytics",
      image: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: true,
      downloads: "8k+",
      badge: "Pro"
    },
    {
      id: 6,
      name: "Smart Translator",
      description: "Traductor inteligente multiidioma con contexto",
      price: "$24.99",
      rating: 4.5,
      reviews: 1567,
      category: "chat",
      image: "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: false,
      downloads: "12k+",
      badge: "Básico"
    }
  ];

  const filteredAgents = featuredAgents.filter(agent => {
    const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-aurora bg-grid relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl floating"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl floating" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl floating" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Futuristic Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50 ? 'glass-panel neon-shadow' : 'bg-transparent'
      }`}>
        <div className="beam-divider"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with Glow Effect */}
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <img
                  className="relative h-12 w-auto object-contain filter brightness-110"
                  alt="Henko Logo"
                  src="/henko logo.png"
                />
              </div>
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold cyber-text glow-text">
                  HENKO AI
                </h1>
                <p className="text-xs text-cyan-300 tracking-wider">MARKETPLACE</p>
              </div>
            </div>

            {/* Futuristic Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur group-focus-within:blur-md transition-all"></div>
                <div className="relative glass-panel rounded-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                  <Input
                    className="w-full pl-12 pr-6 py-3 bg-transparent border-0 text-white placeholder-gray-300 rounded-full focus:ring-2 focus:ring-cyan-400/50 transition-all"
                    placeholder="Buscar agentes de IA del futuro..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-cyan-300 hover:text-white hover:bg-cyan-500/20 rounded-full p-3 transition-all">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-cyan-300 hover:text-white hover:bg-cyan-500/20 rounded-full p-3 transition-all">
                <ShoppingCart className="w-5 h-5" />
              </Button>
              
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-3 glass-panel hover:bg-white/10 rounded-full px-4 py-2 transition-all group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center glow-border">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-white">{user?.displayName || "Usuario"}</p>
                    <p className="text-xs text-cyan-300">Premium Member</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-cyan-300 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-72 glass-panel neon-shadow rounded-2xl py-3 z-50 border border-cyan-500/30">
                    <div className="px-6 py-4 border-b border-cyan-500/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{user?.displayName || "Usuario"}</p>
                          <p className="text-sm text-cyan-300">{user?.email}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Shield className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400">Verificado</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button className="w-full text-left flex items-center px-6 py-3 text-white hover:bg-cyan-500/20 transition-all">
                        <Settings className="w-4 h-4 mr-3 text-cyan-400" />
                        Configuración
                      </button>
                      <button className="w-full text-left flex items-center px-6 py-3 text-white hover:bg-cyan-500/20 transition-all">
                        <Award className="w-4 h-4 mr-3 text-purple-400" />
                        Mis Agentes
                      </button>
                      <button className="w-full text-left flex items-center px-6 py-3 text-white hover:bg-cyan-500/20 transition-all">
                        <Activity className="w-4 h-4 mr-3 text-pink-400" />
                        Estadísticas
                      </button>
                    </div>
                    
                    <div className="border-t border-cyan-500/20 pt-2">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-6 py-3 text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="beam-divider"></div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl"></div>
            <div className="relative z-10 py-16">
              <div className="inline-flex items-center space-x-2 glass-panel rounded-full px-6 py-2 mb-8">
                <Rocket className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-300 text-sm font-medium tracking-wide">NUEVA ERA DE LA IA</span>
              </div>
              
              <h2 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">El Futuro de la</span>
                <br />
                <span className="cyber-text hologram">Inteligencia Artificial</span>
              </h2>
              
              <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                Descubre, adquiere y monetiza los agentes de IA más avanzados del universo digital
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button className="btn-neon text-white font-semibold px-8 py-4 rounded-full text-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Explorar Agentes
                </Button>
                <Button variant="outline" className="glass-panel border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20 px-8 py-4 rounded-full text-lg">
                  <Globe className="w-5 h-5 mr-2" />
                  Ver Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Futuristic Categories */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              <span className="glow-text">Categorías del Futuro</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      group relative flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-500 transform hover:scale-105
                      ${isSelected 
                        ? `glass-panel glow-border neon-shadow` 
                        : "glass-panel hover:bg-white/10 border border-cyan-500/20"
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                      ${isSelected 
                        ? `bg-gradient-to-r ${category.color}` 
                        : "bg-white/10 group-hover:bg-white/20"
                      }
                    `}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`font-medium transition-all ${isSelected ? 'text-white glow-text' : 'text-gray-300 group-hover:text-white'}`}>
                      {category.name}
                    </span>
                    {isSelected && <div className="scan-line absolute inset-0 rounded-2xl"></div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cyber Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Brain, value: "500+", label: "Agentes IA", color: "from-cyan-400 to-blue-500" },
              { icon: Users, value: "50k+", label: "Usuarios Activos", color: "from-purple-400 to-pink-500" },
              { icon: Download, value: "100k+", label: "Descargas", color: "from-green-400 to-cyan-500" },
              { icon: Star, value: "4.9", label: "Rating Global", color: "from-yellow-400 to-orange-500" }
            ].map((stat, index) => (
              <Card key={index} className="glass-panel neon-border card-fx group">
                <CardContent className="p-6 text-center relative overflow-hidden">
                  <div className="scan-line absolute inset-0"></div>
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2 glow-text">{stat.value}</h3>
                  <p className="text-cyan-300 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Featured Agents Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-white glow-text">
                Agentes Destacados
              </h3>
              <Button variant="outline" className="glass-panel border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20 rounded-full">
                <Filter className="w-4 h-4 mr-2" />
                Filtros Avanzados
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAgents.map((agent, index) => (
                <Card key={agent.id} className="glass-panel neon-border card-fx group relative overflow-hidden" style={{animationDelay: `${index * 100}ms`}}>
                  <CardContent className="p-0 relative">
                    {/* Image with Overlay Effects */}
                    <div className="relative overflow-hidden">
                      <img
                        src={agent.image}
                        alt={agent.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="shine absolute inset-0"></div>
                      
                      {/* Floating Badge */}
                      {agent.trending && (
                        <div className="absolute top-4 left-4 glass-panel rounded-full px-3 py-1 glow-border">
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-cyan-400" />
                            <span className="text-xs font-bold text-white">{agent.badge}</span>
                          </div>
                        </div>
                      )}

                      {/* Heart Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-4 right-4 glass-panel hover:bg-pink-500/30 text-pink-300 hover:text-white rounded-full p-2 transition-all"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>

                      {/* Price Tag */}
                      <div className="absolute bottom-4 right-4 glass-panel rounded-full px-4 py-2">
                        <span className="text-lg font-bold cyber-text">{agent.price}</span>
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-6 relative">
                      <div className="scan-line absolute top-0 left-0 right-0"></div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 glow-text group-hover:cyber-text transition-all">
                        {agent.name}
                      </h3>
                      
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{agent.description}</p>
                      
                      {/* Stats Row */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white text-sm font-bold">{agent.rating}</span>
                          </div>
                          <span className="text-gray-400 text-sm">({agent.reviews})</span>
                        </div>
                        <div className="flex items-center space-x-1 text-cyan-300 text-sm font-medium">
                          <Download className="w-4 h-4" />
                          <span>{agent.downloads}</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Button 
                          onClick={handleTryClick}
                          className="flex-1 btn-neon text-white font-bold rounded-full py-3 shine"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Probar Ahora
                        </Button>
                        <Button 
                          variant="outline" 
                          className="glass-panel border-pink-400/50 text-pink-300 hover:bg-pink-500/20 rounded-full p-3 transition-all"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Load More Section */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-50"></div>
              <Button className="relative btn-neon text-white px-12 py-4 rounded-full font-bold text-lg shine">
                <Sparkles className="w-5 h-5 mr-2" />
                Cargar Más Agentes
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Futuristic Footer */}
      <footer className="relative">
        <div className="beam-divider mb-8"></div>
        <div className="glass-panel border-t border-cyan-500/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-6 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center">
                    <img
                      className="h-10 w-auto object-contain filter brightness-110"
                      alt="Henko Logo"
                      src="/henko logo.png"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-2xl font-bold cyber-text">HENKO AI</h4>
                  <p className="text-cyan-300 text-sm tracking-wider">MARKETPLACE DEL FUTURO</p>
                </div>
              </div>
              
              <div className="beam-divider mb-6"></div>
              
              <p className="text-gray-400 text-sm">
                © 2025 Henko AI Marketplace. Construyendo el futuro de la inteligencia artificial.
              </p>
              
              <div className="flex items-center justify-center space-x-6 mt-6">
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs">Sistema Operativo</span>
                </div>
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs">Seguridad Cuántica</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs">IA Neural</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};