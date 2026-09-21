import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Clock, 
  ShieldCheck, 
  PhoneCall, 
  Search, 
  AlertCircle,
  FileCheck,
  Sparkles,
  Info,
  Cloud
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  overdueCount: number;
  openRegulationsModal: () => void;
  onSelectQuickFilter?: (filter: string) => void;
  onNavigateToInspection?: () => void;
  isCloudConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  overdueCount,
  openRegulationsModal,
  onSelectQuickFilter,
  onNavigateToInspection,
  isCloudConnected = true
}) => {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to Dubai Gulf Standard Time
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dubai',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      };
      setTimeString(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      {/* Top emergency & compliance banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-sky-950 px-4 py-1.5 border-b border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            DHA &amp; Dubai Municipality Hospital FM Protocol Active
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden md:inline">AGM All In One • Personal Executive FM Dashboard</span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>GST (Dubai): <strong className="text-white font-mono">{timeString || 'GST (UTC+4)'}</strong></span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="bg-emerald-950/80 px-2.5 py-0.5 rounded text-[11px] border border-emerald-500/50 text-emerald-300 flex items-center gap-1.5 font-medium shadow-sm">
              <Cloud className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Cloud Firestore: <strong>Connected</strong></span>
            </span>

            <span className="bg-emerald-900/60 px-2.5 py-0.5 rounded text-[11px] border border-emerald-600/40 text-emerald-300 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              DHA &amp; JCI Inspection Ready
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  AGM ALL IN ONE
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border border-emerald-500/30 tracking-wider">
                    Hospital FM Suite
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Facility Management, Hard &amp; Soft PPMs, Air/Water Quality &amp; Quotations
              </p>
            </div>
          </div>

          {/* Overdue alert indicator on mobile */}
          <div className="md:hidden flex items-center gap-2">
            {overdueCount > 0 && (
              <button
                onClick={() => onSelectQuickFilter && onSelectQuickFilter('overdue')}
                className="flex items-center gap-1 text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-1 rounded-lg"
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>{overdueCount} Overdue</span>
              </button>
            )}
          </div>
        </div>

        {/* Center Search & Action Center */}
        <div className="flex items-center gap-3 flex-1 max-w-xl md:mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="global-search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search PPM tasks, equipment, vendors, quotations, OT air tests..."
              className="w-full bg-slate-800/90 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Compliance & Quick Action Badges */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {onNavigateToInspection && (
            <button
              onClick={onNavigateToInspection}
              className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
              title="Open 1-Click DHA & JCI Inspection Audit Dossier"
            >
              <FileCheck className="w-4 h-4" />
              <span>1-Click DHA / JCI Dossier</span>
            </button>
          )}

          {overdueCount > 0 && (
            <button
              onClick={() => onSelectQuickFilter && onSelectQuickFilter('overdue')}
              className="hidden md:flex items-center gap-1.5 text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/30 transition-colors"
              title="Click to filter Overdue hospital tasks"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="font-semibold">{overdueCount} Overdue Tasks</span>
            </button>
          )}

          <button
            onClick={openRegulationsModal}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">Dubai FM</span> Standards Guide
          </button>
        </div>
      </div>
    </header>
  );
};
