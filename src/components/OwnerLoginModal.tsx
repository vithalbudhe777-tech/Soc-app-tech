import React, { useState, useEffect } from 'react';
import {
  Building2,
  Home,
  User,
  Phone,
  Mail,
  Calculator,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { HouseOwnerProfile, ApartmentSettings } from '../types';
import {
  DEFAULT_RATE_PER_SQFT,
  calculateMaintenanceByCarpetArea,
  SAMPLE_APARTMENT_FLATS,
  formatINR,
} from '../utils/data';
import { sounds } from '../utils/sound';

interface OwnerLoginModalProps {
  currentProfile: HouseOwnerProfile;
  apartmentSettings: ApartmentSettings;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: HouseOwnerProfile) => void;
  onLogout?: () => void;
}

export const OwnerLoginModal: React.FC<OwnerLoginModalProps> = ({
  currentProfile,
  apartmentSettings,
  isOpen,
  onClose,
  onSaveProfile,
  onLogout,
}) => {
  const [ownerName, setOwnerName] = useState(currentProfile.ownerName || '');
  const [flatNumber, setFlatNumber] = useState(currentProfile.flatNumber || '');
  const [carpetAreaInput, setCarpetAreaInput] = useState<number | string>(
    currentProfile.carpetArea || 850
  );
  const [phone, setPhone] = useState(currentProfile.phone || '+91 98200 11223');
  const [email, setEmail] = useState(currentProfile.email || 'owner@aashapura.in');
  const [wing, setWing] = useState(currentProfile.wing || 'Wing A');

  // Sync with current profile when opened
  useEffect(() => {
    if (currentProfile.isLoggedIn) {
      setOwnerName(currentProfile.ownerName);
      setFlatNumber(currentProfile.flatNumber);
      setCarpetAreaInput(currentProfile.carpetArea);
      setPhone(currentProfile.phone || '+91 98200 11223');
      setEmail(currentProfile.email || 'owner@aashapura.in');
      setWing(currentProfile.wing || 'Wing A');
    }
  }, [currentProfile]);

  if (!isOpen) return null;

  const numericCarpetArea = Number(carpetAreaInput) || 0;
  const ratePerSqFt = DEFAULT_RATE_PER_SQFT; // ₹1.5 per sq ft
  const calculatedMaintenance = calculateMaintenanceByCarpetArea(numericCarpetArea, ratePerSqFt);
  const annualEstimate = calculatedMaintenance * 12;

  // Handle preset selection
  const handleSelectPreset = (preset: typeof SAMPLE_APARTMENT_FLATS[0]) => {
    setFlatNumber(preset.flatNumber);
    setOwnerName(preset.defaultOwner);
    setCarpetAreaInput(preset.carpetArea);
    setWing(preset.wing);
    setPhone(preset.phone);
    setEmail(preset.email);
    sounds.playReminderChime();
  };

  const handleQuickAreaPreset = (area: number) => {
    setCarpetAreaInput(area);
    sounds.playReminderChime();
  };

  const handleAdjustArea = (delta: number) => {
    const next = Math.max(100, Math.min(5000, numericCarpetArea + delta));
    setCarpetAreaInput(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim()) {
      alert('Please enter house owner name');
      return;
    }
    if (!flatNumber.trim()) {
      alert('Please enter or select your flat number');
      return;
    }
    if (numericCarpetArea <= 0) {
      alert('Please enter a valid house carpet area in square feet');
      return;
    }

    const updatedProfile: HouseOwnerProfile = {
      isLoggedIn: true,
      ownerName: ownerName.trim(),
      flatNumber: flatNumber.trim(),
      carpetArea: numericCarpetArea,
      ratePerSqFt,
      calculatedMaintenance,
      phone: phone.trim(),
      email: email.trim(),
      wing: wing.trim(),
      lastLoginDate: '2026-09-10',
    };

    sounds.playSuccessSound();
    onSaveProfile(updatedProfile);
    onClose();
  };

  return (
    <div
      id="owner-login-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="owner-login-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                <Home className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    House Owner Portal
                  </span>
                  <span className="text-xs text-slate-400">{apartmentSettings.apartmentName}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mt-1">
                  {currentProfile.isLoggedIn ? 'Update Flat & Carpet Area' : 'House Owner Login'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Enter your house carpet area to calculate society maintenance at{' '}
                  <span className="text-amber-400 font-bold">₹1.50 per sq. ft.</span>
                </p>
              </div>
            </div>

            {/* Close button (allows guest browsing) */}
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
              title="Close or browse as guest"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Quick Flat Preset Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-slate-500" />
                <span>Quick Select Resident Flat</span>
              </label>
              <span className="text-[11px] text-slate-500">Or type custom below</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {SAMPLE_APARTMENT_FLATS.map((preset) => {
                const isSelected = flatNumber === preset.flatNumber;
                return (
                  <button
                    key={preset.flatNumber}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-left p-2 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 text-slate-900 font-semibold ring-1 ring-amber-500'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{preset.flatNumber}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{preset.bhkType}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{preset.defaultOwner}</div>
                    <div className="text-[10px] font-mono text-amber-700 font-semibold mt-0.5">
                      {preset.carpetArea} sq ft &bull; ₹{preset.carpetArea * 1.5}/mo
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 border-t border-slate-100">
            {/* Owner Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                House Owner Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="input-owner-name"
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="E.g. Amitabh Joshi"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Flat Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Flat / Unit Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Home className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="input-flat-number"
                  type="text"
                  required
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  placeholder="E.g. Flat A-304"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* HIGHLIGHTED CARPET AREA INPUT & PRESETS */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <label className="text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-amber-700" />
                <span>House Carpet Area (in Square Feet) *</span>
              </label>
              <span className="text-[11px] font-semibold text-amber-800">
                Maintenance Rate: ₹1.50 / sq. ft.
              </span>
            </div>

            {/* Numeric input with stepper */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="input-carpet-area"
                  type="number"
                  required
                  min={50}
                  max={10000}
                  step={1}
                  value={carpetAreaInput}
                  onChange={(e) => setCarpetAreaInput(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Enter carpet area in sq ft"
                  className="w-full py-2.5 px-3.5 pr-16 rounded-xl border border-amber-300 bg-white font-mono text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
                <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-500 pointer-events-none">
                  sq. ft.
                </span>
              </div>

              {/* Increments */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleAdjustArea(-50)}
                  className="px-2.5 py-2.5 rounded-lg border border-amber-300 bg-white hover:bg-amber-100 text-xs font-bold text-slate-800 transition-colors"
                  title="Decrease 50 sq ft"
                >
                  -50
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustArea(+50)}
                  className="px-2.5 py-2.5 rounded-lg border border-amber-300 bg-white hover:bg-amber-100 text-xs font-bold text-slate-800 transition-colors"
                  title="Increase 50 sq ft"
                >
                  +50
                </button>
              </div>
            </div>

            {/* Quick Presets for standard flat configurations */}
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-medium text-amber-900">Standard Sizes:</span>
              {[
                { label: '550 sq ft (1 BHK)', val: 550 },
                { label: '750 sq ft (1.5 BHK)', val: 750 },
                { label: '850 sq ft (2 BHK)', val: 850 },
                { label: '1,150 sq ft (3 BHK)', val: 1150 },
                { label: '1,450 sq ft (4 BHK)', val: 1450 },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => handleQuickAreaPreset(item.val)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    numericCarpetArea === item.val
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC REAL-TIME MAINTENANCE CALCULATION CARD */}
          <div className="p-4 rounded-xl bg-slate-900 text-white shadow-md border border-slate-800">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                  <Calculator className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Maintenance Calculation Breakdown
                </span>
              </div>
              <span className="text-[11px] font-semibold text-amber-400">
                Formula: Area &times; ₹1.50
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block uppercase">Carpet Area</span>
                <span className="text-sm font-bold font-mono text-white">
                  {numericCarpetArea} <span className="text-[10px] font-normal text-slate-400">sq ft</span>
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block uppercase">Rate per Sq Ft</span>
                <span className="text-sm font-bold font-mono text-amber-400">
                  ₹{ratePerSqFt.toFixed(2)}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-700/50">
                <span className="text-[10px] text-emerald-300 block uppercase font-semibold">Monthly Amount</span>
                <span className="text-base font-extrabold font-mono text-emerald-400">
                  {formatINR(calculatedMaintenance)}
                </span>
              </div>
            </div>

            {/* Total Highlight */}
            <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">
                  Monthly Society Maintenance:
                </div>
                <div className="text-xs text-slate-300">
                  {numericCarpetArea} sq. ft. &times; ₹1.50 = <span className="text-white font-bold">{formatINR(calculatedMaintenance)}</span> / month
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Annual Total (12 mo):</span>
                <span className="text-xs font-mono font-semibold text-slate-300">
                  {formatINR(annualEstimate)}
                </span>
              </div>
            </div>
          </div>

          {/* Optional contact info */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                WhatsApp / Phone (for bill receipt)
              </label>
              <div className="relative">
                <Phone className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 00000"
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@email.com"
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {currentProfile.isLoggedIn && onLogout ? (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
              >
                Log Out / Switch Flat
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Explore as Guest / Admin
              </button>
            )}

            <button
              id="btn-submit-owner-login"
              type="submit"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all group"
            >
              <span>{currentProfile.isLoggedIn ? 'Update Carpet Area & Recalculate' : 'Calculate & Log In to My Flat'}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform text-amber-400" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
