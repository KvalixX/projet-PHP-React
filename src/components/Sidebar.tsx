import { Calendar, Users, BookOpen, DoorOpen, User, AlertCircle, LayoutDashboard, LogOut, Shield, GraduationCap } from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  conflictCount: number;
  user: UserType;
  onLogout: () => void;
}

export default function Sidebar({ activeView, onViewChange, conflictCount, user, onLogout }: SidebarProps) {
  // Base menu items available to all users
  const baseMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['admin', 'professor', 'student'] },
    { id: 'schedule', label: 'Emploi du temps', icon: Calendar, roles: ['admin', 'professor', 'student'] },
  ];

  // Admin-only menu items
  const adminMenuItems = [
    { id: 'professors', label: 'Professeurs', icon: User, roles: ['admin'] },
    { id: 'groups', label: 'Groupes', icon: Users, roles: ['admin'] },
    { id: 'modules', label: 'Modules', icon: BookOpen, roles: ['admin'] },
    { id: 'rooms', label: 'Salles', icon: DoorOpen, roles: ['admin'] },
    { id: 'conflicts', label: 'Conflits', icon: AlertCircle, badge: conflictCount, roles: ['admin'] },
  ];

  // Filter menu items based on user role
  const menuItems = [...baseMenuItems, ...adminMenuItems].filter(item =>
    item.roles.includes(user.role)
  );

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'professor':
        return 'Professeur';
      case 'student':
        return 'Étudiant';
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'professor':
        return <User className="w-4 h-4" />;
      case 'student':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">UniSchedule</h1>
            <p className="text-xs text-gray-500">{getRoleLabel(user.role)}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
              activeView === item.id
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
            {getRoleIcon(user.role)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-blue-600 font-medium mt-1">{getRoleLabel(user.role)}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
