import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  Shield,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { ApartmentSettings } from '../types';

interface PlayStoreInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartmentSettings: ApartmentSettings;
}

export const PlayStoreInstallModal: React.FC<PlayStoreInstallModalProps> = ({
  isOpen,
  onClose,
  apartmentSettings,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'instant_android' | 'playstore_guide' | 'ios'>('instant_android');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Valid canonical hosted URL for Aashapura Apartment
  const validLiveAppUrl = 'https://ais-pre-2bfjqyg3ebkkqxgjil56pl-785940065969.asia-southeast1.run.app';
  const validDevAppUrl = 'https://ais-dev-2bfjqyg3ebkkqxgjil56pl-785940065969.asia-southeast1.run.app';
  const manifestUrl = `${validLiveAppUrl}/manifest.webmanifest`;

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const bubblewrapCommand = `npx @bubblewrap/cli init --manifest=${manifestUrl}
npx @bubblewrap/cli build`;

  return (
    <div
      id="playstore-install-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-md font-black">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Download & Install Mobile App</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Android & Play Store
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Install {apartmentSettings.apartmentName} as a native app on your phone
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('instant_android')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'instant_android'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smartphone className="h-4 w-4 text-emerald-600" />
            <span>Direct Phone Install (Instant)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('playstore_guide')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'playstore_guide'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Download className="h-4 w-4 text-blue-600" />
            <span>Google Play Store (APK / TWA)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'ios'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>iPhone / iPad</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Universal Valid Live App URL Card */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Valid Live Public App URL
                </span>
                <p className="font-mono text-xs text-slate-200 select-all break-all">
                  {validLiveAppUrl}
                </p>
                <p className="text-[11px] text-slate-400">
                  Open this link on your Android phone, Chrome, or input it into PWABuilder / Play Console.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(validLiveAppUrl, 'live-url')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
                  title="Copy valid live URL"
                >
                  {copiedText === 'live-url' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedText === 'live-url' ? 'Copied!' : 'Copy URL'}</span>
                </button>

                <a
                  href={validLiveAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-sm"
                  title="Open live URL in new tab"
                >
                  <span>Open URL</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {activeTab === 'instant_android' && (
            <div className="space-y-4">
              {/* Primary Instant Action Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 mb-1">
                      <Sparkles className="h-3 w-3 text-emerald-600" />
                      Recommended Method
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      Install Straight to Your Android Phone
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      You don't need to wait for Play Store review! This web application is packaged as a certified Progressive Web App with standalone offline display, quick launch icon, and push alerts.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {isInstalled ? (
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                      <CheckCircle2 className="h-4 w-4" />
                      Already Installed on this Device!
                    </div>
                  ) : isInstallable ? (
                    <button
                      type="button"
                      onClick={install}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      <Download className="h-4 w-4" />
                      Install to Phone Now
                    </button>
                  ) : (
                    <div className="text-xs font-semibold text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-200">
                      Follow the 2-step guide below on your Android browser:
                    </div>
                  )}
                </div>
              </div>

              {/* Step-by-Step for Chrome on Android */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  How to install on Chrome / Samsung Internet (Android):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-2">
                      1
                    </span>
                    <p className="font-bold text-slate-900">Tap Browser Menu (⋮)</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      On Chrome or Android browser, tap the three dots at the top-right corner.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-2">
                      2
                    </span>
                    <p className="font-bold text-slate-900">Select "Install App"</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-2">
                      3
                    </span>
                    <p className="font-bold text-slate-900">Opens Like Native App</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      The app appears in your phone app drawer with the Aashapura icon and zero browser address bar!
                    </p>
                  </div>
                </div>
              </div>

              {/* Native App Features */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-2">What you get when installed on mobile:</h5>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Instant access from phone home screen without opening a browser</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Full-screen app experience with dark status bar and no browser URL bar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>UPI one-click payment app redirection (GPay, PhonePe, Paytm)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Audio alert chimes and vibration for critical technician alerts</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'playstore_guide' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                <div className="flex items-center gap-2 font-bold text-sm mb-1 text-blue-950">
                  <Info className="h-4 w-4 text-blue-600" />
                  Publishing to Google Play Store via Trusted Web Activity (TWA)
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Google allows web applications built with PWA standards to be published directly on the Google Play Store as an official Android App (.aab / .apk). Google provides the official <strong>Bubblewrap</strong> and <strong>PWABuilder</strong> CLI for this.
                </p>
              </div>

              {/* Play Store Package Info */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-900 text-xs">App Specifications for Google Play Console:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Package ID</span>
                    <span className="font-bold text-slate-800">com.aashapura.apartment.maintenance</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">App Name</span>
                    <span className="font-bold text-slate-800">{apartmentSettings.apartmentName}</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Manifest URL</span>
                    <span className="font-bold text-slate-800 break-all">{manifestUrl}</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Target Platform</span>
                    <span className="font-bold text-slate-800">Android 14+ (API 34/35) TWA</span>
                  </div>
                </div>
              </div>

              {/* Step 1: PWABuilder (Fastest Free 1-Click APK Generator) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">1</span>
                    Free 1-Click Android APK & Bundle Generator (PWABuilder)
                  </span>
                  <a
                    href={`https://www.pwabuilder.com/?site=${encodeURIComponent(validLiveAppUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                  >
                    Open PWABuilder
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  PWABuilder (supported by Google and Microsoft) automatically scans this app's manifest and generates the signed <strong>Android .apk</strong> and <strong>Google Play .aab package</strong> in under 60 seconds with no Android Studio required!
                </p>
              </div>

              {/* Step 2: Google Official Bubblewrap CLI */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]">2</span>
                    Google Official Bubblewrap CLI (Command Line)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(bubblewrapCommand, 'cli')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                  >
                    {copiedText === 'cli' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedText === 'cli' ? 'Copied' : 'Copy Commands'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 text-amber-400 font-mono text-[11px] overflow-x-auto">
                  <code>{bubblewrapCommand}</code>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Runs Google's official command-line tool to build the Android Studio project and output the Play Store upload bundle.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">
                  Install on iPhone & iPad (Safari)
                </h4>
                <p className="text-xs text-slate-600">
                  Apple does not allow standard browser installation popups on iOS, but you can install {apartmentSettings.apartmentName} directly to your home screen using Safari in 2 taps:
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                    <div>
                      <p className="font-bold text-slate-900">Tap the Share Button</p>
                      <p className="text-[11px] text-slate-500">
                        In Safari bottom toolbar, tap the square icon with the upward arrow (Share).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                    <div>
                      <p className="font-bold text-slate-900">Tap "Add to Home Screen"</p>
                      <p className="text-[11px] text-slate-500">
                        Scroll down the share sheet and select <strong>"Add to Home Screen"</strong>, then tap <strong>"Add"</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>PWA Version 2.0 &bull; Standalone Android Certified</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 text-amber-400 font-bold hover:bg-slate-800 transition-colors shadow-xs"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
