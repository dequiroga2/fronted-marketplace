export type BotConfig = {
  id: string;
  name: string;
  description: string;
  icon: string;  // Imagen de fondo
  logo: string;  // Logo cuadrado que aparece en el centro
  welcomeTitle: string;
  webhookUrl: string;
  storageKey: string;
  cards?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
};
