import React, { useState } from 'react';
import { PPMTask, ServiceDomain, HospitalZone, Frequency, Vendor } from '../types.ts';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Activity, 
  FileText, 
  X,
  Building,
  Wrench,
  Sparkles
} from 'lucide-react';

interface PpmSchedulerViewProps {
  tasks: PPMTask[];
  vendors: Vendor[];
  initialFilter?: string;
  onUpdateTaskStatus: (taskId: string, newStatus: PPMTask['status']) => void;
  onAddTask: (newTask: Omit<PPMTask, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const PpmSchedulerView: React.FC<PpmSchedulerViewProps> = ({
  tasks,
  vendors,
  initialFilter,
  onUpdateTaskStatus,
  onAddTask,
  onDeleteTask
}) => {
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter || 'all');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [formTitle, setFormTitle] = useState('');
  const [formCode, setFormCode] = useState(`PPM-H-${Math.floor(100 + Math.random() * 900)}`);
  const [formDomain, setFormDomain] = useState<ServiceDomain>('Hard FM');
  const [formCategory, setFormCategory] = useState<PPMTask['category']>('HVAC & Chillers');
  const [formEquipment, setFormEquipment] = useState('');
  const [formAssetTag, setFormAssetTag] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formZone, setFormZone] = useState<HospitalZone>('Zone A - Critical (OT / ICU / Dialysis / MGPS)');
  const [formFrequency, setFormFrequency] = useState<Frequency>('Monthly');
  const [formDueDate, setFormDueDate] = useState('2026-09-25');
  const [formCompliance, setFormCompliance] = useState<PPMTask['complianceBody']>('DHA');
  const [formVendor, setFormVendor] = useState(vendors[0]?.name || 'Gulf Medical Gas LLC');
  const [formCost, setFormCost] = useState(2500);
  const [formNotes, setFormNotes] = useState('');

