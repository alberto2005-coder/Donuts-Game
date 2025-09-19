
# 🍩 Donuts Game

Un juego táctico de mesa para 2 jugadores basado en el juego de Bruno Cathala.

## Descripción

Donuts es un juego estratégico donde los jugadores deben colocar sus piezas (donuts de vainilla o chocolate) en un tablero de 6x6 para conseguir 5 en línea. Cada movimiento determina la dirección en la que el oponente debe jugar su siguiente pieza.

## Tecnologías

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: Radix UI
- **Estado**: Zustand

## Ejecutar en Visual Studio Code

### Prerrequisitos

1. **Node.js** (versión 18 o superior)
2. **Visual Studio Code**
3. **Git**

### Configuración inicial

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd donuts-game
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

### Desarrollo

1. **Ejecuta el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Abre tu navegador en:**
   ```
   http://localhost:5000
   ```

### Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Ejecuta la aplicación en modo producción
- `npm run check` - Verifica tipos de TypeScript

### Estructura del proyecto

```
├── client/               # Frontend React
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── lib/         # Lógica del juego y stores
│   │   └── pages/       # Páginas
├── server/              # Backend Express
├── shared/              # Tipos compartidos
└── package.json
```

### Extensiones recomendadas para VSCode

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

### Desarrollo en VSCode

1. Abre el proyecto en VSCode
2. Instala las extensiones recomendadas
3. Ejecuta `npm run dev` en la terminal integrada
4. ¡Comienza a desarrollar!

## Cómo jugar

1. Los jugadores alternan turnos colocando sus donuts en el tablero
2. El objetivo es conseguir 5 donuts en línea (horizontal, vertical o diagonal)
3. Cada pieza colocada tiene una dirección que determina dónde puede jugar el oponente
4. Si no hay movimientos válidos en la dirección requerida, se puede jugar en cualquier lugar

¡Disfruta del juego! 🎮
