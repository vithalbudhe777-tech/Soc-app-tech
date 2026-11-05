import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  Bell,
  Clock,
  Radio,
  FileText,
  DollarSign,
  CalendarCheck,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  Settings,
  Building2,
  Home,
  Smartphone,
  FolderArchive,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { ActiveTab, TechnicianAlert, StaffAnnouncement, ApartmentSettings, HouseOwnerProfile } from '../types';
import { sounds } from '../utils/sound';
import { formatINR } from '../utils/data';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  totalPendingAmount: number;
  activeAlertsCount: number;
  criticalAnnouncementsCount: number;
  dueInspectionsCount: number;
  documentsCount?: number;
  alerts: TechnicianAlert[];
  announcements: StaffAnnouncement[];
  apartmentSettings: ApartmentSettings;
  ownerProfile: HouseOwnerProfile;
  onOpenOwnerLogin: () => void;
  onOpenSettings: () => void;
  onOpenPlayStoreModal: () => void;
  onTriggerAutoScan: () => void;
  isScanning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  totalPendingAmount,
  activeAlertsCount,
  criticalAnnouncementsCount,
  dueInspectionsCount,
  documentsCount = 12,
  alerts,
  announcements,
  apartmentSettings,
  ownerProfile,
  onOpenOwnerLogin,
  onOpenSettings,
  onOpenPlayStoreModal,
  onTriggerAutoScan,
  isScanning,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  const CANONICAL_APP_URL = 'https://ais-pre-2bfjqyg3ebkkqxgjil56pl-785940065969.asia-southeast1.run.app';

  const handleCopyAppLink = async () => {
    try {
      await navigator.clipboard.writeText(CANONICAL_APP_URL);
      setHasCopiedLink(true);
      sounds.playSuccessSound();
      setTimeout(() => setHasCopiedLink(false), 2500);
    } catch {
      // Fallback
      setHasCopiedLink(true);
      setTimeout(() => setHasCopiedLink(false), 2500);
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      sounds.playReminderChime();
    }
  };

  const urgentAlerts = alerts.filter((a) => a.priority === 'urgent' || a.priority === 'high');
  const criticalAnnouncements = announcements.filter((a) => a.severity === 'urgent');

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">
                  {apartmentSettings.apartmentName}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  Live Society Ops
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Maintenance Tracker, Technician Alerts & In-App Payments (₹)
              </p>
            </div>
          </div>

          {/* Quick Telemetry & Status bar */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Thu, Sep 10, 2026</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{activeAlertsCount} Alerts</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 text-slate-700">
              <span>Pending Dues:</span>
              <span className="font-bold text-slate-900 font-mono">
                {formatINR(totalPendingAmount)}
              </span>
            </div>
          </div>

          {/* Action controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Owner Profile / Login Button */}
            {ownerProfile.isLoggedIn ? (
              <button
                id="btn-navbar-owner-profile"
                type="button"
                onClick={onOpenOwnerLogin}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-slate-900 shadow-xs transition-colors"
                title="House owner active. Click to update carpet area or switch flat."
              >
                <Home className="h-3.5 w-3.5 text-amber-700" />
                <span className="font-bold text-slate-900">{ownerProfile.flatNumber}</span>
                <span className="text-slate-400 hidden sm:inline">&bull;</span>
                <span className="hidden sm:inline text-amber-900 font-mono text-[11px]">{ownerProfile.carpetArea} sq ft</span>
                <span className="text-slate-400 hidden md:inline">&bull;</span>
                <span className="hidden md:inline font-bold text-emerald-800 font-mono text-[11px]">{formatINR(ownerProfile.calculatedMaintenance)}/mo</span>
              </button>
            ) : (
              <button
                id="btn-navbar-owner-login"
                type="button"
                onClick={onOpenOwnerLogin}
                className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 shadow-xs transition-colors"
                title="Log in with your flat & carpet area to calculate maintenance at ₹1.5/sq ft"
              >
                <Home className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Owner Login</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}

            {/* Copy Valid URL Button */}
            <button
              id="btn-copy-app-url"
              type="button"
              onClick={handleCopyAppLink}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors shadow-xs ${
                hasCopiedLink
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
              }`}
              title="Copy valid public URL to open on your phone or share"
            >
              {hasCopiedLink ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
              <span className="hidden lg:inline">{hasCopiedLink ? 'Copied URL!' : 'Copy Link'}</span>
            </button>

            {/* Play Store & Mobile App Download Button */}
            <button
              id="btn-playstore-download"
              type="button"
              onClick={onOpenPlayStoreModal}
              className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 shadow-xs transition-colors"
              title="Download & Install on Android phone or build Google Play Store package"
            >
              <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Play Store / App</span>
              <span className="sm:hidden">App</span>
            </button>

            {/* Edit App / Apartment Settings Button */}
            <button
              id="btn-edit-apartment"
              type="button"
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-colors"
              title="Edit apartment name, address, fine rules, and app settings"
            >
              <Settings className="h-3.5 w-3.5 text-slate-600" />
              <span className="hidden sm:inline">Edit App / Society</span>
            </button>

            {/* Auto-scan telemetry button */}
            <button
              id="btn-auto-scan"
              type="button"
              onClick={onTriggerAutoScan}
              disabled={isScanning}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                isScanning
                  ? 'bg-amber-50 border-amber-300 text-amber-800 cursor-wait'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
              title="Run automated status scan across all apartment equipment, tasks, and overdue payments"
            >
              <Radio className={`h-3.5 w-3.5 ${isScanning ? 'text-amber-600 animate-spin' : 'text-slate-500'}`} />
              <span className="hidden md:inline">{isScanning ? 'Scanning...' : 'Auto-Scan'}</span>
            </button>

            {/* Sound toggle button */}
            <button
              id="btn-toggle-sound"
              type="button"
              onClick={toggleSound}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-slate-200"
              title={soundEnabled ? 'Alert sounds enabled' : 'Muted'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-600" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
            </button>

            {/* Notification bell dropdown toggle */}
            <div className="relative">
              <button
                id="btn-notifications-toggle"
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                aria-label="Open notifications"
              >
                <Bell className="h-4 w-4" />
                {activeAlertsCount + criticalAnnouncementsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow">
                    {activeAlertsCount + criticalAnnouncementsCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div
                  id="notifications-popover"
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-slate-700" />
                      <h4 className="text-sm font-semibold text-slate-900">
                        {apartmentSettings.apartmentName} Alerts
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {urgentAlerts.length === 0 && criticalAnnouncements.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No critical alert triggers pending.</p>
                    ) : (
                      <>
                        {criticalAnnouncements.map((ann) => (
                          <div
                            key={ann.id}
                            className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900"
                          >
                            <div className="flex items-center justify-between font-semibold mb-1">
                              <span className="flex items-center gap-1 text-rose-700">
                                <AlertTriangle className="h-3 w-3" />
                                Staff Announcement
                              </span>
                              <span className="text-[10px] text-rose-500">{ann.createdAt.split(' ')[1] || 'Today'}</span>
                            </div>
                            <p className="font-medium text-slate-900">{ann.title}</p>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('announcements');
                                setShowNotifications(false);
                              }}
                              className="mt-1.5 text-xs text-rose-700 underline font-medium hover:text-rose-800"
                            >
                              View Announcement &rarr;
                            </button>
                          </div>
                        ))}

                        {urgentAlerts.map((alt) => (
                          <div
                            key={alt.id}
                            className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900"
                          >
                            <div className="flex items-center justify-between font-semibold mb-1">
                              <span className="flex items-center gap-1 text-amber-700">
                                <Radio className="h-3 w-3" />
                                Technician Alert ({alt.channel})
                              </span>
                              <span className="text-[10px] text-amber-600">{alt.priority.toUpperCase()}</span>
                            </div>
                            <p className="font-medium text-slate-900">{alt.title}</p>
                            <p className="text-slate-600 mt-0.5 line-clamp-2">{alt.message}</p>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('alerts');
                                setShowNotifications(false);
                              }}
                              className="mt-1.5 text-xs text-amber-700 underline font-medium hover:text-amber-800"
                            >
                              Dispatch Details &rarr;
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          <button
            id="tab-dashboard"
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Dashboard</span>
          </button>

          <button
            id="tab-equipment"
            type="button"
            onClick={() => setActiveTab('equipment')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'equipment'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>Apartment Equipment</span>
          </button>

          <button
            id="tab-alerts"
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>Technician Alerts</span>
            {activeAlertsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-rose-600 text-white">
                {activeAlertsCount}
              </span>
            )}
          </button>

          <button
            id="tab-announcements"
            type="button"
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'announcements'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bell className="h-4 w-4 text-indigo-400" />
            <span>Resident & Staff Notices</span>
            {criticalAnnouncementsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-amber-500 text-slate-900">
                {criticalAnnouncementsCount}
              </span>
            )}
          </button>

          <button
            id="tab-inspections"
            type="button"
            onClick={() => setActiveTab('inspections')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'inspections'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CalendarCheck className="h-4 w-4 text-emerald-400" />
            <span>Inspection Reminders</span>
            {dueInspectionsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-emerald-700 text-white">
                {dueInspectionsCount}
              </span>
            )}
          </button>

          <button
            id="tab-payments"
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'payments'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="font-bold text-amber-400">₹</span>
            <span>Maintenance Payments & Fines</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {formatINR(totalPendingAmount)}
            </span>
          </button>

          <button
            id="tab-documents"
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'documents'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FolderArchive className="h-4 w-4 text-amber-400" />
            <span>Documents & Records</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-800 border border-amber-300">
              {documentsCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
