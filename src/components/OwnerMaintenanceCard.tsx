import React from 'react';
import {
  Home,
  Calculator,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Edit3,
  User,
  ShieldCheck,
  Zap,
  Check,
} from 'lucide-react';
import { HouseOwnerProfile, CalculatedInvoice, ApartmentSettings } from '../types';
import { formatINR } from '../utils/data';

interface OwnerMaintenanceCardProps {
  ownerProfile: HouseOwnerProfile;
  apartmentSettings: ApartmentSettings;
  ownerInvoice?: CalculatedInvoice | null;
  onOpenLoginModal: () => void;
  onOpenPaymentModal: (invoice: CalculatedInvoice) => void;
}

export const OwnerMaintenanceCard: React.FC<OwnerMaintenanceCardProps> = ({
  ownerProfile,
  apartmentSettings,
  ownerInvoice,
  onOpenLoginModal,
  onOpenPaymentModal,
}) => {
  if (!ownerProfile.isLoggedIn) {
    return (
      <div
        id="owner-login-prompt-banner"
        className="rounded-2xl border-2 border-dashed border-amber-300 bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 p-5 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-200 text-amber-900 uppercase tracking-wide">
                  Owner Onboarding
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  Rate: ₹1.50 / sq. ft.
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Are you a house owner at {apartmentSettings.apartmentName}?
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Log in and enter your house carpet area to automatically calculate your monthly society maintenance.
              </p>
            </div>
          </div>

          <button
            id="btn-open-owner-login-banner"
            type="button"
            onClick={onOpenLoginModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all shrink-0 hover:shadow"
          >
            <span>Owner Login & Calculate Maintenance</span>
            <ArrowRight className="h-4 w-4 text-amber-400" />
          </button>
        </div>
      </div>
    );
  }

  // When owner is logged in:
  const isPaid = ownerInvoice ? ownerInvoice.status === 'paid' : false;
  const isOverdue = ownerInvoice ? ownerInvoice.status === 'overdue' : false;
  const daysOverdue = ownerInvoice ? ownerInvoice.daysOverdue : 0;
  const accruedFine = ownerInvoice ? ownerInvoice.accruedFine : 0;
  const totalDue = ownerInvoice ? ownerInvoice.totalAmountDue : ownerProfile.calculatedMaintenance;

  return (
    <div
      id="owner-maintenance-active-card"
      className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Top Banner */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center">
            <Home className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">
                {ownerProfile.flatNumber} &bull; {ownerProfile.ownerName}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Verified Resident
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {apartmentSettings.apartmentName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenLoginModal}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Update house carpet area or switch flat"
          >
            <Edit3 className="h-3 w-3 text-amber-400" />
            <span>Edit Carpet Area ({ownerProfile.carpetArea} sq ft)</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* 1. Carpet Area & Rate Column */}
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 md:pr-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              House Specifications
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {ownerProfile.carpetArea}
              </span>
              <span className="text-xs font-bold text-slate-500">Sq. Ft. Carpet Area</span>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <span>Society Rate:</span>
                <span className="font-bold text-slate-900 font-mono">₹1.50 / sq. ft.</span>
              </div>
              <div className="flex items-center justify-between mt-0.5 text-[11px] text-slate-500">
                <span>Billing Period:</span>
                <span>Current Month</span>
              </div>
            </div>
          </div>

          {/* 2. Live Calculation Formula Column */}
          <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 md:pr-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Calculated Maintenance
              </span>
              <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                <Calculator className="h-3 w-3" />
                Area &times; ₹1.50
              </span>
            </div>

            <div className="text-xs text-slate-700 font-mono bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80">
              <div className="text-[11px] text-amber-900 font-sans font-semibold">
                Formula Calculation:
              </div>
              <div className="text-xs text-slate-900 font-bold mt-0.5">
                {ownerProfile.carpetArea} sq ft &times; ₹1.50 ={' '}
                <span className="text-amber-900 font-black">{formatINR(ownerProfile.calculatedMaintenance)}</span>
              </div>
              {accruedFine > 0 && !isPaid && (
                <div className="text-[11px] text-rose-700 font-semibold mt-1 pt-1 border-t border-amber-200">
                  + Accrued Late Fine: {formatINR(accruedFine)} ({daysOverdue} days past due)
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
              <span>Annual Maintenance (12 mo):</span>
              <span className="font-semibold text-slate-800 font-mono">
                {formatINR(ownerProfile.calculatedMaintenance * 12)}
              </span>
            </div>
          </div>

          {/* 3. Payment Status & Pay Now Action Column */}
          <div className="flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Bill Payment Status
              </span>

              {isPaid ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                      <span>✓ Ticked & Paid</span>
                    </div>
                    <div className="text-[10px] text-emerald-700">
                      Settled via {ownerInvoice?.paymentMethod || 'UPI Online'}
                    </div>
                  </div>
                </div>
              ) : isOverdue ? (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                  <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-rose-950">
                      Payment Overdue ({daysOverdue} days)
                    </div>
                    <div className="text-[10px] text-rose-700">
                      Payable: {formatINR(totalDue)} (incl. fines)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Current Bill Due: {formatINR(totalDue)}
                    </div>
                    <div className="text-[10px] text-slate-600">
                      Due by Sep 20, 2026
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action button */}
            {!isPaid && ownerInvoice && (
              <button
                id="btn-owner-pay-maintenance"
                type="button"
                onClick={() => onOpenPaymentModal(ownerInvoice)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all hover:shadow"
              >
                <CreditCard className="h-4 w-4" />
                <span>Pay Maintenance ({formatINR(totalDue)}) via UPI</span>
              </button>
            )}

            {isPaid && (
              <div className="text-center text-[11px] text-emerald-700 font-medium">
                Receipt #{ownerInvoice?.transactionId || 'TXN-AASH-9912'} logged in society ledger
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
