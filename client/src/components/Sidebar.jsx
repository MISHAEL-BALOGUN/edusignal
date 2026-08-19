import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, School, LogOut, GraduationCap, BookOpen, X } from 'lucide-react';

const Sidebar = ({ open = false, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavItems = () => {
    switch (user?.role) {
      case 'student':
        return [
          { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
        ];
      case 'teacher':
        return [
          { to: '/teacher', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/teacher/students', icon: Users, label: 'My Students' },
        ];
      case 'admin':
        return [
          { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/admin/analytics', icon: School, label: 'Analytics' },
          { to: '/admin/students', icon: Users, label: 'All Students' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const roleConfig = {
    student: { icon: GraduationCap, color: 'text-primary', label: 'Student Portal' },
    teacher: { icon: BookOpen, color: 'text-primary', label: 'Teacher Portal' },
    admin: { icon: School, color: 'text-primary', label: 'Admin Portal' }
  };

  const currentRole = roleConfig[user?.role];
  const RoleIcon = currentRole?.icon;

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar flex flex-col border-r border-gray-100 shadow-lg md:shadow-none transition-transform duration-300 md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/lasu-logo.png" alt="eduSignal logo" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="font-bold text-lg text-gray-800">eduSignal</h1>
                <p className="text-xs text-gray-400">Student Success Platform</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors md:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {user && (
          <div className="p-4 mx-4 mt-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-3">
              {RoleIcon && <RoleIcon size={20} className={currentRole.color} />}
              <div>
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{currentRole?.label}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/student' || item.to === '/teacher' || item.to === '/admin'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-sidebar-hover hover:text-primary'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-danger/10 hover:text-danger rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;