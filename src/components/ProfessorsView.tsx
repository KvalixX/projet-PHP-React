import { useMemo, useState } from 'react';
import { Mail, Pencil, Trash, Plus, X } from 'lucide-react';
import { Professor, Session, Module } from '../types';

interface ProfessorsViewProps {
  professors: Professor[];
  sessions: Session[];
  modules: Module[];
  onAddProfessor?: (data: Omit<Professor, 'id'>) => Promise<void> | void;
  onUpdateProfessor?: (id: string, data: Omit<Professor, 'id'>) => Promise<void> | void;
  onDeleteProfessor?: (id: string) => Promise<void> | void;
}

type ProfessorFormState = {
  name: string;
  email: string;
  department: string;
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

export default function ProfessorsView({ professors, sessions, modules, onAddProfessor, onUpdateProfessor, onDeleteProfessor }: ProfessorsViewProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [form, setForm] = useState<ProfessorFormState>({ name: '', email: '', department: '' });
  const [submitting, setSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    return form.name.trim().length > 1 && /.+@.+\..+/.test(form.email) && form.department.trim().length > 0;
  }, [form]);

  const openAdd = () => {
    setForm({ name: '', email: '', department: '' });
    setSelectedProfessor(null);
    setIsAddOpen(true);
  };

  const openEdit = (prof: Professor) => {
    setSelectedProfessor(prof);
    setForm({ name: prof.name, email: prof.email, department: prof.department });
    setIsEditOpen(true);
  };

  const openDelete = (prof: Professor) => {
    setSelectedProfessor(prof);
    setIsDeleteOpen(true);
  };

  const closeAll = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedProfessor(null);
    setSubmitting(false);
  };

  const submitAdd = async () => {
    if (!onAddProfessor || !isFormValid) return;
    try {
      setSubmitting(true);
      await onAddProfessor({ name: form.name.trim(), email: form.email.trim(), department: form.department.trim() });
      closeAll();
    } finally {
      setSubmitting(false);
    }
  };

  const submitEdit = async () => {
    if (!onUpdateProfessor || !selectedProfessor || !isFormValid) return;
    try {
      setSubmitting(true);
      await onUpdateProfessor(selectedProfessor.id, { name: form.name.trim(), email: form.email.trim(), department: form.department.trim() });
      closeAll();
    } finally {
      setSubmitting(false);
    }
  };

  const submitDelete = async () => {
    if (!onDeleteProfessor || !selectedProfessor) return;
    try {
      setSubmitting(true);
      await onDeleteProfessor(selectedProfessor.id);
      closeAll();
    } finally {
      setSubmitting(false);
    }
  };
  const getProfessorStats = (professorId: string) => {
    const profSessions = sessions.filter(s => s.professorId === professorId);
    const uniqueModules = new Set(profSessions.map(s => s.moduleId)).size;
    const totalHours = profSessions.reduce((acc, s) => {
      const start = parseInt(s.startTime.split(':')[0]) + parseInt(s.startTime.split(':')[1]) / 60;
      const end = parseInt(s.endTime.split(':')[0]) + parseInt(s.endTime.split(':')[1]) / 60;
      return acc + (end - start);
    }, 0);
    return { sessions: profSessions.length, modules: uniqueModules, hours: Math.round(totalHours) };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Professors</h2>
          <p className="text-gray-600 mt-1">Manage teaching staff and their schedules</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Add Professor
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modules</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weekly Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teaching</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {professors.map(professor => {
                const stats = getProfessorStats(professor.id);
                const teachingModules = Array.from(new Set(sessions.filter(s => s.professorId === professor.id).map(s => s.moduleId)));

                return (
                  <tr key={professor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {professor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{professor.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {professor.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {professor.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stats.sessions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stats.modules}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stats.hours}h</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {teachingModules.slice(0, 3).map(moduleId => {
                          const module = modules.find(m => m.id === moduleId);
                          return (
                            <span
                              key={moduleId}
                              className="px-2 py-1 rounded text-xs font-medium text-white"
                              style={{ backgroundColor: module?.color }}
                            >
                              {module?.code}
                            </span>
                          );
                        })}
                        {teachingModules.length > 3 && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-700">
                            +{teachingModules.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded hover:bg-gray-100" onClick={() => openEdit(professor)} title="Edit">
                          <Pencil className="w-4 h-4 text-gray-700" />
                        </button>
                        <button className="p-2 rounded hover:bg-gray-100" onClick={() => openDelete(professor)} title="Delete">
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
      <Modal open={isAddOpen} onClose={closeAll} title="Add Professor"
        footer={
          <>
            <button onClick={closeAll} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={submitAdd} disabled={!isFormValid || submitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
              placeholder="e.g. Computer Science"
            />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={isEditOpen} onClose={closeAll} title="Edit Professor"
        footer={
          <>
            <button onClick={closeAll} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={submitEdit} disabled={!isFormValid || submitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">
              {submitting ? 'Updating...' : 'Update'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={isDeleteOpen} onClose={closeAll} title="Delete Professor"
        footer={
          <>
            <button onClick={closeAll} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={submitDelete} disabled={submitting} className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50">
              {submitting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <p className="text-gray-700">Are you sure you want to delete {selectedProfessor?.name}? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
