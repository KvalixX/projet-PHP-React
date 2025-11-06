import { AlertTriangle, Calendar, User, Users, DoorOpen, CheckCircle } from 'lucide-react';
import { Conflict } from '../utils/scheduleUtils';
import { Module, Professor, Group, Room } from '../types';

interface ConflictsViewProps {
  conflicts: Conflict[];
  modules: Module[];
  professors: Professor[];
  groups: Group[];
  rooms: Room[];
}

export default function ConflictsView({ conflicts, modules, professors, groups, rooms }: ConflictsViewProps) {
  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'room': return DoorOpen;
      case 'professor': return User;
      case 'group': return Users;
      default: return AlertTriangle;
    }
  };

  const getConflictColor = (type: string) => {
    switch (type) {
      case 'room': return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'professor': return 'bg-red-50 border-red-200 text-red-700';
      case 'group': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Schedule Conflicts</h2>
        <p className="text-gray-600 mt-1">Review and resolve scheduling conflicts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border-2 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Professor Conflicts</p>
              <p className="text-2xl font-bold text-gray-900">
                {conflicts.filter(c => c.type === 'professor').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Room Conflicts</p>
              <p className="text-2xl font-bold text-gray-900">
                {conflicts.filter(c => c.type === 'room').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DoorOpen className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border-2 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Group Conflicts</p>
              <p className="text-2xl font-bold text-gray-900">
                {conflicts.filter(c => c.type === 'group').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {conflicts.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">No Conflicts Found</h3>
          <p className="text-green-700">
            Your schedule is conflict-free! All sessions are properly scheduled without any overlaps.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {conflicts.map((conflict, index) => {
            const Icon = getConflictIcon(conflict.type);
            const colorClass = getConflictColor(conflict.type);

            return (
              <div key={index} className={`border rounded-xl p-6 ${colorClass}`}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${conflict.type === 'room' ? 'bg-orange-100' : conflict.type === 'professor' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                      <Icon className={`w-6 h-6 ${conflict.type === 'room' ? 'text-orange-600' : conflict.type === 'professor' ? 'text-red-600' : 'text-yellow-600'}`} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 capitalize">{conflict.type} Conflict</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${conflict.type === 'room' ? 'bg-orange-200 text-orange-800' : conflict.type === 'professor' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                        High Priority
                      </span>
                    </div>
                    <p className="text-gray-900 mb-4">{conflict.message}</p>

                    <div className="space-y-3">
                      {conflict.sessions.map(session => {
                        const module = modules.find(m => m.id === session.moduleId);
                        const professor = professors.find(p => p.id === session.professorId);
                        const group = groups.find(g => g.id === session.groupId);
                        const room = rooms.find(r => r.id === session.roomId);

                        return (
                          <div key={session.id} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: module?.color }}></div>
                                  <span className="font-semibold text-gray-900">{module?.name}</span>
                                  <span className="text-sm text-gray-600">({module?.code})</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                    <span>{session.day}, {session.startTime} - {session.endTime}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <User className="w-4 h-4 mr-2 text-gray-500" />
                                    <span>{professor?.name}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                                    <span>{group?.name}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <DoorOpen className="w-4 h-4 mr-2 text-gray-500" />
                                    <span>{room?.name}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex space-x-3">
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                        Resolve Conflict
                      </button>
                      <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
