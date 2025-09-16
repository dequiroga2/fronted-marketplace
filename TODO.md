# TODO - Mejoras Chatbot Onboarding

## ✅ Completado
- [x] Análisis de la estructura actual
- [x] Plan de implementación definido
- [x] Extraer lógica del webhook de ChatbotOnboarding.tsx a Layout.tsx
- [x] Implementar autenticación con useAuth() en Layout.tsx
- [x] Mejorar manejo de estado de conversaciones
- [x] Hacer header transparente con backdrop-blur
- [x] Añadir sombras flotantes al botón de tema y usuario
- [x] Implementar dropdown funcional para usuario
- [x] Añadir funcionalidad de logout
- [x] Mostrar email del usuario en dropdown
- [x] Implementar transiciones más suaves (duration-500 ease-in-out)
- [x] Mostrar email real del usuario autenticado
- [x] Hacer barra de escritura más redondeada (rounded-full)
- [x] Integrar con lógica del webhook

## 🔄 En Progreso
- [ ] Verificar que todos los componentes funcionen correctamente

## 🔧 Correcciones Finales Completadas
- [x] Reducir tamaño del LogoSection para evitar scroll
- [x] Arreglar botón del sidebar que no funcionaba al cerrarse
- [x] Eliminar línea de separación del header en modo oscuro

## 📋 Pendiente

### Layout.tsx
- [x] Extraer e implementar lógica del webhook del archivo obsoleto
- [x] Integrar autenticación real con useAuth()
- [x] Mejorar manejo del estado de conversaciones
- [x] Implementar funcionalidad de historial de chats

### Header.tsx
- [x] Hacer header transparente con backdrop-blur
- [x] Añadir sombras flotantes al botón de tema y usuario
- [x] Implementar dropdown funcional para usuario
- [x] Añadir funcionalidad de logout
- [x] Mostrar email del usuario en dropdown

### Sidebar.tsx
- [x] Implementar transiciones más suaves (duration-500 ease-in-out)
- [x] Mostrar email real del usuario autenticado
- [x] Mejorar historial de conversaciones
- [x] Añadir animaciones de entrada/salida

### ChatArea.tsx
- [x] Hacer barra de escritura más redondeada (rounded-full)
- [x] Integrar con lógica del webhook
- [x] Mejorar UX de envío de mensajes

## 🧪 Testing
- [ ] Probar funcionalidad del webhook
- [ ] Verificar transiciones suaves del sidebar
- [ ] Probar dropdown de usuario y logout
- [ ] Verificar que el email se muestre correctamente
- [ ] Probar historial de conversaciones

## 🎯 Objetivos Principales
1. ✅ Webhook funcionando (extraer de archivo obsoleto)
2. ✅ Email funcionando en sidebar y historial
3. ✅ Transiciones suaves en sidebar
4. ✅ Barra de escritura más redondeada
5. ✅ Header transparente con sombras flotantes
6. ✅ Botón de usuario funcional con dropdown
