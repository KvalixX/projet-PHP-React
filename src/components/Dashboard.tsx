import { Users, BookOpen, DoorOpen, Calendar, User, AlertTriangle, TrendingUp } from 'lucide-react';
import { Professor, Group, Room, Module, Session } from '../types';

interface DashboardProps {
  professors: Professor[];
  groups: Group[];
  rooms: Room[];
  modules: Module[];
  sessions: Session[];
  conflictCount: number;
}

export default function Dashboard({ professors, groups, rooms, modules, sessions, conflictCount }: DashboardProps) {
  const stats = [
    { label: 'Total Professors', value: professors.length, icon: User, color: 'bg-blue-500'},
    { label: 'Active Groups', value: groups.length, icon: Users, color: 'bg-green-500'},
    { label: 'Available Rooms', value: rooms.length, icon: DoorOpen, color: 'bg-purple-500'},
    { label: 'Modules', value: modules.length, icon: BookOpen, color: 'bg-orange-500'},
    { label: 'Scheduled Sessions', value: sessions.length, icon: Calendar, color: 'bg-cyan-500'},
    { label: 'Conflicts', value: conflictCount, icon: AlertTriangle, color: 'bg-red-500'},
  ];

  const recentSessions = sessions.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <div className="flex items-baseline mt-2 space-x-2">
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
          <div className="space-y-3">
            {recentSessions.map((session) => {
              const module = modules.find(m => m.id === session.moduleId);
              const group = groups.find(g => g.id === session.groupId);
              return (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: module?.color }}></div>
                    <div>
                      <p className="font-medium text-gray-900">{module?.name}</p>
                      <p className="text-sm text-gray-500">{group?.name} • {session.day}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{session.startTime}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Utilization</h3>
          <div className="space-y-4">
            {rooms.slice(0, 5).map((room) => {
              const roomSessions = sessions.filter(s => s.roomId === room.id).length;
              const utilization = (roomSessions / sessions.length) * 100;
              return (
                <div key={room.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{room.name}</span>
                    <span className="text-gray-600">{Math.round(utilization)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${utilization}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {conflictCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Schedule Conflicts Detected</h3>
              <p className="text-red-700 mt-1">
                There are {conflictCount} conflict{conflictCount !== 1 ? 's' : ''} in the current schedule.
                Please review and resolve them to ensure smooth operations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
