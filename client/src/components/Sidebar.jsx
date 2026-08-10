import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, School, LogOut, GraduationCap, BookOpen, Settings } from 'lucide-react';

const Sidebar = () => {
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
    teacher: { icon: BookOpen, color: 'text-success', label: 'Teacher Portal' },
    admin: { icon: School, color: 'text-warning', label: 'Admin Portal' }
  };

  const currentRole = roleConfig[user?.role];
  const RoleIcon = currentRole?.icon;

  return (
    <aside className="w-64 bg-sidebar text-white h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="font-bold text-lg">eS</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">eduSignal</h1>
            <p className="text-xs text-gray-400">Student Success Platform</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="p-4 mx-4 mt-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            {RoleIcon && <RoleIcon size={20} className={currentRole.color} />}
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">{currentRole?.label}</p>
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
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-danger/20 hover:text-danger rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
