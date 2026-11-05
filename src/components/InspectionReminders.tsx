import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bell,
  Search,
  CheckSquare,
  Square,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { InspectionTask, Equipment, Technician } from '../types';
import { sounds } from '../utils/sound';

interface InspectionRemindersProps {
  inspections: InspectionTask[];
  equipment: Equipment[];
  technicians: Technician[];
  onToggleChecklist: (taskId: string, checkId: string) => void;
  onCompleteInspection: (taskId: string) => void;
  onSnoozeInspection: (taskId: string, hours: number) => void;
  onOpenNewInspectionModal: () => void;
}

export const InspectionReminders: React.FC<InspectionRemindersProps> = ({
  inspections,
  equipment,
  technicians,
  onToggleChecklist,
  onCompleteInspection,
  onSnoozeInspection,
  onOpenNewInspectionModal,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const nowTime = new Date('2026-09-10').getTime();

  const filteredInspections = inspections.filter((task) => {
    const isCompleted = task.status === 'completed';
    const taskDueTime = new Date(task.dueDate).getTime();
    const isOverdue = !isCompleted && taskDueTime < nowTime;
    const isToday = !isCompleted && task.dueDate === '2026-09-10';

    if (filter === 'overdue' && !isOverdue) return false;
    if (filter === 'today' && !isToday) return false;
    if (filter === 'pending' && isCompleted) return false;
    if (filter === 'completed' && !isCompleted) return false;

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTechnicianName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const overdueCount = inspections.filter(
    (t) => t.status !== 'completed' && new Date(t.dueDate).getTime() < nowTime
  ).length;

  const todayCount = inspections.filter(
    (t) => t.status !== 'completed' && t.dueDate === '2026-09-10'
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-900 rounded-lg">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Scheduled Inspection Task Reminders
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated calendar reminders, compliance checklists, and technician ping alerts so no mandatory inspection is missed.
          </p>
        </div>

        <button
          id="btn-schedule-new-inspection"
          type="button"
          onClick={onOpenNewInspectionModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Inspection Task</span>
        </button>
      </div>

      {/* Reminder Alert Banner if overdue tasks exist */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 flex items-center justify-between gap-3 text-xs text-rose-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold">Urgent Inspection Notice:</span> You have{' '}
              <strong>{overdueCount} inspection tasks overdue</strong>. Technician escalation alerts have been dispatched.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFilter('overdue')}
            className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold shrink-0 transition-colors"
          >
            View Overdue Tasks
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="inspection-search-input"
              type="text"
              placeholder="Search inspection tasks, equipment, or technician..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              id="inspection-filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="all">All Inspection Tasks</option>
              <option value="overdue">Overdue Inspections Only</option>
              <option value="today">Due Today</option>
              <option value="pending">All Pending Tasks</option>
              <option value="completed">Completed Inspections</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 text-xs scrollbar-none">
          {[
            { label: 'All Tasks', value: 'all', count: inspections.length },
            { label: 'Overdue Inspections', value: 'overdue', count: overdueCount, color: 'text-rose-700 bg-rose-50' },
            { label: 'Due Today', value: 'today', count: todayCount, color: 'text-amber-700 bg-amber-50' },
            { label: 'Pending', value: 'pending', count: inspections.filter((t) => t.status !== 'completed').length, color: 'text-blue-700 bg-blue-50' },
            { label: 'Completed', value: 'completed', count: inspections.filter((t) => t.status === 'completed').length, color: 'text-emerald-700 bg-emerald-50' },
          ].map((pill) => (
            <button
              key={pill.value}
              type="button"
              onClick={() => setFilter(pill.value)}
              className={`px-3 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${
                filter === pill.value
                  ? 'bg-slate-900 text-white'
                  : pill.color || 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {pill.label} ({pill.count})
            </button>
          ))}
        </div>
      </div>

      {/* Inspection Tasks List */}
      <div className="space-y-4">
        {filteredInspections.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <p className="text-slate-500 text-sm">No scheduled inspection tasks found matching your filters.</p>
          </div>
        ) : (
          filteredInspections.map((task) => {
            const isCompleted = task.status === 'completed';
            const taskDueTime = new Date(task.dueDate).getTime();
            const isOverdue = !isCompleted && taskDueTime < nowTime;
            const isToday = !isCompleted && task.dueDate === '2026-09-10';
            const completedChecklistCount = task.checklist.filter((c) => c.done).length;
            const progressPercent = task.checklist.length > 0
              ? Math.round((completedChecklistCount / task.checklist.length) * 100)
              : 0;

            const daysOverdue = isOverdue
              ? Math.max(1, Math.floor((nowTime - taskDueTime) / (1000 * 60 * 60 * 24)))
              : 0;

            return (
              <div
                key={task.id}
                id={`inspection-card-${task.id}`}
                className={`p-5 rounded-xl border bg-white shadow-sm transition-all ${
                  isCompleted
                    ? 'border-slate-200 opacity-70 bg-slate-50/50'
                    : isOverdue
                    ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20'
                    : isToday
                    ? 'border-amber-300 ring-1 ring-amber-100 bg-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {task.id}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          task.priority === 'compliance_critical'
                            ? 'bg-rose-600 text-white'
                            : task.priority === 'mandatory'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {task.priority.replace('_', ' ')}
                      </span>

                      {isOverdue && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                          ⚠️ Overdue by {daysOverdue} day{daysOverdue > 1 ? 's' : ''}
                        </span>
                      )}

                      {isToday && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                          🔔 Due Today
                        </span>
                      )}

                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                    <p className="text-xs text-slate-600">{task.notes}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>
                        Equipment: <strong className="text-slate-800">{task.equipmentName}</strong>
                      </span>
                      <span>&bull;</span>
                      <span>
                        Assigned Tech: <strong className="text-slate-800">{task.assignedTechnicianName}</strong>
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        Due Date: <strong className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'}>{task.dueDate}</strong>
                      </span>
                    </div>

                    {/* Interactive Checklist */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-700">
                          Mandatory Inspection Checklist ({completedChecklistCount}/{task.checklist.length}):
                        </span>
                        <span className="text-slate-500 font-mono font-medium">{progressPercent}% done</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full transition-all ${
                            progressPercent === 100 ? 'bg-emerald-500' : 'bg-slate-800'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {task.checklist.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => onToggleChecklist(task.id, item.id)}
                            className={`p-2 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                              item.done
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 line-through'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={item.done}
                              readOnly
                              className="h-3.5 w-3.5 rounded text-emerald-600 focus:ring-0"
                            />
                            <span>{item.task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="shrink-0 flex flex-col items-start md:items-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {!isCompleted ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            onCompleteInspection(task.id);
                            sounds.playSuccessSound();
                          }}
                          className="w-full md:w-auto px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Complete & Sign Off</span>
                        </button>

                        <div className="flex items-center gap-1.5 w-full md:w-auto">
                          <button
                            type="button"
                            onClick={() => {
                              onSnoozeInspection(task.id, 4);
                              sounds.playReminderChime();
                            }}
                            className="w-full md:w-auto px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                            title="Snooze reminder by 4 hours"
                          >
                            Snooze +4h
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onSnoozeInspection(task.id, 24);
                              sounds.playReminderChime();
                            }}
                            className="w-full md:w-auto px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                            title="Snooze reminder by 24 hours"
                          >
                            Snooze +24h
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-right">
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Inspection Signed Off
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Compliant with OSHA/NFPA</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
