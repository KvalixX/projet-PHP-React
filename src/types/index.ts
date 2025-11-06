export interface Professor {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface Group {
  id: string;
  name: string;
  level: string;
  studentCount: number;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: 'Amphitheatre' | 'Lab' | 'Classroom';
}

export interface Module {
  id: string;
  name: string;
  code: string;
  hours: number;
  color: string;
}

export interface Session {
  id: string;
  moduleId: string;
  professorId: string;
  groupId: string;
  roomId: string;
  day: string;
  startTime: string;
  endTime: string;
  type: 'Course' | 'TD' | 'TP';
}

export type UserRole = 'admin' | 'professor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  groupId?: string;
  professorId?: string;
}
