# 📝 Guía de Personalización de Chatbots

## 1️⃣ CAMBIAR INFORMACIÓN DE LAS CARDS EN EL MARKETPLACE

### Ubicación del archivo:
`src/screens/Marketplace/Marketplace.tsx`

### Busca el array `chats` (líneas 49-107):

```typescript
const chats = [
  {
    id: 2,
    name: "Fase 1",  // ← CAMBIA ESTO: Nombre que aparece en la card
    description: "Chatbot especializado en la primera fase de desarrollo...",  // ← CAMBIA ESTO: Descripción de la card
    price: "$39",  // ← CAMBIA ESTO: Precio
    period: "/mes",  // ← CAMBIA ESTO: Período (ej: "/mes", "/año")
    rating: 4.7,  // ← CAMBIA ESTO: Rating (de 0 a 5)
    users: "8.3k",  // ← CAMBIA ESTO: Número de usuarios
    category: "Desarrollo",  // ← CAMBIA ESTO: Categoría que aparece en la badge
    featured: false,  // ← CAMBIA ESTO: true para mostrar badge "Featured"
    gradient: "from-green-500 to-teal-600",  // ← CAMBIA ESTO: Colores del ícono
    route: "/fase1",  // ⚠️ NO CAMBIES ESTO (debe coincidir con la ruta)
  },
  // ... Fase 2 y Fase 3 igual
];
```

### Ejemplo de personalización para Fase 1:

```typescript
{
  id: 2,
  name: "Marketing Digital Pro",  // ✅ Nuevo nombre
  description: "Experto en estrategias de marketing digital, SEO y redes sociales. Aumenta tu presencia online.",  // ✅ Nueva descripción
  price: "$49",  // ✅ Nuevo precio
  period: "/mes",
  rating: 4.9,  // ✅ Nuevo rating
  users: "15.2k",  // ✅ Nuevos usuarios
  category: "Marketing",  // ✅ Nueva categoría
  featured: true,  // ✅ Ahora es featured
  gradient: "from-pink-500 to-red-600",  // ✅ Nuevos colores (rosa a rojo)
  route: "/fase1",  // ⚠️ NO CAMBIAR
},
```

### Opciones de gradientes de colores:
```typescript
// Azules
"from-blue-500 to-cyan-600"
"from-blue-500 to-purple-600"

// Verdes
"from-green-500 to-teal-600"
"from-emerald-500 to-green-600"

// Naranjas/Rojos
"from-orange-500 to-red-600"
"from-red-500 to-pink-600"

// Púrpuras/Rosas
"from-purple-500 to-pink-600"
"from-violet-500 to-purple-600"

// Amarillos
"from-yellow-500 to-orange-600"
"from-amber-500 to-yellow-600"
```

---

## 2️⃣ CAMBIAR LA FRASE DE BIENVENIDA, DESCRIPCIÓN Y CARDS DEL CHATBOT

### Para Fase 1:
**Archivo:** `src/screens/ChatbotFase1/ChatbotFase1.tsx`

```typescript
const botConfig = {
  id: "fase1",  // ⚠️ NO CAMBIAR
  name: "Fase 1",  // ← CAMBIA ESTO: Nombre del chatbot
  description: "Chatbot especializado en la primera fase...",  // ← CAMBIA ESTO: Descripción
  icon: "/expansion.png",  // ← CAMBIA ESTO: Ruta de la imagen de fondo
  welcomeTitle: "Bienvenido a la Fase 1",  // ← CAMBIA ESTO: Título de bienvenida
  webhookUrl: "https://automation.luminotest.com/webhook/fase1-webhook-url",  // ← CAMBIA ESTO: Tu webhook
  storageKey: "chatbot-fase1-history",  // ⚠️ NO CAMBIAR
};
```

### Ejemplo de personalización completa para Fase 1:

