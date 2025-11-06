import { useMemo, useState } from 'react';
import { DoorOpen, Users, Calendar, MapPin, Plus, Pencil, Trash, X } from 'lucide-react';
import { Room, Session, Module } from '../types';

interface RoomsViewProps {
  rooms: Room[];
  sessions: Session[];
  modules: Module[];
  onAddRoom?: (data: Omit<Room, 'id'>) => Promise<void> | void;
  onUpdateRoom?: (id: string, data: Omit<Room, 'id'>) => Promise<void> | void;
  onDeleteRoom?: (id: string) => Promise<void> | void;
}

type RoomFormState = {
  name: string;
  capacity: number;
  type: Room['type'];
};

function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 shadow-xl">
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

export default function RoomsView({ rooms, sessions, modules, onAddRoom, onUpdateRoom, onDeleteRoom }: RoomsViewProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [form, setForm] = useState<RoomFormState>({ name: '', capacity: 0, type: 'Classroom' });
  const [submitting, setSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    return form.name.trim().length > 1 && form.capacity >= 0 && ['Amphitheatre', 'Lab', 'Classroom'].includes(form.type);
  }, [form]);

  const getRoomStats = (roomId: string) => {
    const roomSessions = sessions.filter(s => s.roomId === roomId);
    const utilization = (roomSessions.length / sessions.length) * 100;
    return { sessions: roomSessions.length, utilization: Math.round(utilization) };
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'Amphitheatre': return 'bg-purple-500';
      case 'Lab': return 'bg-orange-500';
      case 'Classroom': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'Amphitheatre': return '🎭';
      case 'Lab': return '🔬';
      case 'Classroom': return '📚';
      default: return '🏛️';
    }
  };

  const openAdd = () => {
    setForm({ name: '', capacity: 0, type: 'Classroom' });
    setSelectedRoom(null);
    setIsAddOpen(true);
  };

  const openEdit = (r: Room) => {
    setSelectedRoom(r);
    setForm({ name: r.name, capacity: r.capacity, type: r.type });
    setIsEditOpen(true);
  };

  const openDelete = (r: Room) => {
    setSelectedRoom(r);
    setIsDeleteOpen(true);
  };

  const closeAll = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedRoom(null);
    setSubmitting(false);
  };

  const submitAdd = async () => {
    if (!onAddRoom || !isFormValid) return;
    try {
      setSubmitting(true);
      await onAddRoom({ name: form.name.trim(), capacity: Number(form.capacity), type: form.type });
      closeAll();
    } finally {
      setSubmitting(false);
    }
  };

  const submitEdit = async () => {
    if (!onUpdateRoom || !selectedRoom || !isFormValid) return;
    try {
      setSubmitting(true);
      await onUpdateRoom(selectedRoom.id, { name: form.name.trim(), capacity: Number(form.capacity), type: form.type });
      closeAll();
    } finally {
      setSubmitting(false);
    }
  };

  const submitDelete = async () => {
    if (!onDeleteRoom || !selectedRoom) return;
    try {
      setSubmitting(true);
      await onDeleteRoom(selectedRoom.id);
      closeAll();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rooms</h2>
          <p className="text-gray-600 mt-1">Manage facilities and track availability</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {['Amphitheatre', 'Lab', 'Classroom', 'All'].map((type) => {
          const count = type === 'All' ? rooms.length : rooms.filter(r => r.type === type).length;
          return (
            <div key={type} className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">{type}</p>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map(room => {
                const stats = getRoomStats(room.id);

                return (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 ${getRoomTypeColor(room.type)} rounded-lg flex items-center justify-center text-xl mr-3`}>
                          {getRoomTypeIcon(room.type)}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{room.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 ${getRoomTypeColor(room.type)} bg-opacity-10 rounded-full text-xs font-medium`}>
                        {room.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {room.capacity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stats.sessions}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`${getRoomTypeColor(room.type)} h-2 rounded-full transition-all`}
                            style={{ width: `${stats.utilization}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{stats.utilization}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded hover:bg-gray-100" onClick={() => openEdit(room)} title="Edit">
                          <Pencil className="w-4 h-4 text-gray-700" />
                        </button>
                        <button className="p-2 rounded hover:bg-gray-100" onClick={() => openDelete(room)} title="Delete">
                          <Trash className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal open={isAddOpen} onClose={closeAll} title="Add Room"
        footer={
          <>
            <button onClick={closeAll} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={submitAdd} disabled={!isFormValid || submitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">{submitting ? 'Saving...' : 'Save'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Room name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input type="number" min={0} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Room['type'] })}>
                <option value="Amphitheatre">Amphitheatre</option>
                <option value="Lab">Lab</option>
                <option value="Classroom">Classroom</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={isEditOpen} onClose={closeAll} title="Edit Room"
        footer={
          <>
            <button onClick={closeAll} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={submitEdit} disabled={!isFormValid || submitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">{submitting ? 'Updating...' : 'Update'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input type="number" min={0} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Room['type'] })}>
                <option value="Amphitheatre">Amphitheatre</option>
                <option value="Lab">Lab</option>
                <option value="Classroom">Classroom</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={isDeleteOpen} onClose={closeAll} title="Delete Room"
        footer={
          <>
            <button onClick={closeAll} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={submitDelete} disabled={submitting} className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50">{submitting ? 'Deleting...' : 'Delete'}</button>
          </>
        }
      >
        <p className="text-gray-700">Are you sure you want to delete {selectedRoom?.name}? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
