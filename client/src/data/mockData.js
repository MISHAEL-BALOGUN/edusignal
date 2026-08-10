export const students = [
  {
    id: 1,
    name: "Emma Thompson",
    grade: 10,
    avatar: "ET",
    subjects: [
      { name: "Mathematics", score: 92 },
      { name: "English", score: 88 },
      { name: "Science", score: 95 },
      { name: "History", score: 85 },
      { name: "Art", score: 90 }
    ],
    attendance: 96,
    behaviorScore: 95,
    riskScore: 12,
    riskFactors: [],
    interventions: [],
    gradesOverTime: [
      { month: "Sep", score: 88 },
      { month: "Oct", score: 90 },
      { month: "Nov", score: 91 },
      { month: "Dec", score: 89 },
      { month: "Jan", score: 92 }
    ]
  },
  {
    id: 2,
    name: "Liam Martinez",
    grade: 10,
    avatar: "LM",
    subjects: [
      { name: "Mathematics", score: 78 },
      { name: "English", score: 82 },
      { name: "Science", score: 75 },
      { name: "History", score: 80 },
      { name: "Art", score: 85 }
    ],
    attendance: 92,
    behaviorScore: 88,
    riskScore: 28,
    riskFactors: ["Slight decline in math scores"],
    interventions: [
      { name: "Math tutoring session", date: "2024-01-15", status: "completed" }
    ],
    gradesOverTime: [
      { month: "Sep", score: 82 },
      { month: "Oct", score: 80 },
      { month: "Nov", score: 78 },
      { month: "Dec", score: 77 },
      { month: "Jan", score: 78 }
    ]
  },
  {
    id: 3,
    name: "Sophia Chen",
    grade: 11,
    avatar: "SC",
    subjects: [
      { name: "Mathematics", score: 65 },
      { name: "English", score: 70 },
      { name: "Science", score: 62 },
      { name: "History", score: 68 },
      { name: "Art", score: 72 }
    ],
    attendance: 85,
    behaviorScore: 78,
    riskScore: 55,
    riskFactors: ["Declining attendance", "Below average math scores", "Missed 3 assignments"],
    interventions: [
      { name: "Parent-teacher conference", date: "2024-01-10", status: "completed" },
      { name: "Weekly check-in with counselor", date: "2024-01-20", status: "pending" }
    ],
    gradesOverTime: [
      { month: "Sep", score: 75 },
      { month: "Oct", score: 72 },
      { month: "Nov", score: 68 },
      { month: "Dec", score: 65 },
      { month: "Jan", score: 65 }
    ]
  },
  {
    id: 4,
    name: "Noah Williams",
    grade: 9,
    avatar: "NW",
    subjects: [
      { name: "Mathematics", score: 55 },
      { name: "English", score: 60 },
      { name: "Science", score: 52 },
      { name: "History", score: 58 },
      { name: "Art", score: 65 }
    ],
    attendance: 78,
    behaviorScore: 65,
    riskScore: 78,
    riskFactors: ["Frequent absences", "Failing math", "Behavioral incidents", "Missing homework"],
    interventions: [
      { name: "Behavioral support plan", date: "2024-01-05", status: "in-progress" },
      { name: "Daily check-in with teacher", date: "2024-01-12", status: "in-progress" },
      { name: "Counseling referral", date: "2024-01-18", status: "pending" }
    ],
    gradesOverTime: [
      { month: "Sep", score: 65 },
      { month: "Oct", score: 60 },
      { month: "Nov", score: 55 },
      { month: "Dec", score: 52 },
      { month: "Jan", score: 55 }
    ]
  },
  {
    id: 5,
    name: "Olivia Brown",
    grade: 11,
    avatar: "OB",
    subjects: [
      { name: "Mathematics", score: 88 },
      { name: "English", score: 92 },
      { name: "Science", score: 85 },
      { name: "History", score: 90 },
      { name: "Art", score: 88 }
    ],
    attendance: 98,
    behaviorScore: 97,
    riskScore: 8,
    riskFactors: [],
    interventions: [],
    gradesOverTime: [
      { month: "Sep", score: 86 },
      { month: "Oct", score: 88 },
      { month: "Nov", score: 89 },
      { month: "Dec", score: 87 },
      { month: "Jan", score: 88 }
    ]
  },
  {
    id: 6,
    name: "Aiden Johnson",
    grade: 12,
    avatar: "AJ",
    subjects: [
      { name: "Mathematics", score: 45 },
      { name: "English", score: 52 },
      { name: "Science", score: 48 },
      { name: "History", score: 50 },
      { name: "Art", score: 55 }
    ],
    attendance: 72,
    behaviorScore: 60,
    riskScore: 85,
    riskFactors: ["Multiple failing grades", "Chronic absenteeism", "Behavioral issues", "At risk of not graduating"],
    interventions: [
      { name: "Intervention meeting", date: "2024-01-02", status: "completed" },
      { name: "Credit recovery program", date: "2024-01-08", status: "in-progress" },
      { name: "Mentorship assignment", date: "2024-01-15", status: "in-progress" }
    ],
    gradesOverTime: [
      { month: "Sep", score: 58 },
      { month: "Oct", score: 55 },
      { month: "Nov", score: 50 },
      { month: "Dec", score: 47 },
      { month: "Jan", score: 45 }
    ]
  },
  {
    id: 7,
    name: "Isabella Davis",
    grade: 9,
    avatar: "ID",
    subjects: [
      { name: "Mathematics", score: 82 },
      { name: "English", score: 85 },
      { name: "Science", score: 80 },
      { name: "History", score: 78 },
      { name: "Art", score: 88 }
    ],
    attendance: 94,
    behaviorScore: 90,
    riskScore: 22,
    riskFactors: ["Slight drop in history grade"],
    interventions: [],
    gradesOverTime: [
      { month: "Sep", score: 84 },
      { month: "Oct", score: 83 },
      { month: "Nov", score: 82 },
      { month: "Dec", score: 81 },
      { month: "Jan", score: 82 }
    ]
  },
  {
    id: 8,
    name: "Mason Wilson",
    grade: 10,
    avatar: "MW",
    subjects: [
      { name: "Mathematics", score: 70 },
      { name: "English", score: 65 },
      { name: "Science", score: 72 },
      { name: "History", score: 68 },
      { name: "Art", score: 75 }
    ],
    attendance: 88,
    behaviorScore: 82,
    riskScore: 42,
    riskFactors: ["Below grade level in English", "Inconsistent homework submission"],
    interventions: [
      { name: "English tutoring", date: "2024-01-14", status: "pending" }
    ],
    gradesOverTime: [
      { month: "Sep", score: 72 },
      { month: "Oct", score: 70 },
      { month: "Nov", score: 68 },
      { month: "Dec", score: 69 },
      { month: "Jan", score: 70 }
    ]
  },
  {
    id: 9,
    name: "Charlotte Garcia",
    grade: 12,
    avatar: "CG",
    subjects: [
      { name: "Mathematics", score: 95 },
      { name: "English", score: 93 },
      { name: "Science", score: 97 },
      { name: "History", score: 94 },
      { name: "Art", score: 92 }
    ],
    attendance: 99,
    behaviorScore: 98,
    riskScore: 5,
    riskFactors: [],
    interventions: [],
    gradesOverTime: [
      { month: "Sep", score: 93 },
      { month: "Oct", score: 94 },
      { month: "Nov", score: 95 },
      { month: "Dec", score: 94 },
      { month: "Jan", score: 95 }
    ]
  },
  {
    id: 10,
    name: "James Rodriguez",
    grade: 11,
    avatar: "JR",
    subjects: [
      { name: "Mathematics", score: 60 },
      { name: "English", score: 58 },
      { name: "Science", score: 62 },
      { name: "History", score: 55 },
      { name: "Art", score: 65 }
    ],
    attendance: 80,
    behaviorScore: 72,
    riskScore: 62,
    riskFactors: ["Struggling in multiple subjects", "Attendance below 85%", "Low behavior score"],
    interventions: [
      { name: "Academic improvement plan", date: "2024-01-08", status: "in-progress" },
      { name: "Parent contact", date: "2024-01-12", status: "completed" }
    ],
    gradesOverTime: [
      { month: "Sep", score: 65 },
      { month: "Oct", score: 63 },
      { month: "Nov", score: 61 },
      { month: "Dec", score: 59 },
      { month: "Jan", score: 60 }
    ]
  },
  {
    id: 11,
    name: "Amelia Anderson",
    grade: 9,
    avatar: "AA",
    subjects: [
      { name: "Mathematics", score: 75 },
      { name: "English", score: 78 },
      { name: "Science", score: 73 },
      { name: "History", score: 76 },
      { name: "Art", score: 80 }
    ],
    attendance: 90,
    behaviorScore: 85,
    riskScore: 32,
    riskFactors: ["Science needs improvement", "Occasional late submissions"],
    interventions: [
      { name: "Science study group", date: "2024-01-18", status: "pending" }
    ],
    gradesOverTime: [
      { month: "Sep", score: 77 },
      { month: "Oct", score: 76 },
      { month: "Nov", score: 75 },
      { month: "Dec", score: 74 },
      { month: "Jan", score: 75 }
    ]
  },
  {
    id: 12,
    name: "Ethan Taylor",
    grade: 10,
    avatar: "ET",
    subjects: [
      { name: "Mathematics", score: 48 },
      { name: "English", score: 55 },
      { name: "Science", score: 50 },
      { name: "History", score: 52 },
      { name: "Art", score: 58 }
    ],
    attendance: 75,
    behaviorScore: 68,
    riskScore: 72,
    riskFactors: ["Failing mathematics", "Low attendance", "Multiple missing assignments", "Social withdrawal"],
    interventions: [
      { name: "Counselor meeting", date: "2024-01-05", status: "completed" },
      { name: "Peer support program", date: "2024-01-10", status: "in-progress" },
      { name: "Parent conference scheduled", date: "2024-01-22", status: "pending" }
    ],
    gradesOverTime: [
      { month: "Sep", score: 60 },
      { month: "Oct", score: 56 },
      { month: "Nov", score: 52 },
      { month: "Dec", score: 49 },
      { month: "Jan", score: 48 }
    ]
  },
  {
    id: 13,
    name: "Mia Johnson",
    grade: 11,
    avatar: "MJ",
    subjects: [
      { name: "Mathematics", score: 85 },
      { name: "English", score: 90 },
      { name: "Science", score: 82 },
      { name: "History", score: 88 },
      { name: "Art", score: 86 }
    ],
    attendance: 95,
    behaviorScore: 92,
    riskScore: 18,
    riskFactors: ["Minor fluctuation in science scores"],
    interventions: [],
    gradesOverTime: [
      { month: "Sep", score: 86 },
      { month: "Oct", score: 87 },
      { month: "Nov", score: 85 },
      { month: "Dec", score: 84 },
      { month: "Jan", score: 85 }
    ]
  },
  {
    id: 14,
    name: "Alexander Lee",
    grade: 12,
    avatar: "AL",
    subjects: [
      { name: "Mathematics", score: 42 },
      { name: "English", score: 48 },
      { name: "Science", score: 45 },
      { name: "History", score: 40 },
      { name: "Art", score: 50 }
    ],
    attendance: 68,
    behaviorScore: 55,
    riskScore: 90,
    riskFactors: ["Multiple failing grades", "Chronic absenteeism", "Behavioral referrals", "At risk of not graduating", "Needs immediate intervention"],
    interventions: [
      { name: "Emergency intervention plan", date: "2024-01-02", status: "completed" },
      { name: "Daily attendance monitoring", date: "2024-01-03", status: "in-progress" },
      { name: "Mandatory counseling", date: "2024-01-08", status: "in-progress" },
      { name: "Parent involvement required", date: "2024-01-10", status: "completed" }
    ],
    gradesOverTime: [
      { month: "Sep", score: 55 },
      { month: "Oct", score: 50 },
      { month: "Nov", score: 47 },
      { month: "Dec", score: 43 },
      { month: "Jan", score: 42 }
    ]
  },
  {
    id: 15,
    name: "Harper White",
    grade: 9,
    avatar: "HW",
    subjects: [
      { name: "Mathematics", score: 88 },
      { name: "English", score: 85 },
      { name: "Science", score: 90 },
      { name: "History", score: 87 },
      { name: "Art", score: 82 }
    ],
    attendance: 97,
    behaviorScore: 94,
    riskScore: 10,
    riskFactors: [],
    interventions: [],
    gradesOverTime: [
      { month: "Sep", score: 86 },
      { month: "Oct", score: 87 },
      { month: "Nov", score: 88 },
      { month: "Dec", score: 87 },
      { month: "Jan", score: 88 }
    ]
  },
  {
    id: 16,
    name: "Daniel Harris",
    grade: 10,
    avatar: "DH",
    subjects: [
      { name: "Mathematics", score: 68 },
      { name: "English", score: 72 },
      { name: "Science", score: 65 },
      { name: "History", score: 70 },
      { name: "Art", score: 75 }
    ],
    attendance: 86,
    behaviorScore: 80,
    riskScore: 45,
    riskFactors: ["Science below grade level", "Irregular attendance pattern", "Needs academic support"],
    interventions: [
      { name: "Science tutoring", date: "2024-01-16", status: "pending" },
      { name: "Attendance monitoring", date: "2024-01-10", status: "in-progress" }
    ],
    gradesOverTime: [
      { month: "Sep", score: 72 },
      { month: "Oct", score: 70 },
      { month: "Nov", score: 68 },
      { month: "Dec", score: 67 },
      { month: "Jan", score: 68 }
    ]
  },
  {
    id: 17,
    name: "Evelyn Clark",
    grade: 11,
    avatar: "EC",
    subjects: [
      { name: "Mathematics", score: 58 },
      { name: "English", score: 62 },
      { name: "Science", score: 55 },
      { name: "History", score: 60 },
      { name: "Art", score: 65 }
    ],
    attendance: 82,
    behaviorScore: 75,
    riskScore: 58,
    riskFactors: ["Struggling in science", "Below average performance", "Attendance concerns"],
    interventions: [
      { name: "Academic support plan", date: "2024-01-12", status: "in-progress" },
      { name: "Weekly progress check", date: "2024-01-15", status: "pending" }
    ],
    gradesOverTime: [
      { month: "Sep", score: 65 },
      { month: "Oct", score: 63 },
      { month: "Nov", score: 60 },
      { month: "Dec", score: 58 },
      { month: "Jan", score: 58 }
    ]
  },
  {
    id: 18,
    name: "Henry Robinson",
    grade: 12,
    avatar: "HR",
    subjects: [
      { name: "Mathematics", score: 80 },
      { name: "English", score: 82 },
      { name: "Science", score: 78 },
      { name: "History", score: 85 },
      { name: "Art", score: 80 }
    ],
    attendance: 93,
    behaviorScore: 88,
    riskScore: 25,
    riskFactors: ["Slight decline in science", "Could benefit from advanced courses"],
    interventions: [],
    gradesOverTime: [
      { month: "Sep", score: 82 },
      { month: "Oct", score: 81 },
      { month: "Nov", score: 80 },
      { month: "Dec", score: 79 },
      { month: "Jan", score: 80 }
    ]
  },
  {
    id: 19,
    name: "Grace Lewis",
    grade: 9,
    avatar: "GL",
    subjects: [
      { name: "Mathematics", score: 52 },
      { name: "English", score: 58 },
      { name: "Science", score: 50 },
      { name: "History", score: 55 },
      { name: "Art", score: 60 }
    ],
    attendance: 76,
    behaviorScore: 70,
    riskScore: 68,
    riskFactors: ["Low performance across subjects", "Frequent absences", "Needs comprehensive support"],
    interventions: [
      { name: "Comprehensive intervention plan", date: "2024-01-08", status: "in-progress" },
      { name: "Parent engagement meeting", date: "2024-01-15", status: "completed" },
      { name: "Peer mentor assignment", date: "2024-01-18", status: "pending" }
    ],
    gradesOverTime: [
      { month: "Sep", score: 58 },
      { month: "Oct", score: 55 },
      { month: "Nov", score: 53 },
      { month: "Dec", score: 51 },
      { month: "Jan", score: 52 }
    ]
  },
  {
    id: 20,
    name: "Jack Walker",
    grade: 10,
    avatar: "JW",
    subjects: [
      { name: "Mathematics", score: 72 },
      { name: "English", score: 75 },
      { name: "Science", score: 70 },
      { name: "History", score: 73 },
      { name: "Art", score: 78 }
    ],
    attendance: 89,
    behaviorScore: 84,
    riskScore: 35,
    riskFactors: ["Math needs improvement", "Occasional missing work"],
    interventions: [
      { name: "Math support group", date: "2024-01-20", status: "pending" }
    ],
    gradesOverTime: [
      { month: "Sep", score: 74 },
      { month: "Oct", score: 73 },
      { month: "Nov", score: 72 },
      { month: "Dec", score: 71 },
      { month: "Jan", score: 72 }
    ]
  }
];

