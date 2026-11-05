import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  CheckCircle2,
  FileText,
  Zap,
  Send,
  Search,
  Check,
  CreditCard,
  Building2,
} from 'lucide-react';
import { CalculatedInvoice, LatePaymentNotice, Equipment, ApartmentSettings, HouseOwnerProfile } from '../types';
import { formatINR } from '../utils/data';
import { sounds } from '../utils/sound';
import { OwnerMaintenanceCard } from './OwnerMaintenanceCard';

interface PaymentFinesManagerProps {
  invoices: CalculatedInvoice[];
  lateNotices: LatePaymentNotice[];
  equipment: Equipment[];
  apartmentSettings: ApartmentSettings;
  ownerProfile: HouseOwnerProfile;
  onOpenOwnerLogin: () => void;
  onSettlePayment: (invoiceId: string) => void;
  onOpenPaymentModal: (invoice: CalculatedInvoice) => void;
  onSendSingleLateNotice: (invoice: CalculatedInvoice) => void;
  onRunLatePaymentDispatcher: () => void;
  onOpenNoticeModal: (invoice: CalculatedInvoice) => void;
  onOpenNewInvoiceModal: () => void;
}

export const PaymentFinesManager: React.FC<PaymentFinesManagerProps> = ({
  invoices,
  lateNotices,
  apartmentSettings,
  ownerProfile,
  onOpenOwnerLogin,
  onSettlePayment,
  onOpenPaymentModal,
  onSendSingleLateNotice,
  onRunLatePaymentDispatcher,
  onOpenNoticeModal,
  onOpenNewInvoiceModal,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTabSub, setActiveTabSub] = useState<'invoices' | 'notices'>('invoices');

  const pendingInvoices = invoices.filter((i) => i.status !== 'paid');
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');
  const paidInvoices = invoices.filter((i) => i.status === 'paid');

  const totalPendingAmount = pendingInvoices.reduce((acc, curr) => acc + curr.totalAmountDue, 0);
  const totalBasePending = pendingInvoices.reduce((acc, curr) => acc + curr.baseAmount, 0);
  const totalAccruedFines = pendingInvoices.reduce((acc, curr) => acc + curr.accruedFine, 0);
  const totalPaidAmount = paidInvoices.reduce((acc, curr) => acc + curr.baseAmount, 0);

  // Match owner's personal invoice
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

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.flatOrEntity && inv.flatOrEntity.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inv.equipmentName && inv.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* HOUSE OWNER MAINTENANCE SPOTLIGHT & CARPET AREA */}
      <OwnerMaintenanceCard
        ownerProfile={ownerProfile}
        apartmentSettings={apartmentSettings}
        ownerInvoice={ownerInvoice}
        onOpenLoginModal={onOpenOwnerLogin}
        onOpenPaymentModal={onOpenPaymentModal}
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-900 rounded-lg">
              <span className="font-extrabold text-base">₹</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {apartmentSettings.apartmentName} &bull; Maintenance Payments & Fines
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pay maintenance dues online in Rupees (₹) via UPI / Cards. Overdue bills automatically receive a verified green tick upon payment.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-run-auto-notices"
            type="button"
            onClick={onRunLatePaymentDispatcher}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm transition-colors"
            title="Scan overdue invoices and dispatch automated late notices with computed fines"
          >
            <Zap className="h-4 w-4 fill-slate-950" />
            <span>Dispatch Overdue Fine Notices</span>
          </button>

          <button
            id="btn-add-invoice"
            type="button"
            onClick={onOpenNewInvoiceModal}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Society Invoice</span>
          </button>
        </div>
      </div>

      {/* PRIMARY PENDING LEDGER METRIC CARDS IN RUPEES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL PENDING AMOUNT */}
        <div className="p-5 rounded-xl bg-slate-900 text-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Pending Dues (₹)
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-400 text-slate-950">
              {pendingInvoices.length} Unpaid
            </span>
          </div>

          <div className="my-3">
            <div className="text-3xl font-extrabold font-mono text-amber-400 tracking-tight">
              {formatINR(totalPendingAmount)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Base: {formatINR(totalBasePending)} + Fines: {formatINR(totalAccruedFines)}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>Overdue Dues:</span>
            <span className="font-bold text-rose-400 font-mono">
              {formatINR(overdueInvoices.reduce((a, c) => a + c.totalAmountDue, 0))}
            </span>
          </div>
        </div>

        {/* OVERDUE INVOICES COUNT & BALANCE */}
        <div className="p-5 rounded-xl bg-white border border-rose-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
              Overdue Amount (Fines Active)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
              {overdueInvoices.length} Overdue
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl font-bold font-mono text-rose-900">
              {formatINR(overdueInvoices.reduce((a, c) => a + c.totalAmountDue, 0))}
            </div>
            <p className="text-xs text-rose-700 mt-1">
              Late fines compounding at ₹{apartmentSettings.defaultDailyFineRate}/day
            </p>
          </div>

          <div className="pt-2 border-t border-rose-100 text-xs text-rose-800 flex items-center justify-between">
            <span>Longest Delay:</span>
            <span className="font-bold">
              {overdueInvoices.length > 0
                ? Math.max(...overdueInvoices.map((i) => i.daysOverdue))
                : 0}{' '}
              days overdue
            </span>
          </div>
        </div>

        {/* ACCRUED OVERDUE FINES */}
        <div className="p-5 rounded-xl bg-white border border-amber-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Accrued Overdue Penalties
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Society By-Laws
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl font-bold font-mono text-amber-900">
              +{formatINR(totalAccruedFines)}
            </div>
            <p className="text-xs text-amber-700 mt-1">
              ₹{apartmentSettings.defaultFixedFine} fixed + ₹{apartmentSettings.defaultDailyFineRate}/day
            </p>
          </div>

          <div className="pt-2 border-t border-amber-100 text-xs text-amber-800 flex items-center justify-between">
            <span>Late Notices Dispatched:</span>
            <span className="font-bold">{lateNotices.length} notices</span>
          </div>
        </div>

        {/* SETTLED / PAID AMOUNT */}
        <div className="p-5 rounded-xl bg-white border border-emerald-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Settled / Paid (₹)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Check className="h-3 w-3 stroke-[3]" /> {paidInvoices.length} Ticked Paid
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl font-bold font-mono text-emerald-900">
              {formatINR(totalPaidAmount)}
            </div>
            <p className="text-xs text-emerald-700 mt-1">
              Automatically ticked & credited to society account
            </p>
          </div>

          <div className="pt-2 border-t border-emerald-100 text-xs text-emerald-800 flex items-center justify-between">
            <span>Payment VPA:</span>
            <span className="font-bold font-mono text-[11px] truncate max-w-[140px]" title={apartmentSettings.upiId}>
              {apartmentSettings.upiId}
            </span>
          </div>
        </div>
      </div>

      {/* FINE POLICY & SOCIETY UPI INFO BANNER */}
      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{apartmentSettings.apartmentName} By-Laws Overdue Fine Rule:</span> Any maintenance payment unpaid past the due date incurs a{' '}
            <strong className="underline decoration-amber-600">fixed penalty fine of ₹{apartmentSettings.defaultFixedFine}.00</strong> plus an ongoing{' '}
            <strong className="underline decoration-amber-600">daily late charge of ₹{apartmentSettings.defaultDailyFineRate}.00/day</strong>. Making payment online automatically ticks off overdue penalties and updates your receipt instantly.
          </div>
        </div>

        <button
          type="button"
          onClick={onRunLatePaymentDispatcher}
          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 text-amber-400 hover:bg-slate-800 shrink-0 shadow-xs flex items-center gap-1 self-end sm:self-center"
        >
          <Zap className="h-3 w-3" />
          <span>Dispatch Overdue Notices</span>
        </button>
      </div>

      {/* Sub-Tabs: Invoices Ledger vs. Automated Notices History */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveTabSub('invoices')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTabSub === 'invoices'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Society Invoices & Dues ({invoices.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSub('notices')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTabSub === 'notices'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>Automated Late Notices Log ({lateNotices.length})</span>
          </button>
        </div>
      </div>

      {activeTabSub === 'invoices' ? (
        <>
          {/* Filters & Search Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="invoice-search-input"
                  type="text"
                  placeholder="Search by invoice number, Flat (e.g. A-304), recipient name, or equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  id="invoice-status-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="overdue">Overdue Bills (Fines Active)</option>
                  <option value="pending">Current Pending</option>
                  <option value="paid">Ticked & Paid</option>
                </select>
              </div>
            </div>

            {/* Quick Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 text-xs scrollbar-none">
              {[
                { label: 'All Invoices', value: 'all', count: invoices.length },
                { label: 'Overdue (Fines Applied)', value: 'overdue', count: overdueInvoices.length, color: 'text-rose-700 bg-rose-50' },
                { label: 'Pending (Current)', value: 'pending', count: invoices.filter((i) => i.status === 'pending').length, color: 'text-amber-700 bg-amber-50' },
                { label: 'Ticked & Paid', value: 'paid', count: paidInvoices.length, color: 'text-emerald-700 bg-emerald-50' },
              ].map((pill) => (
                <button
                  key={pill.value}
                  type="button"
                  onClick={() => setStatusFilter(pill.value)}
                  className={`px-3 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${
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

          {/* Invoices Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Invoice # & Service</th>
                    <th className="py-3 px-4">Flat / Recipient</th>
                    <th className="py-3 px-4">Due Date & Delay</th>
                    <th className="py-3 px-4 text-right">Base Amount</th>
                    <th className="py-3 px-4 text-right">Late Fine (₹)</th>
                    <th className="py-3 px-4 text-right">Total Payable</th>
                    <th className="py-3 px-4 text-center">Status / Tick</th>
                    <th className="py-3 px-4 text-right">In-App Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        No maintenance invoices found matching your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => {
                      const isOverdue = inv.status === 'overdue';
                      const isPaid = inv.status === 'paid';

                      return (
                        <tr
                          key={inv.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isOverdue ? 'bg-rose-50/20' : isPaid ? 'bg-emerald-50/10' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</span>
                              {isPaid && (
                                <span className="inline-flex items-center p-0.5 rounded-full bg-emerald-100 text-emerald-700" title="Overdue Payment Automatically Ticked & Settled">
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </span>
                              )}
                            </div>
                            <div className="text-slate-600 font-medium truncate max-w-[200px]">{inv.title}</div>
                            {inv.equipmentName && (
                              <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                                {inv.equipmentName}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{inv.recipient}</div>
                            {inv.flatOrEntity && (
                              <div className="text-emerald-700 font-medium text-[11px]">{inv.flatOrEntity}</div>
                            )}
                            <div className="text-slate-400 text-[10px]">{inv.recipientPhone || inv.recipientEmail}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-mono font-medium text-slate-800">{inv.dueDate}</div>
                            {isOverdue && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-600 text-white">
                                {inv.daysOverdue} days overdue
                              </span>
                            )}
                            {isPaid && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5">
                                <Check className="h-2.5 w-2.5 stroke-[3]" />
                                Settled {inv.paidAt}
                              </span>
                            )}
                            {!isOverdue && !isPaid && (
                              <span className="text-[10px] text-slate-500">Active due date</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-700">
                            {formatINR(inv.baseAmount)}
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono">
                            {inv.accruedFine > 0 ? (
                              <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                                +{formatINR(inv.accruedFine)}
                              </span>
                            ) : (
                              <span className="text-slate-400">₹0.00</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                            {formatINR(inv.totalAmountDue)}
                          </td>

                          {/* STATUS & AUTOMATIC TICK BADGE */}
                          <td className="py-3.5 px-4 text-center">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                                <Check className="h-3.5 w-3.5 stroke-[3] text-emerald-600" />
                                <span>Ticked & Paid</span>
                              </span>
                            ) : isOverdue ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                Overdue Fine
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                Pending
                              </span>
                            )}
                          </td>

                          {/* IN-APP PAYMENT & NOTICE ACTIONS */}
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            {!isPaid && (
                              <>
                                {/* Primary In-App Payment button */}
                                <button
                                  type="button"
                                  onClick={() => onOpenPaymentModal(inv)}
                                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors inline-flex items-center gap-1"
                                  title="Pay now via UPI (GPay/PhonePe), NetBanking, or Card in Rupees"
                                >
                                  <CreditCard className="h-3.5 w-3.5" />
                                  <span>Pay {formatINR(inv.totalAmountDue)}</span>
                                </button>

                                {isOverdue && (
                                  <button
                                    type="button"
                                    onClick={() => onSendSingleLateNotice(inv)}
                                    className="px-2 py-1.5 text-[11px] font-bold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors"
                                    title="Dispatch late notice email & SMS"
                                  >
                                    Notice ({inv.lateNoticesSentCount})
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => onOpenNoticeModal(inv)}
                                  className="px-2 py-1.5 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                                  title="View invoice letterhead"
                                >
                                  Bill
                                </button>
                              </>
                            )}

                            {isPaid && (
                              <div className="inline-flex items-center gap-1.5">
                                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                                  {inv.transactionId || 'PAID'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onOpenNoticeModal(inv)}
                                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                                >
                                  Receipt
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* AUTOMATED LATE NOTICES DISPATCH LOG */
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Send className="h-4 w-4 text-amber-600" />
                Automated Late Payment Notice Dispatch History
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Full chronological audit trail of automated delinquent notices, applied fines (₹), and resident SMS/Email alerts.
              </p>
            </div>

            <button
              type="button"
              onClick={onRunLatePaymentDispatcher}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs flex items-center gap-1"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Trigger New Notice Run</span>
            </button>
          </div>

          <div className="space-y-3">
            {lateNotices.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">
                No automated late notices dispatched yet. Click &quot;Dispatch Overdue Fine Notices&quot; to scan.
              </p>
            ) : (
              lateNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                        {notice.invoiceNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase">
                        {notice.noticeStage}
                      </span>
                      <span className="text-slate-500 font-mono">{notice.generatedAt}</span>
                    </div>

                    <div className="font-semibold text-slate-900">
                      Resident / Recipient: {notice.recipient} ({notice.recipientEmail})
                    </div>
                    <p className="text-slate-600 leading-relaxed max-w-2xl">{notice.message}</p>

                    <div className="pt-1 flex items-center gap-4 text-slate-700 font-mono">
                      <span>Principal: {formatINR(notice.originalAmount)}</span>
                      <span>&bull;</span>
                      <span className="font-bold text-rose-600">Accrued Fine: +{formatINR(notice.fineAmount)}</span>
                      <span>&bull;</span>
                      <span className="font-bold text-slate-900">Total Demanded: {formatINR(notice.totalDue)}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                      <Check className="h-3 w-3" /> Delivered
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
