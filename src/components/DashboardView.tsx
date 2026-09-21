import React from 'react';
import { 
  PPMTask, 
  AirQualityRecord, 
  WaterQualityRecord, 
  Vendor, 
  RFQ, 
  VendorQuotation 
} from '../types.ts';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Wind, 
  Droplets, 
  Building2, 
  Scale, 
  TrendingUp, 
  ChevronRight, 
  FileText, 
  Activity, 
  ShieldAlert, 
  PhoneCall, 
  Flame, 
  Zap,
  ArrowRight,
  Filter,
  ShieldCheck,
  Award,
  FileCheck,
  Tag,
  Cloud,
  Briefcase,
  BarChart3,
  PieChart,
  CalendarClock,
  Users,
  FolderOpen
} from 'lucide-react';

interface DashboardViewProps {
  tasks: PPMTask[];
  airTests: AirQualityRecord[];
  waterTests: WaterQualityRecord[];
  vendors: Vendor[];
  rfqs: RFQ[];
  quotations: VendorQuotation[];
  onNavigateTab: (tab: string, filter?: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: PPMTask['status']) => void;
  onSelectRFQ: (rfqId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  airTests,
  waterTests,
  vendors,
  rfqs,
  quotations,
  onNavigateTab,
  onUpdateTaskStatus,
  onSelectRFQ
}) => {
  // Compute counts
  const overdueTasks = tasks.filter(t => t.status === 'overdue');
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Next 7 days scheduled tasks
  const today = new Date('2026-09-20');
  const in7Days = new Date('2026-09-27');
  const next7DaysTasks = tasks.filter(t => {
    const d = new Date(t.dueDate);
    return d >= today && d <= in7Days && t.status !== 'completed';
  });

  // Critical Hospital Area Tasks (Zone A)
  const criticalZoneTasks = tasks.filter(t => t.zone.includes('Zone A') && t.status !== 'completed');

  // Failed / Warning Tests
  const nonCompliantAir = airTests.filter(a => a.status !== 'Compliant');
  const nonCompliantWater = waterTests.filter(w => w.status !== 'Pass');

  // Quotations awaiting review
  const activeRFQs = rfqs.filter(r => r.status === 'Comparing Quotes' || r.status === 'Open for Bids');

  // Hard vs Soft FM breakdown
  const hardFMTotal = tasks.filter(t => t.domain === 'Hard FM' || t.domain === 'Life Safety & DCD' || t.domain === 'Medical Equipment & MGPS');
  const hardFMCompleted = hardFMTotal.filter(t => t.status === 'completed').length;
  const hardFMCompliancePct = hardFMTotal.length > 0 ? Math.round((hardFMCompleted / hardFMTotal.length) * 100) : 100;

  const softFMTotal = tasks.filter(t => t.domain === 'Soft FM');
  const softFMCompleted = softFMTotal.filter(t => t.status === 'completed').length;
  const softFMCompliancePct = softFMTotal.length > 0 ? Math.round((softFMCompleted / softFMTotal.length) * 100) : 100;

  // Operational KPI Calculations
  const totalTasksCount = tasks.length;
  const overallPpmPct = totalTasksCount > 0 ? Math.round((completedTasks.length / totalTasksCount) * 100) : 0;
  const inProgressPct = totalTasksCount > 0 ? Math.round((inProgressTasks.length / totalTasksCount) * 100) : 0;
  const pendingPct = totalTasksCount > 0 ? Math.round((pendingTasks.length / totalTasksCount) * 100) : 0;
  const overduePct = totalTasksCount > 0 ? Math.round((overdueTasks.length / totalTasksCount) * 100) : 0;

  // RFQ Pipeline breakdown
  const closedRFQs = rfqs.filter(r => r.status === 'Awarded' || r.status === 'Completed');
  const totalRFQsCount = rfqs.length;
  const activeRfqPct = totalRFQsCount > 0 ? Math.round((activeRFQs.length / totalRFQsCount) * 100) : 0;
  const closedRfqPct = totalRFQsCount > 0 ? Math.round((closedRFQs.length / totalRFQsCount) * 100) : 0;

  // Upcoming Statutory Compliance Inspections
  const upcomingInspections = [
    {
      id: 'INSP-01',
      agency: 'DHA Health Regulation Sector',
      scope: 'Sterile Operating Theatres & MGPS Cryo Oxygen Audit',
      date: '2026-09-28',
      daysRemaining: 8,
      status: 'On Track',
      readinessPct: 96,
      color: 'sky'
    },
    {
      id: 'INSP-02',
      agency: 'Dubai Municipality (Food & Health Safety)',
      scope: 'Legionella Water Culture & Hemodialysis Endotoxin Review',
      date: '2026-10-04',
      daysRemaining: 14,
      status: 'Ready',
      readinessPct: 100,
      color: 'emerald'
    },
    {
      id: 'INSP-03',
      agency: 'Dubai Civil Defence (DCD Operations 997)',
      scope: 'Hassantuk IoT Linkage & Fire Sprinkler Pump Churn Pressure',
      date: '2026-10-12',
      daysRemaining: 22,
      status: 'Audit Due',
      readinessPct: 91,
      color: 'amber'
    },
    {
      id: 'INSP-04',
      agency: 'Joint Commission International (JCI)',
      scope: '8th Ed. FMS.01 - FMS.10 Environmental Risk Assessment Survey',
      date: '2026-11-15',
      daysRemaining: 56,
      status: 'In Prep',
      readinessPct: 94,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Facility Health Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>HOSPITAL FACILITY COMMAND CENTER • DUBAI</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Hospital Operations &amp; Facility Dashboard
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Real-time monitoring of Hard FM (Medical Gas, HVAC, Chillers, Electrical), Soft FM (Clinical Waste, Pest Control), Dubai Municipality &amp; DHA Water/Air testing, and RFQ Quotation auto-matching.
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-center p-2 rounded-lg bg-slate-900/50">
              <span className="text-xs text-slate-400 block mb-1">PPM Compliance</span>
              <span className="text-xl font-bold text-emerald-400">94.2%</span>
              <span className="text-[10px] text-slate-500 block">DHA Target: 90%</span>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-900/50">
              <span className="text-xs text-slate-400 block mb-1">Critical Gas/O2</span>
              <span className="text-xl font-bold text-sky-400">100%</span>
              <span className="text-[10px] text-slate-500 block">Cryo Tank Normal</span>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-900/50 col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400 block mb-1">Active AMCs</span>
              <span className="text-xl font-bold text-amber-300">{vendors.length} Vendors</span>
              <span className="text-[10px] text-slate-500 block">DCD / DM Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1-CLICK DHA & JCI AUDIT READY HERO ACTION */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-2xl p-4 md:p-5 border border-emerald-500/40 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-300">
                AUDITOR READY • 1-CLICK DISPATCH
              </span>
              <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-400/30">
                100% Compliant
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              DHA &amp; JCI Hospital Inspection Audit Dossier
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Instant one-click access to OT particle certifications, MGPS cryo logs, Legionella cultures &amp; UPS/generator transfer tests.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateTab('vendors')}
            className="px-3.5 py-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 shadow transition-all"
          >
            <FolderOpen className="w-4 h-4 text-amber-400" />
            <span>Contractors Folder</span>
          </button>

          <button
            onClick={() => onNavigateTab('attendance')}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 font-bold text-xs flex items-center gap-1.5 shadow transition-all"
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Staff Attendance (30D)</span>
          </button>

          <button
            onClick={() => onNavigateTab('services')}
            className="px-3.5 py-2.5 rounded-xl bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-500/40 font-bold text-xs flex items-center gap-1.5 shadow transition-all"
          >
            <Briefcase className="w-4 h-4 text-sky-400" />
            <span>FM Services Scope</span>
          </button>

          <button
            onClick={() => onNavigateTab('assets')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-1.5 shadow transition-all"
          >
            <Tag className="w-4 h-4 text-emerald-400" />
            <span>Asset List &amp; Tagging</span>
          </button>

          <button
            onClick={() => onNavigateTab('inspection')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <FileCheck className="w-4 h-4 text-slate-950" />
            Launch 1-Click Inspection Dossier
          </button>
        </div>
      </div>

      {/* 1-CLICK INTERACTIVE STATUS CARDS (The User's Core Request) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-emerald-600" />
            1-Click Instant Status &amp; Schedules (Facility Manager Shortcuts)
          </h3>
          <span className="text-xs text-slate-400">Click any card to filter tasks immediately</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Overdue Tasks (High Alert) */}
          <button
            onClick={() => onNavigateTab('ppm', 'overdue')}
            className={`p-4 rounded-xl text-left border transition-all relative overflow-hidden group shadow-sm hover:shadow-md ${
              overdueTasks.length > 0 
                ? 'bg-rose-50 border-rose-200 hover:border-rose-400' 
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Overdue PPMs
                </span>
                <p className="text-3xl font-extrabold text-rose-900 mt-2">
                  {overdueTasks.length}
                </p>
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  Requires immediate action
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs text-rose-700 font-medium">
              <span>View Overdue Items</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Pending Tasks */}
          <button
            onClick={() => onNavigateTab('ppm', 'pending')}
            className="p-4 rounded-xl text-left border border-amber-200 bg-amber-50 hover:border-amber-400 transition-all group shadow-sm hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Pending Tasks
                </span>
                <p className="text-3xl font-extrabold text-amber-900 mt-2">
                  {pendingTasks.length}
                </p>
                <p className="text-xs text-amber-700 mt-1 font-medium">
                  Scheduled for completion
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-800 font-medium">
              <span>View Pending Queue</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Next 7 Days Schedule */}
          <button
            onClick={() => onNavigateTab('ppm', 'next7days')}
            className="p-4 rounded-xl text-left border border-sky-200 bg-sky-50 hover:border-sky-400 transition-all group shadow-sm hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Next 7 Days
                </span>
                <p className="text-3xl font-extrabold text-sky-900 mt-2">
                  {next7DaysTasks.length}
                </p>
                <p className="text-xs text-sky-700 mt-1 font-medium">
                  Next scheduled PPMs
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-sky-200/60 flex items-center justify-between text-xs text-sky-800 font-medium">
              <span>View 7-Day Timeline</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 4: Critical Zone A (OTs / ICUs / Dialysis) */}
          <button
            onClick={() => onNavigateTab('ppm', 'zoneA')}
            className="p-4 rounded-xl text-left border border-purple-200 bg-purple-50 hover:border-purple-400 transition-all group shadow-sm hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  Zone A Critical
                </span>
                <p className="text-3xl font-extrabold text-purple-900 mt-2">
                  {criticalZoneTasks.length}
                </p>
                <p className="text-xs text-purple-700 mt-1 font-medium">
                  OTs, ICUs, MGPS, Dialysis
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-purple-200/60 flex items-center justify-between text-xs text-purple-800 font-medium">
              <span>Inspect Life Safety</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 5: Quotations Auto-Match Pipeline */}
          <button
            onClick={() => onNavigateTab('quotations')}
            className="p-4 rounded-xl text-left border border-emerald-200 bg-emerald-50 hover:border-emerald-400 transition-all group shadow-sm hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5" />
                  Auto-Match Quotes
                </span>
                <p className="text-3xl font-extrabold text-emerald-950 mt-2">
                  {activeRFQs.length} <span className="text-sm font-normal text-emerald-700">RFQs</span>
                </p>
                <p className="text-xs text-emerald-700 mt-1 font-medium">
                  {quotations.length} Vendor Quotes Logged
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 group-hover:scale-110 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-800 font-medium">
              <span>Compare &amp; Match</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* FACILITY HEALTH KPIS SECTION (Operational Status, PPM Completion, Compliance Dates, RFQs) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                <BarChart3 className="w-4 h-4" />
              </span>
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
                Facility Health KPIs &amp; Operational Analytics
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              High-level operational health indicators visualizing PPM execution efficiency, upcoming statutory survey readiness, and procurement pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Live Operational Data
            </span>
          </div>
        </div>

        {/* 3 Analytics Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KPI 1: PPM Completion & Execution Breakdown */}
          <div className="bg-slate-50/70 rounded-2xl p-4 md:p-5 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-emerald-600" />
                  PPM Tasks Completion Rate
                </span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                  overallPpmPct >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {overallPpmPct}% Overall
                </span>
              </div>

              {/* Big Metric Display */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{completedTasks.length}</span>
                <span className="text-xs font-medium text-slate-500">of {totalTasksCount} tasks completed</span>
              </div>

              {/* Visual Segmented Progress Bar */}
              <div className="mt-3 space-y-1.5">
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  <div 
                    style={{ width: `${overallPpmPct}%` }} 
                    className="bg-emerald-500 transition-all duration-500" 
                    title={`Completed: ${overallPpmPct}%`} 
                  />
                  <div 
                    style={{ width: `${inProgressPct}%` }} 
                    className="bg-sky-500 transition-all duration-500" 
                    title={`In Progress: ${inProgressPct}%`} 
                  />
                  <div 
                    style={{ width: `${pendingPct}%` }} 
                    className="bg-amber-400 transition-all duration-500" 
                    title={`Pending: ${pendingPct}%`} 
                  />
                  <div 
                    style={{ width: `${overduePct}%` }} 
                    className="bg-rose-500 transition-all duration-500" 
                    title={`Overdue: ${overduePct}%`} 
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5">
                  <span>0%</span>
                  <span className="font-semibold text-emerald-600">Target &ge;90% (DHA)</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Progress Legend & Individual Bars */}
              <div className="mt-4 space-y-2.5">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                      Completed / Verified
                    </span>
                    <strong className="text-slate-900 font-mono">{completedTasks.length} ({overallPpmPct}%)</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div style={{ width: `${overallPpmPct}%` }} className="h-full bg-emerald-500 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <span className="w-2.5 h-2.5 rounded-sm bg-sky-500"></span>
                      Active In-Progress
                    </span>
                    <strong className="text-slate-900 font-mono">{inProgressTasks.length} ({inProgressPct}%)</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div style={{ width: `${inProgressPct}%` }} className="h-full bg-sky-500 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
                      Pending Scheduled
                    </span>
                    <strong className="text-slate-900 font-mono">{pendingTasks.length} ({pendingPct}%)</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div style={{ width: `${pendingPct}%` }} className="h-full bg-amber-400 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-rose-700 font-medium">
                      <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                      Overdue Actions
                    </span>
                    <strong className="text-rose-700 font-mono">{overdueTasks.length} ({overduePct}%)</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div style={{ width: `${overduePct}%` }} className="h-full bg-rose-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('ppm')}
              className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Manage PPM Schedule</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* KPI 2: Upcoming Statutory Compliance Inspections */}
          <div className="bg-slate-50/70 rounded-2xl p-4 md:p-5 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarClock className="w-4 h-4 text-sky-600" />
                  Upcoming Statutory Surveys
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  {upcomingInspections.length} Scheduled
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                Audits from DHA, Dubai Municipality, Civil Defence &amp; JCI with countdown timers.
              </p>

              {/* Inspection Timeline List */}
              <div className="mt-3 space-y-2.5">
                {upcomingInspections.map((insp) => (
                  <div 
                    key={insp.id}
                    className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {insp.agency}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        insp.daysRemaining <= 10 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        In {insp.daysRemaining} days
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                      {insp.scope}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="text-slate-400 font-mono">Date: {insp.date}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-medium">Readiness:</span>
                        <span className="font-bold text-emerald-700">{insp.readinessPct}%</span>
                      </div>
                    </div>

                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div style={{ width: `${insp.readinessPct}%` }} className="h-full bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('inspection')}
              className="w-full py-2 rounded-xl bg-sky-900 hover:bg-sky-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <FileCheck className="w-3.5 h-3.5 text-sky-300" />
              <span>Open 1-Click Audit Dossier</span>
            </button>
          </div>

          {/* KPI 3: Procurement & RFQ Operational Pipeline */}
          <div className="bg-slate-50/70 rounded-2xl p-4 md:p-5 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  Active vs Closed RFQ Pipeline
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  {totalRFQsCount} Total RFQs
                </span>
              </div>

              {/* Big Metric Display */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{activeRFQs.length}</span>
                <span className="text-xs font-medium text-slate-500">active sourcing tenders in progress</span>
              </div>

              {/* Progress Visual: Active vs Awarded */}
              <div className="mt-3 space-y-1.5">
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  <div 
                    style={{ width: `${activeRfqPct}%` }} 
                    className="bg-emerald-600 transition-all duration-500" 
                    title={`Active: ${activeRfqPct}%`}
                  />
                  <div 
                    style={{ width: `${closedRfqPct}%` }} 
                    className="bg-slate-400 transition-all duration-500" 
                    title={`Closed / Awarded: ${closedRfqPct}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5">
                  <span className="text-emerald-700 font-semibold">{activeRFQs.length} Active ({activeRfqPct}%)</span>
                  <span className="text-slate-600 font-semibold">{closedRFQs.length} Awarded ({closedRfqPct}%)</span>
                </div>
              </div>

              {/* Pipeline Details */}
              <div className="mt-4 space-y-3">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Registered Hospital Vendors:</span>
                    <strong className="text-slate-900 font-mono">{vendors.length} AMC Partners</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Quotation Submissions Logged:</span>
                    <strong className="text-slate-900 font-mono">{quotations.length} Bids</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Compliance Checked Quotes:</span>
                    <strong className="text-emerald-700 font-mono">100% DHA/DM Validated</strong>
                  </div>
                </div>

                {/* Domain Efficiency Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Hard FM Compliance Rate:</span>
                    <span className="font-bold text-sky-700 font-mono">{hardFMCompliancePct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div style={{ width: `${hardFMCompliancePct}%` }} className="h-full bg-sky-500 rounded-full"></div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Soft FM Compliance Rate:</span>
                    <span className="font-bold text-teal-700 font-mono">{softFMCompliancePct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div style={{ width: `${softFMCompliancePct}%` }} className="h-full bg-teal-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('quotations')}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare Quotations &amp; Savings</span>
            </button>
          </div>
        </div>
      </div>

      {/* TWO COLUMN SECTION: URGENT COMPLIANCE ALERTS & SERVICE DOMAINS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Action Center (Overdue & Immediate attention) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <h3 className="font-bold text-slate-800 text-base">
                  Hospital Priority Attention &amp; Overdue PPMs
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {overdueTasks.length} Overdue / {pendingTasks.length} Pending
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {overdueTasks.length === 0 && pendingTasks.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm">All hospital preventive maintenance tasks are currently up-to-date.</p>
                </div>
              ) : (
                [...overdueTasks, ...pendingTasks.slice(0, 4)].map((task) => (
                  <div key={task.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          task.status === 'overdue' 
                            ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {task.status === 'overdue' ? 'OVERDUE' : 'DUE SOON'}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 font-mono">
                          {task.code}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {task.complianceBody}
                        </span>
                        <span className="text-xs text-purple-700 font-medium">
                          {task.location}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-sm">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-3">
                        <span>Vendor: <strong>{task.assignedVendor}</strong></span>
                        <span>•</span>
                        <span>Due: <strong className={task.status === 'overdue' ? 'text-rose-600' : 'text-slate-700'}>{task.dueDate}</strong></span>
                        {task.costAED && (
                          <>
                            <span>•</span>
                            <span className="text-slate-600">AED {task.costAED.toLocaleString()}</span>
                          </>
                        )}
                      </p>
                      {task.technicianNotes && (
                        <p className="text-xs text-slate-600 italic bg-slate-50 p-1.5 rounded border border-slate-100 mt-1">
                          Note: {task.technicianNotes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mark Completed
                      </button>
                      <button
                        onClick={() => onNavigateTab('ppm')}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={() => onNavigateTab('ppm')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
              >
                View Complete Hospital PPM Schedule ({tasks.length} Total Tasks)
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Environmental Air & Water Alert Module */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-slate-800 text-sm">
                  Dubai Air &amp; Water Quality Compliance Health
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('testing')}
                className="text-xs text-sky-700 hover:underline font-semibold"
              >
                Open Testing Suite &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Air Test Summary Card */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-teal-600" />
                    Indoor Air &amp; OT Pressures
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                    nonCompliantAir.length > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {nonCompliantAir.length > 0 ? `${nonCompliantAir.length} Requires Calibration` : 'All OTs Compliant'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {airTests.length} monitored sterile &amp; isolation spaces. Includes Positive Pressure OTs (+15 Pa) &amp; Negative Pressure AIIR (-2.5 Pa).
                </p>
                {nonCompliantAir.length > 0 && (
                  <div className="text-xs bg-rose-50 border border-rose-200 p-2 rounded text-rose-900 font-medium">
                    ⚠️ {nonCompliantAir[0].roomName}: Pressure {nonCompliantAir[0].differentialPressurePa} Pa (Req: &gt;+{nonCompliantAir[0].requiredPressureMin} Pa). HEPA DOP leak detected!
                  </div>
                )}
              </div>

              {/* Water Test Summary Card */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-600" />
                    Water &amp; Legionella Safety
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                    nonCompliantWater.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {nonCompliantWater.length > 0 ? `${nonCompliantWater.length} Action Notice` : 'All Tested Pure'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Dialysis RO plant purity (AAMI &lt; 0.25 EU/ml) &amp; Dubai Municipality Order 11 Legionella surveillance.
                </p>
                {nonCompliantWater.length > 0 && (
                  <div className="text-xs bg-amber-50 border border-amber-200 p-2 rounded text-amber-900 font-medium">
                    ⚠️ {nonCompliantWater[0].sampleLocation}: {nonCompliantWater[0].resultValue}. Shock chlorination in progress.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Dubai FM Services Scope & Quotation Pipeline */}
        <div className="space-y-4">
          {/* Services Scope breakdown (Hard vs Soft FM) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Hospital FM Services Under AGM
            </h3>
            <p className="text-xs text-slate-500">
              Overview of technical systems &amp; support contracts under your supervision:
            </p>

            <div className="space-y-3">
              {/* Hard FM Bar */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Hard FM (Technical &amp; Life Safety)
                  </span>
                  <span>{hardFMCompliancePct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all" 
                    style={{ width: `${hardFMCompliancePct}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Chillers, AHUs, Medical Gas (MGPS), Diesel Generators, DCD Hassantuk, RO Water.
                </p>
              </div>

              {/* Soft FM Bar */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-teal-600" />
                    Soft FM (Hygiene &amp; Support)
                  </span>
                  <span>{softFMCompliancePct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-600 rounded-full transition-all" 
                    style={{ width: `${softFMCompliancePct}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Biomedical Sharps &amp; Waste, Hospital Pest Control, Terminal Decontamination, Linen.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigateTab('vendors')}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                View Approved Dubai Vendors Folder ({vendors.length})
              </button>
            </div>
          </div>

          {/* Quotations Auto-Match Quick Spotlight */}
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-sm text-white">Quotation Auto-Matcher</h4>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE RFQs
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Multi-vendor quotation comparison engine. Evaluates L1 price, warranty, lead time &amp; DHA compliance automatically.
            </p>

            <div className="space-y-2">
              {activeRFQs.slice(0, 2).map((rfq) => {
                const rfqQuotes = quotations.filter(q => q.rfqId === rfq.id);
                return (
                  <div 
                    key={rfq.id} 
                    onClick={() => {
                      onSelectRFQ(rfq.id);
                      onNavigateTab('quotations');
                    }}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-300 truncate max-w-[180px]">
                        {rfq.title}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        AED {rfq.budgetAED.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{rfqQuotes.length} Vendor Quotes In</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        Compare Now &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigateTab('quotations')}
              className="w-full py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-colors shadow-sm"
            >
              Open Quotation Comparison Engine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
