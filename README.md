# MBTI Expo Dashboard

Real-time MBTI personality type dashboard for the AWS Summit Seoul 2026 Kiro booth. Visitors take an MBTI test at the booth and results display live across 4 fullscreen monitor pages.

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/1` | Hero | Animated Kiro ghost mascot with flip-digit participant counter |
| `/2` | MBTI Bubbles | Physics-based bubble chart of 16 MBTI types. Right sidebar rotates through type profiles with strengths, top-3 Kiro features, and compatibility |
| `/3` | Question Showcase | Featured MBTI question with overall + per-occupation answer bars on the left; rolling list of 6 questions on the right |
| `/4` | Survey Results | 2x2 grid — ranked bars (occupation), arc rings (AI usage frequency), proportional blocks (usage style), sized circles (AI expectations) |

All pages auto-rotate data every 5 seconds with animated transitions.

## Data

- **12 MBTI questions** across 4 axes (EI, SN, TF, JP — 3 each)
- **4 survey questions**: occupation, AI usage frequency, usage style, AI expectations
- **16 MBTI type profiles** with descriptions, quotes, strengths, Kiro feature mappings, and compatibility matches
- **6 Kiro features** (Steering, Powers, Autonomous Agent, Specs, Vibe Coding, Hooks) scored by MBTI letter weights

Data is stored in `localStorage` and synced via custom `mbti-update` events. Sample data is auto-seeded on startup.

## Tech Stack

- **React 19** + **Vite 8**
- **React Router** — 4-page SPA routing
- **Framer Motion** — animated bars, bubbles, rolling lists, card transitions
- **Canvas** — starfield night sky background
- **CSS custom properties** — unified type scale (`--fs-hero` through `--fs-micro`)

## Project Structure

```
src/
  pages/          HeroView, MBTIBattleView, SurveyView1, SurveyView2
  components/     FlipCounter (flip-digit animation), NightSky (canvas starfield)
  data/           mbti.js (types + scoring), mbtiQuestions.js, survey.js, sampleData.js
  styles/         global.css
  assets/         kiro-ghost.svg, hero.png, kiro_characters/ (16 type PNGs)
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview   # preview production build locally
```
