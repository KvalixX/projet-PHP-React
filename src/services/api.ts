const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface ApiError {
  message: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
}

export const api = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  async getProfessors() {
    const response = await fetch(`${API_BASE_URL}/professors`);
    return handleResponse(response);
  },

  async addProfessor(data: { name: string; email: string; department: string }) {
    const response = await fetch(`${API_BASE_URL}/professors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updateProfessor(id: string, data: { name: string; email: string; department: string }) {
    const response = await fetch(`${API_BASE_URL}/professors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteProfessor(id: string) {
    const response = await fetch(`${API_BASE_URL}/professors/${id}`, { method: 'DELETE' });
    return handleResponse(response);
  },

  async getGroups() {
    const response = await fetch(`${API_BASE_URL}/groups`);
    return handleResponse(response);
  },

  async addGroup(data: { name: string; level: string; studentCount: number }) {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updateGroup(id: string, data: { name: string; level: string; studentCount: number }) {
    const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteGroup(id: string) {
    const response = await fetch(`${API_BASE_URL}/groups/${id}`, { method: 'DELETE' });
    return handleResponse(response);
  },

  async getRooms() {
    const response = await fetch(`${API_BASE_URL}/rooms`);
    return handleResponse(response);
  },

  async addRoom(data: { name: string; capacity: number; type: 'Amphitheatre' | 'Lab' | 'Classroom' }) {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updateRoom(id: string, data: { name: string; capacity: number; type: 'Amphitheatre' | 'Lab' | 'Classroom' }) {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteRoom(id: string) {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, { method: 'DELETE' });
    return handleResponse(response);
  },

  async getModules() {
    const response = await fetch(`${API_BASE_URL}/modules`);
    return handleResponse(response);
  },

  async addModule(data: { name: string; code: string; hours: number; color?: string }) {
    const response = await fetch(`${API_BASE_URL}/modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updateModule(id: string, data: { name: string; code: string; hours: number; color?: string }) {
    const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteModule(id: string) {
    const response = await fetch(`${API_BASE_URL}/modules/${id}`, { method: 'DELETE' });
    return handleResponse(response);
  },

  async getSessions() {
    const response = await fetch(`${API_BASE_URL}/sessions`);
    return handleResponse(response);
  },

  async addSession(data: { moduleId: string; professorId: string; groupId: string; roomId: string; day: string; startTime: string; endTime: string; type: 'Course' | 'TD' | 'TP' }) {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updateSession(id: string, data: { moduleId: string; professorId: string; groupId: string; roomId: string; day: string; startTime: string; endTime: string; type: 'Course' | 'TD' | 'TP' }) {
    const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteSession(id: string) {
    const response = await fetch(`${API_BASE_URL}/sessions/${id}`, { method: 'DELETE' });
    return handleResponse(response);
  },
};

