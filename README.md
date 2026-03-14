# KARMA — Personal Growth OS

A mature, gamified habit + fitness tracker. Inspired by Habitica but built for serious, advanced users.

## Deploy to GitHub Pages (2 minutes)

1. Create a GitHub repo (e.g. `karma-app`)
2. Upload `index.html`
3. Settings → Pages → Source → main branch → Save
4. Live at: `https://yourusername.github.io/karma-app`

## Game Mechanics (based on Habitica's formulas)

**XP to level up:** `0.25 × level² + 10 × level + 139.75` (rounded to nearest 10)

**4 Stats:**
| Stat | Effect |
|---|---|
| STR (Strength) | Physical habits, critical hit chance |
| CON (Constitution) | Max HP, reduces missed-daily damage |
| INT (Intelligence) | +2.5% XP per point — multiplies ALL task rewards |
| PER (Perception) | +1% gold per point, streak bonuses |

**HP System:** Max HP = 50 + (CON × 2). Miss a daily = -5 HP (reduced by CON). Perfect day = +10 HP next morning.

**Titles by level:** Initiate → Apprentice → Warrior → Champion → Veteran → Master → Legend → Apex

**At level 10:** Stat allocation unlocks — you can assign points to any stat.

## Your Personalised Data

Habits, dailies, meals, and weight all pre-loaded from your fitness plan. Toggle NV/Veg on the Meals page for Tuesday veg days.

## 5 Pages

- **Home** — Character card, HP/XP bars, stats, achievements
- **Habits** — Repeatable reps with streak tracking
- **Daily** — 21 daily tasks grouped by time block + weight logger
- **Meals** — Full macro tracker with NV/Veg toggle and Indian diet presets
- **Progress** — Weight chart, completion chart, 28-day heatmap, stat radar
