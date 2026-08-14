import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { students, getAverageScore } from '../data/mockData';
import RiskBadge from '../components/RiskBadge';
import { PerformanceLineChart, SubjectBarChart } from '../components/Charts';
import AIChatbot from '../components/AIChatbot';
import { User, TrendingUp, Award, Calendar, AlertCircle, BookOpen } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const student = students.find(s => s.name === user?.name) || students[0];
  const avgScore = getAverageScore(student);

  const stats = [
    { label: 'Average Score', value: `${avgScore}%`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Attendance', value: `${student.attendance}%`, icon: Calendar, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Behavior Score', value: student.behaviorScore, icon: Award, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Risk Level', value: student.riskScore, icon: AlertCircle, color: student.riskScore > 60 ? 'text-danger' : student.riskScore > 30 ? 'text-warning' : 'text-success', bg: student.riskScore > 60 ? 'bg-danger/10' : student.riskScore > 30 ? 'bg-warning/10' : 'bg-success/10' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome back, {student.name.split(' ')[0]}!</h1>
          <p className="text-gray-500">Here's your academic overview</p>
        </div>
        <RiskBadge score={student.riskScore} size="lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PerformanceLineChart
            data={student.gradesOverTime}
            title="Grade Trend"
            dataKey="score"
          />

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {student.subjects.map((subject, idx) => (
                <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className={`text-lg sm:text-2xl font-bold ${
                    subject.score >= 90 ? 'text-success' :
                    subject.score >= 70 ? 'text-primary' :
                    subject.score >= 60 ? 'text-warning' : 'text-danger'
                  }`}>
                    {subject.score}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{subject.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg sm:text-xl">{student.avatar}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{student.name}</h4>
                  <p className="text-sm text-gray-500">Grade {student.grade}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Student ID</span>
                  <span className="font-medium">STU-{student.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Grade Level</span>
                  <span className="font-medium">{student.grade}th Grade</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-medium ${student.riskScore > 60 ? 'text-danger' : student.riskScore > 30 ? 'text-warning' : 'text-success'}`}>
                    {student.riskScore > 60 ? 'At Risk' : student.riskScore > 30 ? 'Monitoring' : 'On Track'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {student.riskFactors.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Factors</h3>
              <div className="space-y-2">
                {student.riskFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-danger/5 rounded-lg">
                    <AlertCircle size={16} className="text-danger mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {student.interventions.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Interventions</h3>
              <div className="space-y-3">
                {student.interventions.map((intervention, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">{intervention.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        intervention.status === 'completed' ? 'bg-success/10 text-success' :
                        intervention.status === 'in-progress' ? 'bg-warning/10 text-warning' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {intervention.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{intervention.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AIChatbot context={{ studentName: student.name, riskScore: student.riskScore }} />
    </div>
  );
};

export default StudentDashboard;
