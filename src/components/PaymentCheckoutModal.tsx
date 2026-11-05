import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  ArrowRight,
  Loader2,
  Receipt,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { CalculatedInvoice, ApartmentSettings } from '../types';
import { formatINR } from '../utils/data';
import { sounds } from '../utils/sound';

interface PaymentCheckoutModalProps {
  invoice: CalculatedInvoice | null;
  apartmentSettings: ApartmentSettings;
  onClose: () => void;
  onPaymentSuccess: (invoiceId: string, transactionId: string, paymentMethod: string) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  invoice,
  apartmentSettings,
  onClose,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking' | 'card' | 'society_cash'>('upi');
  const [upiOption, setUpiOption] = useState<'qr' | 'id'>('qr');
  const [userUpiId, setUserUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('412');
  const [cardHolder, setCardHolder] = useState(invoice?.recipient || '');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedTxnId, setCompletedTxnId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!invoice) return null;

  const isOverdue = invoice.status === 'overdue';

  const handlePayNow = () => {
    setIsProcessing(true);
    setProcessingStep('Connecting to Secure Payment Gateway...');

    // Simulate gateway handshakes
    setTimeout(() => {
      setProcessingStep(`Verifying ${paymentMethod.toUpperCase()} credentials & authorization...`);
    }, 700);

    setTimeout(() => {
      setProcessingStep('Debiting account & settling with Aashapura Society Account...');
    }, 1400);

    setTimeout(() => {
      const txnId = `AASH-TXN-${Date.now().toString().slice(-6)}`;
      setCompletedTxnId(txnId);
      setIsProcessing(false);
      setIsCompleted(true);
      sounds.playSuccessSound();

      let methodDesc = 'UPI (Google Pay / PhonePe)';
      if (paymentMethod === 'upi') {
        methodDesc = upiOption === 'qr' ? `UPI QR Payment (${apartmentSettings.upiId})` : `UPI ID: ${userUpiId || 'Resident VPA'}`;
      } else if (paymentMethod === 'netbanking') {
        methodDesc = `Net Banking (${selectedBank})`;
      } else if (paymentMethod === 'card') {
        methodDesc = `RuPay / Debit Card (ending in 8912)`;
      } else {
        methodDesc = 'Society Office Direct Settlement';
      }

      onPaymentSuccess(invoice.id, txnId, methodDesc);
    }, 2200);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(apartmentSettings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-150 relative">
        {/* Close Button */}
        {!isProcessing && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Header */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isCompleted ? 'Payment Successful' : 'Pay Maintenance Bill Online'}
              </h3>
              <p className="text-xs text-slate-500">
                {apartmentSettings.apartmentName} &bull; Society Billing Gateway
              </p>
            </div>
          </div>
        </div>

        {/* IF COMPLETED: SUCCESS RECEIPT SCREEN */}
        {isCompleted ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
                <span>OVERDUE PAYMENT AUTOMATICALLY TICKED & SETTLED</span>
              </div>
              <h2 className="text-2xl font-bold font-mono text-slate-900 mt-2">
                {formatINR(invoice.totalAmountDue)}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Paid to {apartmentSettings.apartmentName} Maintenance Fund
              </p>
            </div>

            {/* Receipt Details Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction Ref ID:</span>
                <span className="font-mono font-bold text-slate-900">{completedTxnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Number:</span>
                <span className="font-mono font-bold text-slate-900">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Flat / Recipient:</span>
                <span className="font-bold text-slate-900">{invoice.recipient}</span>
              </div>
              {isOverdue && (
                <div className="flex justify-between text-rose-700 font-medium">
                  <span>Overdue Penalty Cleared:</span>
                  <span className="font-mono">✓ {formatINR(invoice.accruedFine)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold text-slate-800">
                <span>Payment Status:</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 fill-emerald-600 text-white" /> Confirmed & Ticked
                </span>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* BILL DETAILS & PAYMENT METHODS */
          <div className="py-4 space-y-4 text-xs">
            {/* Invoice Breakdown Banner */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {invoice.invoiceNumber}
                  </span>
                  <div className="font-semibold text-slate-800 mt-0.5">{invoice.title}</div>
                  <div className="text-slate-500 text-[11px]">
                    Billed to: {invoice.recipient} {invoice.flatOrEntity ? `(${invoice.flatOrEntity})` : ''}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Amount Due (Rupees)</div>
                  <div className="text-xl font-extrabold font-mono text-slate-900">
                    {formatINR(invoice.totalAmountDue)}
                  </div>
                </div>
              </div>

              {/* Overdue Warning & Fine Breakdown */}
              {isOverdue && (
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-rose-800 bg-rose-50/70 p-2.5 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                    <div>
                      <span className="font-bold">Overdue by {invoice.daysOverdue} days</span>
                      <div className="text-[11px] text-rose-700">
                        Base: {formatINR(invoice.baseAmount)} + Late Fine: {formatINR(invoice.accruedFine)}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold bg-rose-200/80 px-2 py-0.5 rounded">
                    Fine Included
                  </span>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block font-bold text-slate-800 mb-2">Select Payment Method (Rupees ₹):</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'upi'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Smartphone className="h-4 w-4 text-emerald-600" />
                  <span className="text-[11px]">UPI / QR Code</span>
                  <span className="text-[9px] text-emerald-700">GPay &bull; PhonePe &bull; Paytm</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'netbanking'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building className="h-4 w-4 text-indigo-600" />
                  <span className="text-[11px]">Net Banking</span>
                  <span className="text-[9px] text-slate-500">All Major Indian Banks</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'card'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="h-4 w-4 text-amber-600" />
                  <span className="text-[11px]">Debit / Credit</span>
                  <span className="text-[9px] text-slate-500">RuPay &bull; Visa &bull; MC</span>
                </button>
              </div>
            </div>

            {/* PAYMENT METHOD DETAILS */}

            {/* 1. UPI */}
            {paymentMethod === 'upi' && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Scan Society UPI QR or Enter VPA</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setUpiOption('qr')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        upiOption === 'qr' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      Scan QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiOption('id')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        upiOption === 'id' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      Enter UPI ID
                    </button>
                  </div>
                </div>

                {upiOption === 'qr' ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                    <div className="p-2 border border-slate-200 rounded-lg bg-white shadow-xs">
                      {/* Stylized QR Code placeholder */}
                      <div className="w-24 h-24 bg-slate-950 p-2 rounded flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div className="w-6 h-6 border-2 border-white rounded-xs bg-emerald-400" />
                          <div className="w-6 h-6 border-2 border-white rounded-xs bg-emerald-400" />
                        </div>
                        <div className="text-[7px] text-center text-white font-mono font-bold tracking-widest">
                          AASHAPURA
                        </div>
                        <div className="flex justify-between">
                          <div className="w-6 h-6 border-2 border-white rounded-xs bg-emerald-400" />
                          <div className="w-4 h-4 bg-white rounded-full mx-auto" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-center sm:text-left">
                      <div className="font-bold text-slate-900">{apartmentSettings.apartmentName} Society Account</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center justify-center sm:justify-start gap-1">
                        <span>UPI: {apartmentSettings.upiId}</span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Scan using Google Pay, PhonePe, Paytm, or BHIM to pay <strong>{formatINR(invoice.totalAmountDue)}</strong> directly.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Your UPI Virtual Address (VPA)</label>
                    <input
                      type="text"
                      placeholder="e.g. resident@okhdfcbank or 9820011223@ybl"
                      value={userUpiId}
                      onChange={(e) => setUserUpiId(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 2. NET BANKING */}
            {paymentMethod === 'netbanking' && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-semibold text-slate-800">Select Indian Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                >
                  <option value="HDFC Bank">HDFC Bank (Instant Transfer)</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Bank of Baroda">Bank of Baroda</option>
                  <option value="Punjab National Bank">Punjab National Bank</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  You will be directed to {selectedBank}&apos;s secure corporate gateway to authorize {formatINR(invoice.totalAmountDue)}.
                </p>
              </div>
            )}

            {/* 3. CARDS */}
            {paymentMethod === 'card' && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PROCESSING PROGRESS OR PAY BUTTON */}
            {isProcessing ? (
              <div className="p-4 rounded-xl bg-slate-900 text-white text-center space-y-2">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-amber-400" />
                <div className="font-bold text-sm text-amber-400">Processing Payment...</div>
                <div className="text-xs text-slate-300">{processingStep}</div>
                <div className="text-[10px] text-slate-400">Do not refresh or close this window</div>
              </div>
            ) : (
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>

                <button
                  id="btn-confirm-pay"
                  type="button"
                  onClick={handlePayNow}
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center gap-2"
                >
                  <span>Authorize & Pay {formatINR(invoice.totalAmountDue)}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
