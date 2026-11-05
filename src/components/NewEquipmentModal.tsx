import React, { useState } from 'react';
import { X, Wrench } from 'lucide-react';
import { Equipment, EquipmentCategory, Technician } from '../types';

interface NewEquipmentModalProps {
  technicians: Technician[];
  onClose: () => void;
  onAddEquipment: (newEq: Omit<Equipment, 'id'>) => void;
}

export const NewEquipmentModal: React.FC<NewEquipmentModalProps> = ({
  technicians,
  onClose,
  onAddEquipment,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<EquipmentCategory>('HVAC');
  const [serialNumber, setSerialNumber] = useState('');
  const [location, setLocation] = useState('');
  const [technicianId, setTechnicianId] = useState(technicians[0]?.id || 'TECH-1');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [installYear, setInstallYear] = useState(2023);
  const [healthScore, setHealthScore] = useState(90);
  const [nextInspectionDate, setNextInspectionDate] = useState('2026-10-15');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const assignedTech = technicians.find((t) => t.id === technicianId);

    onAddEquipment({
      name,
      category,
      serialNumber: serialNumber || `EQ-SN-${Math.floor(1000 + Math.random() * 9000)}`,
      location: location || 'General Maintenance Floor',
      status: 'operational',
      healthScore,
      assignedTechnicianId: technicianId,
      assignedTechnicianName: assignedTech ? assignedTech.name : 'Unassigned',
      lastServicedDate: '2026-09-01',
      nextInspectionDate,
      manufacturer: manufacturer || 'Industrial Standard',
      model: model || 'Pro-500',
      installYear,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-900 text-amber-400">
              <Wrench className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Add New Facility Equipment</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Equipment Name *</label>
            <input
              type="text"
              required
              placeholder="E.g. Secondary Chiller Unit B-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EquipmentCategory)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="HVAC">HVAC</option>
                <option value="Electrical">Electrical</option>
                <option value="Hydraulics">Hydraulics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Safety">Safety</option>
                <option value="Pneumatics">Pneumatics</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Serial Number</label>
              <input
                type="text"
                placeholder="E.g. TRN-9941-X"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Installation Location / Bay</label>
            <input
              type="text"
              placeholder="E.g. Production Floor 2 - Section C"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lead Assigned Technician</label>
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
              <label className="block font-semibold text-slate-700 mb-1">Next Scheduled Inspection</label>
              <input
                type="date"
                value={nextInspectionDate}
                onChange={(e) => setNextInspectionDate(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Manufacturer</label>
              <input
                type="text"
                placeholder="Trane / Cat"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Model #</label>
              <input
                type="text"
                placeholder="X-300"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Health Score %</label>
              <input
                type="number"
                min="1"
                max="100"
                value={healthScore}
                onChange={(e) => setHealthScore(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
              />
            </div>
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
              className="px-5 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
            >
              Save Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
