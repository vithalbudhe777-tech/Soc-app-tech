import React from 'react';
import {
  AlertTriangle,
  Clock,
  DollarSign,
  Wrench,
  CheckCircle2,
  CalendarCheck,
  Radio,
  Send,
  ArrowRight,
  ShieldAlert,
  Users,
  Zap,
  ChevronRight,
  Sparkles,
  Info,
  Building2,
  FileSpreadsheet,
  CreditCard,
  Check,
} from 'lucide-react';
import {
  Equipment,
  TechnicianAlert,
  StaffAnnouncement,
  InspectionTask,
  CalculatedInvoice,
  LatePaymentNotice,
  ActiveTab,
  ApartmentSettings,
  HouseOwnerProfile,
} from '../types';
import { formatINR } from '../utils/data';
import { OwnerMaintenanceCard } from './OwnerMaintenanceCard';

interface DashboardOverviewProps {
  equipment: Equipment[];
  alerts: TechnicianAlert[];
  announcements: StaffAnnouncement[];
  inspections: InspectionTask[];
  invoices: CalculatedInvoice[];
  lateNotices: LatePaymentNotice[];
  apartmentSettings: ApartmentSettings;
  ownerProfile: HouseOwnerProfile;
  onOpenOwnerLogin: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  onAcknowledgeAlert: (alertId: string) => void;
  onAcknowledgeAnnouncement: (announcementId: string) => void;
  onQuickToggleInspectionCheck: (taskId: string, checkId: string) => void;
  onCompleteInspection: (taskId: string) => void;
  onRunLatePaymentDispatcher: () => void;
  onOpenNoticeModal: (invoice: CalculatedInvoice) => void;
  onOpenPaymentModal: (invoice: CalculatedInvoice) => void;
  onSelectEquipmentForAlert: (equipment: Equipment) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  equipment,
  alerts,
  announcements,
  inspections,
  invoices,
  lateNotices,
  apartmentSettings,
  ownerProfile,
  onOpenOwnerLogin,
  setActiveTab,
  onAcknowledgeAlert,
  onAcknowledgeAnnouncement,
  onQuickToggleInspectionCheck,
  onCompleteInspection,
  onRunLatePaymentDispatcher,
  onOpenNoticeModal,
  onOpenPaymentModal,
  onSelectEquipmentForAlert,
}) => {
  // Pending Amount calculations in Rupees
  const pendingInvoices = invoices.filter((i) => i.status !== 'paid');
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');
  const upcomingInvoices = invoices.filter((i) => i.status === 'pending');
  const paidInvoices = invoices.filter((i) => i.status === 'paid');

  const totalBasePending = pendingInvoices.reduce((acc, curr) => acc + curr.baseAmount, 0);
  const totalAccruedFines = pendingInvoices.reduce((acc, curr) => acc + curr.accruedFine, 0);
  const totalPendingAmount = pendingInvoices.reduce((acc, curr) => acc + curr.totalAmountDue, 0);

  // Equipment telemetry counts
  const criticalCount = equipment.filter((e) => e.status === 'critical').length;
  const needsInspCount = equipment.filter((e) => e.status === 'needs_inspection').length;
  const underRepairCount = equipment.filter((e) => e.status === 'under_repair').length;
  const operationalCount = equipment.filter((e) => e.status === 'operational').length;

  // Active alerts
  const activeAlerts = alerts.filter((a) => a.status === 'active' || a.status === 'acknowledged');
  const urgentAlertsCount = activeAlerts.filter((a) => a.priority === 'urgent').length;

  // Inspection tasks
  const pendingTasks = inspections.filter((t) => t.status !== 'completed');
  const overdueTasks = pendingTasks.filter((t) => new Date(t.dueDate).getTime() < new Date('2026-09-10').getTime());
  const dueTodayTasks = pendingTasks.filter((t) => t.dueDate === '2026-09-10');

  // Critical Announcements
  const criticalAnnouncements = announcements.filter(
    (a) => a.severity === 'urgent' || a.type === 'critical_repair' || a.type === 'overdue_repair'
  );

  // Match owner's active invoice for personal flat maintenance
  const ownerInvoice = invoices.find((inv) => {
    if (ownerProfile.flatNumber && inv.flatOrEntity) {
      const cleanFlat = ownerProfile.flatNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanInvFlat = inv.flatOrEntity.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanInvFlat.includes(cleanFlat) || cleanFlat.includes(cleanInvFlat)) {
        return true;
      }
    }
    if (ownerProfile.ownerName && inv.recipient) {
      if (inv.recipient.toLowerCase().includes(ownerProfile.ownerName.toLowerCase())) {
        return true;
      }
    }
    return false;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 0. HOUSE OWNER MAINTENANCE & CARPET AREA SUMMARY SPOTLIGHT */}
      <OwnerMaintenanceCard
        ownerProfile={ownerProfile}
        apartmentSettings={apartmentSettings}
        ownerInvoice={ownerInvoice}
        onOpenLoginModal={onOpenOwnerLogin}
        onOpenPaymentModal={onOpenPaymentModal}
      />

      {/* 1. CRITICAL REPAIR ANNOUNCEMENT BANNER */}
      {criticalAnnouncements.length > 0 && (
        <div
          id="critical-repair-announcement-banner"
          className="rounded-xl border border-rose-200 bg-rose-50/90 p-4 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-600 text-white rounded-lg shrink-0 mt-0.5 animate-pulse">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-rose-200 text-rose-900 tracking-wider">
                    {apartmentSettings.apartmentName} Staff Announcement
                  </span>
                  <span className="text-xs text-rose-700 font-semibold">
                    {criticalAnnouncements.length} Critical Repair Notice{criticalAnnouncements.length > 1 ? 's' : ''} Active
                  </span>
                </div>
                <h3 className="text-base font-bold text-rose-950 mt-1">
                  {criticalAnnouncements[0].title}
                </h3>
                <p className="text-sm text-rose-800 line-clamp-2 mt-0.5">
                  {criticalAnnouncements[0].content}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap text-xs text-rose-700 font-medium">
                  <span>Affected Areas:</span>
                  {criticalAnnouncements[0].affectedAreas.map((area, idx) => (
                    <span key={idx} className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded-md border border-rose-200">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                id="btn-acknowledge-critical-announcement"
                type="button"
                onClick={() => onAcknowledgeAnnouncement(criticalAnnouncements[0].id)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-100 text-rose-900 hover:bg-rose-200 border border-rose-300 transition-colors"
              >
                Acknowledge ({criticalAnnouncements[0].acknowledgedCount} signed)
              </button>
              <button
                id="btn-view-all-announcements"
                type="button"
                onClick={() => setActiveTab('announcements')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-colors flex items-center gap-1"
              >
                <span>View All Staff Notices</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PENDING PAYMENTS & OVERDUE FINES HIGHLIGHT - MAIN QUICK REFERENCE */}
      <div
        id="dashboard-pending-payments-panel"
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-900 rounded-lg">
                <span className="font-extrabold text-base">₹</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Pending Amounts & Overdue Fines Quick Reference
              </h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-medium">
                Rupees (₹)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              All society maintenance bills & contractor dues for {apartmentSettings.apartmentName}. Overdue fines accrue daily and are automatically ticked off upon in-app payment.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-run-late-dispatcher-dash"
              type="button"
              onClick={onRunLatePaymentDispatcher}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-sm"
              title="Scan all overdue bills and dispatch automated late notices with calculated fines"
            >
              <Zap className="h-3.5 w-3.5 fill-slate-950" />
              <span>Dispatch Overdue Notices</span>
            </button>

            <button
              id="btn-view-payments-ledger"
              type="button"
              onClick={() => setActiveTab('payments')}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
            >
              <span>Manage Invoices & Fines</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Big Pending Metrics Strip in Rupees (₹) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Main Card: TOTAL PENDING AMOUNT */}
          <div className="p-4 rounded-xl bg-slate-900 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Total Pending Dues (₹)
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-400 text-slate-950">
                {pendingInvoices.length} Bills Unpaid
              </span>
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-amber-400">
                {formatINR(totalPendingAmount)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Base: {formatINR(totalBasePending)} + Late Fines: {formatINR(totalAccruedFines)}
              </p>
            </div>
            <div className="text-xs text-slate-300 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span>Overdue Count:</span>
              <span className="font-bold text-rose-400">{overdueInvoices.length} late</span>
            </div>
          </div>

          {/* Overdue Balance Card */}
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                Overdue Principal Due (₹)
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900">
                Action Required
              </span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold font-mono text-rose-900">
                {formatINR(overdueInvoices.reduce((a, c) => a + c.baseAmount, 0))}
              </div>
              <p className="text-[11px] text-rose-700 mt-1">
                Across {overdueInvoices.length} overdue society maintenance invoices
              </p>
            </div>
            <div className="text-xs text-rose-800 pt-2 border-t border-rose-200/60 flex items-center justify-between">
              <span>Avg Overdue:</span>
              <span className="font-bold">
                {overdueInvoices.length > 0
                  ? Math.round(overdueInvoices.reduce((a, c) => a + c.daysOverdue, 0) / overdueInvoices.length)
                  : 0}{' '}
                days
              </span>
            </div>
          </div>

          {/* Accrued Late Fines Card */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Accrued Overdue Fines
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                Society Policy
              </span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold font-mono text-amber-900">
                +{formatINR(totalAccruedFines)}
              </div>
              <p className="text-[11px] text-amber-700 mt-1">
                ₹{apartmentSettings.defaultFixedFine} fine + ₹{apartmentSettings.defaultDailyFineRate}/day rate
              </p>
            </div>
            <div className="text-xs text-amber-800 pt-2 border-t border-amber-200/60 flex items-center justify-between">
              <span>Late Notices Dispatched:</span>
              <span className="font-bold">{lateNotices.length} sent</span>
            </div>
          </div>

          {/* Paid / Ticked Settled Card */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Paid & Ticked (₹)
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900 flex items-center gap-1">
                <Check className="h-3 w-3 stroke-[3]" /> Ticked
              </span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold font-mono text-emerald-900">
                {formatINR(paidInvoices.reduce((a, c) => a + c.baseAmount, 0))}
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">
                {paidInvoices.length} invoices settled & automatically ticked
              </p>
            </div>
            <div className="text-xs text-emerald-800 pt-2 border-t border-emerald-200/60 flex items-center justify-between">
              <span>Society VPA:</span>
              <span className="font-bold truncate max-w-[120px]">{apartmentSettings.upiId}</span>
            </div>
          </div>
        </div>

        {/* Overdue Invoices Mini-List with Direct "Pay Now (₹)" Action */}
        {overdueInvoices.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                Overdue Maintenance Bills Requiring Immediate Payment:
              </span>
              <span className="text-xs text-slate-500">Pay online in Rupees (₹) to tick off overdue status</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {overdueInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3 rounded-lg border border-rose-200 bg-rose-50/40 text-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between font-medium">
                      <span className="font-bold text-slate-900">{inv.invoiceNumber}</span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-200 text-rose-900 font-bold text-[10px]">
                        {inv.daysOverdue}d overdue
                      </span>
                    </div>
                    <p className="text-slate-800 font-semibold truncate mt-1">
                      {inv.recipient} {inv.flatOrEntity ? `(${inv.flatOrEntity})` : ''}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-rose-100 font-mono">
                      <span className="text-slate-500">Fine: +{formatINR(inv.accruedFine)}</span>
                      <span className="font-bold text-rose-900 text-sm">
                        {formatINR(inv.totalAmountDue)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-rose-200/50 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenNoticeModal(inv)}
                      className="text-[11px] text-slate-600 hover:text-slate-900 underline"
                    >
                      Notice Letter
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenPaymentModal(inv)}
                      className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1"
                    >
                      <CreditCard className="h-3 w-3" />
                      <span>Pay {formatINR(inv.totalAmountDue)}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. FOUR CORE STATUS SUMMARY PILLARS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Equipment Status Pillar */}
        <div
          onClick={() => setActiveTab('equipment')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-amber-400 transition-colors">
              <Wrench className="h-4 w-4" />
            </div>
            <span className="text-xs text-slate-500 flex items-center gap-0.5 group-hover:text-slate-900">
              Manage <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">{equipment.length} Units</div>
            <p className="text-xs text-slate-500 font-medium">Apartment Equipment</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-rose-600 font-bold">{criticalCount} Critical</span>
            <span className="text-amber-600 font-semibold">{needsInspCount} Inspect</span>
            <span className="text-emerald-600 font-semibold">{operationalCount} OK</span>
          </div>
        </div>

        {/* Technician Alerts Pillar */}
        <div
          onClick={() => setActiveTab('alerts')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="text-xs text-slate-500 flex items-center gap-0.5 group-hover:text-slate-900">
              Alerts <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">{activeAlerts.length} Active</div>
            <p className="text-xs text-slate-500 font-medium">Technician Alerts</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-rose-600 font-bold">{urgentAlertsCount} Urgent</span>
            <span className="text-slate-500">Automated SMS/Push</span>
          </div>
        </div>

        {/* Inspection Reminders Pillar */}
        <div
          onClick={() => setActiveTab('inspections')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <span className="text-xs text-slate-500 flex items-center gap-0.5 group-hover:text-slate-900">
              Tasks <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">{pendingTasks.length} Due</div>
            <p className="text-xs text-slate-500 font-medium">Scheduled Inspections</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-rose-600 font-bold">{overdueTasks.length} Overdue</span>
            <span className="text-amber-600 font-bold">{dueTodayTasks.length} Today</span>
          </div>
        </div>

        {/* Staff Announcements Pillar */}
        <div
          onClick={() => setActiveTab('announcements')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-xs text-slate-500 flex items-center gap-0.5 group-hover:text-slate-900">
              Bulletin <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">{announcements.length} Notices</div>
            <p className="text-xs text-slate-500 font-medium">Resident & Staff Bulletins</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-indigo-600 font-bold">{criticalAnnouncements.length} Critical</span>
            <span className="text-slate-500">Live Broadcast</span>
          </div>
        </div>
      </div>

      {/* 4. DUAL COLUMN WORKFLOW DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Equipment Requiring Attention & Scheduled Inspection Reminders */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section: Equipment Status & Critical Repairs */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-slate-700" />
                <h3 className="font-bold text-slate-900 text-sm">Critical Equipment & Upcoming Repairs</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('equipment')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                All Equipment ({equipment.length}) &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {equipment
                .filter((e) => e.status === 'critical' || e.status === 'needs_inspection' || e.status === 'under_repair')
                .map((eq) => (
                  <div key={eq.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{eq.name}</span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                            eq.status === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : eq.status === 'under_repair'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {eq.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {eq.location} &bull; Tech: <span className="font-medium text-slate-700">{eq.assignedTechnicianName}</span>
                      </p>
                      {eq.criticalNotes && (
                        <p className="text-xs text-rose-700 font-medium mt-1">
                          ⚠️ {eq.criticalNotes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right sm:block hidden">
                        <div className="text-xs font-bold text-slate-700">Health: {eq.healthScore}%</div>
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              eq.healthScore < 50
                                ? 'bg-rose-500'
                                : eq.healthScore < 75
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${eq.healthScore}%` }}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectEquipmentForAlert(eq)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 transition-colors flex items-center gap-1"
                        title="Dispatch immediate automated technician alert"
                      >
                        <Zap className="h-3 w-3" />
                        <span>Dispatch Alert</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Section: Inspection Reminders (So Nobody Misses a Scheduled Inspection) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Scheduled Inspection Reminders
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('inspections')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Inspection Schedule &rarr;
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {pendingTasks.slice(0, 3).map((task) => {
                const isOverdue = new Date(task.dueDate).getTime() < new Date('2026-09-10').getTime();
                const isToday = task.dueDate === '2026-09-10';
                const completedCount = task.checklist.filter((c) => c.done).length;

                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-lg border transition-all ${
                      isOverdue
                        ? 'bg-rose-50/50 border-rose-200'
                        : isToday
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-slate-50/50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 text-sm">{task.title}</h4>
                          {isOverdue && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                              OVERDUE
                            </span>
                          )}
                          {isToday && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                              DUE TODAY
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Equipment: <span className="font-medium text-slate-700">{task.equipmentName}</span> &bull; Tech: {task.assignedTechnicianName}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onCompleteInspection(task.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors shrink-0 flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Sign-off</span>
                      </button>
                    </div>

                    {/* Mini Checklist */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-slate-600">
                        Checklist ({completedCount}/{task.checklist.length} completed):
                      </span>
                      <div className="flex items-center gap-2">
                        {task.checklist.slice(0, 2).map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => onQuickToggleInspectionCheck(task.id, item.id)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center gap-1 ${
                              item.done
                                ? 'bg-emerald-100 border-emerald-300 text-emerald-800 line-through'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={item.done}
                              readOnly
                              className="h-3 w-3 rounded text-emerald-600"
                            />
                            <span className="truncate max-w-[120px]">{item.task}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Automated Technician Alerts Feed & Late Payment Dispatch Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Technician Alerts Live Dispatch Queue */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Technician Alerts Feed
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('alerts')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                View Feed ({activeAlerts.length}) &rarr;
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {activeAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    alert.priority === 'urgent'
                      ? 'bg-rose-50/70 border-rose-200'
                      : alert.priority === 'high'
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                        alert.priority === 'urgent'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {alert.priority} &bull; {alert.channel}
                    </span>
                    <span className="text-[11px] text-slate-500">{alert.timestamp}</span>
                  </div>

                  <p className="font-bold text-slate-900 text-sm mt-1">{alert.title}</p>
                  <p className="text-slate-600 mt-1 line-clamp-2">{alert.message}</p>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-slate-500">
                      Assigned: <strong className="text-slate-800">{alert.technicianName}</strong>
                    </span>

                    {alert.status === 'active' ? (
                      <button
                        type="button"
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-2.5 py-1 rounded bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Acknowledged
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automated Late Payment Notices Dispatcher Box */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/70">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-amber-700" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Automated Late Notice Dispatcher
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                Active System
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2">
              The automated engine tracks invoices that cross the payment due date, computes the contractual daily fines in Rupees (₹), and queues structured late payment warning notices.
            </p>

            <div className="mt-3 p-3 rounded-lg bg-white border border-amber-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Overdue Invoices Triggered:</span>
                <span className="font-bold text-rose-600">{overdueInvoices.length} invoices</span>
              </div>
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Total Accrued Penalty:</span>
                <span className="font-bold text-amber-700 font-mono">+{formatINR(totalAccruedFines)}</span>
              </div>
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Notices Dispatched To Date:</span>
                <span className="font-bold text-slate-900">{lateNotices.length} notices</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={onRunLatePaymentDispatcher}
                className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 transition-colors shadow flex items-center justify-center gap-1.5"
              >
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Send Automated Late Notices Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
