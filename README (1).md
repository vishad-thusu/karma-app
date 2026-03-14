# KARMA — Personal OS

A gamified fitness, habit, and life tracker built as a single-page web app.

## Features

- **Auth System** — Login/signup with credentials displayed on profile
- **Dashboard** — 3D rotating avatar, daily quote, horoscope, stat overview, card navigation
- **Habits** — 5-per-row grid, mouse-following glow, custom habit creation, XP/HP tracking, rep counts
- **Daily Tasks** — 14-day horizontal scroller, auto-collapse non-active blocks, time-based AI recommendations, water tracker
- **To-Do** — Separate page with date/time scheduling
- **Meals** — 3-column grid, P/C/F bars per card, macro panel, smart recommendations
- **Progress** — Dashboard grid with weight chart, completion bars, heatmap, stat radar, AI coach (Claude API)
- **Expenses** — Add/delete transactions, category breakdown, monthly navigation
- **Stat Detail Pages** — STR/CON/INT/PER deep dives with linked habits/dailies, suggested additions

## Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/karma.git
cd karma

# Open locally
open index.html

# OR use a local server
npx serve .
```

## Deploy to GitHub Pages

1. Push to `main` branch
2. Go to Settings → Pages → Source: `main` / `/ (root)`
3. Live at `https://YOUR_USERNAME.github.io/karma/`

## Tech

- Vanilla HTML/CSS/JS (no build step)
- Chart.js for charts
- SF Pro Display font stack (Apple system font)
- Anthropic Claude API for AI coach
- localStorage for data persistence

## Design

- **Font**: SF Pro Display (-apple-system stack)
- **Theme**: Refined dark, muted accent colors (not neon)
- **Logo**: Minimal K monogram, letter-spaced uppercase branding
- **Avatar**: SVG wireframe with organ hints, 3D CSS rotation
