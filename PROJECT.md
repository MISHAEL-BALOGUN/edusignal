# eduSignal — What This App Does

**eduSignal** is an AI-driven student success and early-intervention platform. It helps schools identify students who are at risk of falling behind — academically, behaviorally, or through attendance — and gives teachers and administrators the tools and AI recommendations to intervene early.

## The Problem It Solves

Schools often realize a student is struggling only after grades have already dropped. eduSignal continuously tracks three key signals:

- **Attendance rate**
- **Behavior score**
- **Academic performance**

These are combined into a single **risk score (0–100)**:

| Risk Level | Score | Action |
|-----------|-------|--------|
| Low | 0–39 | On track, standard monitoring |
| Medium | 40–69 | Monitoring and support recommended |
| High | 70–100 | Immediate intervention required |

## Roles & What Each User Sees

### Student Dashboard
- Personal academic overview: average score, attendance, behavior, risk level
- Grade trend chart and per-subject performance
- Profile info and active interventions
- AI assistant for study and improvement advice

### Teacher Dashboard
- Class-wide student overview with search, filter, and risk sorting
- At-risk students sorted by severity, with risk factors shown
- Recommended interventions per student (AI-generated suggestions)
- Create and track interventions
- Student detail modal with full profile

### Admin Dashboard
- School-wide KPIs: total students, average risk, attendance, grades
- Risk distribution pie chart and grade distribution bar chart
- Performance trends over time (multi-line chart)
- Full student roster with search, filter, and sorting
- Per-student drill-down details

### AI Chatbot Assistant (eduAI)
Floating assistant on every dashboard that understands natural language:
- "Analyze risk for [student name]" — full risk analysis
- "What interventions are needed?" — intervention plan
- "How can [student name] improve?" — personalized improvement plan
- "Show risk distribution" / "Show at-risk students" — school-wide reporting
- Tutoring, attendance, behavior, counseling, and mentoring advice

## How It Works

- **Frontend:** React 18 + Vite + Tailwind CSS v4, Recharts for charts
- **Backend:** Node.js + Express with a rule-based NLP AI engine
- **Database:** SQLite (auto-created and seeded with 20 sample students on first run)
- **Deployment:** Frontend on **Vercel**, backend API on **Render**

## Live URLs & Setup

| Piece | URL |
|-------|-----|
| Frontend | `https://edusignal-kappa.vercel.app` |
| Backend API | `https://edusignal-ljec.onrender.com` |

### Environment Variables
- **Vercel:** `VITE_API_URL = https://edusignal-ljec.onrender.com`
- **Render:** `FRONTEND_URL = https://edusignal-kappa.vercel.app` (optional — CORS now also allows any `*.vercel.app` origin)

### Run Locally
```bash
# Backend
cd server
npm install
npm run dev        # http://localhost:5000

# Frontend
cd client
npm install
cp .env.example .env.local   # set VITE_API_URL=http://localhost:5000
npm run dev        # http://localhost:5173
```

Pick a role (Student / Teacher / Admin) on the login page to try each dashboard.
