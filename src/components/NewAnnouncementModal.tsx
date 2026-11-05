import React, { useState } from 'react';
import { X, Megaphone, AlertTriangle } from 'lucide-react';
import { StaffAnnouncement, Equipment } from '../types';
import { sounds } from '../utils/sound';

interface NewAnnouncementModalProps {
  equipmentList: Equipment[];
  onClose: () => void;
  onPublishAnnouncement: (announcement: Omit<StaffAnnouncement, 'id'>) => void;
}

export const NewAnnouncementModal: React.FC<NewAnnouncementModalProps> = ({
  equipmentList,
  onClose,
  onPublishAnnouncement,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'critical_repair' | 'overdue_repair' | 'scheduled_inspection' | 'general'>('critical_repair');
  const [severity, setSeverity] = useState<'urgent' | 'warning' | 'info'>('urgent');
  const [selectedEqId, setSelectedEqId] = useState<string>('');
  const [affectedAreasInput, setAffectedAreasInput] = useState('Production Bay 1, Central Corridor, Annex');
  const [effectiveDate, setEffectiveDate] = useState('2026-09-10');
  const [pinned, setPinned] = useState(true);
  const [author, setAuthor] = useState('Plant Maintenance Operations');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const matchedEq = equipmentList.find((eq) => eq.id === selectedEqId);

    const affectedAreas = affectedAreasInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    onPublishAnnouncement({
      title,
      type,
      severity,
      content,
      equipmentId: matchedEq ? matchedEq.id : undefined,
      equipmentName: matchedEq ? matchedEq.name : undefined,
      affectedAreas: affectedAreas.length > 0 ? affectedAreas : ['Facility Wide'],
      effectiveDate,
      pinned,
      author,
      createdAt: '2026-09-10 09:50',
      automated: false,
      acknowledgedCount: 0,
    });

    sounds.playUrgentAlert();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-600 text-white">
              <Megaphone className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Publish Staff Announcement</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Announcement Notice Title *</label>
            <input
              type="text"
              required
              placeholder="E.g. CRITICAL: Chiller Repair Scheduled - Cooling Reduced in Bay 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Announcement Category</label>
              <select
                value={type}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setType(val);
                  if (val === 'critical_repair' || val === 'overdue_repair') {
                    setSeverity('urgent');
                  }
                }}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="critical_repair">Upcoming Critical Repair</option>
                <option value="overdue_repair">Overdue Critical Repair Notice</option>
                <option value="scheduled_inspection">Scheduled Inspection Shutdown</option>
                <option value="general">General Facility Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white font-bold"
              >
                <option value="urgent" className="text-rose-600 font-bold">URGENT (Top Banner & Staff Alert)</option>
                <option value="warning" className="text-amber-600">WARNING (Advisory Notice)</option>
                <option value="info" className="text-blue-600">INFO (Informational)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Associated Equipment (Optional)</label>
            <select
              value={selectedEqId}
              onChange={(e) => {
                setSelectedEqId(e.target.value);
                const eq = equipmentList.find((item) => item.id === e.target.value);
                if (eq) {
                  setAffectedAreasInput(eq.location);
                }
              }}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="">-- No specific equipment --</option>
              {equipmentList.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} ({eq.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Affected Plant Areas / Rooms (Comma separated)</label>
            <input
              type="text"
              value={affectedAreasInput}
              onChange={(e) => setAffectedAreasInput(e.target.value)}
              placeholder="E.g. Production Bay 3, Central Plant Sub-Level B, Office Annex"
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Staff Notification Message *</label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detail the critical repair, equipment shutdown window, safety precautions, and affected operations..."
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Effective Date</label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Publishing Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="chk-pinned"
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-4 w-4 rounded text-rose-600 focus:ring-0"
            />
            <label htmlFor="chk-pinned" className="font-semibold text-slate-700 cursor-pointer">
              Pin to top of staff bulletin & dashboard announcement banner
            </label>
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
              className="px-5 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5"
            >
              <Megaphone className="h-4 w-4" />
              <span>Broadcast Announcement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
