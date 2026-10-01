# LearnRush 🚀

**LearnRush** is an interactive, colorful educational web game that turns daily learning quizzes into XP, levels, streaks, and achievements.

> *"Learn something. Play something. Level up yourself."*  
> *Turn a few minutes of learning into points, streaks and achievements.*

---

## ✨ Features

- **Interactive 10-Question Quizzes:** Pick a subject and play randomized 10-question rounds with instant answer verification, explanations, and keyboard shortcuts (`A`–`D`, `1`–`4`, `Enter`).
- **Four Core Subjects:**
  - 🧮 **Mathematics** (Sky Blue) — Arithmetic, fractions, percentages, geometry, algebra, and primes.
  - 🧪 **Science** (Mint Green) — Physics, chemistry, biology, space, and the human body.
  - 🌍 **Geography** (Lavender Purple) — Capitals, continents, oceans, rivers, landmarks, and countries.
  - 🏛️ **History** (Warm Peach) — Ancient civilizations, world events, famous pioneers, and inventions.
- **Real-Time XP System:** Earn **+100 XP** immediately for every correct answer and **+10 XP** for every attempt.
- **5-Tier Level Progression:** Climb from *Beginner* to *Knowledge Master* with animated progress bars and dynamic XP countdowns.
- **Daily Learning Streak & Goal Ring:** Track consecutive days with at least one completed quiz alongside a 10-question daily goal SVG progress ring.
- **6 Unlockable Achievements:** Earn badges with real-time toast notifications, unlock timestamps, and progress hints.
- **Progress Analytics & Weekly Chart:** View overall accuracy, a 7-day activity bar chart by local weekday, per-subject mastery bars, and recent challenge history.
- **Resilient Local Persistence:** All progress is automatically validated and persisted in `localStorage` under a single namespaced key (`learnrush:v1`), with an accessible confirmation modal to reset data anytime.
- **Responsive & Accessible Design:** Crafted for 320px mobile screens through 1440px+ desktop monitors with semantic HTML landmarks, keyboard navigation, focus trapping in modals, WCAG AA contrast, and `prefers-reduced-motion` support.

---

## 🛠️ Technology

- **React 18** (Functional components, Hooks, Context API, ErrorBoundary)
- **Vite** (Fast development server and optimized production bundler)
- **Tailwind CSS v3** (Custom pastel design system tokens and responsive utilities)
- **React Router v6** (`BrowserRouter`, dynamic subject routes, active `NavLink` indicators, and 404 fallback)
- **Framer Motion** (Page transitions, progress bar fills, confetti celebrations, and reduced-motion support)
- **Lucide React** (Crisp, consistent iconography)
- **Web Storage API (`localStorage`)** (Zero-backend client-side persistence with schema sanitization and in-memory fallback)

---

## 🎮 How It Works

### Learning Loop
`Dashboard → Start Challenge → Pick Subject → Answer 10 Questions → Instant Feedback + XP → Results → Track Progress & Achievements`

1. **Dashboard (`/`):** View your current level, XP, daily streak, daily 10-question goal ring, subject cards, and up to 3 recent quiz results.
2. **Challenge (`/challenge`):** Choose from Mathematics, Science, Geography, or History (each backed by 20 validated questions across Easy, Medium, and Challenging difficulties).
3. **Quiz (`/quiz/:subject`):**
   - 10 unique questions are selected per session via Fisher–Yates shuffle.
   - Selecting an answer immediately locks options, displays icon + text + color feedback (`✓ Correct` or `✗ Incorrect`), shows a clear explanation, and awards XP.
   - Correct answers trigger a lightweight Framer Motion confetti and star burst with a floating `+100 XP` badge.
4. **Results (`/results`):** Review final score (`X / 10`), accuracy percentage, animated XP earned, current level progress, streak status, and any newly unlocked achievements.
5. **Progress (`/progress`) & Achievements (`/achievements`):** Inspect 7-day activity bars, per-subject accuracy, up to 10 recent quiz history entries, and your 6-badge trophy room.

### XP & Level Thresholds

| Level | Title | Minimum XP |
|---|---|---|
| **Level 1** | Beginner | `0 XP` |
| **Level 2** | Explorer | `500 XP` |
| **Level 3** | Learner | `1,000 XP` |
| **Level 4** | Scholar | `2,000 XP` |
| **Level 5** | Knowledge Master | `3,000 XP` (Max Level) |

### Streak & Daily Goal Rules
- **Daily Goal:** **10 questions per day** (`dailyPercent = min(100, round(answeredToday / 10 * 100))`).
- **Streak Rule:** Counts consecutive local calendar days on which at least one quiz is completed:
  - Completed a quiz today (`lastActiveDate === today`): streak remains unchanged (or starts at `1`).
  - Completed a quiz yesterday (`lastActiveDate === yesterday`): streak increments by `+1`.
  - Missed a full day (`lastActiveDate` is older than yesterday): effective streak displays as `0` on load and resets to `1` upon completing the next quiz.