  // Filter logic
  const filteredTasks = tasks.filter(task => {
    // Search match
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = 
        task.title.toLowerCase().includes(q) ||
        task.code.toLowerCase().includes(q) ||
        task.equipment.toLowerCase().includes(q) ||
        task.location.toLowerCase().includes(q) ||
        task.assignedVendor.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Status filter
    if (statusFilter === 'overdue' && task.status !== 'overdue') return false;
    if (statusFilter === 'pending' && task.status !== 'pending') return false;
    if (statusFilter === 'in-progress' && task.status !== 'in-progress') return false;
    if (statusFilter === 'completed' && task.status !== 'completed') return false;
    if (statusFilter === 'next7days') {
      const today = new Date('2026-09-20');
      const in7 = new Date('2026-09-27');
      const d = new Date(task.dueDate);
      if (d < today || d > in7 || task.status === 'completed') return false;
    }
    if (statusFilter === 'zoneA' && !task.zone.includes('Zone A')) return false;

    // Domain filter
    if (domainFilter !== 'all' && task.domain !== domainFilter) return false;

    // Zone filter
    if (zoneFilter !== 'all' && !task.zone.includes(zoneFilter)) return false;

    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formEquipment) return;

    onAddTask({
      code: formCode,
      title: formTitle,
      domain: formDomain,
      category: formCategory,
      equipment: formEquipment,
      assetTag: formAssetTag || `AST-${Math.floor(1000 + Math.random() * 9000)}`,
      location: formLocation,
      zone: formZone,
      frequency: formFrequency,
      dueDate: formDueDate,
      status: 'pending',
      complianceBody: formCompliance,
      assignedVendor: formVendor,
      costAED: Number(formCost),
      lastServiceDate: '2026-08-20',
      technicianNotes: formNotes,
      criticality: formZone.includes('Zone A') ? 'High' : 'Medium'
    });

    setIsAddModalOpen(false);
    // Reset
    setFormTitle('');
    setFormEquipment('');
    setFormLocation('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Add Task CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-600" />
            Hospital PPM &amp; Work Orders Scheduler
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Planned Preventive Maintenance for Hard FM (MGPS, HVAC, Electrical, Fire) &amp; Soft FM (Waste, Pest Control, Cleaning)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Schedule New Hospital PPM
          </button>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        {/* Quick status buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === 'all' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Tasks ({tasks.length})
          </button>

          <button
            onClick={() => setStatusFilter('overdue')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              statusFilter === 'overdue' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Overdue ({tasks.filter(t => t.status === 'overdue').length})
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              statusFilter === 'pending' 
                ? 'bg-amber-500 text-white shadow-sm' 
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending ({tasks.filter(t => t.status === 'pending').length})
          </button>

          <button
            onClick={() => setStatusFilter('next7days')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              statusFilter === 'next7days' 
                ? 'bg-sky-600 text-white shadow-sm' 
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Next 7 Days
          </button>

          <button
            onClick={() => setStatusFilter('zoneA')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              statusFilter === 'zoneA' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Critical Zone A (OT/ICU)
          </button>

          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              statusFilter === 'completed' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed ({tasks.filter(t => t.status === 'completed').length})
          </button>
        </div>

        {/* Secondary Filters row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search equipment, code, vendor, or zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Domain:</span>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
            >
              <option value="all">All FM Domains</option>
              <option value="Hard FM">Hard FM (Mechanical / Electrical)</option>
              <option value="Soft FM">Soft FM (Waste / Pest / Cleaning)</option>
              <option value="Environmental & Testing">Environmental &amp; Testing (Air/Water)</option>
              <option value="Life Safety & DCD">Life Safety &amp; DCD Fire</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Zone:</span>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
            >
              <option value="all">All Hospital Zones</option>
              <option value="Zone A">Zone A - Critical (OT / ICU / Dialysis)</option>
              <option value="Zone B">Zone B - Inpatient &amp; Clinical Wards</option>
              <option value="Zone C">Zone C - General &amp; Public</option>
            </select>
          </div>
        </div>
      </div>

      {/* PPM Tasks Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Displaying {filteredTasks.length} Scheduled Hospital Maintenance Tasks
          </span>
          <span className="text-xs text-slate-400">
            Click Status to Toggle
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Clock className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-600">No tasks match your active filters.</p>
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setDomainFilter('all');
                  setZoneFilter('all');
                  setSearchTerm('');
                }}
                className="text-xs text-emerald-600 hover:underline font-semibold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Pill */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      task.status === 'overdue' 
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : task.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : task.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {task.status}
                    </span>

                    <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      {task.code}
                    </span>

                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {task.category}
                    </span>

                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      task.zone.includes('Zone A') ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {task.zone.split(' - ')[0]}
                    </span>

                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      {task.complianceBody}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm md:text-base">
                    {task.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-slate-500 pt-1">
                    <div>
                      <span className="text-slate-400 block">Equipment:</span>
                      <strong className="text-slate-700">{task.equipment}</strong> ({task.assetTag})
                    </div>
                    <div>
                      <span className="text-slate-400 block">Location:</span>
                      <span className="text-slate-700 font-medium">{task.location}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Assigned Contractor:</span>
                      <span className="text-slate-700 font-medium">{task.assignedVendor}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Frequency &amp; Due:</span>
                      <span className="font-semibold text-slate-800">{task.frequency}</span> • Due: <strong className={task.status === 'overdue' ? 'text-rose-600 font-bold' : 'text-slate-700'}>{task.dueDate}</strong>
                    </div>
                  </div>

                  {task.technicianNotes && (
                    <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200/80 p-2 rounded-lg mt-1">
                      <strong>Instructions:</strong> {task.technicianNotes}
                    </div>
                  )}
                </div>

                {/* Status Switcher & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Cost Allocation</span>
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      AED {task.costAED?.toLocaleString() || 'AMC Covered'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {task.status !== 'completed' ? (
                      <button
                        onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1 transition-colors"
                        title="Mark as done"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateTaskStatus(task.id, 'pending')}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Re-open task"
                      >
                        Re-open
                      </button>
                    )}

                    {task.status === 'pending' && (
                      <button
                        onClick={() => onUpdateTaskStatus(task.id, 'in-progress')}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                      >
                        Start
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete task"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add New Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Schedule New Hospital PPM Task
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Quarterly HEPA Filter Particle Validation OT 1-4"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    value={formEquipment}
                    onChange={(e) => setFormEquipment(e.target.value)}
                    placeholder="e.g. AHU-OT-3 Hygienic Air Handler"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Domain</label>
                  <select
                    value={formDomain}
                    onChange={(e) => setFormDomain(e.target.value as ServiceDomain)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Hard FM">Hard FM (HVAC, Electrical, Plumbing, MGPS)</option>
                    <option value="Soft FM">Soft FM (Waste, Pest, Cleaning)</option>
                    <option value="Environmental & Testing">Environmental &amp; Testing (Air/Water)</option>
                    <option value="Life Safety & DCD">Life Safety &amp; DCD Fire</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as PPMTask['category'])}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="HVAC & Chillers">HVAC &amp; Chillers</option>
                    <option value="Medical Gas (MGPS)">Medical Gas (MGPS)</option>
                    <option value="Electrical & UPS">Electrical &amp; UPS / Gensets</option>
                    <option value="Water Treatment">Water Treatment &amp; RO</option>
                    <option value="Air Quality & Pressure">Air Quality &amp; Pressure Validation</option>
                    <option value="Bio-Waste & Sharps">Bio-Waste &amp; Sharps</option>
                    <option value="Pest Control">Specialized Hospital Pest Control</option>
                    <option value="Fire & Life Safety">Fire &amp; Life Safety (DCD)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hospital Zone</label>
                  <select
                    value={formZone}
                    onChange={(e) => setFormZone(e.target.value as HospitalZone)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Zone A - Critical (OT / ICU / Dialysis / MGPS)">Zone A - Critical (OT, ICU, MGPS, Dialysis)</option>
                    <option value="Zone B - Inpatient & Clinical Wards">Zone B - Inpatient Wards &amp; Clinics</option>
                    <option value="Zone C - General & Public Services">Zone C - General Administration &amp; Public</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / Room</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. 3rd Floor Surgical Suite Plant Deck"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Frequency</label>
                  <select
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value as Frequency)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Semi-Annual">Semi-Annual</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Vendor / Contractor</label>
                  <select
                    value={formVendor}
                    onChange={(e) => setFormVendor(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {vendors.map(v => (
                      <option key={v.id} value={v.name}>{v.name} ({v.tradeCategory})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Compliance Body</label>
                  <select
                    value={formCompliance}
                    onChange={(e) => setFormCompliance(e.target.value as PPMTask['complianceBody'])}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="DHA">DHA (Dubai Health Authority)</option>
                    <option value="Dubai Municipality">Dubai Municipality (DM)</option>
                    <option value="Dubai Civil Defence (DCD)">Dubai Civil Defence (DCD)</option>
                    <option value="JCI">JCI FMS Standards</option>
                    <option value="Internal SOP">Hospital Internal SOP</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cost Allocation (AED)</label>
                  <input
                    type="number"
                    value={formCost}
                    onChange={(e) => setFormCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Asset Tag ID</label>
                  <input
                    type="text"
                    value={formAssetTag}
                    onChange={(e) => setFormAssetTag(e.target.value)}
                    placeholder="e.g. AST-HVAC-102"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technician Scope &amp; Instructions</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Specific test requirements, pressure limits, safety SOPs..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                >
                  Add to PPM Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
