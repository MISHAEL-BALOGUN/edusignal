import { User } from 'lucide-react';
import RiskBadge from './RiskBadge';
import { getAverageScore } from '../data/mockData';

const StudentCard = ({ student, onClick, compact = false }) => {
  const avgScore = getAverageScore(student);

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">{student.avatar}</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 text-sm">{student.name}</h4>
              <p className="text-xs text-gray-500">Grade {student.grade} • Avg: {avgScore}%</p>
            </div>
          </div>
          <RiskBadge score={student.riskScore} size="sm" />
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
            <span className="text-primary font-bold text-lg">{student.avatar}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{student.name}</h3>
            <p className="text-sm text-gray-500">Grade {student.grade}</p>
          </div>
        </div>
        <RiskBadge score={student.riskScore} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-primary">{avgScore}%</p>
          <p className="text-xs text-gray-500">Avg Score</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-success">{student.attendance}%</p>
          <p className="text-xs text-gray-500">Attendance</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-warning">{student.behaviorScore}</p>
          <p className="text-xs text-gray-500">Behavior</p>
        </div>
      </div>

      {student.riskFactors.length > 0 && (
        <div className="border-t pt-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Risk Factors:</p>
          <div className="flex flex-wrap gap-2">
            {student.riskFactors.slice(0, 2).map((factor, idx) => (
              <span key={idx} className="text-xs bg-danger/10 text-danger px-2 py-1 rounded-full">
                {factor}
              </span>
            ))}
            {student.riskFactors.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                +{student.riskFactors.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCard;
