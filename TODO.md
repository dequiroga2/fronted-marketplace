# Marketplace Futurista Redesign - Plan de Trabajo

## Objetivo
Rediseñar la pantalla del Marketplace con una estética futurista/neón (azul-violeta con acentos rosa), animaciones y efectos de movimiento, sin eliminar ninguna funcionalidad existente.

## Alcance
- Mantener toda la lógica existente: búsqueda, filtro por categoría, navegación a /chatbotvideo, menú de usuario y logout, tarjetas y CTA.
- Solo cambios visuales (TailwindCSS + utilidades personalizadas).

## Pasos

1) Estilos Globales (tailwind.css)
- Añadir keyframes y utilidades personalizadas:
  - Animaciones: aurora-gradient-pan, grid-scroll, glow-pulse, shine-sweep, float-slow, gradient-x.
  - Utilidades:
    - bg-aurora (fondo con gradientes animados, blur, mezcla)
    - bg-grid (rejilla animada sutil)
    - glass-panel (glassmorphism para contenedores)
    - neon-shadow (sombra neón)
    - glow-border (borde gradiente animado via ::before)
    - shine (barrido de brillo via ::after)
    - btn-neon (botón gradiente con glow)
    - card-fx (hover lift + escala + glow)
    - beam-divider (divisor con gradiente animado)

2) Pantalla del Marketplace (src/screens/Marketplace/Marketplace.tsx)
- Mantener la estructura y lógica.
- Agregar capas de fondo animadas (bg-aurora + bg-grid).
- Header: aplicar glass-panel y beam-divider, micro-interacciones en iconos.
- Hero: tipografía con gradiente animado y sutil float.
- Categorías: pills con glow-border en seleccionado, hover lift.
- Stats: cards de vidrio con borde animado y glow.
- Tarjetas de agentes: hover lift (card-fx), border glow, shine sweep, zoom de imagen.
- Botones: usar btn-neon en CTA principal, mantener handlers.
- Footer: agregar beam-divider y glow de marca.

3) Verificación
- Arrancar la app y validar visualmente (animaciones suaves, sin afectar performance).
- Ajustar intensidades/duraciones si es necesario.

## Checklists

- [ ] Añadir utilidades y keyframes a tailwind.css
- [ ] Actualizar estilos de Marketplace.tsx
- [ ] Probar visualmente en /marketplace
- [ ] Confirmar responsivo y accesible
