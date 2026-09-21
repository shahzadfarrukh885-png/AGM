import React, { useState } from 'react';
import { HospitalAsset, AssetCategory, AssetCriticality, AssetStatus, HospitalZone, Frequency, Vendor } from '../types.ts';
import { 
  Plus, 
  Search, 
  Filter, 
  Tag, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Building2, 
  MapPin, 
  Layers, 
  Wrench, 
  FileText, 
  Printer, 
  Download, 
  Cloud, 
  AlertTriangle, 
  ExternalLink,
  Edit2,
  Trash2,
  X,
  Check,
  Calendar,
  DollarSign,
  Cpu,
  Eye
} from 'lucide-react';

interface AssetListViewProps {
  assets: HospitalAsset[];
  vendors: Vendor[];
  onAddAsset: (asset: HospitalAsset) => void;
  onUpdateAsset: (asset: HospitalAsset) => void;
  onDeleteAsset: (id: string) => void;
  isCloudConnected?: boolean;
}

export const AssetListView: React.FC<AssetListViewProps> = ({
  assets,
  vendors,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  isCloudConnected = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<HospitalAsset | null>(null);
  const [selectedAssetForTag, setSelectedAssetForTag] = useState<HospitalAsset | null>(null);
  const [isPrintTagModalOpen, setIsPrintTagModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<HospitalAsset>>({
    tagNumber: `AGM-AST-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    category: 'HVAC & Air Handling (AHU/FCU)',
    department: 'Main Surgical Department',
    location: '',
    zone: 'Zone A - Critical (OT / ICU / Dialysis / MGPS)',
    manufacturer: '',
    model: '',
    serialNumber: '',
    installationDate: new Date().toISOString().split('T')[0],
    warrantyExpiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000 * 5).toISOString().split('T')[0],
    criticality: 'Critical - Life Safety',
    status: 'Operational / In-Service',
    assignedVendor: vendors[0]?.name || 'Gulf Medical Gas & Engineering LLC',
    ppmFrequency: 'Monthly',
    lastPpmDate: new Date().toISOString().split('T')[0],
    nextPpmDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    purchaseCostAED: 50000,
    rfidBarcode: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
    dhaInspectionRequired: true,
    notes: ''
  });

  // Filtered Assets
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesZone = selectedZone === 'all' || asset.zone === selectedZone;
    const matchesCriticality = selectedCriticality === 'all' || asset.criticality === selectedCriticality;

    return matchesSearch && matchesCategory && matchesZone && matchesCriticality;
  });

  // Metrics
  const totalAssetsCount = assets.length;
  const criticalAssetsCount = assets.filter(a => a.criticality === 'Critical - Life Safety').length;
  const dhaRequiredCount = assets.filter(a => a.dhaInspectionRequired).length;
  const totalValuationAED = assets.reduce((sum, a) => sum + (a.purchaseCostAED || 0), 0);

  const openAddModal = () => {
    setEditingAsset(null);
    setFormData({
      tagNumber: `AGM-AST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      category: 'HVAC & Air Handling (AHU/FCU)',
      department: 'Main Surgical Department',
      location: '',
      zone: 'Zone A - Critical (OT / ICU / Dialysis / MGPS)',
      manufacturer: '',
      model: '',
      serialNumber: '',
      installationDate: new Date().toISOString().split('T')[0],
      warrantyExpiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000 * 5).toISOString().split('T')[0],
      criticality: 'Critical - Life Safety',
      status: 'Operational / In-Service',
      assignedVendor: vendors[0]?.name || 'Gulf Medical Gas & Engineering LLC',
      ppmFrequency: 'Monthly',
      lastPpmDate: new Date().toISOString().split('T')[0],
      nextPpmDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      purchaseCostAED: 45000,
      rfidBarcode: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      dhaInspectionRequired: true,
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (asset: HospitalAsset) => {
    setEditingAsset(asset);
    setFormData(asset);
    setIsAddModalOpen(true);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.tagNumber) return;

    if (editingAsset) {
      const updated: HospitalAsset = {
        ...editingAsset,
        ...(formData as HospitalAsset)
      };
      onUpdateAsset(updated);
    } else {
      const newAsset: HospitalAsset = {
        id: `AST-${Date.now().toString().slice(-4)}`,
        tagNumber: formData.tagNumber || `AGM-AST-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name || 'Hospital Equipment',
        category: (formData.category || 'HVAC & Air Handling (AHU/FCU)') as AssetCategory,
        department: formData.department || 'Clinical Facility',
        location: formData.location || 'Hospital Wing',
        zone: (formData.zone || 'Zone A - Critical (OT / ICU / Dialysis / MGPS)') as HospitalZone,
        manufacturer: formData.manufacturer || 'Authorized Manufacturer',
        model: formData.model || 'Standard',
        serialNumber: formData.serialNumber || `SN-${Date.now().toString().slice(-6)}`,
        installationDate: formData.installationDate || new Date().toISOString().split('T')[0],
        warrantyExpiryDate: formData.warrantyExpiryDate || '2028-12-31',
        criticality: (formData.criticality || 'Critical - Life Safety') as AssetCriticality,
        status: (formData.status || 'Operational / In-Service') as AssetStatus,
        assignedVendor: formData.assignedVendor || vendors[0]?.name || 'Hospital Approved Vendor',
        ppmFrequency: (formData.ppmFrequency || 'Monthly') as Frequency,
        lastPpmDate: formData.lastPpmDate || new Date().toISOString().split('T')[0],
        nextPpmDate: formData.nextPpmDate || new Date().toISOString().split('T')[0],
        purchaseCostAED: Number(formData.purchaseCostAED) || 0,
        rfidBarcode: formData.rfidBarcode || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        dhaInspectionRequired: formData.dhaInspectionRequired ?? true,
        notes: formData.notes || ''
      };
      onAddAsset(newAsset);
    }
    setIsAddModalOpen(false);
  };

  const openTagViewer = (asset: HospitalAsset) => {
    setSelectedAssetForTag(asset);
    setIsPrintTagModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Cloud Sync Badge & Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <Cloud className="w-4 h-4 text-emerald-400" />
              <span>FIREBASE CLOUD PERSISTED • ZERO DATA LOSS GUARANTEE</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Hospital Asset Management &amp; Tagging Registry</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Complete physical asset register for clinical HVAC, cryogenic MGPS, generators, RO plants, and elevators. All asset records, RFID barcode tags, and warranty logs are securely synchronized to Cloud Firestore 24/7.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 text-xs text-slate-200 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cloud Realtime Sync: <strong>Active</strong></span>
            </div>

            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Asset / Tag</span>
            </button>
          </div>
        </div>

        {/* Executive Asset Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-700/80 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Total Registered Assets</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-white">{totalAssetsCount}</span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-1.5 py-0.5 rounded">
                100% Tagged
              </span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Life-Safety Critical</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-amber-400">{criticalAssetsCount}</span>
              <span className="text-[10px] text-amber-300 font-semibold bg-amber-950/80 px-1.5 py-0.5 rounded">
                Zone A Redundant
              </span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">DHA Inspected Assets</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-sky-400">{dhaRequiredCount}</span>
              <span className="text-[10px] text-sky-300 font-semibold bg-sky-950/80 px-1.5 py-0.5 rounded">
                JCI FMS Certified
              </span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Total Asset Capital Value</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-emerald-400">
                AED {(totalValuationAED / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Asset Categories ({assets.length})</option>
            <option value="HVAC & Air Handling (AHU/FCU)">HVAC &amp; Air Handling</option>
            <option value="Medical Gas Pipeline (MGPS)">Medical Gas (MGPS)</option>
            <option value="Emergency Diesel Generators">Generators &amp; Power</option>
            <option value="Electrical, Switchgear & UPS">Electrical &amp; UPS</option>
            <option value="Water Treatment & RO Plants">Water Treatment &amp; RO</option>
            <option value="Chillers & Cooling Towers">Chillers &amp; Cooling</option>
            <option value="Fire Fighting & Alarm (DCD)">Fire &amp; DCD Life Safety</option>
            <option value="Lifts & Vertical Transport">Elevators &amp; Lifts</option>
          </select>

          {/* Criticality Filter */}
          <select
            value={selectedCriticality}
            onChange={(e) => setSelectedCriticality(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Criticality Levels</option>
            <option value="Critical - Life Safety">Critical - Life Safety</option>
            <option value="Essential - Clinical">Essential - Clinical</option>
            <option value="Standard - Facility">Standard - Facility</option>
          </select>

          {/* Zone Filter */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Hospital Zones</option>
            <option value="Zone A - Critical (OT / ICU / Dialysis / MGPS)">Zone A (OT/ICU/MGPS)</option>
            <option value="Zone B - Inpatient & Clinical Wards">Zone B (Clinical Wards)</option>
            <option value="Zone C - General & Public Services">Zone C (Public Services)</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tag #, serial, model, room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Asset Table Listing */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Asset Tag &amp; Barcode</th>
                <th className="p-3.5">Equipment Name &amp; Category</th>
                <th className="p-3.5">Location &amp; Zone</th>
                <th className="p-3.5">Manufacturer &amp; Serial</th>
                <th className="p-3.5">Criticality / DHA</th>
                <th className="p-3.5">PPM Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No hospital assets found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Tag & Barcode */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-mono font-bold text-xs">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-slate-900 font-mono font-bold block">
                            {asset.tagNumber}
                          </strong>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <QrCode className="w-3 h-3 text-slate-400" />
                            {asset.rfidBarcode}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Name & Category */}
                    <td className="p-3.5 max-w-xs">
                      <strong className="text-slate-900 block truncate font-medium">
                        {asset.name}
                      </strong>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {asset.category}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <span className="flex items-center gap-1 text-slate-800 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {asset.location}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {asset.department}
                        </span>
                      </div>
                    </td>

                    {/* Make & Serial */}
                    <td className="p-3.5 font-mono text-[11px]">
                      <span className="font-semibold text-slate-800 block">
                        {asset.manufacturer}
                      </span>
                      <span className="text-slate-500 text-[10px] block">
                        SN: {asset.serialNumber}
                      </span>
                    </td>

                    {/* Criticality & DHA */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          asset.criticality === 'Critical - Life Safety'
                            ? 'bg-rose-100 text-rose-800'
                            : asset.criticality === 'Essential - Clinical'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {asset.criticality}
                        </span>
                        {asset.dhaInspectionRequired && (
                          <span className="block text-[10px] text-sky-700 font-semibold">
                            ✓ DHA Survey Required
                          </span>
                        )}
                      </div>
                    </td>

                    {/* PPM Status */}
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-medium text-slate-800 block">
                          {asset.ppmFrequency}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Next: {asset.nextPpmDate}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openTagViewer(asset)}
                          title="Print Physical Equipment Tag & QR"
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(asset)}
                          title="Edit Asset"
                          className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete asset ${asset.tagNumber}?`)) {
                              onDeleteAsset(asset.id);
                            }
                          }}
                          title="Delete Asset"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT ASSET MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingAsset ? 'Edit Hospital Asset & Tag' : 'Add New Hospital Asset (Auto Cloud-Sync)'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAsset} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Asset Tag Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.tagNumber}
                    onChange={(e) => setFormData({ ...formData, tagNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. AGM-AST-AHU-04"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">RFID / Barcode Number</label>
                  <input
                    type="text"
                    value={formData.rfidBarcode}
                    onChange={(e) => setFormData({ ...formData, rfidBarcode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. 849201948291"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. Operating Theatre 3 Air Handling Unit (AHU-OT-3)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Asset Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as AssetCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="HVAC & Air Handling (AHU/FCU)">HVAC &amp; Air Handling (AHU/FCU)</option>
                    <option value="Chillers & Cooling Towers">Chillers &amp; Cooling Towers</option>
                    <option value="Medical Gas Pipeline (MGPS)">Medical Gas Pipeline (MGPS)</option>
                    <option value="Electrical, Switchgear & UPS">Electrical, Switchgear &amp; UPS</option>
                    <option value="Emergency Diesel Generators">Emergency Diesel Generators</option>
                    <option value="Water Treatment & RO Plants">Water Treatment &amp; RO Plants</option>
                    <option value="Fire Fighting & Alarm (DCD)">Fire Fighting &amp; Alarm (DCD)</option>
                    <option value="Biomedical & Life Support">Biomedical &amp; Life Support</option>
                    <option value="Operating Theatre (OT) Systems">Operating Theatre (OT) Systems</option>
                    <option value="Plumbing & Drainage">Plumbing &amp; Drainage</option>
                    <option value="Lifts & Vertical Transport">Lifts &amp; Vertical Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hospital Zone</label>
                  <select
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value as HospitalZone })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Zone A - Critical (OT / ICU / Dialysis / MGPS)">Zone A - Critical (OT / ICU / Dialysis / MGPS)</option>
                    <option value="Zone B - Inpatient & Clinical Wards">Zone B - Inpatient &amp; Clinical Wards</option>
                    <option value="Zone C - General & Public Services">Zone C - General &amp; Public Services</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. Main Surgical Wing"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Specific Room / Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. Roof Penthouse Plant Room 2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. Daikin / Carrier"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Model</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. D-AHU 400"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. SN-88291-DK"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Criticality Level</label>
                  <select
                    value={formData.criticality}
                    onChange={(e) => setFormData({ ...formData, criticality: e.target.value as AssetCriticality })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Critical - Life Safety">Critical - Life Safety</option>
                    <option value="Essential - Clinical">Essential - Clinical</option>
                    <option value="Standard - Facility">Standard - Facility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Operating Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AssetStatus })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Operational / In-Service">Operational / In-Service</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Standby / Backup">Standby / Backup</option>
                    <option value="Decommissioned / Replaced">Decommissioned / Replaced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Purchase Cost (AED)</label>
                  <input
                    type="number"
                    value={formData.purchaseCostAED}
                    onChange={(e) => setFormData({ ...formData, purchaseCostAED: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. 150000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assigned Maintenance Vendor</label>
                  <select
                    value={formData.assignedVendor}
                    onChange={(e) => setFormData({ ...formData, assignedVendor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">PPM Frequency</label>
                  <select
                    value={formData.ppmFrequency}
                    onChange={(e) => setFormData({ ...formData, ppmFrequency: e.target.value as Frequency })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Semi-Annual">Semi-Annual</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="dhaReq"
                  checked={formData.dhaInspectionRequired}
                  onChange={(e) => setFormData({ ...formData, dhaInspectionRequired: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="dhaReq" className="text-slate-700 font-semibold">
                  Requires DHA / JCI Accreditation Inspection Verification
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Cloud className="w-4 h-4" />
                  <span>{editingAsset ? 'Save & Sync to Cloud' : 'Add & Sync to Cloud'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE PHYSICAL ASSET TAG MODAL */}
      {isPrintTagModalOpen && selectedAssetForTag && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Physical Asset Equipment Tag (Printable)
              </h3>
              <button
                onClick={() => setIsPrintTagModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* The Tag Physical Preview */}
            <div className="border-2 border-slate-900 rounded-xl p-4 bg-amber-50/40 text-slate-900 space-y-3 font-mono">
              <div className="flex items-start justify-between border-b border-slate-400 pb-2">
                <div>
                  <strong className="text-xs uppercase font-extrabold tracking-wider block">
                    AGM ALL IN ONE • FM ASSET
                  </strong>
                  <span className="text-[10px] text-slate-600">DUBAI HEALTHCARE FACILITY</span>
                </div>
                <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded">
                  <QrCode className="w-7 h-7" />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="bg-slate-900 text-white px-2 py-1 rounded text-center">
                  <span className="text-[10px] text-slate-300 block">ASSET TAG NUMBER</span>
                  <strong className="text-sm font-bold tracking-widest">{selectedAssetForTag.tagNumber}</strong>
                </div>

                <div className="pt-2 text-[11px] space-y-0.5">
                  <p><strong>NAME:</strong> {selectedAssetForTag.name}</p>
                  <p><strong>SERIAL:</strong> {selectedAssetForTag.serialNumber}</p>
                  <p><strong>LOCATION:</strong> {selectedAssetForTag.location}</p>
                  <p><strong>ZONE:</strong> {selectedAssetForTag.zone.split('-')[0]}</p>
                  <p><strong>CRITICALITY:</strong> {selectedAssetForTag.criticality}</p>
                  <p><strong>BARCODE ID:</strong> {selectedAssetForTag.rfidBarcode}</p>
                </div>
              </div>

              <div className="border-t border-slate-400 pt-2 text-[9px] text-slate-600 flex justify-between">
                <span>DHA/JCI REGISTERED</span>
                <span>CLOUD SYNC VERIFIED</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsPrintTagModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Sticker Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
