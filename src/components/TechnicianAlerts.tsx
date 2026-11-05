import React, { useState } from 'react';
import {
  AlertTriangle,
  Radio,
  Plus,
  CheckCircle2,
  Clock,
  Send,
  Zap,
  Phone,
  Mail,
  ShieldAlert,
  Search,
  Filter,
  Users,
} from 'lucide-react';
import { TechnicianAlert, AlertPriority, Technician, Equipment } from '../types';

interface TechnicianAlertsProps {
  alerts: TechnicianAlert[];
  technicians: Technician[];
  equipment: Equipment[];
  onAcknowledgeAlert: (alertId: string) => void;
  onUpdateAlertStatus: (alertId: string, status: 'active' | 'acknowledged' | 'in_progress' | 'resolved') => void;
  onOpenNewAlertModal: () => void;
}

export const TechnicianAlerts: React.FC<TechnicianAlertsProps> = ({
  alerts,
  technicians,
  equipment,
  onAcknowledgeAlert,
  onUpdateAlertStatus,
  onOpenNewAlertModal,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [technicianFilter, setTechnicianFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesPriority = priorityFilter === 'all' || alert.priority === priorityFilter;
    const matchesTech = technicianFilter === 'all' || alert.technicianId === technicianFilter;
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.technicianName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPriority && matchesTech && matchesSearch;
  });

  const activeAlerts = alerts.filter((a) => a.status === 'active' || a.status === 'acknowledged');
  const resolvedAlerts = alerts.filter((a) => a.status === 'resolved');

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 text-amber-900 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Automated Technician Alert Scheduler & Dispatch
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated notifications scheduled on critical telemetry faults, life-safety breaches, and overdue inspection deadlines.
          </p>
        </div>

        <button
          id="btn-schedule-tech-alert"
          type="button"
          onClick={onOpenNewAlertModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 shadow-sm transition-colors shrink-0"
        >
          <Zap className="h-4 w-4" />
          <span>Dispatch / Schedule Alert</span>
        </button>
      </div>

      {/* Technicians On-Duty Status Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-500" />
          On-Duty Field Technicians & Active Dispatch Load
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {technicians.map((tech) => (
            <div
              key={tech.id}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className={`h-8 w-8 rounded-full ${tech.avatarColor} text-white font-bold text-xs flex items-center justify-center shadow-xs`}>
                  {tech.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-xs">{tech.name}</div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{tech.specialty}</div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    tech.status === 'dispatched'
                      ? 'bg-amber-100 text-amber-900'
                      : tech.status === 'on_duty'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tech.status.replace('_', ' ')}
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  {tech.activeAlertsCount} alerts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="alert-search-input"
              type="text"
              placeholder="Search alert by equipment, technician name, or message keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="md:col-span-3">
            <select
              id="alert-priority-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              id="alert-technician-select"
              value={technicianFilter}
              onChange={(e) => setTechnicianFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="all">All Technicians</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.specialty.split('&')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 text-xs scrollbar-none">
          {[
            { label: 'All Alerts', value: 'all', count: alerts.length },
            { label: 'Urgent Dispatch', value: 'urgent', count: alerts.filter((a) => a.priority === 'urgent').length, color: 'text-rose-700 bg-rose-50' },
            { label: 'High Priority', value: 'high', count: alerts.filter((a) => a.priority === 'high').length, color: 'text-amber-700 bg-amber-50' },
            { label: 'Medium', value: 'medium', count: alerts.filter((a) => a.priority === 'medium').length, color: 'text-blue-700 bg-blue-50' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setPriorityFilter(tab.value)}
              className={`px-3 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${
                priorityFilter === tab.value
                  ? 'bg-slate-900 text-white'
                  : tab.color || 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <p className="text-slate-500 text-sm">No technician alerts found for the selected filters.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              id={`alert-card-${alert.id}`}
              className={`p-5 rounded-xl border transition-all bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                alert.status === 'resolved'
                  ? 'border-slate-200 opacity-60'
                  : alert.priority === 'urgent'
                  ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20'
                  : alert.priority === 'high'
                  ? 'border-amber-300 ring-1 ring-amber-100 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                      alert.priority === 'urgent'
                        ? 'bg-rose-600 text-white'
                        : alert.priority === 'high'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {alert.priority}
                  </span>

                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {alert.id}
                  </span>

                  {alert.automated && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Automated Schedule
                    </span>
                  )}

                  <span className="text-xs text-slate-500">
                    Channel: <strong className="text-slate-700">{alert.channel}</strong>
                  </span>

                  <span className="text-xs text-slate-400">&bull;</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {alert.timestamp}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{alert.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{alert.message}</p>

                <div className="pt-2 flex items-center gap-4 text-xs text-slate-500">
                  <span>
                    Equipment: <strong className="text-slate-800">{alert.equipmentName}</strong>
                  </span>
                  <span>&bull;</span>
                  <span>
                    Assigned: <strong className="text-slate-800">{alert.technicianName}</strong>
                  </span>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-end sm:items-center gap-2 shrink-0">
                {alert.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="w-full sm:w-auto px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors"
                  >
                    Acknowledge Alert
                  </button>
                )}

                {alert.status === 'acknowledged' && (
                  <button
                    type="button"
                    onClick={() => onUpdateAlertStatus(alert.id, 'in_progress')}
                    className="w-full sm:w-auto px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm transition-colors"
                  >
                    Mark In-Progress
                  </button>
                )}

                {alert.status === 'in_progress' && (
                  <button
                    type="button"
                    onClick={() => onUpdateAlertStatus(alert.id, 'resolved')}
                    className="w-full sm:w-auto px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Resolve Alert</span>
                  </button>
                )}

                {alert.status === 'resolved' && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
