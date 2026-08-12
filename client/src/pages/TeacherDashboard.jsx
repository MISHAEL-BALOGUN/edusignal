import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import RiskBadge from '../components/RiskBadge';
import StudentCard from '../components/StudentCard';
import AIChatbot from '../components/AIChatbot';
import { Users, AlertTriangle, CheckCircle, Clock, Filter, Search, ChevronDown } from 'lucide-react';

const TeacherDashboard = () => {
  const { students, loading, error, refetch } = useData();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const getRiskColor = (score) => {
    if (score > 60) return 'text-danger';
    if (score > 30) return 'text-warning';
    return 'text-success';
  };

  const getAverageScore = (student) => {
    if (!student.subjects?.length) return 0;
    const total = student.subjects.reduce((sum, s) => sum + (s.score || s.avg_score || 0), 0);
    return Math.round(total / student.subjects.length);
  };

  const getRiskLevel = (score) => {
    if (score <= 30) return 'low';
    if (score <= 60) return 'medium';
    return 'high';
  };

  const filteredStudents = useMemo(() => students
    .filter(s => {
      const risk = s.risk_score ?? s.riskScore ?? 0;
      if (filter === 'high') return risk > 60;
      if (filter === 'medium') return risk > 30 && risk <= 60;
      if (filter === 'low') return risk <= 30;
      return true;
    })
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())), [students, filter, searchTerm]);

  const atRiskStudents = useMemo(() => students
    .filter(s => (s.risk_score ?? s.riskScore ?? 0) > 60)
    .sort((a, b) => (b.risk_score ?? b.riskScore ?? 0) - (a.risk_score ?? a.riskScore ?? 0)), [students]);

  const mediumRiskStudents = useMemo(() => students
    .filter(s => {
      const risk = s.risk_score ?? s.riskScore ?? 0;
      return risk > 30 && risk <= 60;
    }), [students]);

  const stats = useMemo(() => [
    { label: 'Total Students', value: students.length, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'High Risk', value: atRiskStudents.length, icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10' },
    { label: 'Medium Risk', value: mediumRiskStudents.length, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Low Risk', value: students.filter(s => (s.risk_score ?? s.riskScore ?? 0) <= 30).length, icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' }
  ], [students, atRiskStudents, mediumRiskStudents]);

  const getInterventionSuggestions = (student) => {
    const riskScore = student.risk_score ?? student.riskScore ?? 0;
    const attendance = student.attendance_rate ?? student.attendance ?? 0;
    const behaviorScore = student.behavior_score ?? student.behaviorScore ?? 0;
    const suggestions = [];
    if (riskScore > 60) {
      suggestions.push("Immediate intervention meeting", "Daily check-ins", "Counseling referral");
    } else if (riskScore > 30) {
      suggestions.push("Weekly progress monitoring", "Study skills workshop", "Parent contact");
    } else {
      suggestions.push("Continue monitoring", "Enrichment opportunities");
    }
    if (attendance < 85) suggestions.push("Attendance improvement plan");
    if (behaviorScore < 70) suggestions.push("Behavioral support");
    return suggestions;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger mb-4">Failed to load data: {error}</p>
        <button onClick={refetch} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
          <p className="text-gray-500">Monitor student performance and manage interventions</p>
        </div>
        <button onClick={refetch} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
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

      {atRiskStudents.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-danger" size={20} />
            At-Risk Students Requiring Immediate Attention
          </h2>
          <div className="space-y-4">
            {atRiskStudents.map(student => (
              <div key={student.id} className="border border-danger/20 rounded-xl p-4 bg-danger/5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
                      <span className="text-danger font-semibold">{student.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{student.name}</h3>
                      <p className="text-sm text-gray-500">Grade {student.grade} • Avg: {getAverageScore(student)}%</p>
                    </div>
                  </div>
                  <RiskBadge score={student.risk_score ?? student.riskScore ?? 0} />
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">Risk Factors:</p>
                  <div className="flex flex-wrap gap-2">
                    {(student.risk_factors || student.riskFactors || []).map((factor, idx) => (
                      <span key={idx} className="text-xs bg-danger/10 text-danger px-2 py-1 rounded-full">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Recommended Interventions:</p>
                  <div className="flex flex-wrap gap-2">
                    {getInterventionSuggestions(student).map((suggestion, idx) => (
                      <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>

                {(student.interventions || []).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-danger/20">
                    <p className="text-sm font-medium text-gray-600 mb-2">Current Interventions:</p>
                    <div className="space-y-2">
                      {student.interventions.map((intervention, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{intervention.title || intervention.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            intervention.status === 'completed' ? 'bg-success/10 text-success' :
                            intervention.status === 'in_progress' || intervention.status === 'in-progress' ? 'bg-warning/10 text-warning' :
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
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">All Students</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
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
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={() => setSelectedStudent(student)}
              compact
            />
          ))}
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
                  <p className="text-gray-500">Grade {selectedStudent.grade}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
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
            </div>

            <div className="mb-6">
              <RiskBadge score={selectedStudent.riskScore} size="lg" />
            </div>

            {selectedStudent.riskFactors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Risk Factors</h3>
                <div className="space-y-2">
                  {selectedStudent.riskFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-danger/5 rounded-lg">
                      <AlertTriangle size={14} className="text-danger" />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Recommended Interventions</h3>
              <div className="space-y-2">
                {getInterventionSuggestions(selectedStudent).map((suggestion, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
                    <CheckCircle size={14} className="text-primary" />
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedStudent.interventions.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Current Interventions</h3>
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

export default TeacherDashboard;
