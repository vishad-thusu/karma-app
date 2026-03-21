# KARMA — Production Architecture

## Overview
KARMA is a gamified personal OS with RPG mechanics, built as a vanilla JS SPA.
No build tools, no bundler — deploys as static files anywhere.

## Design Principles
1. **Zero build step** — `<script>` tags, global scope, no npm/webpack
2. **Page isolation** — each page owns its render + handlers, editable independently
3. **API abstraction** — all external calls go through `api.js` (swap localStorage → REST without touching pages)
4. **State abstraction** — all state through `state.js` (swap localStorage → DB later)
5. **Dependency order** — `index.html` controls load order; core → shared → pages

## File Structure
```
karma-app/
├── index.html                 # Shell: HTML skeleton + <script> tags in order
├── README.md                  # This file
│
├── css/
│   ├── tokens.css             # Design variables (:root, light mode)
│   ├── base.css               # Reset, scrollbar, body, background, keyframes
│   ├── layout.css             # App shell, sidebar, nav, main area, pages
│   ├── components.css         # Cards, buttons, modals, forms, tags, chips
│   └── pages/
│       ├── auth.css           # Login, onboarding, analysis orb
│       ├── dashboard.css      # Hero, stats grid, quote, horoscope, arsenal
│       ├── daily.css          # Day scroll, timeline, widgets, boost cards
│       ├── habits.css         # Habit tiles, grid, tags, prompts
│       ├── workout.css        # Gym tracker, session cards, program editor
│       ├── todos.css          # Task cards, form, tags
│       ├── nutrition.css      # Meal cards, macros, recipe modal
│       ├── progress.css       # Charts, radar, heatmap, stat details
│       ├── expenses.css       # Expense grid, budget, lent, insights
│       └── journal.css        # Entries, calendar grid, gratitude
│
├── js/
│   ├── config.js              # Constants: DEF_HABITS, DEF_PROGRAM, MEALS, QUOTES, etc.
│   ├── state.js               # S object, save(), load(), migrations, init
│   ├── api.js                 # API abstraction: aria.ask(), aria.analyze(), etc.
│   ├── utils.js               # todayKey, dateKey, nowTimeStr, getLast, export
│   ├── xp.js                  # addXP, removeXP, damage, stat calculations
│   ├── icons.js               # SVG_I object (all inline SVG icons)
│   ├── ui.js                  # showToast, modal helpers, glow, particles, theme
│   ├── aria.js                # ariaAvatar, ariaHeader, typewriter, ask modal
│   ├── router.js              # goTo, renderPage, showScreen, updateSB, miniAvSVG
│   ├── app.js                 # Boot: init state, check auth, start router
│   └── pages/
│       ├── auth.js            # renderAuth, login, signup, onboarding
│       ├── dashboard.js       # renderDash, charts stub, avatar animation
│       ├── daily.js           # renderDaily, timeline, insights, water, weight
│       ├── habits.js          # renderHabits, log, prompts, categories
│       ├── workout.js         # renderWorkout, gym tracker, program editor
│       ├── todos.js           # renderTodos, add/delete/toggle
│       ├── nutrition.js       # renderMeals, recipes, AI detect, macros
│       ├── progress.js        # renderProgress, charts, heatmap, radar
│       ├── expenses.js        # renderExpenses, budget, lent, AI insights
│       └── journal.js         # renderJournal, calendar, gratitude, AI analyze
│
└── assets/                    # Future: images, fonts, etc.
```

## Load Order (index.html)
```
1. css/tokens.css
2. css/base.css
3. css/layout.css
4. css/components.css
5. css/pages/*.css

6. js/config.js        ← Constants only, no dependencies
7. js/state.js         ← S object, save/load. Depends on: config.js
8. js/utils.js         ← Pure utilities. Depends on: nothing
9. js/xp.js            ← XP engine. Depends on: state.js, utils.js
10. js/icons.js        ← SVG_I. No dependencies
11. js/ui.js           ← Toast, modal, glow. Depends on: utils.js
12. js/api.js          ← API layer. Depends on: state.js
13. js/aria.js         ← AI features. Depends on: api.js, ui.js, icons.js
14. js/router.js       ← Navigation. Depends on: state.js, ui.js, icons.js
15. js/pages/auth.js   ← Depends on: state, ui, router, config
16. js/pages/dashboard.js
17. js/pages/daily.js
18. js/pages/habits.js
19. js/pages/workout.js
20. js/pages/todos.js
21. js/pages/nutrition.js
22. js/pages/progress.js
23. js/pages/expenses.js
24. js/pages/journal.js
25. js/app.js          ← LAST: boots the app, calls init

## API Abstraction (`api.js`)
```js
// Current: direct Anthropic calls
// Future: your backend endpoints
const API = {
  baseUrl: 'https://api.anthropic.com/v1/messages',
  
  async ask(prompt, maxTokens = 600) { ... },
  async askJSON(prompt, maxTokens = 400) { ... },
  
  // Future REST endpoints
  // async saveState() { ... }
  // async loadState() { ... }
  // async syncMeals() { ... }
};
```

## State Management (`state.js`)
```js
// Single source of truth
let S = {};

const State = {
  load()    { ... },  // From localStorage (later: API)
  save()    { ... },  // To localStorage (later: API)  
  reset()   { ... },  // Full reset
  migrate() { ... },  // Schema migrations
  export()  { ... },  // JSON download
};
```

## Page Contract
Every page file follows this pattern:
```js
// js/pages/habits.js

// Page-local state
let habCat = 'all';

// Main render (called by router)
function renderHabits() { ... }

// Page-specific handlers (called from onclick in rendered HTML)
function logHabWithTime(id, event) { ... }
function openHabitModal() { ... }

// Page-specific helpers (used only within this file)
function habCard(h, type) { ... }
```

## Cross-Page Dependencies
| Shared Function     | Lives In    | Called By                          |
|---------------------|-------------|------------------------------------|
| save()              | state.js    | ALL pages                          |
| showToast(msg)      | ui.js       | ALL pages (84 calls)               |
| todayKey()          | utils.js    | ALL pages (27 calls)               |
| addXP(xp,stat,el)  | xp.js       | habits, workout, nutrition, todos  |
| updateSB()          | router.js   | habits, workout, nutrition, todos  |
| goTo(page)          | router.js   | dashboard, daily, journal          |
| ariaHeader(t,s)     | aria.js     | workout, progress, expenses, journal|
| getDailies(dk)      | habits.js*  | daily, progress, dashboard         |
| getBoosters()       | habits.js*  | daily, journal                     |
| getAllMeals()        | nutrition.js*| daily                             |
| getTodayMacros()    | nutrition.js*| daily, journal                     |
| getTodayTodos(dk)   | habits.js*  | daily                              |
| logActivityToTimeline| workout.js* | nutrition (meal logging)           |

*These are "query" functions that read state. They live in their primary page
 but are called cross-page. This is acceptable in global scope architecture.

## Future Migration Path
1. **Phase 1** (now): Split files, global scope, localStorage
2. **Phase 2**: Add api.js backend calls, keep localStorage as cache
3. **Phase 3**: ES modules (`import/export`), needs a bundler
4. **Phase 4**: Framework migration (React/Svelte) if needed
```
