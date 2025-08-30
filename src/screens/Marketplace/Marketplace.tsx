import React, { useRef, useState, useEffect } from "react";
import { 
  Search, Star, TrendingUp, Zap, Brain, MessageSquare, 
  Image, Code, Music, User, Bell, LogOut,
  ChevronDown, Play, Download, Heart, Sparkles, Rocket,
  Shield, Award, Users, Activity, Menu, X, ArrowRight,
  Cpu, Database, Network, Terminal
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
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
    { id: "all", name: "Todo", icon: Sparkles },
    { id: "chat", name: "Chat", icon: MessageSquare },
    { id: "image", name: "Visual", icon: Image },
    { id: "code", name: "Code", icon: Code },
    { id: "music", name: "Audio", icon: Music },
    { id: "analytics", name: "Data", icon: TrendingUp },
  ];

  const featuredAgents = [
    {
      id: 1,
      name: "Neural Chat Pro",
      description: "Conversaciones avanzadas con IA de próxima generación",
      price: "$29.99",
      rating: 4.8,
      reviews: 1234,
      category: "chat",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: true,
      downloads: "10k+",
      badge: "HOT",
      type: "Premium"
    },
    {
      id: 2,
      name: "Quantum Vision",
      description: "Generación de contenido visual con algoritmos cuánticos",
      price: "$49.99",
      rating: 4.9,
      reviews: 856,
      category: "image",
      image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: false,
      downloads: "5k+",
      badge: "NEW",
      type: "Enterprise"
    },
    {
      id: 3,
      name: "Code Nexus",
      description: "Asistente de desarrollo con capacidades de auto-programación",
      price: "$39.99",
      rating: 4.7,
      reviews: 2341,
      category: "code",
      image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: true,
      downloads: "15k+",
      badge: "TRENDING",
      type: "Pro"
    },
    {
      id: 4,
      name: "Sonic AI",
      description: "Composición musical inteligente con síntesis neural",
      price: "$59.99",
      rating: 4.6,
      reviews: 432,
      category: "music",
      image: "https://images.pexels.com/photos/6686445/pexels-photo-6686445.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: false,
      downloads: "3k+",
      badge: "PREMIUM",
      type: "Studio"
    },
    {
      id: 5,
      name: "Data Oracle",
      description: "Análisis predictivo con machine learning cuántico",
      price: "$79.99",
      rating: 4.9,
      reviews: 678,
      category: "analytics",
      image: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: true,
      downloads: "8k+",
      badge: "ELITE",
      type: "Enterprise"
    },
    {
      id: 6,
      name: "Lingua Matrix",
      description: "Traducción contextual con comprensión semántica avanzada",
      price: "$24.99",
      rating: 4.5,
      reviews: 1567,
      category: "chat",
      image: "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=600",
      trending: false,
      downloads: "12k+",
      badge: "BASIC",
      type: "Standard"
    }
  ];

  const filteredAgents = featuredAgents.filter(agent => {
    const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen cyber-bg cyber-grid">
      {/* Clean Minimal Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${
        scrollY > 50 
          ? 'glass-dark backdrop-blur-xl border-b border-cyan-500/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo Minimalista */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold neon-cyan tracking-wider">HENKO</span>
            </div>

            {/* Search Bar Minimalista */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  className="w-full pl-10 pr-4 py-2 bg-black/40 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  placeholder="Buscar agentes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-full bg-black/40 border border-gray-700 hover:border-cyan-400 transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-black" />
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-dark rounded-xl border border-cyan-500/30 overflow-hidden">
                  <div className="p-4 border-b border-gray-700">
                    <p className="text-white font-medium">{user?.displayName || "Usuario"}</p>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-cyan-500/20 hover:text-white transition-all">
                      <Award className="w-4 h-4 inline mr-3" />
                      Mis Agentes
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-cyan-500/20 hover:text-white transition-all">
                      <Activity className="w-4 h-4 inline mr-3" />
                      Estadísticas
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <LogOut className="w-4 h-4 inline mr-3" />
                      Salir
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section Rediseñado */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 glass-dark rounded-full px-4 py-2 mb-8 border border-cyan-500/30">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-300 text-sm font-medium">SISTEMA ACTIVO</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black mb-6 leading-none">
              <span className="text-white">AI</span>
              <span className="neon-cyan glow-text"> NEXUS</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              La nueva dimensión de la inteligencia artificial
            </p>

            <div className="flex items-center justify-center space-x-4">
              <Button 
                onClick={handleTryClick}
                className="cyber-button text-white font-bold px-8 py-4 rounded-full text-lg"
              >
                <Rocket className="w-5 h-5 mr-2" />
                INICIAR MISIÓN
              </Button>
            </div>
          </div>

          {/* Categories como Pills Horizontales */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 border
                    ${isSelected 
                      ? 'glass-dark border-cyan-400 text-cyan-400' 
                      : 'bg-black/20 border-gray-700 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* Stats en formato horizontal */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Brain, value: "500+", label: "Agentes", color: "cyan" },
              { icon: Users, value: "50k+", label: "Usuarios", color: "pink" },
              { icon: Download, value: "100k+", label: "Descargas", color: "purple" },
              { icon: Star, value: "4.9", label: "Rating", color: "yellow" }
            ].map((stat, index) => (
              <div key={index} className="glass-dark rounded-2xl p-6 border border-gray-700 hover:border-cyan-400/50 transition-all floating-element" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    stat.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
                    stat.color === 'pink' ? 'bg-pink-500/20 text-pink-400' :
                    stat.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Agentes en formato Lista/Tabla Futurista */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold neon-cyan glow-text">AGENTES DISPONIBLES</h2>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{filteredAgents.length} agentes activos</span>
              </div>
            </div>

            {filteredAgents.map((agent, index) => (
              <div 
                key={agent.id} 
                className="cyber-card rounded-2xl p-6 slide-up group"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-center space-x-6">
                  {/* Imagen del Agente */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-700 group-hover:border-cyan-400 transition-all">
                      <img
                        src={agent.image}
                        alt={agent.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {agent.trending && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </div>

                  {/* Info del Agente */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-white group-hover:neon-cyan transition-all">
                            {agent.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            agent.badge === 'HOT' ? 'bg-red-500/20 text-red-400' :
                            agent.badge === 'NEW' ? 'bg-green-500/20 text-green-400' :
                            agent.badge === 'TRENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                            agent.badge === 'PREMIUM' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-cyan-500/20 text-cyan-400'
                          }`}>
                            {agent.badge}
                          </span>
                        </div>
                        <p className="text-gray-400 mb-3 max-w-md">{agent.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white font-medium">{agent.rating}</span>
                            <span className="text-gray-500">({agent.reviews})</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Download className="w-4 h-4" />
                            <span>{agent.downloads}</span>
                          </div>
                          <div className="px-2 py-1 bg-gray-800 rounded-full text-gray-300 text-xs">
                            {agent.type}
                          </div>
                        </div>
                      </div>

                      {/* Precio y Acciones */}
                      <div className="text-right">
                        <div className="text-2xl font-bold neon-pink mb-4">{agent.price}</div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-pink-400 hover:bg-pink-500/20 rounded-full p-2"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button 
                            onClick={handleTryClick}
                            className="cyber-button text-white font-bold px-6 py-2 rounded-full"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            PROBAR
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Línea de progreso/estado */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Online</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Network className="w-3 h-3" />
                        <span>Latencia: 12ms</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Database className="w-3 h-3" />
                        <span>Uptime: 99.9%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-cyan-400">
                      <Terminal className="w-3 h-3" />
                      <span>API Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button className="cyber-button text-white px-8 py-3 rounded-full font-bold">
              <ArrowRight className="w-5 h-5 mr-2" />
              CARGAR MÁS AGENTES
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="border-t border-gray-800 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center">
                <Cpu className="w-4 h-4 text-black" />
              </div>
              <span className="text-gray-400 text-sm">© 2025 Henko AI</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-500 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Sistema Operativo</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};