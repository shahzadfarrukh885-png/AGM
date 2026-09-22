import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  Users, 
  Wrench, 
  FileCheck, 
  Tag, 
  Wind, 
  Scale, 
  Briefcase, 
  LayoutDashboard, 
  BookOpen, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  ExternalLink,
  Layers,
  ArrowUpRight,
  HardDrive
} from 'lucide-react';
import { 
  PPMTask, 
  AirQualityRecord, 
  WaterQualityRecord, 
  Vendor, 
  RFQ, 
  VendorQuotation, 
  HospitalAsset, 
  StaffMember 
} from '../types.ts';

interface DesktopFolderViewProps {
  tasks: PPMTask[];
  airTests: AirQualityRecord[];
  waterTests: WaterQualityRecord[];
  vendors: Vendor[];
  rfqs: RFQ[];
  quotations: VendorQuotation[];
  assets: HospitalAsset[];
  staffList: StaffMember[];
  hospitalServicesCount: number;
  onOpenModule: (tab: string, filter?: string) => void;
  onOpenRegulations: () => void;
}

export const DesktopFolderView: React.FC<DesktopFolderViewProps> = ({
  tasks,
  airTests,
  waterTests,
  vendors,
  rfqs,
  quotations,
  assets,
  staffList,
  hospitalServicesCount,
  onOpenModule,
  onOpenRegulations
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'maintenance' | 'compliance' | 'vendors' | 'admin'>('all');

  // Compute key stats for badges
  const overdueTasksCount = tasks.filter(t => t.status === 'overdue').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;
  const activeRfqsCount = rfqs.filter(r => r.status === 'Comparing Quotes' || r.status === 'Open for Bids').length;

  // Define desktop folders
  const desktopFolders = [
    {
      id: 'contractors',
      title: 'Contractors Folder',
      subtitle: 'Vendor Directory & Contracts',
      badgeLabel: 'Commercial & SLA',
      category: 'vendors',
      tabKey: 'vendors',
      icon: FolderOpen,
      iconColor: 'text-amber-600',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      folderBg: 'from-amber-400 to-amber-500',
      folderShadow: 'shadow-amber-500/20',
      tag: `${vendors.length} Vendors Registered`,
      description: 'Trade licenses, 24/7 emergency SLA contacts, AMC contract terms, and specialized healthcare contractors.',
      statsText: `${vendors.filter(v => v.rating >= 4.5).length} Verified Partners`
    },
    {
      id: 'attendance',
      title: 'Staff Attendance & Roster',
      subtitle: '30-Day Shift Schedules',
      badgeLabel: 'Workforce Operations',
      category: 'admin',
      tabKey: 'attendance',
      icon: Users,
      iconColor: 'text-indigo-600',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      folderBg: 'from-indigo-500 to-indigo-600',
      folderShadow: 'shadow-indigo-500/20',
      tag: `${staffList.length} Team Members`,
      description: 'Morning, Evening, and Night duty roster, technician leave tracking, and daily presence log.',
      statsText: '30-Day Live Roster'
    },
    {
      id: 'services',
      title: 'FM Services Scope',
      subtitle: 'DHA & JCI Responsibilities',
      badgeLabel: 'Statutory Scope',
      category: 'admin',
      tabKey: 'services',
      icon: Briefcase,
      iconColor: 'text-sky-600',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
      folderBg: 'from-sky-400 to-sky-600',
      folderShadow: 'shadow-sky-500/20',
      tag: `${hospitalServicesCount} Core Scopes`,
      description: 'DHA Hospital Facility Manager scope: Hard FM, Soft FM, Biomedical interfaces, and Life Safety.',
      statsText: '100% DHA Scope'
    },
    {
      id: 'ppm',
      title: 'PPM & Maintenance',
      subtitle: 'Preventive Work Orders',
      badgeLabel: 'Engineering & Plants',
      category: 'maintenance',
      tabKey: 'ppm',
      icon: Wrench,
      iconColor: 'text-teal-600',
      badgeColor: overdueTasksCount > 0 ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-teal-100 text-teal-900 border-teal-300',
      folderBg: 'from-teal-400 to-teal-600',
      folderShadow: 'shadow-teal-500/20',
      tag: overdueTasksCount > 0 ? `${overdueTasksCount} Overdue Tasks` : `${tasks.length} Active Tasks`,
      description: 'HVAC Chillers, AHUs, Medical Gas MGPS, Life Safety DCD, and Electrical UPS schedules.',
      statsText: `${pendingTasksCount} Pending Actions`
    },
    {
      id: 'assets',
      title: 'Asset List & Tagging',
      subtitle: 'Hospital Equipment & QR Tags',
      badgeLabel: 'Facility Registry',
      category: 'maintenance',
      tabKey: 'assets',
      icon: Tag,
      iconColor: 'text-emerald-600',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      folderBg: 'from-emerald-400 to-emerald-600',
      folderShadow: 'shadow-emerald-500/20',
      tag: `${assets.length} Tagged Assets`,
      description: 'Physical barcodes, equipment serials, warranty dates, location zones, and critical plant registry.',
      statsText: 'Cloud Synchronized'
    },
    {
      id: 'testing',
      title: 'Air & Water Testing',
      subtitle: 'OT Hygiene & Legionella',
      badgeLabel: 'Environmental Safety',
      category: 'compliance',
      tabKey: 'testing',
      icon: Wind,
      iconColor: 'text-cyan-600',
      badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
      folderBg: 'from-cyan-400 to-blue-500',
      folderShadow: 'shadow-cyan-500/20',
      tag: `${airTests.length + waterTests.length} Total Reports`,
      description: 'Operating Theatre particle counts, Laminar airflow velocity, potable water, and RO hemodialysis logs.',
      statsText: 'DHA / DM Certified'
    },
    {
      id: 'inspection',
      title: 'DHA & JCI Inspection Dossier',
      subtitle: '1-Click Audit Readiness Binder',
      badgeLabel: 'Auditor Ready',
      category: 'compliance',
      tabKey: 'inspection',
      icon: FileCheck,
      iconColor: 'text-emerald-700',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      folderBg: 'from-emerald-500 to-teal-700',
      folderShadow: 'shadow-emerald-600/30',
      tag: '100% Compliant Binder',
      description: 'Instant regulatory dossier: particle certs, Hassantuk DCD link, chiller logs, and water tests.',
      statsText: '1-Click Export Ready'
    },
    {
      id: 'quotations',
      title: 'Quotations & Auto-Match',
      subtitle: 'Vendor RFQs & AI Comparison',
      badgeLabel: 'Procurement & Bids',
      category: 'vendors',
      tabKey: 'quotations',
      icon: Scale,
      iconColor: 'text-violet-600',
      badgeColor: 'bg-violet-100 text-violet-900 border-violet-300',
      folderBg: 'from-violet-400 to-purple-600',
      folderShadow: 'shadow-violet-500/20',
      tag: `${activeRfqsCount} Open RFQs`,
      description: 'Line-by-line price comparisons, scope auto-matching, variance analysis, and award recommendations.',
      statsText: `${quotations.length} Received Quotes`
    },
    {
      id: 'dashboard',
      title: 'Facility Operations Overview',
      subtitle: 'Command Center & Stats',
      badgeLabel: 'Executive Analytics',
      category: 'admin',
      tabKey: 'dashboard',
      icon: LayoutDashboard,
      iconColor: 'text-slate-700',
      badgeColor: 'bg-slate-100 text-slate-900 border-slate-300',
      folderBg: 'from-slate-600 to-slate-800',
      folderShadow: 'shadow-slate-600/20',
      tag: 'Full Analytical View',
      description: 'Comprehensive hospital operations summary with real-time graphs, KPI cards, and compliance bars.',
      statsText: 'Live Health Status'
    },
    {
      id: 'regulations',
      title: 'Dubai Healthcare Regulations',
      subtitle: 'DHA, DM & DCD Standards Guide',
      badgeLabel: 'Statutory Guidelines',
      category: 'compliance',
      tabKey: 'modal-regulations',
      icon: BookOpen,
      iconColor: 'text-rose-600',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      folderBg: 'from-rose-400 to-red-600',
      folderShadow: 'shadow-rose-500/20',
      tag: 'Statutory Standards',
      description: 'Official inspection checklists, Dubai Municipality water standards, and Hassantuk fire safety rules.',
      statsText: 'Regulatory Guide'
    }
  ];

  // Filter folders
  const filteredFolders = desktopFolders.filter(folder => {
    const matchesCategory = selectedCategory === 'all' || folder.category === selectedCategory;
    const matchesSearch = 
      folder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.badgeLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFolderClick = (tabKey: string) => {
    if (tabKey === 'modal-regulations') {
      onOpenRegulations();
    } else {
      onOpenModule(tabKey);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Clean Desktop Header & Filter Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>AGM Hospital Desktop</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Command Workspace
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access hospital facility modules as organized desktop folders. Click any folder to inspect and manage:
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search folders or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Folders ({desktopFolders.length})
            </button>
            <button
              onClick={() => setSelectedCategory('vendors')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedCategory === 'vendors'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contractors
            </button>
            <button
              onClick={() => setSelectedCategory('maintenance')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedCategory === 'maintenance'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Maintenance
            </button>
            <button
              onClick={() => setSelectedCategory('compliance')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedCategory === 'compliance'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              DHA Compliance
            </button>
          </div>
        </div>
      </div>

      {/* Main Desktop Folder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredFolders.map((folder) => {
          const IconComp = folder.icon;

          return (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder.tabKey)}
              className="group relative bg-white hover:bg-slate-50/90 rounded-2xl p-5 border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Gradient Bar on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent group-hover:via-emerald-500 transition-all opacity-0 group-hover:opacity-100" />

              <div>
                {/* Folder Top Row: Realistic Desktop Folder Icon & Status Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  {/* Desktop Folder Graphic */}
                  <div className="relative">
                    {/* Folder Tab (Backing) */}
                    <div className={`w-8 h-3 rounded-t-md bg-gradient-to-r ${folder.folderBg} opacity-80 mb-[-2px] ml-1`} />
                    {/* Folder Main Body */}
                    <div className={`w-14 h-12 rounded-xl bg-gradient-to-br ${folder.folderBg} flex items-center justify-center shadow-md ${folder.folderShadow} group-hover:scale-105 transition-transform duration-200`}>
                      <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30">
                        <IconComp className="w-4.5 h-4.5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Badges / Item Count */}
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${folder.badgeColor} shadow-2xs`}>
                      {folder.tag}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                      <span>{folder.statsText}</span>
                    </span>
                  </div>
                </div>

                {/* Folder Labels & Titles */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight flex items-center gap-1.5">
                      <span>{folder.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-slate-600">{folder.subtitle}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold uppercase tracking-wider">{folder.badgeLabel}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {folder.description}
                  </p>
                </div>
              </div>

              {/* Bottom Quick-Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 group-hover:text-slate-900">
                <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-700">
                  Click to open folder
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 group-hover:underline">
                  <span>Open Folder</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clean Bottom Executive Quick Summary Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>AGM Hospital Executive Facility Command Center</span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-1.5 py-0.2 rounded">
                DHA READY
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Clean modular layout: All facility operations and specialized contractor binders organized above.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => onOpenModule('inspection')}
            className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>1-Click Inspection Dossier</span>
          </button>

          <button
            onClick={() => onOpenModule('dashboard')}
            className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
            <span>Detailed KPI Charts</span>
          </button>
        </div>
      </div>
    </div>
  );
};
