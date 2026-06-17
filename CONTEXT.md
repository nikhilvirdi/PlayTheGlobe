# PlayTheGlobe — Master Context

## Stack
- Runtime: Node.js v20 LTS
- Package Manager: pnpm workspaces
- Frontend: SolidJS + Vite + Tailwind CSS v4
- Globe: Three.js + globe.gl
- Animation: GSAP
- Audio: Howler.js
- Backend: Express.js + TypeScript
- Realtime: Socket.io
- Database: SurrealDB
- Cache: Upstash Redis
- AI: Google Gemini Pro
- Auth: jsonwebtoken + bcrypt
- Storage: Cloudflare R2
- Tooling: Turborepo + Biome + tsx

## Monorepo Structure
playtheglobe/
├── apps/
│   ├── web/        → SolidJS + Vite frontend
│   └── server/     → Express.js backend
├── packages/
│   ├── types/      → shared TypeScript types
│   └── config/     → shared tsconfig + biome
├── python/         → dataset builder sidecar
├── CONTEXT.md      → master context (this file)
├── PROGRESS.md     → build progress tracker
├── .env.example
├── turbo.json
├── pnpm-workspace.yaml
├── biome.json
└── package.json

## Architecture Decisions
- pnpm workspaces, not npm or yarn
- Biome only, no ESLint no Prettier
- TypeScript strict mode everywhere
- Socket.io for all realtime features
- SurrealDB handles relational + document + graph data
- Upstash Redis for sessions, duels, leaderboard cache
- Gemini Pro for all AI hint generation
- Python sidecar runs offline only for dataset building
- No authentication via third party, JWT + bcrypt only
- Desktop first UI
- Pixel art retro aesthetic, multicolor earth palette
- Press Start 2P font for all typography

## Game Modes
Flag Mode, Globe Mode, Reverse Mode, Hard Mode, Blitz Speedrun, Trivia Blitz, Population Poker, Area Showdown, Oldest/Youngest Nation, GDP Ladder, Capital Chaos, Currency Match, Language Roots, Timeline Nation, Who's From Where, Anthem Drop, Shape Shifter, Coat of Arms, Flag Builder, Border Chain, Elimination Mode, Head to Head Live Duels, Daily Gauntlet

## Hint System
4 slots per round, AI generated, fame-aware calibration
Slot 1 → 10% points deducted, maximally vague
Slot 2 → 15% points deducted
Slot 3 → 35% points deducted
Slot 4 → 50% points deducted, direct but never obvious for famous countries

## Scoring Formula
Global Score = f(Streak + Points + Countries Collected)
Daily Gauntlet win = flat bonus points added

## Current Phase
Phase 1 — Monorepo scaffold
