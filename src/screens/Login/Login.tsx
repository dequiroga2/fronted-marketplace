import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, PhoneIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { auth } from "../../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";

export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    // Si la autenticación ya no está cargando y SÍ existe un usuario...
    if (!isAuthLoading && user) {
      // ...entonces no debería estar aquí. Lo mandamos al marketplace.
      navigate('/marketplace', { replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  const handleLogin = async () => {

    setError(null);
    setIsLoading(true);

    try {
      // Intenta iniciar sesión con el email y la contraseña proporcionados
      await signInWithEmailAndPassword(auth, email, password);
      // Si tiene éxito, Firebase maneja la sesión y redirigimos al usuario
      navigate("/marketplace");
    } catch (err: any) {
      // Si Firebase devuelve un error, lo mostramos al usuario
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("El correo o la contraseña son incorrectos.");
      } else {
        setError("Ocurrió un error. Por favor, inténtalo de nuevo.");
      }
      console.error("Error de Firebase:", err.code);
    } finally {
      // Desactiva el estado de carga, tanto si tuvo éxito como si no
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };


  return (
    <div className="bg-white min-h-screen w-full">
      <div className="flex flex-col lg:flex-row min-h-screen max-w-7xl mx-auto">
        {/* Left side with login form - Mobile first, then desktop */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 lg:py-0 order-2 lg:order-1">
          {/* Top left logo - only visible on desktop - INVERTED VERSION */}
          <div className="hidden lg:block absolute top-4 left-4">
            <div className="w-32 h-14 flex items-center justify-center">
              {/* Inverted Henko Logo - Dark version for white background */}
              <svg width="120" height="56" viewBox="0 0 400 200" className="object-contain">
                <defs>
                  <linearGradient id="darkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#000741" />
                    <stop offset="100%" stopColor="#0c21c1" />
                  </linearGradient>
                </defs>
                {/* H letter with lightning bolt effect - Dark version */}
                <path d="M50 40 L50 160 L80 160 L80 110 L120 110 L120 160 L150 160 L150 40 L120 40 L120 80 L80 80 L80 40 Z" fill="url(#darkGradient)" />
                {/* Lightning bolt accent */}
                <path d="M170 40 L200 40 L180 100 L210 100 L170 160 L190 100 L170 100 Z" fill="url(#darkGradient)" />
                {/* Additional geometric elements */}
                <circle cx="250" cy="100" r="30" fill="url(#darkGradient)" opacity="0.8" />
                <path d="M300 70 L350 70 L325 130 L300 130 Z" fill="url(#darkGradient)" opacity="0.6" />
              </svg>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto lg:mx-0 lg:mt-20">
            {/* Login header */}
            <div className="mb-8 lg:mb-12">
              <h2 className="font-['Poppins'] font-medium text-black text-2xl lg:text-3xl">
                Iniciar sesión
              </h2>
              <div className="mt-6 lg:mt-16">
                <p className="font-['Poppins'] font-normal text-black text-sm lg:text-base">
                  Si aún no tienes una cuenta registrada
                </p>
                <p className="font-['Poppins'] font-normal text-black text-sm lg:text-base mt-4 lg:mt-8">
                  Puedes{" "}
                  <span className="font-semibold text-[#0c21c1] cursor-pointer hover:underline">
                    Registrarte aquí!
                  </span>
                </p>
              </div>
            </div>

            {/* Login form */}
            <div className="space-y-6 lg:space-y-8">
              {/* Email field */}
              <div className="relative">
                <label className="font-['Poppins'] font-medium text-[#999999] text-xs lg:text-[13px]">
                  Email
                </label>
                <div className="relative mt-4 lg:mt-8">
                  <MailIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-[17px] lg:h-[17px] text-[#000741]" />
                  <Input
                    className="border-none pl-6 lg:pl-[27px] font-['Poppins'] text-[#000741] text-sm lg:text-base focus-visible:ring-0 h-8 px-0 bg-transparent"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                  <div className="w-full h-0.5 bg-[#000741] mt-1" />
                </div>
              </div>

              {/* Password field */}
              <div className="relative">
                <label className="font-['Poppins'] font-medium text-[#999999] text-xs lg:text-[13px]">
                  Password
                </label>
                <div className="relative mt-4 lg:mt-8">
                  <LockIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-[17px] lg:h-[17px] text-[#000741]" />
                  <Input
                    className="border-none pl-6 lg:pl-[29px] pr-8 font-['Poppins'] text-[#000741] text-sm lg:text-base focus-visible:ring-0 h-8 bg-transparent"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button onClick={togglePasswordVisibility} className="absolute right-0 top-1/2 -translate-y-1/2">
                    {isPasswordVisible ? (
                      <EyeOffIcon className="w-3.5 h-3.5 text-[#999999] cursor-pointer hover:text-[#000741] transition-colors" />
                    ) : (
                      <EyeIcon className="w-3.5 h-3.5 text-[#999999] cursor-pointer hover:text-[#000741] transition-colors" />
                    )}
                  </button>
                  <div className="w-full h-0.5 bg-[#999999] mt-1" />
                </div>
              </div>

              {/* Remember me and forgot password */}
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    className="w-3.5 h-3.5 lg:w-[15px] lg:h-[15px] rounded-none border-black"
                  />
                  <label
                    htmlFor="remember"
                    className="font-['Poppins'] font-light text-black cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <span className="font-['Poppins'] font-light text-[#4c4c4c] cursor-pointer hover:text-[#0c21c1] transition-colors">
                  Forgot Password ?
                </span>
              </div>
              {error && (
                  <p className="text-red-500 text-sm text-center font-['Poppins']">{error}</p>
              )}

              {/* Login button */}
              <Button 
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-12 lg:h-[53px] bg-[#0c21c1] hover:bg-[#0a1da8] rounded-[32px] font-['Poppins'] font-medium text-sm lg:text-[17px] shadow-[0px_4px_26px_#00000040] transition-colors disabled:bg-gray-400">
                {isLoading ? "Iniciando sesión..." : "Login"}
              </Button>

              {/* Social login */}
              <div className="text-center space-y-4">
                <p className="font-['Poppins'] font-medium text-[#b4b4b4] text-sm lg:text-base">
                  or continue with
                </p>
                <div className="flex justify-center gap-4 lg:gap-[21px]">
                  <img
                    className="w-8 h-8 lg:w-[41px] lg:h-[41px] cursor-pointer hover:scale-110 transition-transform"
                    alt="Facebook"
                    src="/facebook.png"
                  />
                  <img
                    className="w-8 h-8 lg:w-[41px] lg:h-[41px] cursor-pointer hover:scale-110 transition-transform"
                    alt="Apple"
                    src="/apple.png"
                  />
                  <img
                    className="w-8 h-8 lg:w-[41px] lg:h-[41px] cursor-pointer hover:scale-110 transition-transform"
                    alt="Google"
                    src="/google.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel with dark background */}
        <div className="flex-1 order-1 lg:order-2 min-h-[300px] lg:min-h-screen">
          <Card className="w-full h-full rounded-none lg:rounded-[15px] lg:m-4 border-none overflow-hidden">
            <CardContent className="p-0">
              <div className="w-full h-full bg-[#000741] rounded-none lg:rounded-[15px] p-6 lg:p-8 flex flex-col justify-between min-h-[300px] lg:min-h-[calc(100vh-2rem)]">
                {/* Phone number */}
                <div className="flex justify-end items-center gap-2 text-white">
                  <PhoneIcon className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                  <span className="font-['Poppins'] text-xs lg:text-[15px]">
                    + xx xxxx-xxxx
                  </span>
                </div>

                {/* Center logo - Original Henko logo */}
                <div className="flex justify-center items-center flex-1">
                  <img
                    className="w-full max-w-[300px] lg:max-w-[602px] h-32 lg:h-64 object-contain"
                    alt="Henko Logo"
                    src="/henko logo.png"
                  />
                </div>

                {/* Bottom text */}
                <div className="text-center lg:text-left lg:ml-[98px]">
                  <h1 className="font-['Poppins'] font-semibold text-white text-xl lg:text-[40px] leading-tight">
                    Marketplace de Henko AI
                  </h1>
                  <p className="font-['Poppins'] font-light text-white text-sm lg:text-xl mt-2 lg:mt-4 max-w-full lg:max-w-[396px]">
                    Monetiza tus agentes de Inteligencia Artificial
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};