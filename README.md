# Migajeros TIVA 2026

Volleyball team management app for **Equipo TIVA 2026**.

**Live:** https://migajeros-tiva-2026.vercel.app/

## What it does

Displays a player table loaded from a CSV file with:

- Player names and contact emails
- Availability per day (Tuesday, Thursday, Saturday)
- Game stats: games played, games starting, played last game
- Volleyball positions: armador, opuesto, punta, central, libero

## Stack

- React 19 + TypeScript
- Vite
- Deployed on Vercel

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Data

Player data lives in `public/team_data_completed.csv`. Update this file to add/edit players.
