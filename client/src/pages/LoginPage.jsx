import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, BookOpen, Shield, ArrowRight, Check, Sparkles } from 'lucide-react';

const ROLES = [
  {
    id: 'student',
    title: 'Student',
    description: 'Track your academic progress and get personalized AI recommendations.',
    icon: GraduationCap,
    chip: 'bg-primary/10 text-primary',
  },
  {
    id: 'teacher',
    title: 'Teacher',
    description: 'Monitor student performance and access AI-powered insights.',
    icon: BookOpen,
    chip: 'bg-success/10 text-success',
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Manage school analytics, trends, and student data.',
    icon: Shield,
    chip: 'bg-warning/10 text-warning',
  },
];

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (selectedRole) {
      login(selectedRole);
      navigate(`/${selectedRole}`);
    }
  };

  const selectedRoleData = ROLES.find(r => r.id === selectedRole);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-pink-50 via-white to-pink-50 relative flex justify-center px-4 py-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 -right-28 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-primary/[0.04] rounded-full blur-2xl" />
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md my-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl shadow-md shadow-primary/20 flex items-center justify-center">
              <span className="font-bold text-white text-sm">eS</span>
            </div>
            <div className="text-left">
              <h1 className="font-bold text-gray-800 leading-none">eduSignal</h1>
              <p className="text-[11px] text-gray-400 mt-1 leading-none">AI-Driven Student Success Platform</p>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
            Welcome to Student Success
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Select your role to access your personalized dashboard
          </p>
        </header>

        <section className="space-y-3" aria-label="Select your role">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                aria-pressed={isSelected}
                className={`group relative w-full flex items-center gap-4 p-4 rounded-2xl border-2 bg-white text-left transition-all duration-200 active:scale-[0.98] ${
                  isSelected
                    ? 'border-primary bg-primary/[0.04] shadow-lg shadow-primary/10'
                    : 'border-gray-200 hover:border-primary/40 hover:shadow-md hover:shadow-gray-200/60'
                }`}
              >
                <span className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${role.chip} group-hover:scale-105`}>
                  <Icon size={20} />
                </span>

                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-sm sm:text-base text-gray-800 leading-snug">
                    {role.title}
                  </span>
                  <span className="block text-xs sm:text-[13px] text-gray-500 leading-snug mt-1">
                    {role.description}
                  </span>
                </span>

                <span
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary'
                      : 'border-gray-300 group-hover:border-primary/60'
                  }`}
                >
                  {isSelected && <Check size={13} strokeWidth={3} className="text-white" />}
                </span>
              </button>
            );
          })}
        </section>

        <div className="mt-6">
          <button
            onClick={handleLogin}
            disabled={!selectedRole}
            className={`w-full h-12 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 ${
              selectedRole
                ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-dark active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedRoleData ? (
              <>
                <Sparkles size={16} />
                Continue as {selectedRoleData.title}
                <ArrowRight size={18} />
              </>
            ) : (
              'Select a role'
            )}
          </button>

          <p className="text-[11px] text-gray-400 text-center mt-4">
            Powered by AI &bull; Built for Student Success
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
