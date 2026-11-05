import React, { useState } from 'react';
import { X, Zap, AlertTriangle } from 'lucide-react';
import { Equipment, Technician, TechnicianAlert, AlertPriority, AlertType } from '../types';
import { sounds } from '../utils/sound';

interface NewAlertModalProps {
  equipmentList: Equipment[];
  technicians: Technician[];
  preSelectedEquipment?: Equipment | null;
  onClose: () => void;
  onDispatchAlert: (alert: Omit<TechnicianAlert, 'id'>) => void;
}

export const NewAlertModal: React.FC<NewAlertModalProps> = ({
  equipmentList,
  technicians,
  preSelectedEquipment,
  onClose,
  onDispatchAlert,
}) => {
  const [selectedEqId, setSelectedEqId] = useState(
    preSelectedEquipment ? preSelectedEquipment.id : equipmentList[0]?.id || ''
  );
  const [selectedTechId, setSelectedTechId] = useState(
    preSelectedEquipment?.assignedTechnicianId || technicians[0]?.id || ''
  );
  const [priority, setPriority] = useState<AlertPriority>(
    preSelectedEquipment?.status === 'critical' ? 'urgent' : 'high'
  );
  const [alertType, setAlertType] = useState<AlertType>('critical_repair');
  const [channel, setChannel] = useState<'SMS' | 'Push Alert' | 'Radio/Pager' | 'Email'>('SMS');
  const [title, setTitle] = useState(
    preSelectedEquipment
      ? `CRITICAL ALERT: ${preSelectedEquipment.name} Immediate Service Required`
      : ''
  );
  const [message, setMessage] = useState(
    preSelectedEquipment?.criticalNotes ||
      'Abnormal sensor telemetry detected on primary operating assembly. Inspect immediately.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eq = equipmentList.find((item) => item.id === selectedEqId);
    const tech = technicians.find((item) => item.id === selectedTechId);

    if (!eq || !tech) return;

    onDispatchAlert({
      equipmentId: eq.id,
      equipmentName: eq.name,
      technicianId: tech.id,
      technicianName: tech.name,
      type: alertType,
      priority,
      title: title || `URGENT ALERT: ${eq.name}`,
      message,
      timestamp: '2026-09-10 09:45',
      status: 'active',
      automated: true,
      channel,
    });

    sounds.playUrgentAlert();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950">
              <Zap className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Schedule & Dispatch Technician Alert</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Equipment *</label>
            <select
              value={selectedEqId}
              onChange={(e) => {
                setSelectedEqId(e.target.value);
                const match = equipmentList.find((eq) => eq.id === e.target.value);
                if (match) {
                  setTitle(`ALERT: ${match.name} Immediate Service Required`);
                  if (match.assignedTechnicianId) {
                    setSelectedTechId(match.assignedTechnicianId);
                  }
                }
              }}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              {equipmentList.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} ({eq.status.replace('_', ' ').toUpperCase()}) - {eq.location}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dispatch Technician *</label>
              <select
                value={selectedTechId}
                onChange={(e) => setSelectedTechId(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.status.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alert Urgency Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as AlertPriority)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white font-bold"
              >
                <option value="urgent" className="text-rose-600 font-bold">URGENT (Immediate Siren / SMS)</option>
                <option value="high" className="text-amber-600 font-bold">HIGH (30-min SLA)</option>
                <option value="medium" className="text-blue-600">MEDIUM (Routine Shift)</option>
                <option value="low">LOW (Informational)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alert Trigger Category</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value as AlertType)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="critical_repair">Critical Repair Trigger</option>
                <option value="inspection_overdue">Inspection Overdue Escalation</option>
                <option value="inspection_due">Upcoming Inspection Notice</option>
                <option value="system_fault">Sensor Telemetry Fault</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dispatch Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as 'SMS' | 'Push Alert' | 'Radio/Pager' | 'Email')}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="SMS">SMS Direct Text</option>
                <option value="Push Alert">Mobile Push Notification</option>
                <option value="Radio/Pager">Facility Radio / Pager</option>
                <option value="Email">Email Dispatch</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Alert Headline *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. CRITICAL: Vibration spike on Primary Chiller"
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Alert Message & Instructions *</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide technician with diagnostic instructions, lockout tagout warnings, and room access..."
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
              className="px-5 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 shadow-sm flex items-center gap-1.5"
            >
              <Zap className="h-4 w-4" />
              <span>Send & Dispatch Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
