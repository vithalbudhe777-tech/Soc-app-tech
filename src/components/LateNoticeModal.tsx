import React from 'react';
import {
  X,
  FileText,
  AlertTriangle,
  Building2,
  Calendar,
  Printer,
  CheckCircle2,
  Mail,
  Phone,
  ShieldAlert,
  CreditCard,
  Check,
} from 'lucide-react';
import { CalculatedInvoice, ApartmentSettings } from '../types';
import { formatINR } from '../utils/data';
import { sounds } from '../utils/sound';

interface LateNoticeModalProps {
  invoice: CalculatedInvoice | null;
  apartmentSettings: ApartmentSettings;
  onClose: () => void;
  onSettlePayment: (invoiceId: string) => void;
  onOpenPaymentModal?: (invoice: CalculatedInvoice) => void;
}

export const LateNoticeModal: React.FC<LateNoticeModalProps> = ({
  invoice,
  apartmentSettings,
  onClose,
  onSettlePayment,
  onOpenPaymentModal,
}) => {
  if (!invoice) return null;

  const isOverdue = invoice.status === 'overdue';
  const isPaid = invoice.status === 'paid';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-2xl w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Letterhead Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight uppercase">
                  {apartmentSettings.apartmentName}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 uppercase">
                  Society Accounts
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Reg: {apartmentSettings.societyRegNo} &bull; {apartmentSettings.address}
              </p>
            </div>

            <div className="text-right">
              {isPaid ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <Check className="h-3 w-3 stroke-[3]" /> OFFICIAL RECEIPT: SETTLED
                </span>
              ) : isOverdue ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300 animate-pulse">
                  OVERDUE PAYMENT DEMAND
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  MAINTENANCE BILL
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Recipient & Meta Section */}
        <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Billed To / Resident:</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{invoice.recipient}</div>
            {invoice.flatOrEntity && (
              <div className="text-emerald-700 font-semibold">{invoice.flatOrEntity}</div>
            )}
            <div className="text-slate-600">{invoice.recipientEmail}</div>
            <div className="text-slate-600">{invoice.recipientPhone}</div>
          </div>

          <div className="text-right">
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Reference Details:</span>
            <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">{invoice.invoiceNumber}</div>
            <div className="text-slate-600">
              Due Date: <strong className={isOverdue ? 'text-rose-600' : 'text-slate-800'}>{invoice.dueDate}</strong>
            </div>
            <div className="text-slate-600">Notice Date: <strong>2026-09-10</strong></div>
            {invoice.transactionId && (
              <div className="text-emerald-700 font-mono font-bold text-[11px] mt-0.5">
                Txn: {invoice.transactionId}
              </div>
            )}
          </div>
        </div>

        {/* Overdue Warning Body */}
        {isOverdue && (
          <div className="my-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>Overdue Maintenance Notice: {invoice.daysOverdue} Days Past Due</span>
            </div>
            <p className="leading-relaxed">
              As per {apartmentSettings.apartmentName} managing committee rules, payment for bill <strong>{invoice.invoiceNumber}</strong> was due on <strong>{invoice.dueDate}</strong>. Late payment fines have been applied as itemized below. You can pay instantly online in Rupees via UPI / Cards to clear this balance.
            </p>
          </div>
        )}

        {/* Itemized Calculation Breakdown in Rupees */}
        <div className="my-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Statement Breakdown & Fines Calculation (Indian Rupees ₹)
          </h4>
          <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3 text-left">Description</th>
                  <th className="py-2.5 px-3 text-left">Basis</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {invoice.title}
                    {invoice.equipmentName && (
                      <span className="block text-[11px] text-slate-500">Asset: {invoice.equipmentName}</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">Society maintenance charge</td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800">
                    {formatINR(invoice.baseAmount)}
                  </td>
                </tr>

                {invoice.daysOverdue > 0 && (
                  <>
                    <tr className="bg-rose-50/30">
                      <td className="py-2.5 px-3 font-medium text-rose-900">
                        Fixed Late Penalty Fine
                      </td>
                      <td className="py-2.5 px-3 text-rose-700">Society late penalty fee</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-rose-700">
                        +{formatINR(invoice.fixedPenaltyFee)}
                      </td>
                    </tr>
                    <tr className="bg-rose-50/30">
                      <td className="py-2.5 px-3 font-medium text-rose-900">
                        Daily Overdue Compounding Fine
                      </td>
                      <td className="py-2.5 px-3 text-rose-700">
                        {invoice.daysOverdue} days @ {formatINR(invoice.dailyFineRate)} / day
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-rose-700">
                        +{formatINR(invoice.daysOverdue * invoice.dailyFineRate)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
              <tfoot className="bg-slate-900 text-white font-bold">
                <tr>
                  <td colSpan={2} className="py-3 px-3 text-right text-xs uppercase tracking-wider">
                    Total Amount Payable:
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-base text-amber-400">
                    {formatINR(invoice.totalAmountDue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Remittance Instructions with Society UPI ID */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-semibold text-slate-800">Society Bank & UPI Details:</div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div>Beneficiary: {apartmentSettings.apartmentName} Maintenance Fund</div>
            <div>Society UPI: <strong className="text-emerald-700">{apartmentSettings.upiId}</strong></div>
            <div>Hon. Secretary: {apartmentSettings.secretaryName}</div>
            <div>Secretary Phone: {apartmentSettings.secretaryContact}</div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Printer className="h-4 w-4" />
            <span>Print Receipt</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              Close
            </button>

            {!isPaid && (
              <>
                {onOpenPaymentModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPaymentModal(invoice);
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Pay {formatINR(invoice.totalAmountDue)} Online</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onSettlePayment(invoice.id);
                    sounds.playSuccessSound();
                    onClose();
                  }}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
                >
                  Mark Settle
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
