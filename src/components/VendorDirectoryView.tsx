import React, { useState, useMemo } from 'react';
import { Vendor } from '../types.ts';
import { 
  Building2, 
  Plus, 
  Search, 
  Phone, 
  PhoneCall, 
  Mail, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Star, 
  Clock, 
  X, 
  CheckCircle2, 
  FolderOpen, 
  Calendar, 
  CreditCard, 
  Edit3, 
  Trash2, 
  Filter, 
  ExternalLink, 
  DollarSign, 
  CalendarRange, 
  Briefcase, 
  TrendingUp, 
  CloudCheck, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

interface VendorDirectoryViewProps {
  vendors: Vendor[];
  onAddVendor: (vendor: Omit<Vendor, 'id'>) => void;
  onUpdateVendor: (vendor: Vendor) => void;
  onDeleteVendor: (vendorId: string) => void;
  isCloudConnected?: boolean;
}

export const VendorDirectoryView: React.FC<VendorDirectoryViewProps> = ({
  vendors,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor,
  isCloudConnected = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'folder_grid' | 'contract_table'>('contract_table');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [selectedVendorForDocs, setSelectedVendorForDocs] = useState<Vendor | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [tradeCategory, setTradeCategory] = useState<Vendor['tradeCategory']>('HVAC & Refrigeration');
  const [contractStartDate, setContractStartDate] = useState('2026-01-01');
  const [contractEndDate, setContractEndDate] = useState('2027-01-01');
  const [contractDuration, setContractDuration] = useState<Vendor['contractDuration']>('1 Year');
  const [paymentTerms, setPaymentTerms] = useState<Vendor['paymentTerms']>('30 Days Credit');
  const [contractValueAED, setContractValueAED] = useState<number>(50000);
  const [billingCycleNotes, setBillingCycleNotes] = useState('');
  const [tradeLicenseNo, setTradeLicenseNo] = useState('');
  const [tradeLicenseExpiry, setTradeLicenseExpiry] = useState('2027-06-30');
  const [dmDhaApprovalNo, setDmDhaApprovalNo] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [designation, setDesignation] = useState('Contract Manager');
  const [phone, setPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Dubai, UAE');
  const [slaHours, setSlaHours] = useState(2);
  const [notes, setNotes] = useState('');
  const [activeAmcStatus, setActiveAmcStatus] = useState<Vendor['activeAmcStatus']>('Active Contract');

  // Open modal for new contractor
  const handleOpenAddModal = () => {
    setEditingVendor(null);
    setName('');
    setTradeCategory('HVAC & Refrigeration');
    setContractStartDate(new Date().toISOString().split('T')[0]);
    // default 1 year ahead
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setContractEndDate(nextYear.toISOString().split('T')[0]);
    setContractDuration('1 Year');
    setPaymentTerms('30 Days Credit');
    setContractValueAED(60000);
    setBillingCycleNotes('Invoices payable net 30 days upon Hospital FM sign-off');
    setTradeLicenseNo('');
    setTradeLicenseExpiry('2027-12-31');
    setDmDhaApprovalNo('');
    setContactPerson('');
    setDesignation('Technical Director / Account Lead');
    setPhone('');
    setEmergencyPhone('');
    setEmail('');
    setAddress('Al Quoz / DSO, Dubai, UAE');
    setSlaHours(2);
    setNotes('DHA & Dubai Municipality authorized healthcare contractor.');
    setActiveAmcStatus('Active Contract');
    setIsModalOpen(true);
  };

  // Open modal for editing contractor
  const handleOpenEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setName(vendor.name);
    setTradeCategory(vendor.tradeCategory);
    setContractStartDate(vendor.contractStartDate || '2026-01-01');
    setContractEndDate(vendor.contractEndDate || vendor.amcExpiryDate || '2027-01-01');
    setContractDuration(vendor.contractDuration || '1 Year');
    setPaymentTerms(vendor.paymentTerms || '30 Days Credit');
    setContractValueAED(vendor.contractValueAED || 0);
    setBillingCycleNotes(vendor.billingCycleNotes || '');
    setTradeLicenseNo(vendor.tradeLicenseNo || '');
    setTradeLicenseExpiry(vendor.tradeLicenseExpiry || '2027-06-30');
    setDmDhaApprovalNo(vendor.dmDhaApprovalNo || '');
    setContactPerson(vendor.contactPerson || '');
    setDesignation(vendor.designation || 'Account Director');
    setPhone(vendor.phone || '');
    setEmergencyPhone(vendor.emergencyHotline24x7 || '');
    setEmail(vendor.email || '');
    setAddress(vendor.officeAddress || 'Dubai, UAE');
    setSlaHours(vendor.slaResponseTimeHours || 2);
    setNotes(vendor.notes || '');
    setActiveAmcStatus(vendor.activeAmcStatus || 'Active Contract');
    setIsModalOpen(true);
  };

  // Auto calculate duration if start & end date changed
  const handleStartDateChange = (val: string) => {
    setContractStartDate(val);
    if (val && contractEndDate) {
      const d1 = new Date(val);
      const d2 = new Date(contractEndDate);
      const diffMonths = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
      if (diffMonths >= 22 && diffMonths <= 26) {
        setContractDuration('2 Years');
      } else if (diffMonths >= 34) {
        setContractDuration('3 Years');
      } else if (diffMonths >= 10 && diffMonths <= 14) {
        setContractDuration('1 Year');
      } else if (diffMonths <= 7) {
        setContractDuration('6 Months');
      } else {
        setContractDuration('Custom');
      }
    }
  };

  const handleEndDateChange = (val: string) => {
    setContractEndDate(val);
    if (contractStartDate && val) {
      const d1 = new Date(contractStartDate);
      const d2 = new Date(val);
      const diffMonths = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
      if (diffMonths >= 22 && diffMonths <= 26) {
        setContractDuration('2 Years');
      } else if (diffMonths >= 34) {
        setContractDuration('3 Years');
      } else if (diffMonths >= 10 && diffMonths <= 14) {
        setContractDuration('1 Year');
      } else if (diffMonths <= 7) {
        setContractDuration('6 Months');
      } else {
        setContractDuration('Custom');
      }
    }
  };

  const handleDurationPreset = (dur: Vendor['contractDuration']) => {
    setContractDuration(dur);
    if (contractStartDate) {
      const d = new Date(contractStartDate);
      if (dur === '1 Year') {
        d.setFullYear(d.getFullYear() + 1);
        setContractEndDate(d.toISOString().split('T')[0]);
      } else if (dur === '2 Years') {
        d.setFullYear(d.getFullYear() + 2);
        setContractEndDate(d.toISOString().split('T')[0]);
      } else if (dur === '3 Years') {
        d.setFullYear(d.getFullYear() + 3);
        setContractEndDate(d.toISOString().split('T')[0]);
      } else if (dur === '6 Months') {
        d.setMonth(d.getMonth() + 6);
        setContractEndDate(d.toISOString().split('T')[0]);
      }
    }
  };

  // Submit Add or Edit
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    if (editingVendor) {
      // Update existing vendor
      const updated: Vendor = {
        ...editingVendor,
        name,
        tradeCategory,
        contractStartDate,
        contractEndDate,
        contractDuration,
        paymentTerms,
        contractValueAED: Number(contractValueAED) || 0,
        billingCycleNotes,
        tradeLicenseNo: tradeLicenseNo || editingVendor.tradeLicenseNo,
        tradeLicenseExpiry,
        dmDhaApprovalNo: dmDhaApprovalNo || editingVendor.dmDhaApprovalNo,
        contactPerson: contactPerson || editingVendor.contactPerson,
        designation,
        phone,
        emergencyHotline24x7: emergencyPhone || phone,
        email: email || editingVendor.email,
        officeAddress: address,
        activeAmcStatus,
        amcExpiryDate: contractEndDate,
        slaResponseTimeHours: Number(slaHours),
        notes: notes || editingVendor.notes
      };
      onUpdateVendor(updated);
    } else {
      // Add new contractor
      const maxSerial = vendors.reduce((max, v) => Math.max(max, v.serialNumber || 0), 0);
      onAddVendor({
        serialNumber: maxSerial + 1,
        name,
        tradeCategory,
        contractStartDate,
        contractEndDate,
        contractDuration,
        paymentTerms,
        contractValueAED: Number(contractValueAED) || 0,
        billingCycleNotes,
        tradeLicenseNo: tradeLicenseNo || `CN-${Math.floor(1000000 + Math.random() * 9000000)}-DXB`,
        tradeLicenseExpiry,
        dmDhaApprovalNo: dmDhaApprovalNo || `DHA-APPROVED-${Math.floor(100 + Math.random() * 900)}`,
        dhaPermitExpiry: '2027-12-31',
        contactPerson: contactPerson || 'Operations Lead',
        designation: designation || 'Account Director',
        phone,
        emergencyHotline24x7: emergencyPhone || phone,
        email: email || 'info@contractor-dxb.ae',
        officeAddress: address,
        activeAmcStatus: 'Active Contract',
        amcExpiryDate: contractEndDate,
        slaResponseTimeHours: Number(slaHours),
        rating: 4.8,
        documentsCount: 4,
        completedJobsCount: 0,
        notes: notes || 'Hospital facility contractor registered under Dubai Health Authority standards.'
      });
    }

    setIsModalOpen(false);
  };

  // Filtered Contractors
  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      if (selectedTrade !== 'all' && v.tradeCategory !== selectedTrade) return false;
      if (selectedPaymentTerm !== 'all' && v.paymentTerms !== selectedPaymentTerm) return false;
      if (selectedDuration !== 'all' && v.contractDuration !== selectedDuration) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const match = 
          v.name.toLowerCase().includes(q) ||
          v.tradeCategory.toLowerCase().includes(q) ||
          (v.contactPerson && v.contactPerson.toLowerCase().includes(q)) ||
          (v.tradeLicenseNo && v.tradeLicenseNo.toLowerCase().includes(q)) ||
          (v.paymentTerms && v.paymentTerms.toLowerCase().includes(q)) ||
          (v.contractDuration && v.contractDuration.toLowerCase().includes(q)) ||
          (v.notes && v.notes.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [vendors, selectedTrade, selectedPaymentTerm, selectedDuration, searchTerm]);

  // Overall Contract Analytics
  const stats = useMemo(() => {
    const totalVendors = vendors.length;
    const totalContractValue = vendors.reduce((acc, v) => acc + (v.contractValueAED || 0), 0);
    const count30Days = vendors.filter(v => v.paymentTerms?.includes('30 Days')).length;
    const countQuarterly = vendors.filter(v => v.paymentTerms === 'Quarterly').length;
    const countYearly = vendors.filter(v => v.paymentTerms === 'Yearly Advance').length;
    const countMonthly = vendors.filter(v => v.paymentTerms === 'Monthly').length;
    const oneYearContracts = vendors.filter(v => v.contractDuration === '1 Year').length;
    const twoYearContracts = vendors.filter(v => v.contractDuration === '2 Years').length;
    const threeYearContracts = vendors.filter(v => v.contractDuration === '3 Years').length;
    return {
      totalVendors,
      totalContractValue,
      count30Days,
      countQuarterly,
      countYearly,
      countMonthly,
      oneYearContracts,
      twoYearContracts,
      threeYearContracts
    };
  }, [vendors]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Folder Styling & Executive Action */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-3xl text-white shadow-lg border border-slate-700/60 flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
              Hospital AMC Contracts &amp; Contractors Folder
            </span>
            {isCloudConnected && (
              <span className="text-[11px] font-bold text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded-md border border-teal-500/30 flex items-center gap-1">
                <CloudCheck className="w-3.5 h-3.5 text-teal-400" />
                CLOUD SYNCED
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Contractors Master Register &amp; Payment Terms Directory
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hospital Contractors Master Ledger: Serial Number, Contractor Name, Contract Start &amp; End Dates, Duration (1 or 2 Years), and Payment Terms (30 Days Credit, Quarterly, or Yearly Advance). All contract information is synchronized with cloud storage and can be edited directly.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:shadow-emerald-500/25 transition-all"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Add New Contractor</span>
          </button>
        </div>
      </div>

      {/* KPI Financial & Terms Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Total Contractors</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900">{stats.totalVendors}</span>
            <span className="text-[10px] text-slate-500 font-medium">Contractors</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">DHA/DM Registered</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Total Value (AED)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg font-black text-emerald-700">
              AED {(stats.totalContractValue / 1000).toFixed(0)}k
            </span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">Active AMC Commitments</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">30 Days Credit</span>
            <CreditCard className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-sky-700">{stats.count30Days}</span>
            <span className="text-[10px] text-slate-500">Contracts</span>
          </div>
          <div className="mt-1 text-[11px] text-sky-600">30-Day Invoicing</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Quarterly</span>
            <CalendarRange className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-indigo-700">{stats.countQuarterly}</span>
            <span className="text-[10px] text-slate-500">Contracts</span>
          </div>
          <div className="mt-1 text-[11px] text-indigo-600">Quarterly Payments</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Yearly Advance</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-amber-700">{stats.countYearly}</span>
            <span className="text-[10px] text-slate-500">Contracts</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-600">Yearly Advance</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Duration (1 vs 2 Yrs)</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[11px]">{stats.oneYearContracts} x 1Y</span>
            <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-[11px]">{stats.twoYearContracts} x 2Y</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Duration Split</div>
        </div>
      </div>

      {/* Filter and View Mode Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contractor name, payment terms, trade, or license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Trade Filter */}
          <select
            value={selectedTrade}
            onChange={(e) => setSelectedTrade(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
          >
            <option value="all">All Trade Scopes</option>
            <option value="HVAC & Refrigeration">HVAC &amp; Chillers</option>
            <option value="Medical Gas Systems (MGPS)">Medical Gas (MGPS)</option>
            <option value="Water Treatment & Lab">Water Treatment (Legionella)</option>
            <option value="Fire Fighting & Alarm (DCD)">Fire &amp; Safety (DCD)</option>
            <option value="Bio-Waste & Hazardous Disposal">Medical Waste</option>
            <option value="Hospital Pest Control">Pest Control</option>
            <option value="Electrical & Generators">Generators &amp; UPS</option>
          </select>

          {/* Payment Terms Filter */}
          <select
            value={selectedPaymentTerm}
            onChange={(e) => setSelectedPaymentTerm(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
          >
            <option value="all">All Payment Terms</option>
            <option value="30 Days Credit">30 Days Credit / Invoicing</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly Advance">Yearly Advance</option>
            <option value="Monthly">Monthly</option>
            <option value="60 Days PDC">60 Days PDC</option>
          </select>

          {/* Duration Filter */}
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
          >
            <option value="all">All Durations</option>
            <option value="1 Year">1 Year Contract</option>
            <option value="2 Years">2 Years Contract</option>
            <option value="3 Years">3 Years Contract</option>
            <option value="6 Months">6 Months Contract</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50 ml-auto">
            <button
              onClick={() => setViewMode('contract_table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'contract_table'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('folder_grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'folder_grid'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Folder Cards
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: CONTRACT DETAIL TABLE VIEW (EXACTLY AS USER REQUESTED: S.No, Contractor Name, Start Date, End Date, Duration 1Y/2Y, Payment Terms 30D/Quarterly/Yearly, Edit Action) */}
      {viewMode === 'contract_table' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Contractors Master Ledger ({filteredVendors.length} Contractors)
              </h3>
            </div>
            <div className="text-xs text-slate-500">
              Click <strong className="text-emerald-700">"Edit"</strong> to update contract dates, duration, or payment terms
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3.5 px-4 text-center w-16">S.No #</th>
                  <th className="py-3.5 px-4 min-w-[220px]">Contractor Name</th>
                  <th className="py-3.5 px-3 min-w-[150px]">Trade Scope</th>
                  <th className="py-3.5 px-3 min-w-[120px]">Start Date</th>
                  <th className="py-3.5 px-3 min-w-[120px]">End Date</th>
                  <th className="py-3.5 px-3 min-w-[110px]">Duration</th>
                  <th className="py-3.5 px-3 min-w-[160px]">Payment Terms</th>
                  <th className="py-3.5 px-3 min-w-[120px]">Contract Value (AED)</th>
                  <th className="py-3.5 px-3 min-w-[120px]">AMC Status</th>
                  <th className="py-3.5 px-4 text-center min-w-[130px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      No contractors found. Click "Add New Contractor" above to create one.
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor, index) => {
                    const isExpiringSoon = vendor.activeAmcStatus === 'Expiring Soon (<30d)';
                    const serialNumber = vendor.serialNumber || index + 1;

                    return (
                      <tr 
                        key={vendor.id} 
                        className="hover:bg-slate-50/90 transition-colors group"
                      >
                        {/* Serial Number */}
                        <td className="py-3 px-4 text-center font-bold text-slate-900 bg-slate-50/50">
                          <span className="w-7 h-7 rounded-full bg-slate-200/80 text-slate-800 inline-flex items-center justify-center text-xs">
                            {serialNumber}
                          </span>
                        </td>

                        {/* Contractor Name & Contact */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span>{vendor.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>Contact: <strong className="text-slate-700">{vendor.contactPerson}</strong></span>
                            <span>•</span>
                            <span className="font-mono text-slate-600">{vendor.phone}</span>
                          </div>
                        </td>

                        {/* Trade Category */}
                        <td className="py-3 px-3">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {vendor.tradeCategory}
                          </span>
                        </td>

                        {/* Contract Start Date */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 font-mono text-slate-800 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{vendor.contractStartDate || '2026-01-01'}</span>
                          </div>
                        </td>

                        {/* Contract End Date */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 font-mono text-slate-800 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-rose-600" />
                            <span>{vendor.contractEndDate || vendor.amcExpiryDate || '2027-01-01'}</span>
                          </div>
                        </td>

                        {/* Duration (1 Year, 2 Years, etc) */}
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
                            vendor.contractDuration === '2 Years' 
                              ? 'bg-indigo-100 text-indigo-900 border border-indigo-200' 
                              : vendor.contractDuration === '1 Year'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              : 'bg-purple-100 text-purple-900 border border-purple-200'
                          }`}>
                            <Clock className="w-3 h-3" />
                            {vendor.contractDuration || '1 Year'}
                          </span>
                        </td>

                        {/* Payment Terms (30 Days, Quarterly, Yearly) */}
                        <td className="py-3 px-3">
                          <div className="space-y-0.5">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
                              vendor.paymentTerms?.includes('30 Days')
                                ? 'bg-sky-100 text-sky-900 border border-sky-200'
                                : vendor.paymentTerms === 'Quarterly'
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : vendor.paymentTerms === 'Yearly Advance'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                : 'bg-slate-100 text-slate-800 border border-slate-200'
                            }`}>
                              <CreditCard className="w-3 h-3" />
                              {vendor.paymentTerms || '30 Days Credit'}
                            </span>
                            {vendor.billingCycleNotes && (
                              <p className="text-[10px] text-slate-400 truncate max-w-[170px]" title={vendor.billingCycleNotes}>
                                {vendor.billingCycleNotes}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Contract Value in AED */}
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 font-mono">
                            AED {(vendor.contractValueAED || 0).toLocaleString()}
                          </div>
                        </td>

                        {/* AMC Status */}
                        <td className="py-3 px-3">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            isExpiringSoon
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isExpiringSoon ? 'bg-rose-600 animate-ping' : 'bg-emerald-600'}`} />
                            {vendor.activeAmcStatus}
                          </span>
                        </td>

                        {/* Action Buttons: Edit & Documents & Delete */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(vendor)}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors flex items-center gap-1 text-xs font-semibold"
                              title="Edit Contractor Details & Contract Terms"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => setSelectedVendorForDocs(vendor)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="View Attached Contractor Documents"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove contractor ${vendor.name}?`)) {
                                  onDeleteVendor(vendor.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Remove Contractor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: FOLDER CARDS GRID VIEW */}
      {viewMode === 'folder_grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVendors.map((vendor, index) => {
            const serialNumber = vendor.serialNumber || index + 1;
            return (
              <div 
                key={vendor.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between relative group"
              >
                <div className="space-y-3">
                  {/* Top Badge & Serial Number */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        #{serialNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                        {vendor.tradeCategory}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenEditModal(vendor)}
                      className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {vendor.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Contact: <strong className="text-slate-700">{vendor.contactPerson}</strong> ({vendor.designation})
                    </p>
                  </div>

                  {/* Contract Specific Highlights */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Contract Duration:</span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {vendor.contractDuration || '1 Year'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Payment Terms:</span>
                      <span className="font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                        {vendor.paymentTerms || '30 Days Credit'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Contract Schedule:</span>
                      <span className="font-mono text-slate-800 font-semibold text-[11px]">
                        {vendor.contractStartDate || '2026-01-01'} → {vendor.contractEndDate || vendor.amcExpiryDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500 font-medium">Annual Value:</span>
                      <span className="font-black text-slate-900 font-mono">
                        AED {(vendor.contractValueAED || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* License & Dubai Compliance */}
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Trade License:</span>
                      <span className="font-mono font-semibold text-slate-800">{vendor.tradeLicenseNo}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">DHA/DM Permit:</span>
                      <span className="font-mono text-emerald-700 font-semibold">{vendor.dmDhaApprovalNo}</span>
                    </div>
                  </div>

                  {/* Contacts */}
                  <div className="space-y-1 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Office: <strong className="text-slate-800 font-mono">{vendor.phone}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-rose-700 font-semibold bg-rose-50/70 p-1.5 rounded border border-rose-100">
                      <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                      <span>24/7 Hotline: <strong className="font-mono">{vendor.emergencyHotline24x7}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedVendorForDocs(vendor)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium flex items-center gap-1 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>Documents ({vendor.documentsCount})</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete contractor ${vendor.name}?`)) {
                        onDeleteVendor(vendor.id);
                      }
                    }}
                    className="text-rose-500 hover:text-rose-700 p-1.5"
                    title="Delete contractor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT & ADD CONTRACTOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingVendor ? 'Edit Contractor & Contract Terms' : 'Add New Hospital Contractor to Folder'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update contract dates, duration (1 or 2 Years), payment terms (30 Days, Quarterly, Yearly), and Dubai compliance details.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              {/* SECTION 1: CONTRACT DATES & PAYMENT TERMS (CORE REQUEST) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CalendarRange className="w-4 h-4 text-emerald-600" />
                  <span>Contract Dates &amp; Payment Schedule</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Contract Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={contractStartDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Contract End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={contractEndDate}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Duration Picker with 1 Year / 2 Years buttons */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contract Duration (Click to select preset):
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['1 Year', '2 Years', '3 Years', '6 Months'] as Vendor['contractDuration'][]).map((dur) => (
                      <button
                        type="button"
                        key={dur}
                        onClick={() => handleDurationPreset(dur)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                          contractDuration === dur
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Terms (30 Days, Quarterly, Yearly) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Payment Terms *
                    </label>
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value as Vendor['paymentTerms'])}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white font-medium"
                    >
                      <option value="30 Days Credit">30 Days Credit / Invoicing</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Yearly Advance">Yearly Advance</option>
                      <option value="Monthly">Monthly</option>
                      <option value="60 Days PDC">60 Days PDC</option>
                      <option value="Bi-Annual">Bi-Annual</option>
                      <option value="100% Post Completion">100% Post Completion &amp; Signoff</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Contract Value (AED)
                    </label>
                    <input
                      type="number"
                      value={contractValueAED}
                      onChange={(e) => setContractValueAED(Number(e.target.value))}
                      placeholder="e.g. 120000"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Billing &amp; Payment Notes
                  </label>
                  <input
                    type="text"
                    value={billingCycleNotes}
                    onChange={(e) => setBillingCycleNotes(e.target.value)}
                    placeholder="e.g. Invoices submitted after monthly maintenance sign-off and DHA report submittal"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>

              {/* SECTION 2: CONTRACTOR NAME & TRADE CATEGORY */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contractor / Company Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Trane Gulf Chiller Maintenance LLC"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Trade Category *</label>
                    <select
                      value={tradeCategory}
                      onChange={(e) => setTradeCategory(e.target.value as Vendor['tradeCategory'])}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="HVAC & Refrigeration">HVAC &amp; Refrigeration (Chillers)</option>
                      <option value="Medical Gas Systems (MGPS)">Medical Gas Systems (MGPS)</option>
                      <option value="Water Treatment & Lab">Water Treatment &amp; Lab (Legionella)</option>
                      <option value="Fire Fighting & Alarm (DCD)">Fire Fighting &amp; Alarm (DCD)</option>
                      <option value="Bio-Waste & Hazardous Disposal">Bio-Waste &amp; Hazardous Sharps</option>
                      <option value="Hospital Pest Control">Hospital Pest Control (IPM)</option>
                      <option value="Electrical & Generators">Electrical &amp; Generators / UPS</option>
                      <option value="Biomedical & Life Support">Biomedical &amp; Life Support</option>
                      <option value="Building Automation (BMS)">Building Automation (BMS)</option>
                    </select>
                  </div>
                </div>

                {/* Section 3: Contact Person & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. Eng. Tariq Al-Mansoor"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Technical Account Manager"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Office Phone *</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +971 4 347 8820"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Emergency 24/7 Hotline *</label>
                    <input
                      type="text"
                      required
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="e.g. +971 50 882 9911"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. contracts@contractor.ae"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Trade License Number (Dubai / UAE)</label>
                    <input
                      type="text"
                      value={tradeLicenseNo}
                      onChange={(e) => setTradeLicenseNo(e.target.value)}
                      placeholder="e.g. CN-1049281-DXB"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contract &amp; SLA Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter compliance scopes, SLA response requirements, or special notes..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Contractor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENTS FOLDER VIEW MODAL */}
      {selectedVendorForDocs && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-emerald-600" />
                  <span>{selectedVendorForDocs.name}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Digital Contract Dossier &amp; Regulatory Compliance Permits
                </p>
              </div>
              <button 
                onClick={() => setSelectedVendorForDocs(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-bold text-slate-800">Hospital AMC Master Service Agreement</div>
                    <div className="text-[11px] text-slate-500">
                      Duration: {selectedVendorForDocs.contractDuration || '1 Year'} • Terms: {selectedVendorForDocs.paymentTerms || '30 Days'}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Active</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div className="font-bold text-slate-800">Dubai Trade License Copy</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {selectedVendorForDocs.tradeLicenseNo} (Exp: {selectedVendorForDocs.tradeLicenseExpiry})
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">Verified</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <div>
                    <div className="font-bold text-slate-800">DHA / Dubai Municipality Approval Certificate</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {selectedVendorForDocs.dmDhaApprovalNo}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">Compliant</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedVendorForDocs(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Close Folder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
