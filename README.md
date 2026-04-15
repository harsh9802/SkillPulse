# Synthetique — CS Practice App

AI-powered daily CS practice with MCQs and predict-the-output challenges, built with **Next.js 14 App Router**.

---

## Project Structure

```
synthetique/
├── app/
│   ├── layout.js                  # Root layout (fonts, metadata)
│   ├── page.js                    # Client shell — screen router
│   └── api/
│       ├── question/route.js      # POST /api/question  → generates MCQ or predict-output
│       └── hint/route.js          # POST /api/hint      → generates a contextual hint
│
├── components/
│   ├── layout/
│   │   ├── TopNav.js + .module.css
│   │   ├── Sidebar.js + .module.css
│   │   └── UI.js + .module.css    # Shared primitives: Card, Chip, BtnPrimary, Spinner…
│   │
│   ├── topic-selection/
│   │   ├── TopicSelection.js
│   │   └── TopicSelection.module.css
│   │
│   ├── dashboard/
│   │   ├── Dashboard.js
│   │   └── Dashboard.module.css
│   │
│   ├── practice/
│   │   ├── PracticeScreen.js      # Orchestrates question fetch, timer, hints
│   │   ├── PracticeScreen.module.css
│   │   ├── QuestionCard.js        # Renders MCQ or predict-output question
│   │   ├── QuestionCard.module.css
│   │   ├── CodeBlock.js           # Syntax-highlighted code display
│   │   └── CodeBlock.module.css
│   │
│   └── summary/
│       ├── Summary.js
│       └── Summary.module.css
│
├── lib/
│   ├── constants.js               # TOPICS list, DIFFICULTIES array
│   └── highlight.js               # Lightweight regex syntax highlighter
│
├── styles/
│   └── globals.css                # CSS custom properties (design tokens) + animations
│
└── package.json
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set your Anthropic API key

Create a `.env.local` file at the project root:

```env
GEMINI_API_KEY=AIza...
```

Then update `app/api/question/route.js` and `app/api/hint/route.js` to read it:

```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': process.env.ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
},
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## User Flow

1. **Topic Selection** — pick one or more CS domains (Data Structures, Algorithms, OS, Networks, Databases, Web Dev)
2. **Dashboard** — see your daily matrix, XP, runtime stats, upcoming tracks
3. **Practice** — 10 AI-generated questions alternating between:
   - **MCQ** — conceptual questions on time complexity, best practices, theory
   - **Predict the Output** — read a short JS/Python snippet and pick the correct output
4. **Summary** — score breakdown, points earned, global leaderboard

---

## Design System

All design tokens live in `styles/globals.css` as CSS custom properties.
Every component uses **CSS Modules** — no global class collisions.

Key tokens:

| Token | Value |
|---|---|
| `--bg` | `#0b1326` (midnight blue) |
| `--primary` | `#c3f5ff` |
| `--primary-container` | `#00e5ff` (cyan accent) |
| `--secondary` | `#3eec6f` (success green) |
| `--tertiary` | `#ffe8d5` (warm amber) |
| `--font-display` | Space Grotesk |
| `--font-mono` | JetBrains Mono |
