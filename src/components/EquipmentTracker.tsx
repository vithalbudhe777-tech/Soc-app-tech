import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  Radio,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
  Edit3,
} from 'lucide-react';
import { Equipment, EquipmentStatus, EquipmentCategory, Technician } from '../types';

interface EquipmentTrackerProps {
  equipment: Equipment[];
  technicians: Technician[];
  onUpdateStatus: (id: string, newStatus: EquipmentStatus, notes?: string) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (equipment: Equipment) => void;
  onDispatchAlert: (equipment: Equipment) => void;
  onScheduleInspection: (equipment: Equipment) => void;
}

export const EquipmentTracker: React.FC<EquipmentTrackerProps> = ({
  equipment,
  technicians,
  onUpdateStatus,
  onOpenAddModal,
  onOpenEditModal,
  onDispatchAlert,
  onScheduleInspection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedEquipmentForStatusChange, setSelectedEquipmentForStatusChange] = useState<Equipment | null>(null);
  const [newStatusInput, setNewStatusInput] = useState<EquipmentStatus>('operational');
  const [statusNotesInput, setStatusNotesInput] = useState('');

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEquipmentForStatusChange) {
      onUpdateStatus(selectedEquipmentForStatusChange.id, newStatusInput, statusNotesInput);
      setSelectedEquipmentForStatusChange(null);
      setStatusNotesInput('');
    }
  };

  const getStatusBadge = (status: EquipmentStatus) => {
    switch (status) {
      case 'critical':
        return (
          <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-ping" />
            Critical Repair Needed
          </span>
        );
      case 'needs_inspection':
        return (
          <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Needs Inspection
          </span>
        );
      case 'under_repair':
        return (
          <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Under Active Repair
          </span>
        );
      case 'offline':
        return (
          <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-slate-200 text-slate-800 border border-slate-300">
            Offline / Locked Out
          </span>
        );
      case 'operational':
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Operational
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Search and New Equipment Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="h-5 w-5 text-slate-700" />
            Equipment Status Telemetry & Health Tracking
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Live status of industrial chillers, generators, hydraulics, pumps, and automation units.
          </p>
        </div>

        <button
          id="btn-add-equipment"
          type="button"
          onClick={onOpenAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Equipment</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="equipment-search-input"
              type="text"
              placeholder="Search by equipment name, ID, location, or serial #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-4">
            <select
              id="equipment-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="critical">Critical Repair Needed</option>
              <option value="needs_inspection">Needs Inspection</option>
              <option value="under_repair">Under Active Repair</option>
              <option value="operational">Operational</option>
              <option value="offline">Offline / Locked Out</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              id="equipment-category-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="HVAC">HVAC</option>
              <option value="Electrical">Electrical</option>
              <option value="Hydraulics">Hydraulics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Safety">Safety</option>
              <option value="Pneumatics">Pneumatics</option>
            </select>
          </div>
        </div>

        {/* Quick status tabs pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 text-xs scrollbar-none">
          <span className="text-slate-400 text-xs font-semibold mr-1">Quick View:</span>
          {[
            { label: 'All Units', value: 'all', count: equipment.length },
            { label: 'Critical Alert', value: 'critical', count: equipment.filter((e) => e.status === 'critical').length, color: 'text-rose-700 bg-rose-50' },
            { label: 'Inspection Required', value: 'needs_inspection', count: equipment.filter((e) => e.status === 'needs_inspection').length, color: 'text-blue-700 bg-blue-50' },
            { label: 'Under Repair', value: 'under_repair', count: equipment.filter((e) => e.status === 'under_repair').length, color: 'text-amber-700 bg-amber-50' },
            { label: 'Operational', value: 'operational', count: equipment.filter((e) => e.status === 'operational').length, color: 'text-emerald-700 bg-emerald-50' },
          ].map((pill) => (
            <button
              key={pill.value}
              type="button"
              onClick={() => setStatusFilter(pill.value)}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${
                statusFilter === pill.value
                  ? 'bg-slate-900 text-white'
                  : pill.color || 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {pill.label} ({pill.count})
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredEquipment.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <p className="text-slate-500 text-sm">No equipment matches the selected search and filter criteria.</p>
          </div>
        ) : (
          filteredEquipment.map((item) => {
            const isInspectionOverdue =
              new Date(item.nextInspectionDate).getTime() < new Date('2026-09-10').getTime();
            const isInspectionToday = item.nextInspectionDate === '2026-09-10';

            return (
              <div
                key={item.id}
                id={`equipment-card-${item.id}`}
                className={`p-5 rounded-xl border transition-all bg-white shadow-sm flex flex-col justify-between ${
                  item.status === 'critical'
                    ? 'border-rose-300 ring-1 ring-rose-300/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top line: Category, ID & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {item.id}
                        </span>
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-400">{item.serialNumber}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mt-1.5">{item.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{item.location}</span>
                      </p>
                    </div>

                    <div className="shrink-0">{getStatusBadge(item.status)}</div>
                  </div>

                  {/* Health Meter & Specs */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-600 font-medium">Equipment Health Score</span>
                      <span
                        className={`font-mono font-bold ${
                          item.healthScore < 50
                            ? 'text-rose-600'
                            : item.healthScore < 75
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {item.healthScore}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.healthScore < 50
                            ? 'bg-rose-500'
                            : item.healthScore < 75
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${item.healthScore}%` }}
                      />
                    </div>

                    {/* Schedule and Tech details */}
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-slate-500 block">Lead Technician:</span>
                        <span className="font-semibold text-slate-800">{item.assignedTechnicianName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Next Scheduled Inspection:</span>
                        <div className="flex items-center gap-1 font-semibold">
                          <span className={isInspectionOverdue ? 'text-rose-600 font-bold' : isInspectionToday ? 'text-amber-600 font-bold' : 'text-slate-800'}>
                            {item.nextInspectionDate}
                          </span>
                          {isInspectionOverdue && (
                            <span className="text-[10px] bg-rose-600 text-white px-1 rounded uppercase font-bold">
                              Overdue
                            </span>
                          )}
                          {isInspectionToday && (
                            <span className="text-[10px] bg-amber-500 text-slate-950 px-1 rounded uppercase font-bold">
                              Today
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Critical notes if present */}
                    {item.criticalNotes && (
                      <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 font-medium">
                        <strong className="text-rose-700">Notice:</strong> {item.criticalNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEquipmentForStatusChange(item);
                        setNewStatusInput(item.status);
                        setStatusNotesInput(item.criticalNotes || '');
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
                    >
                      Status
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenEditModal(item)}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors flex items-center gap-1"
                      title="Edit equipment specifications, location, or assigned technician"
                    >
                      <Edit3 className="h-3 w-3 text-slate-600" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onScheduleInspection(item)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
                    >
                      Schedule Task
                    </button>

                    <button
                      type="button"
                      onClick={() => onDispatchAlert(item)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-sm transition-colors flex items-center gap-1"
                    >
                      <Zap className="h-3 w-3" />
                      <span>Alert Technician</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Change Status Modal */}
      {selectedEquipmentForStatusChange && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900">
              Update Equipment Status: {selectedEquipmentForStatusChange.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select current operating condition and add log notes.
            </p>

            <form onSubmit={handleStatusChangeSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operating Status</label>
                <select
                  value={newStatusInput}
                  onChange={(e) => setNewStatusInput(e.target.value as EquipmentStatus)}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="operational">Operational</option>
                  <option value="needs_inspection">Needs Inspection</option>
                  <option value="under_repair">Under Active Repair</option>
                  <option value="critical">Critical Repair Needed</option>
                  <option value="offline">Offline / Locked Out</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status / Maintenance Notes</label>
                <textarea
                  rows={3}
                  value={statusNotesInput}
                  onChange={(e) => setStatusNotesInput(e.target.value)}
                  placeholder="E.g. Inspection completed, or warning on oil pressure..."
                  className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedEquipmentForStatusChange(null)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
