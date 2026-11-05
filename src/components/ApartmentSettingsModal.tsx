import React, { useState } from 'react';
import { X, Building2, Save, CheckCircle2, ShieldAlert, Sliders } from 'lucide-react';
import { ApartmentSettings } from '../types';
import { sounds } from '../utils/sound';

interface ApartmentSettingsModalProps {
  settings: ApartmentSettings;
  onClose: () => void;
  onSaveSettings: (newSettings: ApartmentSettings) => void;
}

export const ApartmentSettingsModal: React.FC<ApartmentSettingsModalProps> = ({
  settings,
  onClose,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<ApartmentSettings>({ ...settings });

  const handleChange = (field: keyof ApartmentSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    sounds.playSuccessSound();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in duration-150 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-900 text-amber-400">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Edit Apartment & App Configuration</h3>
              <p className="text-[11px] text-slate-500">
                Customize society identity, address, late fine policy (₹), and payment VPA
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Apartment / Housing Society Name *
            </label>
            <input
              id="input-apartment-name"
              type="text"
              required
              value={formData.apartmentName}
              onChange={(e) => handleChange('apartmentName', e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Society Registration No.</label>
              <input
                type="text"
                value={formData.societyRegNo}
                onChange={(e) => handleChange('societyRegNo', e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Wings & Flat Count</label>
              <input
                type="text"
                value={formData.wings}
                onChange={(e) => handleChange('wings', e.target.value)}
                placeholder="e.g. Wing A & B (64 Flats)"
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Apartment Street Address & City</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hon. Secretary Name</label>
              <input
                type="text"
                value={formData.secretaryName}
                onChange={(e) => handleChange('secretaryName', e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Secretary Contact Phone</label>
              <input
                type="text"
                value={formData.secretaryContact}
                onChange={(e) => handleChange('secretaryContact', e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Society UPI ID (for In-App Payments)</label>
              <input
                type="text"
                value={formData.upiId}
                onChange={(e) => handleChange('upiId', e.target.value)}
                placeholder="e.g. aashapura.society@okhdfcbank"
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-emerald-700 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Accounts / Treasurer Email</label>
              <input
                type="email"
                value={formData.treasurerEmail}
                onChange={(e) => handleChange('treasurerEmail', e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Overdue Fine Policy Configuration in Rupees */}
          <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 space-y-2.5">
            <span className="font-bold text-amber-950 block">
              Default Overdue Fine Policy (Indian Rupees ₹)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-amber-900 mb-1">Fixed Overdue Fine (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-600">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={formData.defaultFixedFine}
                    onChange={(e) => handleChange('defaultFixedFine', Number(e.target.value))}
                    className="w-full py-1.5 pl-7 pr-3 rounded-lg border border-amber-300 bg-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-amber-900 mb-1">Daily Late Fine Rate (₹/day)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-600">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={formData.defaultDailyFineRate}
                    onChange={(e) => handleChange('defaultDailyFineRate', Number(e.target.value))}
                    className="w-full py-1.5 pl-7 pr-3 rounded-lg border border-amber-300 bg-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-amber-800">
              When residents or contractors miss the payment due date, the app automatically assesses this fixed fine plus compounding daily charges until paid.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Save & Apply Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
