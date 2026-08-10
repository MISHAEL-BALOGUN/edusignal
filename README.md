# eduSignal - AI-Driven Student Success & Early Intervention System

An AI-powered educational platform designed to identify at-risk students early and provide data-driven intervention recommendations. Built as a full-stack web application with React and Node.js.

## Overview

eduSignal helps educators proactively monitor student success by analyzing academic performance, attendance, and behavioral data. The system calculates risk scores, identifies students who need immediate attention, and leverages an AI chatbot to suggest personalized intervention strategies.

## Key Features

### Student Dashboard
- Personal academic performance overview
- Grade tracking across subjects with trend visualization
- Attendance summary and behavioral score
- Risk assessment display with color-coded indicators
- Access to AI assistant for academic guidance

### Teacher Dashboard
- Class-wide student overview with sorting and filtering
- At-risk student identification (sorted by risk severity)
- Intervention creation and status tracking
- AI-powered intervention recommendations per student
- Progress monitoring tools

### Admin Dashboard
- School-wide analytics and KPIs
- Risk distribution visualization (pie chart)
- Grade distribution analysis (bar chart)
- Performance trend tracking (line chart)
- Complete student roster with advanced filtering

### AI Chatbot Assistant
- Context-aware student analysis
- Intervention suggestion engine
- Improvement plan generation
- Risk distribution reporting
- Natural language queries (e.g., "Analyze risk for Emma Thompson", "What interventions are needed?")

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js, Express |
| Database | SQLite (better-sqlite3) |
| AI Engine | Rule-based NLP with pattern matching |

## Project Structure

```
eduSignal/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIChatbot.jsx      # Floating AI assistant
│   │   │   ├── Charts.jsx         # Reusable chart components
│   │   │   ├── Layout.jsx         # Main layout wrapper
│   │   │   ├── RiskBadge.jsx      # Risk level indicator
│   │   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   │   └── StudentCard.jsx    # Student info card
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Authentication state
│   │   ├── data/
│   │   │   └── mockData.js        # Frontend mock data
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx      # Role selection login
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js backend
│   ├── aiEngine.js                # AI response generation
│   ├── database.js                # SQLite setup & seeding
│   ├── server.js                  # Express API server
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/StainlessTech/eduSignal.git
cd eduSignal
```

**2. Install backend dependencies**
```bash
cd server
npm install
```

**3. Install frontend dependencies**
```bash
cd ../client
npm install
```

### Running the Application

**Start the backend server** (in one terminal):
```bash
cd server
npm run dev
```
The server runs on `http://localhost:5000`. The SQLite database is auto-created and seeded on first run.

**Start the frontend dev server** (in another terminal):
```bash
cd client
npm run dev
```
The app opens at `http://localhost:5173`.

### Login

Select a role on the login page to access the corresponding dashboard:

| Role | Access |
|------|--------|
| Student | Personal dashboard with grades, attendance, risk score |
| Teacher | Class overview, at-risk students, interventions |
| Admin | School-wide analytics, all students, reports |

## API Endpoints

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | List all students with risk data |
| GET | `/api/students/:id` | Get student details with subjects & interventions |
| GET | `/api/students/:id/subjects` | Get student's subject scores |
| GET | `/api/students/:id/interventions` | Get student's interventions |
| POST | `/api/students/:id/interventions` | Create new intervention |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/overview` | Dashboard KPIs and summary stats |
| GET | `/api/analytics/risk-distribution` | Risk level breakdown |
| GET | `/api/analytics/grade-distribution` | Grade and subject analysis |
| GET | `/api/analytics/trends` | Performance trends over time |
| GET | `/api/analytics/at-risk` | At-risk student list |

### Interventions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/interventions` | List all interventions (filterable) |
| PUT | `/api/interventions/:id` | Update intervention status |

### AI Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message, get AI recommendation |

## AI Engine

The AI chatbot uses a rule-based natural language processing system that:

1. **Parses user intent** through keyword and pattern matching
2. **Queries the database** for relevant student data
3. **Analyzes risk factors** including attendance, grades, and behavior
4. **Generates recommendations** based on configurable rules

### Supported Queries
- `"Analyze risk for [student name]"` - Full risk analysis with factors
- `"What interventions are needed?"` - Lists interventions for all at-risk students
- `"How can [student name] improve?"` - Personalized improvement plan
- `"Show risk distribution"` - School-wide risk overview
- `"Show at-risk students"` - List of critical students
- `"Hello"` / `"Help"` - Available commands

### Risk Calculation
Risk scores (0-100) are computed from:
- **Attendance rate** (weight: 35%)
- **Behavior score** (weight: 25%)
- **Academic performance** (weight: 40%)

Risk levels:
- **High** (70-100): Immediate intervention required
- **Medium** (40-69): Monitoring and support recommended
- **Low** (0-39): On track, standard monitoring

## Database Schema

```
users          → id, name, email, role, password_hash, created_at
students       → id, user_id, grade, attendance_rate, behavior_score, risk_score, risk_factors
subjects       → id, name, student_id, score, semester
interventions  → id, student_id, title, description, type, status, created_by, created_at, completed_at
chat_messages  → id, user_id, message, response, created_at
```

The database is automatically seeded with 20 students across 4 grade levels (9th-12th), 5 subjects, and 3 semesters of data on first run.

## Sample Data

The seed data includes a realistic mix of student profiles:
- **5 high-risk students** (risk score 70-88) with factors like chronic absenteeism, failing grades, and behavioral issues
- **7 medium-risk students** (risk score 45-60) needing monitoring and targeted support
- **8 low-risk students** (risk score 5-22) performing well academically

## License

This project is for educational purposes. Feel free to use and modify for your school projects.
