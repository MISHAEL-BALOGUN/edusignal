import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, BookOpen, Shield, ArrowRight, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'View your academic progress, attendance, and get AI-powered recommendations',
      icon: GraduationCap,
      color: 'bg-primary',
      hoverColor: 'hover:bg-primary-dark'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Monitor student performance, manage interventions, and access AI insights',
      icon: BookOpen,
      color: 'bg-success',
      hoverColor: 'hover:bg-success-dark'
    },
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Access school-wide analytics, track trends, and manage student data',
      icon: Shield,
      color: 'bg-warning',
      hoverColor: 'hover:bg-warning-dark'
    }
  ];

  const handleLogin = () => {
    if (selectedRole) {
      login(selectedRole);
      navigate(`/${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <span className="font-bold text-2xl text-white">eS</span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-800">eduSignal</h1>
              <p className="text-sm text-gray-500">AI-Driven Student Success Platform</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Welcome to Student Success
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Select your role to access personalized dashboards and AI-powered insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg scale-105'
                    : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <div className={`w-14 h-14 ${role.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{role.title}</h3>
                <p className="text-sm text-gray-500">{role.description}</p>
                {isSelected && (
                  <div className="mt-4 flex items-center gap-2 text-primary font-medium">
                    <Sparkles size={16} />
                    <span>Selected</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={handleLogin}
            disabled={!selectedRole}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all ${
              selectedRole
                ? 'bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.title : '...'}
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="mt-12 text-center text-sm text-gray-400">
          <p>Powered by AI • Built for Student Success</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
