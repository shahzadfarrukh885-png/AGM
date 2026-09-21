import React, { useState, useEffect } from 'react';
import { 
  PPMTask, 
  AirQualityRecord, 
  WaterQualityRecord, 
  Vendor, 
  RFQ, 
  VendorQuotation,
  HospitalAsset,
  StaffMember,
  ShiftTimingConfig
} from './types.ts';
import { 
  INITIAL_PPM_TASKS, 
  INITIAL_AIR_TESTS, 
  INITIAL_WATER_TESTS, 
  INITIAL_VENDORS, 
  INITIAL_RFQS, 
  INITIAL_QUOTATIONS,
  INITIAL_ASSETS,
  INITIAL_HOSPITAL_SERVICES,
  INITIAL_STAFF_MEMBERS,
  DEFAULT_SHIFT_CONFIG
} from './data/mockData.ts';
import { Header } from './components/Header.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { PpmSchedulerView } from './components/PpmSchedulerView.tsx';
import { TestingComplianceView } from './components/TestingComplianceView.tsx';
import { VendorDirectoryView } from './components/VendorDirectoryView.tsx';
import { QuotationAutoMatchView } from './components/QuotationAutoMatchView.tsx';
import { DhaJciInspectionView } from './components/DhaJciInspectionView.tsx';
import { AssetListView } from './components/AssetListView.tsx';
import { HospitalServicesDirectoryView } from './components/HospitalServicesDirectoryView.tsx';
import { StaffAttendanceView } from './components/StaffAttendanceView.tsx';
import { DubaiRegulationsGuideModal } from './components/DubaiRegulationsGuideModal.tsx';
import { 
  initializeFirestoreData, 
  subscribeToAssets, 
  saveAssetToCloud, 
  deleteAssetFromCloud,
  subscribeToStaff,
  saveStaffToCloud,
  deleteStaffFromCloud,
  subscribeToShiftConfig,
  saveShiftConfigToCloud,
  subscribeToPpmTasks,
  savePpmTaskToCloud,
  deletePpmTaskFromCloud,
  subscribeToAirTests,
  saveAirTestToCloud,
  subscribeToWaterTests,
  saveWaterTestToCloud,
  subscribeToVendors,
  saveVendorToCloud,
  deleteVendorFromCloud,
  subscribeToRfqs,
  saveRfqToCloud,
  subscribeToQuotations,
  saveQuotationToCloud
} from './services/cloudStorage.ts';
import { 
  LayoutDashboard, 
  Wrench, 
  Wind, 
  FolderOpen, 
  Scale, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  Award,
  FileCheck,
  Tag,
  Cloud,
  Briefcase,
  CalendarCheck,
  Users
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'attendance' | 'ppm' | 'testing' | 'vendors' | 'quotations' | 'inspection' | 'assets'>('dashboard');
  const [ppmFilterOverride, setPpmFilterOverride] = useState<string>('all');
  const [selectedRfqId, setSelectedRfqId] = useState<string>('');
  const [globalSearch, setGlobalSearch] = useState('');
  const [isRegulationsModalOpen, setIsRegulationsModalOpen] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(true);

  // Hospital Services Under Facility Manager (Dubai DHA & JCI Scope)
  const [hospitalServices] = useState(INITIAL_HOSPITAL_SERVICES);

  // Facility Team Staff & Shift Timings State (Cloud Firestore Synchronized)
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('agm_hospital_staff');
      return saved ? JSON.parse(saved) : INITIAL_STAFF_MEMBERS;
    } catch {
      return INITIAL_STAFF_MEMBERS;
    }
  });

  const [shiftConfig, setShiftConfig] = useState<ShiftTimingConfig>(() => {
    try {
      const saved = localStorage.getItem('agm_hospital_shifts');
      return saved ? JSON.parse(saved) : DEFAULT_SHIFT_CONFIG;
    } catch {
      return DEFAULT_SHIFT_CONFIG;
    }
  });

  // Hospital Assets State (Cloud Firestore Synchronized)
  const [assets, setAssets] = useState<HospitalAsset[]>(() => {
    try {
      const saved = localStorage.getItem('agm_hospital_assets');
      return saved ? JSON.parse(saved) : INITIAL_ASSETS;
    } catch {
      return INITIAL_ASSETS;
    }
  });

  // Persistent State with LocalStorage
  const [tasks, setTasks] = useState<PPMTask[]>(() => {
    try {
      const saved = localStorage.getItem('agm_hospital_ppm_tasks');
      return saved ? JSON.parse(saved) : INITIAL_PPM_TASKS;
    } catch {
      return INITIAL_PPM_TASKS;
    }
  });

  const [airTests, setAirTests] = useState<AirQualityRecord[]>(() => {
    try {
      const saved = localStorage.getItem('agm_hospital_air_tests');
      return saved ? JSON.parse(saved) : INITIAL_AIR_TESTS;
    } catch {
      return INITIAL_AIR_TESTS;
    }
  });

  const [waterTests, setWaterTests] = useState<WaterQualityRecord[]>(() => {
    try {
      const saved = localStorage.getItem('agm_hospital_water_tests');
      return saved ? JSON.parse(saved) : INITIAL_WATER_TESTS;
    } catch {
      return INITIAL_WATER_TESTS;
    }
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    try {
      const saved = localStorage.getItem('agm_hospital_vendors');
      return saved ? JSON.parse(saved) : INITIAL_VENDORS;
    } catch {
      return INITIAL_VENDORS;
    }
  });

  const [rfqs, setRfqs] = useState<RFQ[]>(() => {
    try {
      const saved = localStorage.getItem('agm_hospital_rfqs');
      return saved ? JSON.parse(saved) : INITIAL_RFQS;
    } catch {
      return INITIAL_RFQS;
    }
  });

  const [quotations, setQuotations] = useState<VendorQuotation[]>(() => {
    try {
      const saved = localStorage.getItem('agm_hospital_quotations');
      return saved ? JSON.parse(saved) : INITIAL_QUOTATIONS;
    } catch {
      return INITIAL_QUOTATIONS;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('agm_hospital_ppm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('agm_hospital_air_tests', JSON.stringify(airTests));
  }, [airTests]);

  useEffect(() => {
    localStorage.setItem('agm_hospital_water_tests', JSON.stringify(waterTests));
  }, [waterTests]);

  useEffect(() => {
    localStorage.setItem('agm_hospital_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('agm_hospital_rfqs', JSON.stringify(rfqs));
  }, [rfqs]);

  useEffect(() => {
    localStorage.setItem('agm_hospital_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('agm_hospital_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('agm_hospital_staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('agm_hospital_shifts', JSON.stringify(shiftConfig));
  }, [shiftConfig]);

  // Connect to Firebase Cloud Firestore and subscribe to realtime Asset, Staff, PPM, Testing, Vendor, and RFQ updates
  useEffect(() => {
    let unsubscribeAssets = () => {};
    let unsubscribeStaff = () => {};
    let unsubscribeShift = () => {};
    let unsubscribePpm = () => {};
    let unsubscribeAir = () => {};
    let unsubscribeWater = () => {};
    let unsubscribeVendors = () => {};
    let unsubscribeRfqs = () => {};
    let unsubscribeQuotes = () => {};

    const initCloud = async () => {
      try {
        await initializeFirestoreData();
        unsubscribeAssets = subscribeToAssets(
          (cloudAssets) => {
            setAssets(cloudAssets);
            setIsCloudConnected(true);
          },
          (err) => {
            console.warn('Firestore asset subscription notice:', err);
          }
        );

        unsubscribeStaff = subscribeToStaff(
          (cloudStaff) => {
            setStaffList(cloudStaff);
            setIsCloudConnected(true);
          },
          (err) => {
            console.warn('Firestore staff subscription notice:', err);
          }
        );

        unsubscribeShift = subscribeToShiftConfig(
          (cloudShift) => {
            setShiftConfig(cloudShift);
          }
        );

        unsubscribePpm = subscribeToPpmTasks(
          (cloudTasks) => {
            setTasks(cloudTasks);
          }
        );

        unsubscribeAir = subscribeToAirTests(
          (cloudAir) => {
            setAirTests(cloudAir);
          }
        );

        unsubscribeWater = subscribeToWaterTests(
          (cloudWater) => {
            setWaterTests(cloudWater);
          }
        );

        unsubscribeVendors = subscribeToVendors(
          (cloudVendors) => {
            setVendors(cloudVendors);
          }
        );

        unsubscribeRfqs = subscribeToRfqs(
          (cloudRfqs) => {
            setRfqs(cloudRfqs);
          }
        );

        unsubscribeQuotes = subscribeToQuotations(
          (cloudQuotes) => {
            setQuotations(cloudQuotes);
          }
        );
      } catch (err) {
        console.error('Failed to initialize Firestore connection:', err);
        setIsCloudConnected(false);
      }
    };

    initCloud();

    return () => {
      unsubscribeAssets();
      unsubscribeStaff();
      unsubscribeShift();
      unsubscribePpm();
      unsubscribeAir();
      unsubscribeWater();
      unsubscribeVendors();
      unsubscribeRfqs();
      unsubscribeQuotes();
    };
  }, []);

  // Facility Staff & Attendance Cloud Handlers
  const handleSaveStaff = async (staffToSave: StaffMember) => {
    setStaffList(prev => {
      const exists = prev.some(s => s.id === staffToSave.id);
      if (exists) {
        return prev.map(s => s.id === staffToSave.id ? staffToSave : s);
      } else {
        return [staffToSave, ...prev];
      }
    });

    try {
      await saveStaffToCloud(staffToSave);
      setIsCloudConnected(true);
    } catch (err) {
      console.error('Error saving staff to Cloud Firestore:', err);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    setStaffList(prev => prev.filter(s => s.id !== staffId));
    try {
      await deleteStaffFromCloud(staffId);
      setIsCloudConnected(true);
    } catch (err) {
      console.error('Error deleting staff from Cloud Firestore:', err);
    }
  };

  const handleSaveShiftConfig = async (newConfig: ShiftTimingConfig) => {
    setShiftConfig(newConfig);
    try {
      await saveShiftConfigToCloud(newConfig);
      setIsCloudConnected(true);
    } catch (err) {
      console.error('Error saving shift timings to Cloud Firestore:', err);
    }
  };

  // Hospital Asset Cloud Handlers
  const handleAddAsset = async (newAsset: HospitalAsset) => {
    setAssets(prev => [newAsset, ...prev]);
    try {
      await saveAssetToCloud(newAsset);
      setIsCloudConnected(true);
    } catch (err) {
      console.error('Error saving asset to Cloud Firestore:', err);
    }
  };

  const handleUpdateAsset = async (updatedAsset: HospitalAsset) => {
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
    try {
      await saveAssetToCloud(updatedAsset);
      setIsCloudConnected(true);
    } catch (err) {
      console.error('Error updating asset in Cloud Firestore:', err);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    setAssets(prev => prev.filter(a => a.id !== assetId));
    try {
      await deleteAssetFromCloud(assetId);
      setIsCloudConnected(true);
    } catch (err) {
      console.error('Error deleting asset from Cloud Firestore:', err);
    }
  };

  // Reset to default data
  const handleResetData = () => {
    if (window.confirm('Reset all hospital PPM tasks, vendors, assets, and quotations to default Dubai data?')) {
      setAssets(INITIAL_ASSETS);
      setTasks(INITIAL_PPM_TASKS);
      setAirTests(INITIAL_AIR_TESTS);
      setWaterTests(INITIAL_WATER_TESTS);
      setVendors(INITIAL_VENDORS);
      setRfqs(INITIAL_RFQS);
      setQuotations(INITIAL_QUOTATIONS);
      localStorage.clear();
    }
  };

  // PPM Task Handlers
  const handleUpdateTaskStatus = async (taskId: string, newStatus: PPMTask['status']) => {
    let updatedTask: PPMTask | undefined;
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        updatedTask = { ...t, status: newStatus };
        return updatedTask;
      }
      return t;
    }));
    if (updatedTask) {
      try {
        await savePpmTaskToCloud(updatedTask);
      } catch (err) {
        console.error('Error saving PPM task status to Firestore:', err);
      }
    }
  };

  const handleAddTask = async (newTaskData: Omit<PPMTask, 'id'>) => {
    const newTask: PPMTask = {
      ...newTaskData,
      id: `PPM-${Date.now().toString().slice(-4)}`
    };
    setTasks(prev => [newTask, ...prev]);
    try {
      await savePpmTaskToCloud(newTask);
    } catch (err) {
      console.error('Error adding PPM task to Firestore:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await deletePpmTaskFromCloud(taskId);
    } catch (err) {
      console.error('Error deleting PPM task from Firestore:', err);
    }
  };

  // Environmental Testing Handlers
  const handleAddAirTest = async (newAir: Omit<AirQualityRecord, 'id'>) => {
    const rec: AirQualityRecord = {
      ...newAir,
      id: `AIR-${Date.now().toString().slice(-4)}`
    };
    setAirTests(prev => [rec, ...prev]);
    try {
      await saveAirTestToCloud(rec);
    } catch (err) {
      console.error('Error adding air test to Firestore:', err);
    }
  };

  const handleAddWaterTest = async (newWater: Omit<WaterQualityRecord, 'id'>) => {
    const rec: WaterQualityRecord = {
      ...newWater,
      id: `WTR-${Date.now().toString().slice(-4)}`
    };
    setWaterTests(prev => [rec, ...prev]);
    try {
      await saveWaterTestToCloud(rec);
    } catch (err) {
      console.error('Error adding water test to Firestore:', err);
    }
  };

  // Vendor Handlers
  const handleAddVendor = async (newVendorData: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...newVendorData,
      id: `VEND-${Date.now().toString().slice(-4)}`
    };
    setVendors(prev => [newVendor, ...prev]);
    try {
      await saveVendorToCloud(newVendor);
    } catch (err) {
      console.error('Error adding vendor to Firestore:', err);
    }
  };

  const handleUpdateVendor = async (updatedVendor: Vendor) => {
    setVendors(prev => prev.map(v => v.id === updatedVendor.id ? updatedVendor : v));
    try {
      await saveVendorToCloud(updatedVendor);
    } catch (err) {
      console.error('Error updating vendor in Firestore:', err);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    setVendors(prev => prev.filter(v => v.id !== vendorId));
    try {
      await deleteVendorFromCloud(vendorId);
    } catch (err) {
      console.error('Error deleting vendor from Firestore:', err);
    }
  };

  // Quotation & RFQ Handlers
  const handleAddRfq = async (newRfqData: Omit<RFQ, 'id'>) => {
    const newRfq: RFQ = {
      ...newRfqData,
      id: `RFQ-2026-${Date.now().toString().slice(-3)}`
    };
    setRfqs(prev => [newRfq, ...prev]);
    setSelectedRfqId(newRfq.id);
    try {
      await saveRfqToCloud(newRfq);
    } catch (err) {
      console.error('Error adding RFQ to Firestore:', err);
    }
  };

  const handleAddQuotation = async (newQuoteData: Omit<VendorQuotation, 'id'>) => {
    const newQuote: VendorQuotation = {
      ...newQuoteData,
      id: `QUOTE-${Date.now().toString().slice(-4)}`
    };
    setQuotations(prev => [...prev, newQuote]);
    try {
      await saveQuotationToCloud(newQuote);
    } catch (err) {
      console.error('Error adding quotation to Firestore:', err);
    }
  };

  const handleApproveQuotation = async (rfqId: string, quoteId: string) => {
    let approvedQuote: VendorQuotation | undefined;
    setQuotations(prev => prev.map(q => {
      if (q.rfqId === rfqId) {
        const updated = {
          ...q,
          status: (q.id === quoteId ? 'approved' : 'rejected') as VendorQuotation['status']
        };
        if (q.id === quoteId) approvedQuote = updated;
        saveQuotationToCloud(updated).catch(e => console.error(e));
        return updated;
      }
      return q;
    }));

    let updatedRfq: RFQ | undefined;
    setRfqs(prev => prev.map(r => {
      if (r.id === rfqId) {
        updatedRfq = {
          ...r,
          status: 'Awarded',
          awardedQuoteId: quoteId
        };
        saveRfqToCloud(updatedRfq).catch(e => console.error(e));
        return updatedRfq;
      }
      return r;
    }));
  };

  // Navigation router
  const handleNavigateTab = (tab: string, filter?: string) => {
    if (tab === 'ppm') {
      setActiveTab('ppm');
      if (filter) {
        setPpmFilterOverride(filter);
      }
    } else if (tab === 'testing') {
      setActiveTab('testing');
    } else if (tab === 'vendors') {
      setActiveTab('vendors');
    } else if (tab === 'quotations') {
      setActiveTab('quotations');
    } else if (tab === 'attendance') {
      setActiveTab('attendance');
    } else if (tab === 'services') {
      setActiveTab('services');
    } else if (tab === 'assets') {
      setActiveTab('assets');
    } else if (tab === 'inspection') {
      setActiveTab('inspection');
    } else {
      setActiveTab('dashboard');
    }
  };

  const overdueCount = tasks.filter(t => t.status === 'overdue').length;

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <Header
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
        overdueCount={overdueCount}
        openRegulationsModal={() => setIsRegulationsModalOpen(true)}
        onSelectQuickFilter={(filter) => handleNavigateTab('ppm', filter)}
        onNavigateToInspection={() => setActiveTab('inspection')}
        isCloudConnected={isCloudConnected}
      />

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 py-4 sm:py-6 flex-1 flex flex-col space-y-5">
        {/* Navigation Tabs Bar */}
        <nav className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setPpmFilterOverride('all');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Facility Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('services');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-sky-900 text-white shadow-sm'
                : 'text-sky-800 bg-sky-50/70 hover:bg-sky-100/90 border border-sky-300/60'
            }`}
          >
            <Briefcase className="w-4 h-4 text-sky-500" />
            <span>FM Services Scope ({hospitalServices.length})</span>
            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
              activeTab === 'services' ? 'bg-white/20 text-white' : 'bg-sky-600 text-white'
            }`}>
              DHA SCOPE
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('inspection');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'inspection'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-300/60'
            }`}
          >
            <FileCheck className="w-4 h-4 text-emerald-500" />
            <span>DHA &amp; JCI Inspection Dossier</span>
            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
              activeTab === 'inspection' ? 'bg-white/20 text-white' : 'bg-emerald-600 text-white'
            }`}>
              1-CLICK AUDIT
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ppm');
              setPpmFilterOverride('all');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap relative ${
              activeTab === 'ppm'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Wrench className="w-4 h-4 text-sky-400" />
            <span>PPM &amp; Maintenance</span>
            {overdueCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {overdueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('testing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'testing'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Wind className="w-4 h-4 text-teal-400" />
            <span>Air &amp; Water Testing</span>
            <span className="bg-teal-500/10 text-teal-700 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-teal-500/20">
              DHA / DM
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'assets'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-4 h-4 text-emerald-400" />
            <span>Asset List &amp; Tagging ({assets.length})</span>
            <span className="bg-emerald-500/20 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
              <Cloud className="w-3 h-3 text-emerald-500" />
              <span>CLOUD</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'bg-indigo-900 text-white shadow-sm'
                : 'text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100/90 border border-indigo-300/60'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Team Attendance ({staffList.length})</span>
            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
              activeTab === 'attendance' ? 'bg-white/20 text-white' : 'bg-indigo-600 text-white'
            }`}>
              30-DAY ROSTER
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'vendors'
                ? 'bg-amber-950 text-white shadow-sm'
                : 'text-amber-900 bg-amber-50/70 hover:bg-amber-100/90 border border-amber-300/60'
            }`}
          >
            <FolderOpen className="w-4 h-4 text-amber-500" />
            <span>Contractors Folder ({vendors.length})</span>
            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
              activeTab === 'vendors' ? 'bg-white/20 text-white' : 'bg-amber-600 text-white'
            }`}>
              CONTRACTS &amp; TERMS
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quotations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'quotations'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Quotations &amp; Auto-Match</span>
            <span className="bg-emerald-500/20 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
              AI MATCH
            </span>
          </button>
        </nav>

        {/* Dynamic View Rendering */}
        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              airTests={airTests}
              waterTests={waterTests}
              vendors={vendors}
              rfqs={rfqs}
              quotations={quotations}
              onNavigateTab={handleNavigateTab}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onSelectRFQ={(rfqId) => setSelectedRfqId(rfqId)}
            />
          )}

          {activeTab === 'services' && (
            <HospitalServicesDirectoryView
              services={hospitalServices}
              onNavigateToTab={handleNavigateTab}
              onNavigateToInspection={() => setActiveTab('inspection')}
            />
          )}

          {activeTab === 'inspection' && (
            <DhaJciInspectionView
              tasks={tasks}
              airTests={airTests}
              waterTests={waterTests}
              vendors={vendors}
            />
          )}

          {activeTab === 'ppm' && (
            <PpmSchedulerView
              tasks={tasks}
              vendors={vendors}
              initialFilter={ppmFilterOverride}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === 'assets' && (
            <AssetListView
              assets={assets}
              vendors={vendors}
              onAddAsset={handleAddAsset}
              onUpdateAsset={handleUpdateAsset}
              onDeleteAsset={handleDeleteAsset}
              isCloudConnected={isCloudConnected}
            />
          )}

          {activeTab === 'testing' && (
            <TestingComplianceView
              airTests={airTests}
              waterTests={waterTests}
              onAddAirTest={handleAddAirTest}
              onAddWaterTest={handleAddWaterTest}
            />
          )}

          {activeTab === 'attendance' && (
            <StaffAttendanceView
              staffList={staffList}
              onSaveStaff={handleSaveStaff}
              onDeleteStaff={handleDeleteStaff}
              shiftConfig={shiftConfig}
              onSaveShiftConfig={handleSaveShiftConfig}
              isCloudSynced={isCloudConnected}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorDirectoryView
              vendors={vendors}
              onAddVendor={handleAddVendor}
              onUpdateVendor={handleUpdateVendor}
              onDeleteVendor={handleDeleteVendor}
              isCloudConnected={isCloudConnected}
            />
          )}

          {activeTab === 'quotations' && (
            <QuotationAutoMatchView
              rfqs={rfqs}
              quotations={quotations}
              vendors={vendors}
              selectedRfqId={selectedRfqId}
              onSelectRfq={(rfqId) => setSelectedRfqId(rfqId)}
              onAddRfq={handleAddRfq}
              onAddQuotation={handleAddQuotation}
              onApproveQuotation={handleApproveQuotation}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">AGM ALL IN ONE</span>
            <span>• Hospital Facility Management Suite</span>
            <span>(Dubai Healthcare Authority &amp; Dubai Municipality Aligned)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRegulationsModalOpen(true)}
              className="text-emerald-700 hover:underline font-medium"
            >
              View Dubai FM Regulatory Protocols
            </button>
            <span>•</span>
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-slate-700 flex items-center gap-1"
              title="Reset to default mock data"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo Data
            </button>
          </div>
        </div>
      </footer>

      {/* Regulations Modal */}
      <DubaiRegulationsGuideModal
        isOpen={isRegulationsModalOpen}
        onClose={() => setIsRegulationsModalOpen(false)}
      />
    </div>
  );
}
