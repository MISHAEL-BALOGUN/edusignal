import { User } from 'lucide-react';
import RiskBadge from './RiskBadge';

const StudentCard = ({ student, onClick, compact = false }) => {
  const getAverageScore = (student) => {
    if (!student.subjects?.length) return 0;
    const total = student.subjects.reduce((sum, s) => sum + (s.score || s.avg_score || 0), 0);
    return Math.round(total / student.subjects.length);
  };

  const avgScore = getAverageScore(student);
  const riskScore = student.risk_score ?? student.riskScore ?? 0;
  const attendance = student.attendance_rate ?? student.attendance ?? 0;
  const behaviorScore = student.behavior_score ?? student.behaviorScore ?? 0;
  const riskFactors = student.risk_factors || student.riskFactors || [];

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">{student.avatar || student.name?.charAt(0)}</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 text-sm">{student.name}</h4>
              <p className="text-xs text-gray-500">Grade {student.grade} • Avg: {avgScore}%</p>
            </div>
          </div>
          <RiskBadge score={riskScore} size="sm" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-lg">{student.avatar || student.name?.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{student.name}</h3>
            <p className="text-sm text-gray-500">Grade {student.grade}</p>
          </div>
        </div>
        <RiskBadge score={riskScore} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-primary">{avgScore}%</p>
          <p className="text-xs text-gray-500">Avg Score</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-success">{attendance}%</p>
          <p className="text-xs text-gray-500">Attendance</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-warning">{behaviorScore}</p>
          <p className="text-xs text-gray-500">Behavior</p>
        </div>
      </div>

      {riskFactors.length > 0 && (
        <div className="border-t pt-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Risk Factors:</p>
          <div className="flex flex-wrap gap-2">
            {riskFactors.slice(0, 2).map((factor, idx) => (
              <span key={idx} className="text-xs bg-danger/10 text-danger px-2 py-1 rounded-full">
                {factor}
              </span>
            ))}
            {riskFactors.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                +{riskFactors.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCard;