### Achievements Table

| ID | Badge | Title | Unlock Condition |
|---|---|---|---|
| `firstChallenge` | 🏆 | **First Challenge** | Complete at least 1 quiz (`completedQuizzes >= 1`) |
| `hotStreak` | 🔥 | **Hot Streak** | Answer 5 questions correctly in a row (`bestAnswerStreak >= 5`) |
| `quizMaster` | 🧠 | **Quiz Master** | Finish a quiz with **≥ 90% accuracy** |
| `explorer` | 🌍 | **Explorer** | Complete a **Geography** quiz |
| `knowledgeSeeker` | 📚 | **Knowledge Seeker** | Answer at least 50 total questions (`totalQuestions >= 50`) |
| `xpHunter` | ⭐ | **XP Hunter** | Earn at least **1,000 total XP** (`xp >= 1000`) |

---

## 📁 Project Structure

```text
learnrush/
├─ index.html
├─ package.json
├─ tailwind.config.js
├─ postcss.config.js
├─ vite.config.js
├─ README.md
└─ src/
   ├─ main.jsx
   ├─ App.jsx                      (Router + Providers + ErrorBoundary + Layout shell)
   ├─ index.css                    (Tailwind layers, font rules, focus & reduced-motion styles)
   ├─ data/
   │  ├─ questions.js              (80 validated questions across 4 subjects + validator)
   │  ├─ subjects.js               (Subject metadata, icons, descriptions, color tokens)
   │  ├─ achievements.js           (6 achievement definitions with pure check functions)
   │  └─ levels.js                 (Level thresholds 1–5)
   ├─ utils/
   │  ├─ storage.js                (Centralized localStorage persistence under learnrush:v1)
   │  ├─ levels.js                 (getLevelInfo(xp) calculation helper)
   │  ├─ quiz.js                   (Fisher–Yates shuffle, question picker, scoring helpers)
   │  ├─ streak.js                 (Effective display & completion streak calculation)
   │  └─ dates.js                  (Local YYYY-MM-DD keys & last-7-days generator)
   ├─ context/
   │  ├─ ProgressContext.jsx       (Central learning state, XP, streaks, achievements)
   │  ├─ QuizContext.jsx           (Active 10-question quiz session state)
   │  └─ ToastContext.jsx          (Toast notification queue & auto-dismiss)
   ├─ pages/
   │  ├─ Dashboard.jsx
   │  ├─ Challenge.jsx
   │  ├─ Quiz.jsx
   │  ├─ Results.jsx
   │  ├─ Progress.jsx
   │  └─ Achievements.jsx
   └─ components/
      ├─ layout/                   (Navbar, Sidebar, MobileNavigation, Footer, PageTransition)
      ├─ ui/                       (Button, ProgressBar, StatCard, XPBadge, StreakBadge, ConfirmDialog, Toast, LoadingState, EmptyState)
      ├─ dashboard/                (HeroCard, DailyProgress, SubjectCard, HistoryCard)
      ├─ quiz/                     (QuizCard, AnswerOption, Celebration, FeedbackPanel)
      ├─ results/                  (ResultsCard)
      └─ progress/                 (WeeklyChart, SubjectPerformance)
```

---

## 💻 Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Create a production build:**
   ```bash
   npm run build
   ```

4. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

---

## 🔒 Data & Privacy

All learning statistics, XP, streaks, unlocked achievements, and quiz history are stored **exclusively in your local browser** via `localStorage` under the `learnrush:v1` key. No personal data is ever transmitted to an external server. You can wipe all saved data at any time using the **Reset Progress** button in the Settings menu or on the Progress page.

---

##🎙️ Voice-Driven Development

**LearnRush** was designed and built through a voice-driven development workflow combining **Wispr Flow** and **Google Antigravity** (an agentic coding IDE):

1. **Natural Voice Specification:** Product requirements, visual design tokens, data models, and edge-case rules were dictated naturally using Wispr Flow rather than manually typing boilerplate code.
2. **Autonomous Agentic Execution:** Google Antigravity translated the specification into an structured 16-phase implementation plan, scaffolded the Vite + React + Tailwind project, authored the 80-question knowledge bank, and wired up the state and persistence layers.
3. **Iterative Voice Refinement & Browser Verification:** Spoken follow-up prompts guided end-to-end browser verification across desktop (`1440px`) and mobile (`390px`) viewports, validating accessibility, animations, and edge-case resilience.