export const getRiskLevel = (score) => {
  if (score <= 30) return "low";
  if (score <= 60) return "medium";
  return "high";
};

export const getRiskColor = (score) => {
  if (score <= 30) return "success";
  if (score <= 60) return "warning";
  return "danger";
};

export const getStudentsByRisk = (level) => {
  return students.filter(s => getRiskLevel(s.riskScore) === level);
};

export const getAverageScore = (student) => {
  const total = student.subjects.reduce((sum, s) => sum + s.score, 0);
  return Math.round(total / student.subjects.length);
};

export const getSchoolStats = () => {
  const totalStudents = students.length;
  const avgRiskScore = Math.round(students.reduce((sum, s) => sum + s.riskScore, 0) / totalStudents);
  const avgAttendance = Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / totalStudents);
  const avgGrade = Math.round(students.reduce((sum, s) => sum + getAverageScore(s), 0) / totalStudents);
  const atRiskCount = students.filter(s => s.riskScore > 60).length;
  const mediumRiskCount = students.filter(s => s.riskScore > 30 && s.riskScore <= 60).length;
  const lowRiskCount = students.filter(s => s.riskScore <= 30).length;

  return {
    totalStudents,
    avgRiskScore,
    avgAttendance,
    avgGrade,
    atRiskCount,
    mediumRiskCount,
    lowRiskCount
  };
};

export const getGradeDistribution = () => {
  const grades = {};
  students.forEach(s => {
    const grade = `Grade ${s.grade}`;
    grades[grade] = (grades[grade] || 0) + 1;
  });
  return Object.entries(grades).map(([name, value]) => ({ name, value }));
};

export const getRiskDistribution = () => {
  const stats = getSchoolStats();
  return [
    { name: "Low Risk", value: stats.lowRiskCount, color: "#10B981" },
    { name: "Medium Risk", value: stats.mediumRiskCount, color: "#F59E0B" },
    { name: "High Risk", value: stats.atRiskCount, color: "#EF4444" }
  ];
};

export const getPerformanceTrend = () => {
  return [
    { month: "Sep", average: 75, attendance: 91 },
    { month: "Oct", average: 74, attendance: 90 },
    { month: "Nov", average: 73, attendance: 89 },
    { month: "Dec", average: 72, attendance: 88 },
    { month: "Jan", average: 72, attendance: 88 }
  ];
};
