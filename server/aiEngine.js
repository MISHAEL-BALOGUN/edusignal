const db = require('./database');

function getRiskLevel(score) {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function analyzeStudentRisk(student, subjects) {
  const factors = JSON.parse(student.risk_factors || '[]');
  const avgScore = subjects.length > 0
    ? subjects.reduce((sum, s) => sum + s.score, 0) / subjects.length
    : 0;

  const analysis = {
    riskLevel: getRiskLevel(student.risk_score),
    riskScore: student.risk_score,
    attendanceRate: student.attendance_rate,
    behaviorScore: student.behavior_score,
    averageScore: Math.round(avgScore),
    riskFactors: factors,
    weakestSubjects: subjects
      .filter(s => s.score < 60)
      .map(s => ({ name: s.name, score: s.score })),
    strengths: subjects
      .filter(s => s.score >= 80)
      .map(s => ({ name: s.name, score: s.score })),
  };

  return analysis;
}

function generateRecommendations(analysis) {
  const recommendations = [];

  if (analysis.attendanceRate < 85) {
    recommendations.push({
      type: 'attendance',
      priority: analysis.attendanceRate < 75 ? 'critical' : 'high',
      action: 'Implement daily attendance monitoring and parent notification system.',
      details: `Current attendance is ${analysis.attendanceRate}%. Consider a check-in protocol and home visits for chronic absenteeism.`,
    });
  }

  if (analysis.averageScore < 60) {
    recommendations.push({
      type: 'academic',
      priority: 'critical',
      action: 'Enroll in intensive academic recovery program.',
      details: `Average score is ${analysis.averageScore}%. Immediate intervention needed with small-group tutoring and modified workload.`,
    });
  } else if (analysis.averageScore < 70) {
    recommendations.push({
      type: 'academic',
      priority: 'high',
      action: 'Provide targeted tutoring in weak subjects.',
      details: `Average score is ${analysis.averageScore}%. Focus on ${analysis.weakestSubjects.map(s => s.name).join(', ') || 'underperforming areas'}.`,
    });
  }

  if (analysis.behaviorScore < 65) {
    recommendations.push({
      type: 'behavioral',
      priority: 'high',
      action: 'Schedule counseling session and behavior improvement plan.',
      details: `Behavior score is ${analysis.behaviorScore}/100. Consider a behavior contract and positive reinforcement program.`,
    });
  }

  analysis.weakestSubjects.forEach(subject => {
    recommendations.push({
      type: 'subject_specific',
      priority: subject.score < 50 ? 'critical' : 'medium',
      action: `Arrange supplemental instruction for ${subject.name}.`,
      details: `${subject.name} score is ${subject.score}%. Pair with peer tutor and provide additional practice materials.`,
    });
  });

  if (analysis.riskLevel === 'high') {
    recommendations.push({
      type: 'parent_engagement',
      priority: 'critical',
      action: 'Schedule immediate parent/guardian conference.',
      details: 'High-risk student requires family involvement. Discuss home support strategies and available resources.',
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: 'monitoring',
      priority: 'low',
      action: 'Continue regular monitoring.',
      details: 'Student is performing well. Maintain current support level and monitor progress.',
    });
  }

  return recommendations;
}

function generateResponse(message, userId) {
  const lowerMsg = message.toLowerCase();

  const studentPattern = /(?:about|student|analyze|risk|intervention)\s+(?:for\s+)?(.+?)(?:\s*\?|$)/i;
  const studentMatch = message.match(studentPattern);

  if (studentMatch || lowerMsg.includes('analyze') || lowerMsg.includes('tell me about')) {
    const searchName = studentMatch ? studentMatch[1].trim() : '';

    let students;
    if (searchName) {
      students = db.prepare(`
        SELECT s.*, u.name, u.email FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE u.name LIKE ?
      `).all(`%${searchName}%`);
    } else {
      return {
        response: 'Please specify a student name. For example: "Analyze risk for Emma Rodriguez" or "Tell me about Liam Patel".',
        recommendations: [],
        confidence: 0.5,
      };
    }

    if (students.length === 0) {
      return {
        response: `I couldn't find a student matching "${searchName}". Please check the name and try again.`,
        recommendations: [],
        confidence: 0.3,
      };
    }

    const student = students[0];
    const subjects = db.prepare('SELECT * FROM subjects WHERE student_id = ?').all(student.id);
    const analysis = analyzeStudentRisk(student, subjects);
    const recommendations = generateRecommendations(analysis);

    const factorText = analysis.riskFactors.length > 0
      ? ` Key risk factors include: ${analysis.riskFactors.join(', ')}.`
      : ' No significant risk factors detected.';

    const weakText = analysis.weakestSubjects.length > 0
      ? ` Weakest subjects: ${analysis.weakestSubjects.map(s => `${s.name} (${s.score}%)`).join(', ')}.`
      : '';

    return {
      response: `Analysis for ${student.name} (${student.grade} grade): ` +
        `Risk Level: ${analysis.riskLevel.toUpperCase()} (Score: ${analysis.riskScore}/100). ` +
        `Attendance: ${analysis.attendanceRate}%. Behavior Score: ${analysis.behaviorScore}/100. ` +
        `Average Grade: ${analysis.averageScore}%.${factorText}${weakText}`,
      recommendations,
      confidence: 0.9,
      studentData: analysis,
    };
  }

  if (lowerMsg.includes('intervention') && (lowerMsg.includes('suggest') || lowerMsg.includes('recommend') || lowerMsg.includes('what') || lowerMsg.includes('which'))) {
    const highRiskStudents = db.prepare(`
      SELECT s.*, u.name FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.risk_score >= 70
      ORDER BY s.risk_score DESC
    `).all();

    if (highRiskStudents.length === 0) {
      return {
        response: 'No high-risk students currently need immediate interventions.',
        recommendations: [],
        confidence: 0.8,
      };
    }

    let responseText = `Found ${highRiskStudents.length} high-risk students requiring intervention:\n\n`;
    const allRecommendations = [];

    highRiskStudents.forEach(student => {
      const subjects = db.prepare('SELECT * FROM subjects WHERE student_id = ?').all(student.id);
      const analysis = analyzeStudentRisk(student, subjects);
      const recs = generateRecommendations(analysis);
      allRecommendations.push(...recs);

      responseText += `• ${student.name} (Risk: ${student.risk_score}): `;
      responseText += recs.slice(0, 2).map(r => r.action).join('; ');
      responseText += '\n';
    });

    return {
      response: responseText,
      recommendations: allRecommendations.slice(0, 8),
      confidence: 0.85,
    };
  }

  if (lowerMsg.includes('improve') || lowerMsg.includes('improvement') || lowerMsg.includes('progress') || lowerMsg.includes('better')) {
    const studentNameMatch = lowerMsg.match(/(?:for|of)\s+(.+?)(?:\s*\?|$)/);
    const searchName = studentNameMatch ? studentNameMatch[1].trim() : '';

    let student;
    if (searchName) {
      student = db.prepare(`
        SELECT s.*, u.name FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE u.name LIKE ?
      `).get(`%${searchName}%`);
    }

    if (student) {
      const subjects = db.prepare('SELECT * FROM subjects WHERE student_id = ? ORDER BY semester').all(student.id);
      const analysis = analyzeStudentRisk(student, subjects);

      const semesterData = {};
      subjects.forEach(s => {
        if (!semesterData[s.semester]) semesterData[s.semester] = [];
        semesterData[s.semester].push(s.score);
      });

      const semesters = Object.keys(semesterData);
      let trendText = '';
      if (semesters.length >= 2) {
        const recentAvg = semesterData[semesters[0]].reduce((a, b) => a + b, 0) / semesterData[semesters[0]].length;
        const olderAvg = semesterData[semesters[semesters.length - 1]].reduce((a, b) => a + b, 0) / semesterData[semesters[semesters.length - 1]].length;
        const diff = Math.round(recentAvg - olderAvg);
        trendText = diff > 0
          ? `There's a positive trend with an improvement of ${diff} points.`
          : diff < 0
            ? `There's a declining trend of ${Math.abs(diff)} points that needs attention.`
            : 'Performance has been stable across semesters.';
      }

      const actionPlan = [];
      if (analysis.averageScore < 70) {
        actionPlan.push('Schedule daily study sessions focusing on weak subjects');
        actionPlan.push('Implement a homework completion tracker');
        actionPlan.push('Connect with subject-specific peer tutors');
      }
      if (analysis.attendanceRate < 90) {
        actionPlan.push('Set up a morning check-in system');
        actionPlan.push('Create an attendance incentive program');
      }
      if (analysis.behaviorScore < 75) {
        actionPlan.push('Implement a positive behavior reinforcement plan');
        actionPlan.push('Schedule weekly check-ins with school counselor');
      }
      if (actionPlan.length === 0) {
        actionPlan.push('Maintain current academic support');
        actionPlan.push('Consider enrichment opportunities');
      }

      return {
        response: `Improvement plan for ${student.name}: ${trendText} ` +
          `Current average: ${analysis.averageScore}%. ` +
          `Recommended actions to improve performance:`,
        recommendations: actionPlan.map((action, i) => ({
          type: 'improvement',
          priority: i === 0 ? 'high' : 'medium',
          action,
          details: `Specific step to help ${student.name} improve.`,
        })),
        confidence: 0.85,
        studentData: analysis,
      };
    }

    return {
      response: 'To provide improvement suggestions, please specify a student name. For example: "How can Emma Rodriguez improve?"',
      recommendations: [],
      confidence: 0.5,
    };
  }

  if (lowerMsg.includes('risk') && (lowerMsg.includes('distribution') || lowerMsg.includes('overview') || lowerMsg.includes('summary') || lowerMsg.includes('how many'))) {
    const highRisk = db.prepare('SELECT COUNT(*) as count FROM students WHERE risk_score >= 70').get();
    const mediumRisk = db.prepare('SELECT COUNT(*) as count FROM students WHERE risk_score >= 40 AND risk_score < 70').get();
    const lowRisk = db.prepare('SELECT COUNT(*) as count FROM students WHERE risk_score < 40').get();
    const total = highRisk.count + mediumRisk.count + lowRisk.count;

    return {
      response: `Current Risk Distribution:\n` +
        `• High Risk: ${highRisk.count} students (${Math.round(highRisk.count / total * 100)}%)\n` +
        `• Medium Risk: ${mediumRisk.count} students (${Math.round(mediumRisk.count / total * 100)}%)\n` +
        `• Low Risk: ${lowRisk.count} students (${Math.round(lowRisk.count / total * 100)}%)\n` +
        `• Total: ${total} students\n\n` +
        `${highRisk.count > 0 ? `Recommendation: ${highRisk.count} student(s) need immediate attention.` : 'All students are within acceptable risk levels.'}`,
      recommendations: highRisk.count > 0 ? [{
        type: 'system',
        priority: 'high',
        action: `Schedule review meetings for ${highRisk.count} high-risk students.`,
        details: 'Prioritize interventions for the highest-risk students.',
      }] : [],
      confidence: 0.95,
    };
  }

  if (lowerMsg.includes('at-risk') || lowerMsg.includes('at risk') || lowerMsg.includes('critical') || lowerMsg.includes('urgent')) {
    const atRiskStudents = db.prepare(`
      SELECT s.*, u.name FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.risk_score >= 70
      ORDER BY s.risk_score DESC
    `).all();

    if (atRiskStudents.length === 0) {
      return {
        response: 'No students are currently classified as at-risk. Great job!',
        recommendations: [],
        confidence: 0.9,
      };
    }

    const studentList = atRiskStudents
      .map(s => `• ${s.name} (Risk: ${s.risk_score}, Attendance: ${s.attendance_rate}%)`)
      .join('\n');

    return {
      response: `At-Risk Students (${atRiskStudents.length} total):\n${studentList}\n\nThese students require immediate attention and intervention.`,
      recommendations: [{
        type: 'urgent',
        priority: 'critical',
        action: `Initiate intervention protocols for ${atRiskStudents.length} at-risk students.`,
        details: 'Schedule individual meetings and create personalized intervention plans.',
      }],
      confidence: 0.9,
    };
  }

  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey') || lowerMsg === 'help') {
    return {
      response: 'Welcome to eduSignal AI Assistant! I can help you with:\n\n' +
        '• Student Analysis: "Analyze risk for [student name]"\n' +
        '• Intervention Suggestions: "What interventions are needed?"\n' +
        '• Improvement Plans: "How can [student name] improve?"\n' +
        '• Risk Overview: "What is the risk distribution?"\n' +
        '• At-Risk Students: "Show at-risk students"\n\n' +
        'How can I assist you today?',
      recommendations: [],
      confidence: 1.0,
    };
  }

  return {
    response: 'I can help you analyze student data, suggest interventions, and create improvement plans. Try asking:\n\n' +
      '• "Analyze risk for Emma Rodriguez"\n' +
      '• "What interventions are needed?"\n' +
      '• "How can the at-risk students improve?"\n' +
      '• "Show me the risk distribution"',
    recommendations: [],
    confidence: 0.4,
  };
}

module.exports = { generateResponse, analyzeStudentRisk, generateRecommendations, getRiskLevel };