```typescript
import { MessageSquare, Zap, TrendingUp } from 'lucide-react';

const botConfig = {
  id: "fase1",  // ⚠️ NO CAMBIAR
  name: "Marketing Digital Pro",  // ✅ Nuevo nombre
  description: "Tu asistente experto en marketing digital. Especializado en SEO, redes sociales, email marketing y estrategias de contenido para hacer crecer tu negocio.",  // ✅ Nueva descripción
  icon: "/marketing-bg.jpg",  // ✅ Nueva imagen (debes subirla a /public/)
  welcomeTitle: "¡Bienvenido a Marketing Digital Pro!",  // ✅ Nuevo título
  webhookUrl: "https://tu-webhook.com/marketing-fase1",  // ✅ Tu webhook real
  storageKey: "chatbot-fase1-history",  // ⚠️ NO CAMBIAR
  cards: [  // ✅ NUEVO: Cards personalizadas (opcional)
    {
      icon: <MessageSquare size={16} className="text-white" />,
      title: "Estrategias SEO",
      description: "Optimiza tu posicionamiento en buscadores"
    },
    {
      icon: <Zap size={16} className="text-white" />,
      title: "Redes Sociales",
      description: "Aumenta tu presencia en redes sociales"
    },
    {
      icon: <TrendingUp size={16} className="text-white" />,
      title: "Analytics",
      description: "Mide y mejora tus resultados"
    }
  ]
};
```

**Nota:** Si no incluyes el campo `cards`, se usarán las cards por defecto (Servicios, Precios, Soporte).

### Para Fase 2:
**Archivo:** `src/screens/ChatbotFase2/ChatbotFase2.tsx`

```typescript
import { Target, DollarSign, Users } from 'lucide-react';

const botConfig = {
  id: "fase2",  // ⚠️ NO CAMBIAR
  name: "Ventas y Conversión",  // ✅ Cambia esto
  description: "Experto en técnicas de ventas, copywriting persuasivo y optimización de conversiones.",  // ✅ Cambia esto
  icon: "/ventas-bg.jpg",  // ✅ Cambia esto
  welcomeTitle: "¡Bienvenido a Ventas y Conversión!",  // ✅ Cambia esto
  webhookUrl: "https://tu-webhook.com/ventas-fase2",  // ✅ Cambia esto
  storageKey: "chatbot-fase2-history",  // ⚠️ NO CAMBIAR
  cards: [  // ✅ Cards personalizadas
    {
      icon: <Target size={16} className="text-white" />,
      title: "Copywriting",
      description: "Textos que venden y convierten"
    },
    {
      icon: <DollarSign size={16} className="text-white" />,
      title: "Embudos de Venta",
      description: "Optimiza tu proceso de ventas"
    },
    {
      icon: <Users size={16} className="text-white" />,
      title: "CRM",
      description: "Gestiona tus clientes eficientemente"
    }
  ]
};
```

### Para Fase 3:
**Archivo:** `src/screens/ChatbotFase3/ChatbotFase3.tsx`

```typescript
import { Cpu, Workflow, Rocket } from 'lucide-react';

const botConfig = {
  id: "fase3",  // ⚠️ NO CAMBIAR
  name: "Automatización Avanzada",  // ✅ Cambia esto
  description: "Especialista en automatización de procesos, integraciones y escalamiento de negocios digitales.",  // ✅ Cambia esto
  icon: "/automation-bg.jpg",  // ✅ Cambia esto
  welcomeTitle: "¡Bienvenido a Automatización Avanzada!",  // ✅ Cambia esto
  webhookUrl: "https://tu-webhook.com/automation-fase3",  // ✅ Cambia esto
  storageKey: "chatbot-fase3-history",  // ⚠️ NO CAMBIAR
  cards: [  // ✅ Cards personalizadas
    {
      icon: <Cpu size={16} className="text-white" />,
      title: "Automatización",
      description: "Automatiza tareas repetitivas"
    },
    {
      icon: <Workflow size={16} className="text-white" />,
      title: "Integraciones",
      description: "Conecta todas tus herramientas"
    },
    {
      icon: <Rocket size={16} className="text-white" />,
      title: "Escalamiento",
      description: "Crece sin límites"
    }
  ]
};
```

