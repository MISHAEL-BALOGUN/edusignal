import { useState } from 'react';
import { students, getSchoolStats, getRiskDistribution, getGradeDistribution, getPerformanceTrend, getAverageScore, getRiskLevel } from '../data/mockData';
import { MultiLineChart, RiskPieChart, GradeBarChart } from '../components/Charts';
import AIChatbot from '../components/AIChatbot';
import { Users, School, TrendingUp, AlertTriangle, Search, ChevronDown, X, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('riskDesc');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const stats = getSchoolStats();
  const riskDistribution = getRiskDistribution();
  const gradeDistribution = getGradeDistribution();
  const performanceTrend = getPerformanceTrend();

  const filteredStudents = students
    .filter(s => {
      if (filter === 'high') return s.riskScore > 60;
      if (filter === 'medium') return s.riskScore > 30 && s.riskScore <= 60;
      if (filter === 'low') return s.riskScore <= 30;
      return true;
    })
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'riskDesc') return b.riskScore - a.riskScore;
      if (sortBy === 'riskAsc') return a.riskScore - b.riskScore;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'grade') return a.grade - b.grade;
      return 0;
    });

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Average Risk Score', value: stats.avgRiskScore, icon: AlertTriangle, color: stats.avgRiskScore > 50 ? 'text-danger' : stats.avgRiskScore > 30 ? 'text-warning' : 'text-success', bg: stats.avgRiskScore > 50 ? 'bg-danger/10' : stats.avgRiskScore > 30 ? 'bg-warning/10' : 'bg-success/10' },
    { label: 'Average Attendance', value: `${stats.avgAttendance}%`, icon: School, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Average Grade', value: `${stats.avgGrade}%`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' }
  ];

  const getRiskColor = (score) => {
    if (score > 60) return 'text-danger';
    if (score > 30) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">School-wide analytics and student management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RiskPieChart data={riskDistribution} title="Risk Distribution" />
        <GradeBarChart data={gradeDistribution} title="Students by Grade Level" />
      </div>

      <MultiLineChart
        data={performanceTrend}
        lines={[
          { key: 'average', name: 'Average Score' },
          { key: 'attendance', name: 'Attendance %' }
        ]}
        title="Performance Trends Over Time"
      />

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800">All Students ({filteredStudents.length})</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm w-64"
              />
            </div>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm bg-white"
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm bg-white"
              >
                <option value="riskDesc">Risk: High to Low</option>
                <option value="riskAsc">Risk: Low to High</option>
                <option value="name">Name: A to Z</option>
                <option value="grade">Grade: Low to High</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Student</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Grade</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Avg Score</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Attendance</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Risk Score</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr
                  key={student.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-xs">{student.avatar}</span>
                      </div>
                      <span className="font-medium text-gray-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{student.grade}</td>
                  <td className="py-3 px-4 text-gray-600">{getAverageScore(student)}%</td>
                  <td className="py-3 px-4 text-gray-600">{student.attendance}%</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${getRiskColor(student.riskScore)}`}>
                      {student.riskScore}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      student.riskScore > 60 ? 'bg-danger/10 text-danger' :
                      student.riskScore > 30 ? 'bg-warning/10 text-warning' :
                      'bg-success/10 text-success'
                    }`}>
                      {getRiskLevel(student.riskScore).charAt(0).toUpperCase() + getRiskLevel(student.riskScore).slice(1)} Risk
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students found matching your criteria
          </div>
        )}
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">{selectedStudent.avatar}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h2>
                  <p className="text-gray-500">Grade {selectedStudent.grade} - ID: STU-{selectedStudent.id.toString().padStart(4, '0')}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-primary">{getAverageScore(selectedStudent)}%</p>
                <p className="text-sm text-gray-500">Avg Score</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-success">{selectedStudent.attendance}%</p>
                <p className="text-sm text-gray-500">Attendance</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-warning">{selectedStudent.behaviorScore}</p>
                <p className="text-sm text-gray-500">Behavior</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className={`text-2xl font-bold ${getRiskColor(selectedStudent.riskScore)}`}>{selectedStudent.riskScore}</p>
                <p className="text-sm text-gray-500">Risk Score</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Subject Performance</h3>
              <div className="grid grid-cols-5 gap-2">
                {selectedStudent.subjects.map((subject, idx) => (
                  <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className={`text-lg font-bold ${
                      subject.score >= 90 ? 'text-success' :
                      subject.score >= 70 ? 'text-primary' :
                      subject.score >= 60 ? 'text-warning' : 'text-danger'
                    }`}>
                      {subject.score}%
                    </div>
                    <p className="text-xs text-gray-500">{subject.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedStudent.riskFactors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Risk Factors</h3>
                <div className="space-y-2">
                  {selectedStudent.riskFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-danger/5 rounded-lg">
                      <AlertCircle size={14} className="text-danger" />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedStudent.interventions.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Interventions</h3>
                <div className="space-y-3">
                  {selectedStudent.interventions.map((intervention, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{intervention.name}</p>
                        <p className="text-sm text-gray-500">{intervention.date}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        intervention.status === 'completed' ? 'bg-success/10 text-success' :
                        intervention.status === 'in-progress' ? 'bg-warning/10 text-warning' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {intervention.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <AIChatbot context={{ selectedStudent: selectedStudent?.name }} />
    </div>
  );
};

export default AdminDashboard;
