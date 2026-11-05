import React, { useState } from 'react';
import { X, Wrench, Save } from 'lucide-react';
import { Equipment, EquipmentCategory, Technician } from '../types';
import { sounds } from '../utils/sound';

interface EditEquipmentModalProps {
  equipment: Equipment | null;
  technicians: Technician[];
  onClose: () => void;
  onUpdateEquipment: (updated: Equipment) => void;
}

export const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({
  equipment,
  technicians,
  onClose,
  onUpdateEquipment,
}) => {
  if (!equipment) return null;

  const [name, setName] = useState(equipment.name);
  const [category, setCategory] = useState<EquipmentCategory>(equipment.category);
  const [serialNumber, setSerialNumber] = useState(equipment.serialNumber);
  const [location, setLocation] = useState(equipment.location);
  const [technicianId, setTechnicianId] = useState(equipment.assignedTechnicianId);
  const [manufacturer, setManufacturer] = useState(equipment.manufacturer);
  const [model, setModel] = useState(equipment.model);
  const [installYear, setInstallYear] = useState(equipment.installYear);
  const [healthScore, setHealthScore] = useState(equipment.healthScore);
  const [nextInspectionDate, setNextInspectionDate] = useState(equipment.nextInspectionDate);
  const [criticalNotes, setCriticalNotes] = useState(equipment.criticalNotes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const assignedTech = technicians.find((t) => t.id === technicianId);

    onUpdateEquipment({
      ...equipment,
      name,
      category,
      serialNumber,
      location,
      assignedTechnicianId: technicianId,
      assignedTechnicianName: assignedTech ? assignedTech.name : equipment.assignedTechnicianName,
      manufacturer,
      model,
      installYear,
      healthScore,
      nextInspectionDate,
      criticalNotes,
    });

    sounds.playSuccessSound();
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
            <div>
              <h3 className="text-base font-bold text-slate-900">Edit Equipment Specifications</h3>
              <p className="text-[11px] text-slate-500">ID: {equipment.id}</p>
            </div>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
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
                <option value="Mechanical">Mechanical (Lifts / Conveyors)</option>
                <option value="Electrical">Electrical (Generators / AMF)</option>
                <option value="Hydraulics">Hydraulics (Water Pumps)</option>
                <option value="HVAC">HVAC & Solar Water</option>
                <option value="Safety">Safety & Fire Systems</option>
                <option value="Pneumatics">Pneumatics</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Serial Number</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Apartment Location / Wing / Floor</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned AMC Technician</label>
              <select
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.specialty})
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
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Model / Spec</label>
              <input
                type="text"
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
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Critical Fault / Service Notes</label>
            <textarea
              rows={2}
              value={criticalNotes}
              onChange={(e) => setCriticalNotes(e.target.value)}
              placeholder="Enter current fault diagnosis or replacement notes..."
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
              className="px-5 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
