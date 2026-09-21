import React, { useState } from 'react';
import { HospitalServiceItem, Frequency } from '../types.ts';
import { 
  Building2, 
  Wrench, 
  ShieldCheck, 
  Sparkles, 
  Trash2, 
  ShieldAlert, 
  Wind, 
  Droplets, 
  Flame, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  FileCheck, 
  ChevronRight, 
  Layers, 
  Briefcase, 
  PhoneCall, 
  ExternalLink,
  Info,
  Check,
  Award,
  Zap
} from 'lucide-react';

interface HospitalServicesDirectoryViewProps {
  services: HospitalServiceItem[];
  onNavigateToTab: (tab: string, filter?: string) => void;
  onNavigateToInspection: () => void;
}

export const HospitalServicesDirectoryView: React.FC<HospitalServicesDirectoryViewProps> = ({
  services,
  onNavigateToTab,
  onNavigateToInspection
}) => {
  const [activeTypeFilter, setActiveTypeFilter] = useState<'ALL' | 'Hard FM' | 'Soft FM' | 'Compliance & Safety'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<HospitalServiceItem | null>(null);

  const filteredServices = services.filter(svc => {
    const matchesType = activeTypeFilter === 'ALL' || svc.type === activeTypeFilter;
    const matchesSearch = 
      svc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.dubaiRegulatoryRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.activeVendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.complianceAuditor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const hardFmCount = services.filter(s => s.type === 'Hard FM').length;
  const softFmCount = services.filter(s => s.type === 'Soft FM').length;
  const complianceCount = services.filter(s => s.type === 'Compliance & Safety').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-5 md:p-6 border border-slate-700/80 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DUBAI HEALTHCARE AUTHORITY (DHA) &amp; JCI FMS MANDATED SCOPE</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Hospital Facility Management Master Services Directory</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            All mandatory services under the authority of a Dubai Hospital Facility Manager — covering critical 
            <strong> Hard FM</strong> (cleanroom HVAC, cryo-MGPS, 10-second ATS power, Legionella RO), 
            <strong> Soft FM</strong> (clinical IPC terminal disinfection, Wekaya bio-waste manifests, 24/7 SIRA security), and 
            <strong> JCI FMS Safety Governance</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onNavigateToInspection}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <FileCheck className="w-4 h-4" />
            <span>1-Click DHA / JCI Audit Dossier</span>
          </button>
        </div>
      </div>

      {/* Scope Overview KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setActiveTypeFilter('ALL')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            activeTypeFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${activeTypeFilter === 'ALL' ? 'text-slate-300' : 'text-slate-500'}`}>
              Total Regulated Services
            </span>
            <Layers className={`w-4 h-4 ${activeTypeFilter === 'ALL' ? 'text-emerald-400' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-black mt-1">{services.length}</div>
          <span className={`text-[10px] font-medium block mt-0.5 ${activeTypeFilter === 'ALL' ? 'text-emerald-400' : 'text-emerald-600'}`}>
            100% DHA / DM / DCD Aligned
          </span>
        </div>

        <div 
          onClick={() => setActiveTypeFilter('Hard FM')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            activeTypeFilter === 'Hard FM'
              ? 'bg-sky-900 text-white border-sky-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-sky-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${activeTypeFilter === 'Hard FM' ? 'text-sky-200' : 'text-slate-500'}`}>
              Hard FM Services
            </span>
            <Wrench className={`w-4 h-4 ${activeTypeFilter === 'Hard FM' ? 'text-sky-300' : 'text-sky-500'}`} />
          </div>
          <div className="text-2xl font-black mt-1">{hardFmCount}</div>
          <span className={`text-[10px] font-medium block mt-0.5 ${activeTypeFilter === 'Hard FM' ? 'text-sky-300' : 'text-sky-600'}`}>
            HVAC, MGPS, Power, RO, Fire, Lifts
          </span>
        </div>

        <div 
          onClick={() => setActiveTypeFilter('Soft FM')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            activeTypeFilter === 'Soft FM'
              ? 'bg-teal-900 text-white border-teal-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-teal-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${activeTypeFilter === 'Soft FM' ? 'text-teal-200' : 'text-slate-500'}`}>
              Soft FM Services
            </span>
            <Sparkles className={`w-4 h-4 ${activeTypeFilter === 'Soft FM' ? 'text-teal-300' : 'text-teal-500'}`} />
          </div>
          <div className="text-2xl font-black mt-1">{softFmCount}</div>
          <span className={`text-[10px] font-medium block mt-0.5 ${activeTypeFilter === 'Soft FM' ? 'text-teal-300' : 'text-teal-600'}`}>
            Housekeeping, Bio-Waste, Security, IPM
          </span>
        </div>

        <div 
          onClick={() => setActiveTypeFilter('Compliance & Safety')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            activeTypeFilter === 'Compliance & Safety'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${activeTypeFilter === 'Compliance & Safety' ? 'text-emerald-200' : 'text-slate-500'}`}>
              JCI &amp; Regulatory Safety
            </span>
            <Award className={`w-4 h-4 ${activeTypeFilter === 'Compliance & Safety' ? 'text-emerald-300' : 'text-emerald-500'}`} />
          </div>
          <div className="text-2xl font-black mt-1">{complianceCount}</div>
          <span className={`text-[10px] font-medium block mt-0.5 ${activeTypeFilter === 'Compliance & Safety' ? 'text-emerald-300' : 'text-emerald-600'}`}>
            FMS.01 - FMS.10 Audit Protocols
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FM service, regulatory reference (e.g. DHA, DM, DCD, JCI)..."
            className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {(['ALL', 'Hard FM', 'Soft FM', 'Compliance & Safety'] as const).map(type => (
            <button
              key={type}
              onClick={() => setActiveTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTypeFilter === type
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'ALL' ? 'All Services' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map(svc => {
          const isHard = svc.type === 'Hard FM';
          const isSoft = svc.type === 'Soft FM';

          return (
            <div
              key={svc.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                    isHard 
                      ? 'bg-sky-50 text-sky-700 border-sky-200' 
                      : isSoft
                        ? 'bg-teal-50 text-teal-700 border-teal-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {svc.type}
                  </span>

                  <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>SLA: {svc.primarySlaHours}h Response</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {svc.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {svc.description}
                </p>

                {/* Regulatory reference badge */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Dubai Regulatory Ref:</span>
                    <strong className="text-slate-800 text-[10px] font-mono">{svc.dubaiRegulatoryRef}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Inspecting Authority:</span>
                    <strong className="text-emerald-700 font-semibold">{svc.complianceAuditor}</strong>
                  </div>
                </div>

                {/* Key Checks Checklist (3 preview) */}
                <div className="mt-3 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Mandatory FM Checks:
                  </span>
                  {svc.keyChecks.slice(0, 2).map((chk, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{chk}</span>
                    </div>
                  ))}
                  {svc.keyChecks.length > 2 && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      +{svc.keyChecks.length - 2} more regulatory checks in dossier
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500 truncate">
                  Vendor: <strong className="text-slate-700 font-semibold">{svc.activeVendor}</strong>
                </div>

                <button
                  onClick={() => setSelectedService(svc)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all shrink-0"
                >
                  <span>Protocol Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL FOR PROTOCOL AUDIT & SLA */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                  selectedService.type === 'Hard FM'
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : 'bg-teal-50 text-teal-700 border-teal-200'
                }`}>
                  {selectedService.type} • {selectedService.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  {selectedService.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedService.description}
            </p>

            {/* Audit & Regulatory Spec Card */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">Statutory Dubai Standard</span>
                  <strong className="text-slate-900 font-mono text-[11px]">{selectedService.dubaiRegulatoryRef}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Primary Auditor</span>
                  <strong className="text-emerald-700 font-semibold">{selectedService.complianceAuditor}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Emergency SLA Window</span>
                  <strong className="text-slate-900 font-bold">{selectedService.primarySlaHours} Hour Maximum</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Inspection Cycle</span>
                  <strong className="text-slate-900 font-semibold">{selectedService.inspectionCycle}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 block text-[10px]">Audit KPI Passing Target</span>
                <strong className="text-emerald-800 font-semibold text-xs">{selectedService.auditKpiTarget}</strong>
              </div>
            </div>

            {/* All Key Verification Steps */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Full Regulatory Verification Checklist:
              </h4>
              <div className="space-y-1.5">
                {selectedService.keyChecks.map((chk, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-normal">{chk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-500">
                Vendor: <strong className="text-slate-800">{selectedService.activeVendor}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedService(null);
                    onNavigateToInspection();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>View in Inspection Dossier</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
