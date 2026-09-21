import React, { useState } from 'react';
import { AirQualityRecord, WaterQualityRecord } from '../types.ts';
import { 
  Wind, 
  Droplets, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  Thermometer, 
  Gauge, 
  X,
  FileCheck,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

interface TestingComplianceViewProps {
  airTests: AirQualityRecord[];
  waterTests: WaterQualityRecord[];
  onAddAirTest: (record: Omit<AirQualityRecord, 'id'>) => void;
  onAddWaterTest: (record: Omit<WaterQualityRecord, 'id'>) => void;
}

export const TestingComplianceView: React.FC<TestingComplianceViewProps> = ({
  airTests,
  waterTests,
  onAddAirTest,
  onAddWaterTest
}) => {
  const [activeTab, setActiveTab] = useState<'air' | 'water'>('air');
  const [isAirModalOpen, setIsAirModalOpen] = useState(false);
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);

  // Air form state
  const [roomName, setRoomName] = useState('');
  const [department, setDepartment] = useState('Main Surgical Suite - 3rd Floor');
  const [roomType, setRoomType] = useState<AirQualityRecord['roomType']>('Operating Theatre (Positive)');
  const [pressurePa, setPressurePa] = useState(16.5);
  const [reqPressure, setReqPressure] = useState(15.0);
  const [ach, setAch] = useState(24);
  const [reqAch, setReqAch] = useState(20);
  const [tempC, setTempC] = useState(20.0);
  const [humidity, setHumidity] = useState(48);
  const [hepaDop, setHepaDop] = useState(99.98);
  const [isoClass, setIsoClass] = useState('ISO Class 5');
  const [tester, setTester] = useState('DHA Accredited Cleanroom Body');

  // Water form state
  const [sampleLocation, setSampleLocation] = useState('');
  const [testType, setTestType] = useState<WaterQualityRecord['testType']>('Legionella Pneumophila');
  const [resultVal, setResultVal] = useState('< 10 CFU/L');
  const [threshold, setThreshold] = useState('< 100 CFU/L (DM Code)');
  const [unit, setUnit] = useState('CFU/L');
  const [lab, setLab] = useState('Al Safeer Environmental Technologies (DM Accr)');

  const handleCreateAirRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName) return;

    // Evaluate compliance
    const isCompliant = 
      roomType === 'Operating Theatre (Positive)' 
        ? pressurePa >= reqPressure && ach >= reqAch && hepaDop >= 99.97
        : pressurePa <= reqPressure && ach >= reqAch; // Negative pressure

    onAddAirTest({
      roomName,
      department,
      roomType,
      differentialPressurePa: Number(pressurePa),
      requiredPressureMin: Number(reqPressure),
      airChangesPerHour: Number(ach),
      requiredACH: Number(reqAch),
      temperatureC: Number(tempC),
      humidityPercent: Number(humidity),
      hepaIntegrityDOP: Number(hepaDop),
      particleCountIsoClass: isoClass,
      testDate: new Date().toISOString().split('T')[0],
      nextDueDate: '2026-12-20',
      testedBy: tester,
      status: isCompliant ? 'Compliant' : 'Critical Failure',
      dhaCompliant: isCompliant
    });

    setIsAirModalOpen(false);
    setRoomName('');
  };

  const handleCreateWaterRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleLocation) return;

    const isPass = !resultVal.toLowerCase().includes('elevated') && !resultVal.toLowerCase().includes('fail');

    onAddWaterTest({
      sampleLocation,
      testType,
      resultValue: resultVal,
      thresholdLimit: threshold,
      unit,
      testDate: new Date().toISOString().split('T')[0],
      nextDueDate: '2026-10-20',
      accreditedLab: lab,
      status: isPass ? 'Pass' : 'Action Required',
      dmCompliant: isPass
    });

    setIsWaterModalOpen(false);
    setSampleLocation('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Hospital Environmental &amp; Laboratory Compliance Testing
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mandatory Dubai Health Authority (DHA) &amp; Dubai Municipality (DM) environmental audits for sterile air &amp; clinical water systems.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'air' ? (
            <button
              onClick={() => setIsAirModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Log Air Quality / Pressure Test
            </button>
          ) : (
            <button
              onClick={() => setIsWaterModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Log Water &amp; Legionella Lab Test
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('air')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'air'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Wind className="w-4 h-4" />
          Indoor Air Quality, OTs &amp; Isolation Pressures ({airTests.length})
        </button>

        <button
          onClick={() => setActiveTab('water')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'water'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Droplets className="w-4 h-4" />
          Water Quality, Legionella &amp; Dialysis RO ({waterTests.length})
        </button>
      </div>

      {/* TAB 1: AIR QUALITY & PRESSURE */}
      {activeTab === 'air' && (
        <div className="space-y-4">
          {/* Dubai Standard Air Guidance Notice */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-900 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-sky-950 text-sm">
                <Gauge className="w-4 h-4 text-sky-600" />
                DHA Sterile Air Protocols:
              </span>
              <p className="text-sky-800">
                Operating Theaters require <strong>Positive Pressure (+15 Pa minimum)</strong> &amp; <strong>20+ Air Changes per Hour (ACH)</strong> with ISO Class 5 particulate levels. Airborne Infection Isolation Rooms (AIIR) require strict <strong>Negative Pressure (-2.5 Pa minimum)</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-white rounded-lg border border-sky-300 font-bold text-sky-900">
                Quarterly DOP &amp; Particle Validation Mandate
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {airTests.map((rec) => {
              const isOT = rec.roomType.includes('Operating Theatre');
              const isIsolation = rec.roomType.includes('Airborne Infection');
              return (
                <div 
                  key={rec.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3 transition-all ${
                    rec.status === 'Compliant'
                      ? 'border-slate-200 hover:border-sky-300'
                      : 'border-rose-300 bg-rose-50/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        {rec.department}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">
                        {rec.roomName}
                      </h3>
                      <span className="text-xs text-sky-700 font-medium">
                        {rec.roomType}
                      </span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      rec.status === 'Compliant'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                    }`}>
                      {rec.status === 'Compliant' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      {rec.status}
                    </span>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Diff. Pressure</span>
                      <strong className={`text-sm font-mono ${
                        (isOT && rec.differentialPressurePa < rec.requiredPressureMin) ||
                        (isIsolation && rec.differentialPressurePa > rec.requiredPressureMin)
                          ? 'text-rose-600'
                          : 'text-emerald-700'
                      }`}>
                        {rec.differentialPressurePa > 0 ? `+${rec.differentialPressurePa}` : rec.differentialPressurePa} Pa
                      </strong>
                      <span className="text-[10px] text-slate-500 block">
                        Req: {rec.requiredPressureMin > 0 ? `+${rec.requiredPressureMin}` : rec.requiredPressureMin} Pa
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Air Changes (ACH)</span>
                      <strong className={`text-sm font-mono ${rec.airChangesPerHour < rec.requiredACH ? 'text-rose-600' : 'text-slate-800'}`}>
                        {rec.airChangesPerHour} ACH
                      </strong>
                      <span className="text-[10px] text-slate-500 block">
                        Req: &ge; {rec.requiredACH} ACH
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">HEPA DOP Integrity</span>
                      <strong className={`text-sm font-mono ${rec.hepaIntegrityDOP < 99.97 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {rec.hepaIntegrityDOP}%
                      </strong>
                      <span className="text-[10px] text-slate-500 block">Min 99.97%</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Cleanroom Class</span>
                      <strong className="text-sm text-slate-800 font-mono">
                        {rec.particleCountIsoClass.split(' ')[2] || 'ISO 5'}
                      </strong>
                      <span className="text-[10px] text-slate-500 block">ISO 14644-1</span>
                    </div>
                  </div>

                  {/* Temp & Humidity footer */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <span>Temp: <strong className="text-slate-700">{rec.temperatureC}°C</strong></span>
                      <span>Humidity: <strong className="text-slate-700">{rec.humidityPercent}% RH</strong></span>
                    </div>
                    <div>
                      <span>Tested: <strong className="text-slate-700">{rec.testDate}</strong> by {rec.testedBy}</span>
                    </div>
                  </div>

                  {rec.status !== 'Compliant' && (
                    <div className="text-xs bg-rose-100/70 border border-rose-200 text-rose-900 p-2.5 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>
                        <strong>Action Mandatory:</strong> Room fails DHA sterile air criteria. Do not schedule joint replacement surgeries until HEPA filters are replaced and re-validated.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: WATER QUALITY & LEGIONELLA */}
      {activeTab === 'water' && (
        <div className="space-y-4">
          {/* Dubai Municipality Water Order Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-blue-950 text-sm">
                <Droplets className="w-4 h-4 text-blue-600" />
                Dubai Municipality Local Order 11 Regulations:
              </span>
              <p className="text-blue-800">
                Hospital Cooling Towers and Domestic Water systems require monthly testing for <em>Legionella pneumophila</em> (&lt;100 CFU/L). Dialysis RO product water must comply with AAMI/ISO 23500 bacterial endotoxin standards (&lt;0.25 EU/mL).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-white rounded-lg border border-blue-300 font-bold text-blue-900">
                DM Accredited Lab ISO 17025
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {waterTests.map((rec) => (
              <div 
                key={rec.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3 transition-all ${
                  rec.status === 'Pass'
                    ? 'border-slate-200 hover:border-blue-300'
                    : 'border-amber-300 bg-amber-50/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {rec.testType}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">
                      {rec.sampleLocation}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    rec.status === 'Pass'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                  }`}>
                    {rec.status === 'Pass' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {rec.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Lab Result Value</span>
                    <strong className={`text-base font-mono ${rec.status === 'Pass' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {rec.resultValue}
                    </strong>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">Allowable Threshold</span>
                    <span className="text-xs font-semibold text-slate-700 font-mono">
                      {rec.thresholdLimit}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <span>Accredited Lab: <strong className="text-slate-700">{rec.accreditedLab}</strong></span>
                  <span>Tested: <strong className="text-slate-700">{rec.testDate}</strong></span>
                </div>

                {rec.status !== 'Pass' && (
                  <div className="text-xs bg-amber-100/70 border border-amber-200 text-amber-900 p-2.5 rounded-lg">
                    <strong>Notice:</strong> Result exceeds Dubai Municipality safety threshold. Facility protocol requires immediate biocidal hyper-chlorination and re-sampling within 7 days.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Air Test */}
      {isAirModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Wind className="w-5 h-5 text-sky-600" />
                Log Hospital Air Quality &amp; OT Pressure Test
              </h3>
              <button onClick={() => setIsAirModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAirRecord} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room / Theatre Name *</label>
                  <input
                    type="text"
                    required
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g. Operating Theatre 4 (Neuro)"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => {
                      const val = e.target.value as AirQualityRecord['roomType'];
                      setRoomType(val);
                      if (val.includes('Operating')) {
                        setReqPressure(15.0);
                        setPressurePa(17.2);
                        setReqAch(20);
                        setAch(24);
                      } else if (val.includes('Airborne')) {
                        setReqPressure(-2.5);
                        setPressurePa(-3.5);
                        setReqAch(12);
                        setAch(14);
                      }
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="Operating Theatre (Positive)">Operating Theatre (Positive Pressure)</option>
                    <option value="Airborne Infection Isolation (Negative)">Airborne Infection Isolation (Negative Pressure)</option>
                    <option value="Protective Environment">Protective Environment (NICU / Transplant)</option>
                    <option value="General Ward">General Ward</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Measured Diff. Pressure (Pa)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pressurePa}
                    onChange={(e) => setPressurePa(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Air Changes / Hr (ACH)</label>
                  <input
                    type="number"
                    value={ach}
                    onChange={(e) => setAch(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">HEPA DOP Integrity (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={hepaDop}
                    onChange={(e) => setHepaDop(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ISO Particle Cleanroom Class</label>
                  <select
                    value={isoClass}
                    onChange={(e) => setIsoClass(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="ISO Class 5">ISO Class 5 (Laminar Airflow Surgery)</option>
                    <option value="ISO Class 6">ISO Class 6</option>
                    <option value="ISO Class 7">ISO Class 7 (Surgical Prep / AIIR)</option>
                    <option value="ISO Class 8">ISO Class 8</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Testing Agency / Tech</label>
                  <input
                    type="text"
                    value={tester}
                    onChange={(e) => setTester(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAirModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-sm"
                >
                  Save Air Test Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Water Test */}
      {isWaterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-600" />
                Log Water Quality &amp; Legionella Lab Test
              </h3>
              <button onClick={() => setIsWaterModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWaterRecord} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sampling Location *</label>
                  <input
                    type="text"
                    required
                    value={sampleLocation}
                    onChange={(e) => setSampleLocation(e.target.value)}
                    placeholder="e.g. Cooling Tower CT-1 Basin / Dialysis RO Port"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Test Type</label>
                  <select
                    value={testType}
                    onChange={(e) => {
                      const val = e.target.value as WaterQualityRecord['testType'];
                      setTestType(val);
                      if (val === 'Legionella Pneumophila') {
                        setResultVal('< 10 CFU/L');
                        setThreshold('< 100 CFU/L (DM Code)');
                        setUnit('CFU/L');
                      } else if (val === 'Dialysis RO Microbial & Endotoxin') {
                        setResultVal('0.05 EU/mL');
                        setThreshold('< 0.25 EU/mL (AAMI)');
                        setUnit('EU/mL');
                      } else if (val === 'Free Residual Chlorine') {
                        setResultVal('0.30 mg/L');
                        setThreshold('0.20 - 0.50 mg/L');
                        setUnit('mg/L');
                      }
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Legionella Pneumophila">Legionella Pneumophila (Cooling Towers / Showers)</option>
                    <option value="Dialysis RO Microbial & Endotoxin">Dialysis RO Microbial &amp; Endotoxin (AAMI)</option>
                    <option value="Potability & Chemical">Potability &amp; Chemical (Underground Tanks)</option>
                    <option value="Free Residual Chlorine">Free Residual Chlorine</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Result Value</label>
                  <input
                    type="text"
                    required
                    value={resultVal}
                    onChange={(e) => setResultVal(e.target.value)}
                    placeholder="e.g. < 10 CFU/L"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Allowable Threshold</label>
                  <input
                    type="text"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Accredited Laboratory Name</label>
                  <input
                    type="text"
                    value={lab}
                    onChange={(e) => setLab(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWaterModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                >
                  Save Water Test Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
