import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

const RiskBadge = ({ score, size = 'md' }) => {
  const getRiskConfig = (score) => {
    if (score <= 30) {
      return {
        level: 'Low',
        bgColor: 'bg-success/10',
        textColor: 'text-success',
        borderColor: 'border-success/30',
        icon: CheckCircle
      };
    }
    if (score <= 60) {
      return {
        level: 'Medium',
        bgColor: 'bg-warning/10',
        textColor: 'text-warning',
        borderColor: 'border-warning/30',
        icon: AlertCircle
      };
    }
    return {
      level: 'High',
      bgColor: 'bg-danger/10',
      textColor: 'text-danger',
      borderColor: 'border-danger/30',
      icon: AlertTriangle
    };
  };

  const config = getRiskConfig(score);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]}`}>
      <Icon size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
      <span className="font-medium">{config.level} Risk ({score})</span>
    </div>
  );
};

export default RiskBadge;
