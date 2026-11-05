import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldAlert,
  Megaphone,
  Filter,
  Users,
  Search,
  Pin,
  Share2,
} from 'lucide-react';
import { StaffAnnouncement, Equipment } from '../types';

interface StaffAnnouncementsProps {
  announcements: StaffAnnouncement[];
  equipment: Equipment[];
  onAcknowledgeAnnouncement: (announcementId: string) => void;
  onOpenNewAnnouncementModal: () => void;
}

export const StaffAnnouncements: React.FC<StaffAnnouncementsProps> = ({
  announcements,
  equipment,
  onAcknowledgeAnnouncement,
  onOpenNewAnnouncementModal,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.affectedAreas.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Broadcast Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-100 text-rose-900 rounded-lg">
              <Megaphone className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Staff Announcements & Critical Repair Notices
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official broadcasts notifying facility personnel, operators, and safety officers of upcoming or overdue critical equipment repairs.
          </p>
        </div>

        <button
          id="btn-new-staff-announcement"
          type="button"
          onClick={onOpenNewAnnouncementModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Publish Staff Announcement</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="announcement-search-input"
              type="text"
              placeholder="Search announcements by keyword, affected bay/area, or equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              id="announcement-type-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="all">All Notice Types</option>
              <option value="critical_repair">Upcoming Critical Repair</option>
              <option value="overdue_repair">Overdue Repair Notice</option>
              <option value="scheduled_inspection">Scheduled Inspection</option>
              <option value="general">General Maintenance</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 text-xs scrollbar-none">
          {[
            { label: 'All Notices', value: 'all', count: announcements.length },
            {
              label: 'Critical / Overdue Repairs',
              value: 'critical_repair',
              count: announcements.filter((a) => a.type === 'critical_repair' || a.type === 'overdue_repair').length,
              color: 'text-rose-700 bg-rose-50',
            },
            {
              label: 'Scheduled Inspections',
              value: 'scheduled_inspection',
              count: announcements.filter((a) => a.type === 'scheduled_inspection').length,
              color: 'text-amber-700 bg-amber-50',
            },
          ].map((pill) => (
            <button
              key={pill.value}
              type="button"
              onClick={() => setFilterType(pill.value)}
              className={`px-3 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${
                filterType === pill.value
                  ? 'bg-slate-900 text-white'
                  : pill.color || 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {pill.label} ({pill.count})
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <p className="text-slate-500 text-sm">No announcements found matching the current search filters.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              id={`announcement-card-${ann.id}`}
              className={`p-5 rounded-xl border bg-white shadow-sm transition-all ${
                ann.severity === 'urgent'
                  ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20'
                  : ann.severity === 'warning'
                  ? 'border-amber-300 ring-1 ring-amber-100'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {ann.pinned && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 flex items-center gap-1">
                        <Pin className="h-3 w-3" /> Pinned
                      </span>
                    )}

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                        ann.severity === 'urgent'
                          ? 'bg-rose-600 text-white'
                          : ann.severity === 'warning'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ann.type.replace('_', ' ')}
                    </span>

                    {ann.automated && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        Automated System Trigger
                      </span>
                    )}

                    <span className="text-xs text-slate-400">&bull;</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Effective {ann.effectiveDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
                    {ann.content}
                  </p>

                  {/* Affected areas badges */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      Affected Areas:
                    </span>
                    {ann.affectedAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs rounded bg-slate-100 text-slate-800 border border-slate-200 font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
                    <span>
                      Author: <strong className="text-slate-800">{ann.author}</strong>
                    </span>
                    <span>&bull;</span>
                    <span>Posted on {ann.createdAt}</span>
                  </div>
                </div>

                {/* Acknowledgement Action Button */}
                <div className="shrink-0 flex flex-col items-start md:items-end gap-2 mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-xs text-slate-600 font-medium">
                    <span className="font-bold text-slate-900">{ann.acknowledgedCount}</span> staff acknowledged
                  </div>

                  <button
                    type="button"
                    onClick={() => onAcknowledgeAnnouncement(ann.id)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Acknowledge Notice</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
