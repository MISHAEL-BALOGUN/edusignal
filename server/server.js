const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');
const { generateResponse } = require('./aiEngine');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'https://edusignal-kappa.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (/\.vercel\.app$/.test(origin) || /\.onrender\.com$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// ─── Students ────────────────────────────────────────────────

app.get('/api/students', (req, res) => {
  try {
    const students = db.prepare(`
      SELECT s.*, u.name, u.email
      FROM students s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.risk_score DESC
    `).all();

    const result = students.map(s => ({
      ...s,
      risk_factors: JSON.parse(s.risk_factors || '[]'),
      risk_level: s.risk_score >= 70 ? 'high' : s.risk_score >= 40 ? 'medium' : 'low',
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students', details: err.message });
  }
});

app.get('/api/students/:id', (req, res) => {
  try {
    const student = db.prepare(`
      SELECT s.*, u.name, u.email
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `).get(req.params.id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const subjects = db.prepare('SELECT * FROM subjects WHERE student_id = ? ORDER BY semester DESC').all(student.id);
    const interventions = db.prepare('SELECT * FROM interventions WHERE student_id = ? ORDER BY created_at DESC').all(student.id);

    res.json({
      ...student,
      risk_factors: JSON.parse(student.risk_factors || '[]'),
      risk_level: student.risk_score >= 70 ? 'high' : student.risk_score >= 40 ? 'medium' : 'low',
      subjects,
      interventions,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student', details: err.message });
  }
});

app.get('/api/students/:id/subjects', (req, res) => {
  try {
    const student = db.prepare('SELECT id FROM students WHERE id = ?').get(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const subjects = db.prepare('SELECT * FROM subjects WHERE student_id = ? ORDER BY semester DESC, name ASC').all(req.params.id);
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subjects', details: err.message });
  }
});

app.get('/api/students/:id/interventions', (req, res) => {
  try {
    const student = db.prepare('SELECT id FROM students WHERE id = ?').get(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const interventions = db.prepare(`
      SELECT i.*, u.name as creator_name
      FROM interventions i
      JOIN users u ON i.created_by = u.id
      WHERE i.student_id = ?
      ORDER BY i.created_at DESC
    `).all(req.params.id);

    res.json(interventions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interventions', details: err.message });
  }
});

app.post('/api/students/:id/interventions', (req, res) => {
  try {
    const student = db.prepare('SELECT id FROM students WHERE id = ?').get(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { title, description, type, created_by } = req.body;
    if (!title || !description || !type || !created_by) {
      return res.status(400).json({ error: 'Missing required fields: title, description, type, created_by' });
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO interventions (id, student_id, title, description, type, status, created_by)
      VALUES (?, ?, ?, ?, ?, 'pending', ?)
    `).run(id, req.params.id, title, description, type, created_by);

    const intervention = db.prepare('SELECT * FROM interventions WHERE id = ?').get(id);
    res.status(201).json(intervention);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create intervention', details: err.message });
  }
});

// ─── Analytics ───────────────────────────────────────────────

app.get('/api/analytics/overview', (req, res) => {
  try {
    const totalStudents = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
    const avgRisk = db.prepare('SELECT AVG(risk_score) as avg FROM students').get().avg;
    const avgAttendance = db.prepare('SELECT AVG(attendance_rate) as avg FROM students').get().avg;
    const avgBehavior = db.prepare('SELECT AVG(behavior_score) as avg FROM students').get().avg;

    const highRisk = db.prepare('SELECT COUNT(*) as count FROM students WHERE risk_score >= 70').get().count;
    const mediumRisk = db.prepare('SELECT COUNT(*) as count FROM students WHERE risk_score >= 40 AND risk_score < 70').get().count;
    const lowRisk = db.prepare('SELECT COUNT(*) as count FROM students WHERE risk_score < 40').get().count;

    const totalInterventions = db.prepare('SELECT COUNT(*) as count FROM interventions').get().count;
    const pendingInterventions = db.prepare("SELECT COUNT(*) as count FROM interventions WHERE status = 'pending'").get().count;
    const activeInterventions = db.prepare("SELECT COUNT(*) as count FROM interventions WHERE status = 'in_progress'").get().count;
    const completedInterventions = db.prepare("SELECT COUNT(*) as count FROM interventions WHERE status = 'completed'").get().count;

    res.json({
      totalStudents,
      avgRiskScore: Math.round(avgRisk * 10) / 10,
      avgAttendance: Math.round(avgAttendance * 10) / 10,
      avgBehaviorScore: Math.round(avgBehavior * 10) / 10,
      riskDistribution: {
        high: highRisk,
        medium: mediumRisk,
        low: lowRisk,
      },
      interventions: {
        total: totalInterventions,
        pending: pendingInterventions,
        active: activeInterventions,
        completed: completedInterventions,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics', details: err.message });
  }
});

app.get('/api/analytics/risk-distribution', (req, res) => {
  try {
    const highRisk = db.prepare(`
      SELECT s.*, u.name FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.risk_score >= 70
      ORDER BY s.risk_score DESC
    `).all();

    const mediumRisk = db.prepare(`
      SELECT s.*, u.name FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.risk_score >= 40 AND s.risk_score < 70
      ORDER BY s.risk_score DESC
    `).all();

    const lowRisk = db.prepare(`
      SELECT s.*, u.name FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.risk_score < 40
      ORDER BY s.risk_score ASC
    `).all();

    res.json({
      high: highRisk.map(s => ({ ...s, risk_factors: JSON.parse(s.risk_factors || '[]') })),
      medium: mediumRisk.map(s => ({ ...s, risk_factors: JSON.parse(s.risk_factors || '[]') })),
      low: lowRisk.map(s => ({ ...s, risk_factors: JSON.parse(s.risk_factors || '[]') })),
      summary: {
        highCount: highRisk.length,
        mediumCount: mediumRisk.length,
        lowCount: lowRisk.length,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch risk distribution', details: err.message });
  }
});

app.get('/api/analytics/grade-distribution', (req, res) => {
  try {
    const gradeDistribution = db.prepare(`
      SELECT s.grade, COUNT(*) as count, AVG(s.risk_score) as avg_risk,
             AVG(s.attendance_rate) as avg_attendance, AVG(s.behavior_score) as avg_behavior
      FROM students s
      GROUP BY s.grade
      ORDER BY s.grade
    `).all();

    const subjectAverages = db.prepare(`
      SELECT sub.name as subject, AVG(sub.score) as avg_score,
             MIN(sub.score) as min_score, MAX(sub.score) as max_score,
             COUNT(DISTINCT sub.student_id) as student_count
      FROM subjects sub
      GROUP BY sub.name
      ORDER BY avg_score ASC
    `).all();

    const semesterTrends = db.prepare(`
      SELECT sub.semester, sub.name as subject, AVG(sub.score) as avg_score
      FROM subjects sub
      GROUP BY sub.semester, sub.name
      ORDER BY sub.semester DESC, sub.name
    `).all();

    res.json({
      byGrade: gradeDistribution,
      bySubject: subjectAverages,
      semesterTrends,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch grade distribution', details: err.message });
  }
});

app.get('/api/analytics/trends', (req, res) => {
  try {
    const semesterScores = db.prepare(`
      SELECT sub.semester, AVG(sub.score) as avg_score,
             COUNT(DISTINCT sub.student_id) as student_count
      FROM subjects sub
      GROUP BY sub.semester
      ORDER BY sub.semester DESC
    `).all();

    const riskTrend = db.prepare(`
      SELECT s.grade, AVG(s.risk_score) as avg_risk,
             AVG(s.attendance_rate) as avg_attendance,
             AVG(s.behavior_score) as avg_behavior
      FROM students s
      GROUP BY s.grade
      ORDER BY s.grade
    `).all();

    res.json({
      semesterScores,
      riskByGrade: riskTrend,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trends', details: err.message });
  }
});

app.get('/api/analytics/at-risk', (req, res) => {
  try {
    const atRisk = db.prepare(`
      SELECT s.*, u.name, u.email
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.risk_score >= 60
      ORDER BY s.risk_score DESC
    `).all();

    const result = atRisk.map(s => {
      const interventions = db.prepare(
        "SELECT COUNT(*) as count FROM interventions WHERE student_id = ? AND status != 'completed'"
      ).get(s.id);

      return {
        ...s,
        risk_factors: JSON.parse(s.risk_factors || '[]'),
        risk_level: s.risk_score >= 70 ? 'high' : 'medium',
        active_interventions: interventions.count,
      };
    });

    res.json({
      students: result,
      total: result.length,
      highRisk: result.filter(s => s.risk_level === 'high').length,
      mediumRisk: result.filter(s => s.risk_level === 'medium').length,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch at-risk students', details: err.message });
  }
});

// ─── Interventions ───────────────────────────────────────────

app.get('/api/interventions', (req, res) => {
  try {
    const { status, student_id } = req.query;
    let query = `
      SELECT i.*, u.name as creator_name, s.name as student_name
      FROM interventions i
      JOIN users u ON i.created_by = u.id
      JOIN students st ON i.student_id = st.id
      JOIN users s ON st.user_id = s.id
    `;
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('i.status = ?');
      params.push(status);
    }
    if (student_id) {
      conditions.push('i.student_id = ?');
      params.push(student_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY i.created_at DESC';

    const interventions = db.prepare(query).all(...params);
    res.json(interventions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interventions', details: err.message });
  }
});

app.put('/api/interventions/:id', (req, res) => {
  try {
    const intervention = db.prepare('SELECT * FROM interventions WHERE id = ?').get(req.params.id);
    if (!intervention) {
      return res.status(404).json({ error: 'Intervention not found' });
    }

    const { status } = req.body;
    if (!status || !['pending', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be: pending, in_progress, or completed' });
    }

    const completedAt = status === 'completed' ? new Date().toISOString() : null;

    db.prepare('UPDATE interventions SET status = ?, completed_at = COALESCE(?, completed_at) WHERE id = ?')
      .run(status, completedAt, req.params.id);

    const updated = db.prepare(`
      SELECT i.*, u.name as creator_name
      FROM interventions i
      JOIN users u ON i.created_by = u.id
      WHERE i.id = ?
    `).get(req.params.id);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update intervention', details: err.message });
  }
});

// ─── AI Chat ─────────────────────────────────────────────────

app.post('/api/chat', (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message || !userId) {
      return res.status(400).json({ error: 'Missing required fields: message, userId' });
    }

    const result = generateResponse(message, userId);

    const chatId = uuidv4();
    db.prepare(`
      INSERT INTO chat_messages (id, user_id, message, response)
      VALUES (?, ?, ?, ?)
    `).run(chatId, userId, message, JSON.stringify(result));

    res.json({
      id: chatId,
      message,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process chat message', details: err.message });
  }
});

// ─── Error Handling ──────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// ─── Start Server ────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`eduSignal server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
