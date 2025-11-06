import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScheduleView from './components/ScheduleView';
import ProfessorsView from './components/ProfessorsView';
import GroupsView from './components/GroupsView';
import ModulesView from './components/ModulesView';
import RoomsView from './components/RoomsView';
import ConflictsView from './components/ConflictsView';
import { api } from './services/api';
import { detectConflicts } from './utils/scheduleUtils';
import { Professor, Group, Room, Module, Session } from './types';

function AppContent() {
  const { user, login, logout } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        const [professorsData, groupsData, roomsData, modulesData, sessionsData] = await Promise.all([
          api.getProfessors(),
          api.getGroups(),
          api.getRooms(),
          api.getModules(),
          api.getSessions(),
        ]);
        
        setProfessors(professorsData as Professor[]);
        setGroups(groupsData as Group[]);
        setRooms(roomsData as Room[]);
        setModules(modulesData as Module[]);
        setSessions(sessionsData as Session[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const conflicts = detectConflicts(sessions, professors, groups, rooms);

  // Filter sessions based on user role
  const getFilteredSessions = () => {
    if (!user) return sessions;
    
    if (user.role === 'professor' && user.professorId) {
      return sessions.filter(s => s.professorId === user.professorId);
    }
    
    if (user.role === 'student' && user.groupId) {
      return sessions.filter(s => s.groupId === user.groupId);
    }
    
    return sessions;
  };

  const filteredSessions = getFilteredSessions();

  // CRUD handlers wired to API and local state updates
  const onAddProfessor = async (data: Omit<Professor, 'id'>) => {
    const created = await api.addProfessor(data);
    setProfessors(prev => [...prev, created as Professor]);
  };
  const onUpdateProfessor = async (id: string, data: Omit<Professor, 'id'>) => {
    const updated = await api.updateProfessor(id, data);
    setProfessors(prev => prev.map(p => (p.id === id ? (updated as Professor) : p)));
  };
  const onDeleteProfessor = async (id: string) => {
    await api.deleteProfessor(id);
    setProfessors(prev => prev.filter(p => p.id !== id));
  };

  const onAddGroup = async (data: Omit<Group, 'id'>) => {
    const created = await api.addGroup({ name: data.name, level: data.level, studentCount: data.studentCount });
    setGroups(prev => [...prev, created as Group]);
  };
  const onUpdateGroup = async (id: string, data: Omit<Group, 'id'>) => {
    const updated = await api.updateGroup(id, { name: data.name, level: data.level, studentCount: data.studentCount });
    setGroups(prev => prev.map(g => (g.id === id ? (updated as Group) : g)));
  };
  const onDeleteGroup = async (id: string) => {
    await api.deleteGroup(id);
    setGroups(prev => prev.filter(g => g.id !== id));
  };

  const onAddModule = async (data: Omit<Module, 'id'>) => {
    const created = await api.addModule(data);
    setModules(prev => [...prev, created as Module]);
  };
  const onUpdateModule = async (id: string, data: Omit<Module, 'id'>) => {
    const updated = await api.updateModule(id, data);
    setModules(prev => prev.map(m => (m.id === id ? (updated as Module) : m)));
  };
  const onDeleteModule = async (id: string) => {
    await api.deleteModule(id);
    setModules(prev => prev.filter(m => m.id !== id));
  };

  const onAddRoom = async (data: Omit<Room, 'id'>) => {
    const created = await api.addRoom(data);
    setRooms(prev => [...prev, created as Room]);
  };
  const onUpdateRoom = async (id: string, data: Omit<Room, 'id'>) => {
    const updated = await api.updateRoom(id, data);
    setRooms(prev => prev.map(r => (r.id === id ? (updated as Room) : r)));
  };
  const onDeleteRoom = async (id: string) => {
    await api.deleteRoom(id);
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const onAddSession = async (data: Omit<Session, 'id'>) => {
    const created = await api.addSession(data as any);
    setSessions(prev => [...prev, created as Session]);
  };
  const onUpdateSession = async (id: string, data: Omit<Session, 'id'>) => {
    const updated = await api.updateSession(id, data as any);
    setSessions(prev => prev.map(s => (s.id === id ? (updated as Session) : s)));
  };
  const onDeleteSession = async (id: string) => {
    await api.deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            professors={professors}
            groups={groups}
            rooms={rooms}
            modules={modules}
            sessions={filteredSessions}
            conflictCount={user?.role === 'admin' ? conflicts.length : 0}
          />
        );
      case 'schedule':
        return (
          <ScheduleView
            sessions={filteredSessions}
            modules={modules}
            professors={professors}
            groups={groups}
            rooms={rooms}
            onAddSession={onAddSession}
            onUpdateSession={onUpdateSession}
            onDeleteSession={onDeleteSession}
          />
        );
      case 'professors':
        return (
          <ProfessorsView
            professors={professors}
            sessions={filteredSessions}
            modules={modules}
            onAddProfessor={onAddProfessor}
            onUpdateProfessor={onUpdateProfessor}
            onDeleteProfessor={onDeleteProfessor}
          />
        );
      case 'groups':
        return (
          <GroupsView
            groups={groups}
            sessions={filteredSessions}
            modules={modules}
            onAddGroup={onAddGroup}
            onUpdateGroup={onUpdateGroup}
            onDeleteGroup={onDeleteGroup}
          />
        );
      case 'modules':
        return (
          <ModulesView
            modules={modules}
            sessions={filteredSessions}
            groups={groups}
            onAddModule={onAddModule}
            onUpdateModule={onUpdateModule}
            onDeleteModule={onDeleteModule}
          />
        );
      case 'rooms':
        return (
          <RoomsView
            rooms={rooms}
            sessions={filteredSessions}
            modules={modules}
            onAddRoom={onAddRoom}
            onUpdateRoom={onUpdateRoom}
            onDeleteRoom={onDeleteRoom}
          />
        );
      case 'conflicts':
        return (
          <ConflictsView
            conflicts={conflicts}
            modules={modules}
            professors={professors}
            groups={groups}
            rooms={rooms}
          />
        );
      default:
        return null;
    }
  };

  if (!user) {
    return <Login onLogin={login} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold mb-2">Erreur de chargement</p>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        conflictCount={user.role === 'admin' ? conflicts.length : 0}
        user={user}
        onLogout={logout}
      />
      <div className="ml-64 p-8">
        {renderView()}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
