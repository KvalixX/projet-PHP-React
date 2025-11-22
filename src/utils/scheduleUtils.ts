import { Session, Professor, Group, Room } from '../types';

export interface Conflict {
  type: 'room' | 'professor' | 'group';
  sessions: Session[];
  message: string;
}

export const detectConflicts = (
  sessions: Session[],
  professors: Professor[],
  groups: Group[],
  rooms: Room[]
): Conflict[] => {
  const conflicts: Conflict[] = [];

  sessions.forEach((session1, index) => {
    sessions.slice(index + 1).forEach((session2) => {
      if (session1.day === session2.day && timesOverlap(session1, session2)) {
        if (session1.roomId === session2.roomId) {
          conflicts.push({
            type: 'room',
            sessions: [session1, session2],
            message: `Room conflict: ${rooms.find(r => r.id === session1.roomId)?.name} is booked twice`,
          });
        }

        if (session1.professorId === session2.professorId) {
          conflicts.push({
            type: 'professor',
            sessions: [session1, session2],
            message: `Professor conflict: ${professors.find(p => p.id === session1.professorId)?.name} has overlapping sessions`,
          });
        }

        if (session1.groupId === session2.groupId) {
          conflicts.push({
            type: 'group',
            sessions: [session1, session2],
            message: `Group conflict: ${groups.find(g => g.id === session1.groupId)?.name} has overlapping sessions`,
          });
        }
      }
    });
  });

  return conflicts;
};

const timesOverlap = (session1: Session, session2: Session): boolean => {
  const start1 = timeToMinutes(session1.startTime);
  const end1 = timeToMinutes(session1.endTime);
  const start2 = timeToMinutes(session2.startTime);
  const end2 = timeToMinutes(session2.endTime);

  return (start1 < end2 && end1 > start2);
};

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const getSessionsForDay = (sessions: Session[], day: string): Session[] => {
  return sessions.filter(s => s.day === day).sort((a, b) =>
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );
};

export const getSessionsForGroup = (sessions: Session[], groupId: string): Session[] => {
  return sessions.filter(s => s.groupId === groupId);
};

export const getSessionsForProfessor = (sessions: Session[], professorId: string): Session[] => {
  return sessions.filter(s => s.professorId === professorId);
};

export const getSessionsForRoom = (sessions: Session[], roomId: string): Session[] => {
  return sessions.filter(s => s.roomId === roomId);
};

export const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00'
];
