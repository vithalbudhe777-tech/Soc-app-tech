import React, { useState } from 'react';
import { X, CalendarCheck, Plus, Trash2 } from 'lucide-react';
import { InspectionTask, Equipment, Technician, EquipmentCategory } from '../types';

interface NewInspectionModalProps {
  equipmentList: Equipment[];
  technicians: Technician[];
  onClose: () => void;
  onAddInspection: (task: Omit<InspectionTask, 'id'>) => void;
}

export const NewInspectionModal: React.FC<NewInspectionModalProps> = ({
  equipmentList,
  technicians,
  onClose,
  onAddInspection,
}) => {
  const [selectedEqId, setSelectedEqId] = useState(equipmentList[0]?.id || '');
  const [title, setTitle] = useState('');
  const [technicianId, setTechnicianId] = useState(technicians[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-09-12');
  const [priority, setPriority] = useState<'routine' | 'mandatory' | 'compliance_critical'>('mandatory');
  const [notes, setNotes] = useState('');
  const [checklistItems, setChecklistItems] = useState<string[]>([
    'Inspect mechanical seal & lubricate bearings',
    'Verify electrical supply voltage & breakers',
    'Log vibration and operating temperature',
  ]);
  const [newCheckItemInput, setNewCheckItemInput] = useState('');

  const handleAddCheckItem = () => {
    if (newCheckItemInput.trim()) {
      setChecklistItems([...checklistItems, newCheckItemInput.trim()]);
      setNewCheckItemInput('');
    }
  };

  const handleRemoveCheckItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eq = equipmentList.find((item) => item.id === selectedEqId);
    const tech = technicians.find((item) => item.id === technicianId);

    if (!eq) return;

    onAddInspection({
      title: title || `${eq.name} Scheduled Routine Inspection`,
      equipmentId: eq.id,
      equipmentName: eq.name,
      category: eq.category,
      assignedTechnicianId: tech ? tech.id : 'TECH-1',
      assignedTechnicianName: tech ? tech.name : 'Unassigned',
      dueDate,
      priority,
      status: 'pending',
      notes: notes || 'Check vital operating parameters against manufacturer specifications.',
      checklist: checklistItems.map((item, idx) => ({
        id: `chk-${Date.now()}-${idx}`,
        task: item,
        done: false,
      })),
      reminderWindowHours: 24,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Schedule Inspection Task Reminder</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Equipment *</label>
            <select
              value={selectedEqId}
              onChange={(e) => {
                setSelectedEqId(e.target.value);
                const matched = equipmentList.find((eq) => eq.id === e.target.value);
                if (matched) {
                  setTitle(`${matched.name} Inspection Audit`);
                  if (matched.assignedTechnicianId) {
                    setTechnicianId(matched.assignedTechnicianId);
                  }
                }
              }}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              {equipmentList.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} ({eq.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Inspection Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Trane Chiller Monthly Valve & Pressure Inspection"
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Field Technician</label>
              <select
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Priority Classification</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="compliance_critical">Compliance Critical (NFPA / EPA / OSHA Mandated)</option>
              <option value="mandatory">Mandatory Factory Scheduled</option>
              <option value="routine">Routine Preventative Check</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Inspection Checklist Steps</label>
            <div className="space-y-1.5 mb-2">
              {checklistItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-800">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCheckItem(idx)}
                    className="text-slate-400 hover:text-rose-600 p-0.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCheckItemInput}
                onChange={(e) => setNewCheckItemInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCheckItem();
                  }
                }}
                placeholder="Add checklist step (press Enter)..."
                className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={handleAddCheckItem}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 shrink-0"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Inspection Notes & Safety Instructions</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="PPE required, lockout procedure, instrument tolerances..."
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5"
            >
              <CalendarCheck className="h-4 w-4" />
              <span>Schedule Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
