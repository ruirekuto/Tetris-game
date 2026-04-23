# Tetris Game

A browser-based Tetris game built with React, TypeScript, and Vite.

## Overview

This project implements a playable Tetris clone in the browser with a simple React component structure and custom hooks for board state, player control, scoring, and timing.

## Features

- Move, rotate, and drop tetrominoes
- Clear lines and track score
- Level and row progression
- Hold piece support
- Keyboard shortcuts for swapping to specific tetrominoes

## Tech Stack

- React 19
- TypeScript
- Vite

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open `http://localhost:5173/`.

## Build

Create a production build:

```bash
npm run build
```

Preview the built app locally:

```bash
npm run preview
```

## Controls

- `Left / Right`: Move
- `Down`: Soft drop
- `Up`: Rotate
- `Space`: Random/switch tetromino
- `C` or `Shift`: Hold piece
- `I J L O S T Z`: Switch to a specific tetromino

## Project Structure

```text
src/
  components/   UI components
  hooks/        Game state hooks
  utils/        Tetromino and board helpers
public/         Static assets
unity-src/      Unity-related source files
```

## Notes

- `node_modules/`, `dist/`, and `report/` are not intended for version control.
- The web app is the main runnable version in this repository.