---

## 3️⃣ CÓMO CAMBIAR LA IMAGEN DE FONDO

### Paso 1: Sube tu imagen
Coloca tu imagen en la carpeta `/public/` del proyecto.

Ejemplo:
- `/public/marketing-bg.jpg`
- `/public/ventas-bg.jpg`
- `/public/automation-bg.jpg`

### Paso 2: Actualiza la ruta en el botConfig
```typescript
icon: "/marketing-bg.jpg",  // La ruta comienza con /
```

---

## 4️⃣ RESUMEN DE CAMBIOS NECESARIOS

### ✅ Para cada fase necesitas cambiar:

**En Marketplace.tsx (líneas 49-107):**
- ✏️ `name` - Nombre de la card
- ✏️ `description` - Descripción de la card
- ✏️ `price` - Precio
- ✏️ `rating` - Calificación
- ✏️ `users` - Número de usuarios
- ✏️ `category` - Categoría
- ✏️ `gradient` - Colores del ícono

**En ChatbotFaseX.tsx:**
- ✏️ `name` - Nombre del chatbot
- ✏️ `description` - Descripción larga
- ✏️ `icon` - Imagen de fondo
- ✏️ `welcomeTitle` - Título de bienvenida
- ✏️ `webhookUrl` - URL de tu webhook
- ✏️ `cards` - Cards personalizadas (opcional)

---

## 5️⃣ EJEMPLO COMPLETO DE PERSONALIZACIÓN

### Fase 1: Marketing Digital

**Marketplace.tsx:**
```typescript
{
  id: 2,
  name: "Marketing Digital Pro",
  description: "Experto en SEO, redes sociales y estrategias de contenido para hacer crecer tu negocio online.",
  price: "$49",
  period: "/mes",
  rating: 4.9,
  users: "15.2k",
  category: "Marketing",
  featured: true,
  gradient: "from-pink-500 to-red-600",
  route: "/fase1",
},
```

**ChatbotFase1.tsx:**
```typescript
const botConfig = {
  id: "fase1",
  name: "Marketing Digital Pro",
  description: "Tu asistente experto en marketing digital. Especializado en SEO, redes sociales, email marketing y estrategias de contenido.",
  icon: "/marketing-bg.jpg",
  welcomeTitle: "¡Bienvenido a Marketing Digital Pro!",
  webhookUrl: "https://tu-webhook.com/marketing",
  storageKey: "chatbot-fase1-history",
};
```

---

## ⚠️ IMPORTANTE: NO CAMBIES ESTOS VALORES

- ❌ `id` - Debe ser único (fase1, fase2, fase3)
- ❌ `route` - Debe coincidir con la ruta en index.tsx
- ❌ `storageKey` - Mantiene el historial separado

---

## 🎨 TIPS DE DISEÑO

1. **Nombres cortos:** Máximo 3-4 palabras
2. **Descripciones claras:** 1-2 líneas que expliquen el valor
3. **Precios coherentes:** Fase 1 < Fase 2 < Fase 3
4. **Imágenes:** Usa imágenes de alta calidad (1920x1080px recomendado)
5. **Colores:** Elige gradientes que representen la temática del chatbot

---

---

## 6️⃣ ICONOS DISPONIBLES PARA LAS CARDS

Puedes usar cualquier icono de Lucide React. Aquí algunos populares:

```typescript
import { 
  MessageSquare, Zap, Users, Target, DollarSign, 
  TrendingUp, Cpu, Workflow, Rocket, Shield, 
  Heart, Star, Award, CheckCircle, Settings,
  Mail, Phone, Calendar, Clock, Search
} from 'lucide-react';
```

**Ejemplo de uso:**
```typescript
{
  icon: <Star size={16} className="text-white" />,
  title: "Premium",
  description: "Acceso a funciones exclusivas"
}
```

---

## 📞 ¿Necesitas ayuda?

Si tienes dudas sobre cómo personalizar algo específico, pregúntame y te ayudo! 🚀
