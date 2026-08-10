const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'edusignal.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student', 'teacher', 'admin')),
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    grade TEXT NOT NULL,
    attendance_rate REAL NOT NULL,
    behavior_score REAL NOT NULL,
    risk_score REAL NOT NULL,
    risk_factors TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    student_id TEXT NOT NULL,
    score REAL NOT NULL,
    semester TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS interventions (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed')),
    created_by TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

const existingUser = db.prepare('SELECT id FROM users LIMIT 1').get();
if (!existingUser) {
  seedDatabase();
}

function hashPassword(pwd) {
  const salt = 'edusignal-salt';
  return crypto.pbkdf2Sync(pwd, salt, 10000, 64, 'sha512').toString('hex');
}

function seedDatabase() {
  const teacherId = uuidv4();
  const adminId = uuidv4();

  db.prepare(`INSERT INTO users (id, name, email, role, password_hash) VALUES (?, ?, ?, ?, ?)`).run(
    teacherId, 'Ms. Sarah Johnson', 'sarah.johnson@edusignal.edu', 'teacher', hashPassword('teacher123')
  );
  db.prepare(`INSERT INTO users (id, name, email, role, password_hash) VALUES (?, ?, ?, ?, ?)`).run(
    adminId, 'Dr. Michael Chen', 'admin@edusignal.edu', 'admin', hashPassword('admin123')
  );

  const studentNames = [
    { name: 'Emma Rodriguez', email: 'emma.r@edusignal.edu' },
    { name: 'Liam Patel', email: 'liam.p@edusignal.edu' },
    { name: 'Olivia Wang', email: 'olivia.w@edusignal.edu' },
    { name: 'Noah Thompson', email: 'noah.t@edusignal.edu' },
    { name: 'Ava Martinez', email: 'ava.m@edusignal.edu' },
    { name: 'Ethan Kim', email: 'ethan.k@edusignal.edu' },
    { name: 'Sophia Davis', email: 'sophia.d@edusignal.edu' },
    { name: 'Jackson Brown', email: 'jackson.b@edusignal.edu' },
    { name: 'Isabella Nguyen', email: 'isabella.n@edusignal.edu' },
    { name: 'Aiden Wilson', email: 'aiden.w@edusignal.edu' },
    { name: 'Mia Anderson', email: 'mia.a@edusignal.edu' },
    { name: 'Lucas Garcia', email: 'lucas.g@edusignal.edu' },
    { name: 'Charlotte Lee', email: 'charlotte.l@edusignal.edu' },
    { name: 'James Taylor', email: 'james.t@edusignal.edu' },
    { name: 'Amelia Clark', email: 'amelia.c@edusignal.edu' },
    { name: 'Benjamin Hall', email: 'benjamin.h@edusignal.edu' },
    { name: 'Harper Lewis', email: 'harper.l@edusignal.edu' },
    { name: 'Alexander Scott', email: 'alexander.s@edusignal.edu' },
    { name: 'Evelyn Young', email: 'evelyn.y@edusignal.edu' },
    { name: 'Daniel Walker', email: 'daniel.w@edusignal.edu' },
  ];

  const grades = ['9th', '10th', '11th', '12th'];
  const semesters = ['Fall 2025', 'Spring 2025', 'Fall 2024'];
  const subjectNames = ['Math', 'English', 'Science', 'History', 'Art'];

  const riskProfiles = [
    { attendance: 72, behavior: 55, risk: 82, factors: ['Low attendance', 'Declining grades', 'Behavioral incidents'], riskLevel: 'high' },
    { attendance: 78, behavior: 60, risk: 75, factors: ['Irregular attendance', 'Struggling in Math', 'Social isolation'], riskLevel: 'high' },
    { attendance: 75, behavior: 58, risk: 78, factors: ['Frequent absences', 'Low engagement', 'Missing assignments'], riskLevel: 'high' },
    { attendance: 80, behavior: 62, risk: 70, factors: ['Below grade level in English', 'Tardiness', 'Lack of participation'], riskLevel: 'high' },
    { attendance: 70, behavior: 50, risk: 88, factors: ['Chronic absenteeism', 'Disciplinary referrals', 'Failing multiple subjects'], riskLevel: 'high' },
    { attendance: 82, behavior: 65, risk: 60, factors: ['Declining Math scores', 'Irregular homework submission'], riskLevel: 'medium' },
    { attendance: 85, behavior: 70, risk: 55, factors: ['Needs extra support in Science', 'Low test scores'], riskLevel: 'medium' },
    { attendance: 88, behavior: 68, risk: 50, factors: ['Inconsistent performance', 'Struggling with advanced topics'], riskLevel: 'medium' },
    { attendance: 83, behavior: 72, risk: 52, factors: ['Recent grade drop', 'Absent 5 days this month'], riskLevel: 'medium' },
    { attendance: 86, behavior: 66, risk: 48, factors: ['Below average in History', 'Needs motivation support'], riskLevel: 'medium' },
    { attendance: 90, behavior: 75, risk: 45, factors: ['Occasional late submissions', 'Could improve study habits'], riskLevel: 'medium' },
    { attendance: 84, behavior: 71, risk: 50, factors: ['Science lab participation low', 'Needs peer support'], riskLevel: 'medium' },
    { attendance: 95, behavior: 88, risk: 15, factors: [], riskLevel: 'low' },
    { attendance: 97, behavior: 92, risk: 10, factors: [], riskLevel: 'low' },
    { attendance: 93, behavior: 85, risk: 20, factors: ['Minor Art score dip'], riskLevel: 'low' },
    { attendance: 98, behavior: 95, risk: 8, factors: [], riskLevel: 'low' },
    { attendance: 96, behavior: 90, risk: 12, factors: [], riskLevel: 'low' },
    { attendance: 94, behavior: 87, risk: 18, factors: ['Could improve History participation'], riskLevel: 'low' },
    { attendance: 99, behavior: 94, risk: 5, factors: [], riskLevel: 'low' },
    { attendance: 92, behavior: 86, risk: 22, factors: ['Slight Math decline'], riskLevel: 'low' },
  ];

  const insertUser = db.prepare(`INSERT INTO users (id, name, email, role, password_hash) VALUES (?, ?, ?, 'student', ?)`);
  const insertStudent = db.prepare(`INSERT INTO students (id, user_id, grade, attendance_rate, behavior_score, risk_score, risk_factors) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const insertSubject = db.prepare(`INSERT INTO subjects (id, name, student_id, score, semester) VALUES (?, ?, ?, ?, ?)`);
  const insertIntervention = db.prepare(`INSERT INTO interventions (id, student_id, title, description, type, status, created_by, created_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const insertAll = db.transaction(() => {
    studentNames.forEach((student, index) => {
      const userId = uuidv4();
      const studentId = uuidv4();
      const profile = riskProfiles[index];
      const grade = grades[index % grades.length];

      insertUser.run(userId, student.name, student.email, hashPassword('student123'));
      insertStudent.run(studentId, userId, grade, profile.attendance, profile.behavior, profile.risk, JSON.stringify(profile.factors));

      subjectNames.forEach((subName) => {
        let baseScore;
        if (profile.riskLevel === 'high') {
          baseScore = 40 + Math.random() * 25;
        } else if (profile.riskLevel === 'medium') {
          baseScore = 55 + Math.random() * 25;
        } else {
          baseScore = 78 + Math.random() * 20;
        }

        if (subName === 'Art' && profile.riskLevel !== 'high') {
          baseScore += 5;
        }
        if (subName === 'Math' && profile.riskLevel === 'high') {
          baseScore -= 10;
        }
        baseScore = Math.min(100, Math.max(20, Math.round(baseScore)));

        semesters.forEach((semester) => {
          let semesterScore = baseScore + Math.round((Math.random() - 0.5) * 10);
          semesterScore = Math.min(100, Math.max(20, semesterScore));
          insertSubject.run(uuidv4(), subName, studentId, semesterScore, semester);
        });
      });

      if (profile.riskLevel === 'high') {
        const interventionTitles = [
          { title: 'Math Tutoring Program', desc: 'Weekly one-on-one tutoring sessions to improve Math fundamentals.', type: 'tutoring' },
          { title: 'Attendance Improvement Plan', desc: 'Daily check-in system and parent communication protocol.', type: 'behavioral' },
          { title: 'Academic Recovery Plan', desc: 'Structured after-school program focusing on core subjects.', type: 'academic_support' },
        ];
        const picked = interventionTitles[index % interventionTitles.length];
        const status = index % 3 === 0 ? 'completed' : (index % 2 === 0 ? 'in_progress' : 'pending');
        const createdDate = new Date(2025, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1);
        insertIntervention.run(
          uuidv4(), studentId, picked.title, picked.desc, picked.type, status, teacherId,
          createdDate.toISOString(), status === 'completed' ? new Date().toISOString() : null
        );
      } else if (profile.riskLevel === 'medium' && index % 3 === 0) {
        const picked = { title: 'Study Skills Workshop', desc: 'Weekly group workshop on effective study techniques.', type: 'academic_support' };
        insertIntervention.run(
          uuidv4(), studentId, picked.title, picked.desc, picked.type, 'in_progress', teacherId,
          new Date(2025, 2, 15).toISOString(), null
        );
      }
    });
  });

  insertAll();
  console.log('Database seeded with 20 students and sample data.');
}

module.exports = db;
