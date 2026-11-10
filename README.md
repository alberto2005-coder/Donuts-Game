# Donuts Game

[Español](#español) · [English](#english)

---

## Español

### Índice

- [Descripción](#descripción)
- [Cómo se juega](#cómo-se-juega)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación y desarrollo](#instalación-y-desarrollo)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Base de datos (opcional)](#base-de-datos-opcional)
- [Licencia](#licencia)

### Descripción

Adaptación digital del juego de mesa **Donuts**, de Bruno Cathala. Es un juego táctico para **2 jugadores** (o contra la IA) en un tablero de **6 × 6** en el que hay que alinear **5 donuts** antes que el rival.

La particularidad del juego es que cada donut colocado marca la **dirección** en la que el rival está obligado a jugar su siguiente pieza.

### Cómo se juega

1. Los jugadores se alternan colocando donuts de **vainilla** o **chocolate**.
2. El objetivo es conseguir **5 en línea** en horizontal, vertical o diagonal.
3. Cada pieza colocada indica la dirección permitida para la siguiente jugada del rival.
4. Si no hay movimientos válidos en esa dirección, se puede jugar en cualquier casilla libre.
5. Gana quien complete la línea de 5 antes.

### Características

- **Modos de juego**: dos jugadores en el mismo dispositivo o contra la IA.
- **Tres niveles de IA**: fácil, medio y difícil.
- **Direcciones**: horizontal, vertical y las dos diagonales.
- **Detección de victoria** con resaltado de la línea ganadora.
- **Interfaz 3D** con React Three Fiber y animaciones.
- **Efectos de sonido** con Howler.
- **Estado global** con Zustand.

### Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript |
| Bundler | Vite 5 |
| Estilos | Tailwind CSS + shadcn/ui (Radix UI) |
| Estado | Zustand |
| 3D | Three.js + React Three Fiber + Drei |
| Sonido | Howler |
| Backend | Express + TypeScript |
| Datos | Drizzle ORM (opcional) |

### Requisitos

- **Node.js 18 o superior**.
- npm (incluido con Node.js).

### Instalación y desarrollo

```bash
git clone https://github.com/alberto2005-coder/Donuts-Game.git
cd Donuts-Game
npm install
npm run dev
```

Abre [http://localhost:5000](http://localhost:5000).

### Scripts disponibles

| Script | Función |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Build de producción (cliente + servidor) |
| `npm start` | Ejecuta el build en modo producción |
| `npm run check` | Comprueba los tipos con TypeScript |
| `npm run db:push` | Aplica el esquema de Drizzle a la base de datos |

### Estructura del proyecto

```text
Donuts-Game/
├── client/
│   ├── index.html
│   ├── public/              # Texturas, sonidos, fuentes y modelos
│   └── src/
│       ├── components/      # UI y componentes del juego
│       ├── lib/
│       │   ├── gameLogic/   # Reglas, IA, victoria y generación del tablero
│       │   └── stores/      # Stores de Zustand y audio
│       ├── pages/
│       └── main.tsx
├── server/                  # Express (sirve la app en producción)
├── shared/                  # Tipos y esquema compartidos
├── drizzle.config.ts
├── package.json
├── LICENSE
└── README.md
```

### Base de datos (opcional)

Para jugar **no hace falta base de datos**: el servidor usa almacenamiento en memoria. Solo si quieres usar `npm run db:push` necesitas definir `DATABASE_URL` (PostgreSQL, p. ej. Neon):

```bash
DATABASE_URL=postgresql://usuario:password@host:5432/donuts npm run db:push
```

### Licencia

Este proyecto se distribuye bajo la **licencia MIT**. Consulta [LICENSE](LICENSE).

---

## English

### Table of contents

- [Overview](#overview)
- [How to play](#how-to-play)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Install and develop](#install-and-develop)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Database (optional)](#database-optional)
- [License](#license)

### Overview

A digital adaptation of Bruno Cathala's board game **Donuts**. It is a tactical game for **2 players** (or against the AI) on a **6 × 6** board where you race to line up **5 donuts** before your opponent.

The twist: every placed donut sets the **direction** in which your opponent must play their next piece.

### How to play

1. Players take turns placing **vanilla** or **chocolate** donuts.
2. The goal is **5 in a row** horizontally, vertically or diagonally.
3. Each placed piece dictates the allowed direction for the opponent's next move.
4. If there are no valid moves in that direction, any empty cell can be played.
5. The first player to complete a line of 5 wins.

### Features

- **Game modes**: two players on the same device or against the AI.
- **Three AI levels**: easy, medium and hard.
- **Directions**: horizontal, vertical and both diagonals.
- **Victory detection** with the winning line highlighted.
- **3D interface** with React Three Fiber and animations.
- **Sound effects** with Howler.
- **Global state** with Zustand.

### Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Bundler | Vite 5 |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| State | Zustand |
| 3D | Three.js + React Three Fiber + Drei |
| Audio | Howler |
| Backend | Express + TypeScript |
| Data | Drizzle ORM (optional) |

### Requirements

- **Node.js 18 or later**.
- npm (bundled with Node.js).

### Install and develop

```bash
git clone https://github.com/alberto2005-coder/Donuts-Game.git
cd Donuts-Game
npm install
npm run dev
```

Open [http://localhost:5000](http://localhost:5000).

### Available scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (client + server) |
| `npm start` | Runs the production build |
| `npm run check` | Type-checks the project |
| `npm run db:push` | Applies the Drizzle schema to the database |

### Project structure

```text
Donuts-Game/
├── client/
│   ├── index.html
│   ├── public/              # Textures, sounds, fonts and models
│   └── src/
│       ├── components/      # UI and game components
│       ├── lib/
│       │   ├── gameLogic/   # Rules, AI, victory and board generation
│       │   └── stores/      # Zustand stores and audio
│       ├── pages/
│       └── main.tsx
├── server/                  # Express (serves the app in production)
├── shared/                  # Shared types and schema
├── drizzle.config.ts
├── package.json
├── LICENSE
└── README.md
```

### Database (optional)

You do **not** need a database to play: the server uses in-memory storage. Only `npm run db:push` requires `DATABASE_URL` (PostgreSQL, e.g. Neon):

```bash
DATABASE_URL=postgresql://user:password@host:5432/donuts npm run db:push
```

### License

This project is released under the **MIT License**. See [LICENSE](LICENSE).
