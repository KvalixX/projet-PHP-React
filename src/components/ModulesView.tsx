import { useMemo, useState } from 'react';
import { BookOpen, Clock, Plus, Pencil, Trash, X } from 'lucide-react';
import { Module, Session, Group } from '../types';

interface ModulesViewProps {
  modules: Module[];
  sessions: Session[];
  groups: Group[];
  onAddModule?: (data: Omit<Module, 'id'>) => Promise<void> | void;
  onUpdateModule?: (id: string, data: Omit<Module, 'id'>) => Promise<void> | void;
  onDeleteModule?: (id: string) => Promise<void> | void;
}

type ModuleFormState = {
  name: string;
  code: string;
  hours: number;
  color: string;
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

export default function ModulesView({ modules, sessions, groups, onAddModule, onUpdateModule, onDeleteModule }: ModulesViewProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [form, setForm] = useState<ModuleFormState>({ name: '', code: '', hours: 0, color: '#3b82f6' });
  const [submitting, setSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    return form.name.trim().length > 1 && form.code.trim().length > 0 && form.hours >= 0 && /^#([0-9a-fA-F]{3}){1,2}$/.test(form.color);
  }, [form]);

  const openAdd = () => {
    setForm({ name: '', code: '', hours: 0, color: '#3b82f6' });
    setSelectedModule(null);
    setIsAddOpen(true);
  };

  const openEdit = (m: Module) => {
    setSelectedModule(m);
    setForm({ name: m.name, code: m.code, hours: m.hours, color: m.color });
    setIsEditOpen(true);
  };

  const openDelete = (m: Module) => {
    setSelectedModule(m);
    setIsDeleteOpen(true);
  };

  const closeAll = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedModule(null);
    setSubmitting(false);
  };

  const submitAdd = async () => {
    if (!onAddModule || !isFormValid) return;
    try {
      setSubmitting(true);
      await onAddModule({ name: form.name.trim(), code: form.code.trim(), hours: Number(form.hours), color: form.color });
      closeAll();
    } finally {
      setSubmitting(false);
    }
  };

  const submitEdit = async () => {
    if (!onUpdateModule || !selectedModule || !isFormValid) return;
    try {
      setSubmitting(true);
      await onUpdateModule(selectedModule.id, { name: form.name.trim(), code: form.code.trim(), hours: Number(form.hours), color: form.color });
      closeAll();
    } finally {
      setSubmitting(false);
    }
  };

  const submitDelete = async () => {
    if (!onDeleteModule || !selectedModule) return;
    try {
      setSubmitting(true);
      await onDeleteModule(selectedModule.id);
      closeAll();
    } finally {
      setSubmitting(false);
    }
  };
  const getModuleStats = (moduleId: string) => {
    const moduleSessions = sessions.filter(s => s.moduleId === moduleId);
    const uniqueGroups = new Set(moduleSessions.map(s => s.groupId)).size;
    return { sessions: moduleSessions.length, groups: uniqueGroups };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Modules</h2>
          <p className="text-gray-600 mt-1">Manage courses and curriculum</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Add Module
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groups</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Groups</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {modules.map(module => {
                const stats = getModuleStats(module.id);
                const moduleGroups = Array.from(new Set(sessions.filter(s => s.moduleId === module.id).map(s => s.groupId)));

                return (
                  <tr key={module.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-1 h-10 rounded mr-3" style={{ backgroundColor: module.color }}></div>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: `${module.color}20` }}>
                          <BookOpen className="w-5 h-5" style={{ color: module.color }} />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{module.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${module.color}20`, color: module.color }}>
                        {module.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {module.hours}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stats.sessions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stats.groups}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {moduleGroups.slice(0, 3).map(groupId => {
                          const group = groups.find(g => g.id === groupId);
                          return (
                            <span
                              key={groupId}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                            >
                              {group?.name}
                            </span>
                          );
                        })}
                        {moduleGroups.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            +{moduleGroups.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded hover:bg-gray-100" onClick={() => openEdit(module)} title="Edit">
                          <Pencil className="w-4 h-4 text-gray-700" />
                        </button>
                        <button className="p-2 rounded hover:bg-gray-100" onClick={() => openDelete(module)} title="Delete">
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
      <Modal open={isAddOpen} onClose={closeAll} title="Add Module"
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
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Module name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. CS101" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
              <input type="number" min={0} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.hours} onChange={e => setForm({ ...form, hours: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input type="color" className="w-full h-10 rounded-lg border border-gray-300 px-1 py-1" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={isEditOpen} onClose={closeAll} title="Edit Module"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
              <input type="number" min={0} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.hours} onChange={e => setForm({ ...form, hours: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input type="color" className="w-full h-10 rounded-lg border border-gray-300 px-1 py-1" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={isDeleteOpen} onClose={closeAll} title="Delete Module"
        footer={
          <>
            <button onClick={closeAll} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={submitDelete} disabled={submitting} className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50">{submitting ? 'Deleting...' : 'Delete'}</button>
          </>
        }
      >
        <p className="text-gray-700">Are you sure you want to delete {selectedModule?.name}? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
