import React, { useState } from 'react';
import { X, Plus, Calculator } from 'lucide-react';
import { MaintenanceInvoice, Equipment, ApartmentSettings } from '../types';
import { DEFAULT_RATE_PER_SQFT, calculateMaintenanceByCarpetArea } from '../utils/data';

interface NewInvoiceModalProps {
  equipmentList: Equipment[];
  apartmentSettings: ApartmentSettings;
  onClose: () => void;
  onAddInvoice: (inv: Omit<MaintenanceInvoice, 'id'>) => void;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  equipmentList,
  apartmentSettings,
  onClose,
  onAddInvoice,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState(`AA-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [flatOrEntity, setFlatOrEntity] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('+91 98200 00000');
  const [serviceType, setServiceType] = useState<any>('Monthly Society Maintenance');
  const [selectedEqId, setSelectedEqId] = useState('');
  const [carpetArea, setCarpetArea] = useState<number | string>('');
  const [baseAmount, setBaseAmount] = useState(1275);
  const [dueDate, setDueDate] = useState('2026-09-20');
  const [fixedPenaltyFee, setFixedPenaltyFee] = useState(apartmentSettings.defaultFixedFine || 150);
  const [dailyFineRate, setDailyFineRate] = useState(apartmentSettings.defaultDailyFineRate || 25);
  const [notes, setNotes] = useState('');

  const handleApplyCarpetArea = (area: number) => {
    setCarpetArea(area);
    const calculated = calculateMaintenanceByCarpetArea(area, DEFAULT_RATE_PER_SQFT);
    setBaseAmount(calculated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !recipient.trim()) return;

    const matchedEq = equipmentList.find((eq) => eq.id === selectedEqId);

    onAddInvoice({
      invoiceNumber,
      title,
      recipient,
      flatOrEntity: flatOrEntity.trim() || undefined,
      recipientEmail: recipientEmail || 'resident@aashapura.in',
      recipientPhone,
      serviceType,
      equipmentId: matchedEq ? matchedEq.id : undefined,
      equipmentName: matchedEq ? matchedEq.name : undefined,
      issueDate: '2026-09-10',
      dueDate,
      baseAmount: Number(baseAmount),
      fixedPenaltyFee: Number(fixedPenaltyFee),
      dailyFineRate: Number(dailyFineRate),
      status: 'pending',
      lateNoticesSentCount: 0,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-900">
              <span className="font-extrabold text-base">₹</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Create {apartmentSettings.apartmentName} Invoice
              </h3>
              <p className="text-[11px] text-slate-500">
                Generate maintenance bill with late fine rules in Rupees (₹)
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bill / Invoice Number *</label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category / Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="Monthly Society Maintenance">Monthly Society Maintenance</option>
                <option value="Emergency Repair Parts">Emergency Repair Parts</option>
                <option value="Quarterly Inspection">Quarterly Inspection</option>
                <option value="Contract Maintenance">Contract Maintenance</option>
                <option value="Technician Labor">Technician Labor</option>
                <option value="Sinking Fund Contribution">Sinking Fund Contribution</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Bill Title / Description *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Lift Annual Maintenance & Cable Servicing"
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Resident / Contractor Name *</label>
              <input
                type="text"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="E.g. Rajesh Shah"
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Flat / Wing / Unit</label>
              <input
                type="text"
                value={flatOrEntity}
                onChange={(e) => setFlatOrEntity(e.target.value)}
                placeholder="E.g. Flat A-402, Wing B"
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email for Automated Notices</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="resident@email.com"
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile (for SMS & UPI)</label>
              <input
                type="text"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Associated Equipment (Optional)</label>
            <select
              value={selectedEqId}
              onChange={(e) => setSelectedEqId(e.target.value)}
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

          {/* Carpet Area Auto-Calculator (₹1.5/sq ft) */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                <Calculator className="h-3.5 w-3.5 text-amber-600" />
                <span>Calculate by Carpet Area (₹1.50 / sq. ft.)</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Area &times; ₹1.5 = Amount</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Enter sq ft (e.g. 850)"
                value={carpetArea}
                onChange={(e) => handleApplyCarpetArea(Number(e.target.value))}
                className="w-36 py-1.5 px-2.5 rounded-md border border-slate-300 bg-white font-mono text-xs"
              />
              <div className="flex items-center gap-1 flex-wrap">
                {[550, 850, 1150].map((sqft) => (
                  <button
                    key={sqft}
                    type="button"
                    onClick={() => handleApplyCarpetArea(sqft)}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-700"
                  >
                    {sqft} sq ft
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Maintenance Amount (₹) *</label>
              <input
                type="number"
                step="1"
                required
                value={baseAmount}
                onChange={(e) => setBaseAmount(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Due Date *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Overdue Fine Terms Section in Rupees */}
          <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 space-y-2">
            <span className="font-bold text-amber-950 block">
              {apartmentSettings.apartmentName} By-Laws Overdue Fine Rules:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-amber-900 mb-1">Fixed Late Penalty (₹)</label>
                <input
                  type="number"
                  step="1"
                  value={fixedPenaltyFee}
                  onChange={(e) => setFixedPenaltyFee(Number(e.target.value))}
                  className="w-full py-1.5 px-3 rounded-lg border border-amber-300 bg-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-amber-900 mb-1">Daily Accrual Fine (₹/day)</label>
                <input
                  type="number"
                  step="1"
                  value={dailyFineRate}
                  onChange={(e) => setDailyFineRate(Number(e.target.value))}
                  className="w-full py-1.5 px-3 rounded-lg border border-amber-300 bg-white font-mono font-bold"
                />
              </div>
            </div>
            <p className="text-[11px] text-amber-800">
              * Fines automatically accrue past due date and trigger automated late demand notices. Paying via in-app UPI automatically ticks off overdue status.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
              <Plus className="h-4 w-4" />
              <span>Create Bill</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
