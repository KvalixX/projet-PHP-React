import { useMemo, useState } from 'react';
import { Session, Module, Professor, Group, Room } from '../types';
import { daysOfWeek } from '../utils/scheduleUtils';
import { Plus, Pencil, Trash, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface ScheduleViewProps {
  sessions: Session[];
  modules: Module[];
  professors: Professor[];
  groups: Group[];
  rooms: Room[];
  onAddSession?: (data: Omit<Session, 'id'>) => Promise<void> | void;
  onUpdateSession?: (id: string, data: Omit<Session, 'id'>) => Promise<void> | void;
  onDeleteSession?: (id: string) => Promise<void> | void;
}

type SessionFormState = {
  moduleId: string;
  professorId: string;
  groupId: string;
  roomId: string;
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  type: Session['type'];
};

function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer ? <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}

// Helper function to get the start of the week (Monday) for a given date
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

// Helper function to get dates for each day of the week
const getWeekDates = (weekStart: Date): Date[] => {
  const dates: Date[] = [];
  for (let i = 0; i < 6; i++) { // Monday to Saturday
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// Helper function to format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

// Helper function to format week range
const formatWeekRange = (weekStart: Date): string => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 5); // Saturday
  const startStr = weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  const endStr = weekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${startStr} - ${endStr}`;
};

export default function ScheduleView({ sessions, modules, professors, groups, rooms, onAddSession, onUpdateSession, onDeleteSession }: ScheduleViewProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<SessionFormState>({ moduleId: '', professorId: '', groupId: '', roomId: '', day: daysOfWeek[0], date: '', startTime: '08:00', endTime: '09:00', type: 'Course' });
  
  // State for week navigation
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getStartOfWeek(new Date()));

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  
  // Get dates for current week
  const weekDates = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart]);
  
  // Check if current week is the actual current week
  const isCurrentWeek = useMemo(() => {
    const today = new Date();
    const todayWeekStart = getStartOfWeek(today);
    return currentWeekStart.getTime() === todayWeekStart.getTime();
  }, [currentWeekStart]);

  // Navigation functions
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getStartOfWeek(new Date()));
  };

  const getSessionsForDayAndTime = (day: string, time: string, dayIndex: number) => {
    const dayDate = weekDates[dayIndex];
    const dayDateString = dayDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    return sessions.filter(s => {
      // Check day match
      if (s.day !== day) return false;
      
      // If session has a specific date, it must match the current day's date
      if (s.date) {
        if (s.date !== dayDateString) return false;
      }
      // If session has no date, it's recurring and shows every week on that day
      
      // Check time overlap
      const sessionStart = parseInt(s.startTime.split(':')[0]);
      const slotTime = parseInt(time.split(':')[0]);
      const sessionEnd = parseInt(s.endTime.split(':')[0]);
      return sessionStart <= slotTime && slotTime < sessionEnd;
    });
  };

  const getSessionHeight = (session: Session) => {
    const start = parseInt(session.startTime.split(':')[0]) + parseInt(session.startTime.split(':')[1]) / 60;
    const end = parseInt(session.endTime.split(':')[0]) + parseInt(session.endTime.split(':')[1]) / 60;
    return (end - start) * 60;
  };

  const isFormValid = useMemo(() => {
    if (!form.moduleId || !form.professorId || !form.groupId || !form.roomId) return false;
    if (!form.day || !form.startTime || !form.endTime) return false;
    const startH = parseInt(form.startTime.split(':')[0]) + parseInt(form.startTime.split(':')[1]) / 60;
    const endH = parseInt(form.endTime.split(':')[0]) + parseInt(form.endTime.split(':')[1]) / 60;
    return endH > startH;
  }, [form]);

  const openAdd = () => {
    setSelectedSession(null);
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setForm({ moduleId: '', professorId: '', groupId: '', roomId: '', day: daysOfWeek[0], date: today, startTime: '08:00', endTime: '09:00', type: 'Course' });
    setIsAddOpen(true);
  };

  const openEdit = (s: Session) => {
    setSelectedSession(s);
    setForm({ moduleId: s.moduleId, professorId: s.professorId, groupId: s.groupId, roomId: s.roomId, day: s.day, date: s.date || '', startTime: s.startTime, endTime: s.endTime, type: s.type });
    setIsEditOpen(true);
  };

  const openDelete = (s: Session) => {
    setSelectedSession(s);
    setIsDeleteOpen(true);
  };

  const closeAll = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedSession(null);
    setSubmitting(false);
  };

  const submitAdd = async () => {
    if (!onAddSession || !isFormValid) return;
    try {
      setSubmitting(true);
      await onAddSession({ moduleId: form.moduleId, professorId: form.professorId, groupId: form.groupId, roomId: form.roomId, day: form.day, date: form.date || null, startTime: form.startTime, endTime: form.endTime, type: form.type });
      closeAll();
    } finally {
      setSubmitting(false);
    }
  };

  const submitEdit = async () => {
    if (!onUpdateSession || !selectedSession || !isFormValid) return;
    try {
      setSubmitting(true);
      await onUpdateSession(selectedSession.id, { moduleId: form.moduleId, professorId: form.professorId, groupId: form.groupId, roomId: form.roomId, day: form.day, date: form.date || null, startTime: form.startTime, endTime: form.endTime, type: form.type });
      closeAll();
    } finally {
      setSubmitting(false);
    }
  };

  const submitDelete = async () => {
    if (!onDeleteSession || !selectedSession) return;
    try {
      setSubmitting(true);
      await onDeleteSession(selectedSession.id);
      closeAll();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly Schedule</h2>
          <p className="text-gray-600 mt-1">Complete overview of all scheduled sessions</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Add Session
        </button>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousWeek}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
            Semaine précédente
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>{formatWeekRange(currentWeekStart)}</span>
              </div>
            </div>
            {!isCurrentWeek && (
              <button
                onClick={goToCurrentWeek}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Aujourd'hui
              </button>
            )}
          </div>

          <button
            onClick={goToNextWeek}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            Semaine suivante
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid grid-cols-7 border-b border-gray-200">
              <div className="p-4 bg-gray-50 border-r border-gray-200 font-semibold text-gray-700">Time</div>
              {daysOfWeek.map((day, index) => (
                <div key={day} className="p-4 bg-gray-50 border-r border-gray-200 font-semibold text-gray-900 text-center">
                  <div>{day}</div>
                  <div className="text-xs font-normal text-gray-600 mt-1">{formatDate(weekDates[index])}</div>
                </div>
              ))}
            </div>

            {timeSlots.map(time => (
              <div key={time} className="grid grid-cols-7 border-b border-gray-200 min-h-[80px]">
                <div className="p-4 bg-gray-50 border-r border-gray-200 font-medium text-gray-600 text-sm">
                  {time}
                </div>
                {daysOfWeek.map((day, dayIndex) => {
                  const daySessions = getSessionsForDayAndTime(day, time, dayIndex);
                  return (
                    <div key={`${day}-${time}`} className="border-r border-gray-200 p-2 relative">
                      {daySessions.map(session => {
                        const module = modules.find(m => m.id === session.moduleId);
                        const group = groups.find(g => g.id === session.groupId);
                        const room = rooms.find(r => r.id === session.roomId);
                        const isFirstSlot = session.startTime.startsWith(time);

                        if (!isFirstSlot) return null;

                        return (
                          <div
                            key={session.id}
                            className="rounded-lg p-2 text-white text-xs mb-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            style={{
                              backgroundColor: module?.color,
                              minHeight: `${Math.min(getSessionHeight(session), 60)}px`,
                            }}
                            onClick={() => openEdit(session)}
                          >
                            <div className="font-semibold mb-1">{module?.code}</div>
                            <div className="opacity-90 space-y-0.5">
                              <div>{group?.name}</div>
                              <div>{room?.name}</div>
                              <div className="text-[10px]">{session.startTime} - {session.endTime}</div>
                            </div>
                            <div className="mt-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px] inline-block">
                              {session.type}
                            </div>
                            <div className="mt-2 flex gap-2">
                              <button className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded" onClick={(e) => { e.stopPropagation(); openEdit(session); }} title="Edit">
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded" onClick={(e) => { e.stopPropagation(); openDelete(session); }} title="Delete">
                                <Trash className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Session Modal */}
      <Modal open={isAddOpen} onClose={closeAll} title="Add Session"
        footer={
          <>
            <button onClick={closeAll} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={submitAdd} disabled={!isFormValid || submitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">{submitting ? 'Saving...' : 'Save'}</button>
          </>
        }
      >
        <SessionForm form={form} setForm={setForm} modules={modules} professors={professors} groups={groups} rooms={rooms} />
      </Modal>

      {/* Edit Session Modal */}
      <Modal open={isEditOpen} onClose={closeAll} title="Edit Session"
        footer={
          <>
            <button onClick={closeAll} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={submitEdit} disabled={!isFormValid || submitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">{submitting ? 'Updating...' : 'Update'}</button>
          </>
        }
      >
        <SessionForm form={form} setForm={setForm} modules={modules} professors={professors} groups={groups} rooms={rooms} />
      </Modal>

      {/* Delete Session Modal */}
      <Modal open={isDeleteOpen} onClose={closeAll} title="Delete Session"
        footer={
          <>
            <button onClick={closeAll} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={submitDelete} disabled={submitting} className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50">{submitting ? 'Deleting...' : 'Delete'}</button>
          </>
        }
      >
        <p className="text-gray-700">Are you sure you want to delete this session?</p>
      </Modal>
    </div>
  );
}

function SessionForm({ form, setForm, modules, professors, groups, rooms }: {
  form: SessionFormState;
  setForm: React.Dispatch<React.SetStateAction<SessionFormState>>;
  modules: Module[];
  professors: Professor[];
  groups: Group[];
  rooms: Room[];
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
          <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.moduleId} onChange={e => setForm(prev => ({ ...prev, moduleId: e.target.value }))}>
            <option value="">Select module</option>
            {modules.map(m => (
              <option key={m.id} value={m.id}>{m.code} - {m.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Professor</label>
          <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.professorId} onChange={e => setForm(prev => ({ ...prev, professorId: e.target.value }))}>
            <option value="">Select professor</option>
            {professors.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
          <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.groupId} onChange={e => setForm(prev => ({ ...prev, groupId: e.target.value }))}>
            <option value="">Select group</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
          <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.roomId} onChange={e => setForm(prev => ({ ...prev, roomId: e.target.value }))}>
            <option value="">Select room</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input 
          type="date" 
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          value={form.date} 
          onChange={e => {
            const selectedDate = e.target.value;
            setForm(prev => {
              // Auto-update day based on selected date
              let newDay = prev.day;
              if (selectedDate) {
                const date = new Date(selectedDate);
                const dayIndex = date.getDay();
                const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Sunday=6, Monday=0, etc.
                const adjustedIndex = dayMap[dayIndex];
                if (adjustedIndex >= 0 && adjustedIndex < daysOfWeek.length) {
                  newDay = daysOfWeek[adjustedIndex];
                }
              }
              return { ...prev, date: selectedDate, day: newDay };
            });
          }} 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
          <input type="time" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.startTime} onChange={e => setForm(prev => ({ ...prev, startTime: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
          <input type="time" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.endTime} onChange={e => setForm(prev => ({ ...prev, endTime: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value as Session['type'] }))}>
          <option value="Course">Course</option>
          <option value="TD">TD</option>
          <option value="TP">TP</option>
        </select>
      </div>
    </div>
  );
}
