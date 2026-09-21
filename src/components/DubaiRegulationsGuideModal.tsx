import React from 'react';
import { ShieldCheck, X, Building, Wind, Droplets, Flame, Activity, Zap, CheckCircle2 } from 'lucide-react';

interface DubaiRegulationsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DubaiRegulationsGuideModal: React.FC<DubaiRegulationsGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Dubai Hospital Facility Management Standards Guide
              </h3>
              <p className="text-xs text-slate-500">
                Key regulatory benchmarks from DHA, Dubai Municipality, Dubai Civil Defence, and JCI FMS.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs text-slate-700">
          {/* Section 1: DHA Guidelines */}
          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2">
            <div className="flex items-center gap-2 text-sky-950 font-bold text-sm">
              <Wind className="w-4 h-4 text-sky-600" />
              <h4>1. DHA (Dubai Health Authority) Sterile &amp; Gas Standards</h4>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-slate-700 leading-relaxed">
              <li>
                <strong>Operating Theatres (OT):</strong> Strict Positive Pressure (minimum +15 Pascals relative to adjacent semi-restricted corridor). Minimum 20 Total Air Changes per Hour (ACH), with at least 4 outside air ACH. Temperature 18°C–21°C, Relative Humidity 30%–60%.
              </li>
              <li>
                <strong>HEPA Filter DOP &amp; Particle Validation:</strong> Mandatory quarterly Dispersed Oil Particulate (DOP) aerosol test (&ge;99.97% efficiency) and particle count verification to ISO 14644-1 Class 5.
              </li>
              <li>
                <strong>Airborne Infection Isolation Rooms (AIIR):</strong> Strict Negative Pressure (-2.5 Pa minimum). Minimum 12 ACH with 100% exhaust directly outdoors through certified HEPA filtration.
              </li>
              <li>
                <strong>Medical Gas Pipeline System (MGPS):</strong> HTM 02-01 standard. Daily visual verification of Liquid Oxygen (LOX) cryogenic level, manifold backup cylinders, and surgical vacuum pump pressures (min 400 mmHg).
              </li>
            </ul>
          </div>

          {/* Section 2: Dubai Municipality Guidelines */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
            <div className="flex items-center gap-2 text-blue-950 font-bold text-sm">
              <Droplets className="w-4 h-4 text-blue-600" />
              <h4>2. Dubai Municipality (DM) Water, Legionella &amp; Waste Mandates</h4>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-slate-700 leading-relaxed">
              <li>
                <strong>Legionella Testing (Local Order 11):</strong> Cooling towers and domestic hot water recirculating loops must be tested monthly by a Dubai Municipality accredited ISO 17025 laboratory. Action limit: &lt;100 CFU/L.
              </li>
              <li>
                <strong>Water Storage Tanks:</strong> Underground and roof water storage tanks must undergo complete draining, scrubbing, and disinfection every 6 months with DM approved food-grade biocides.
              </li>
              <li>
                <strong>Hemodialysis RO Plant:</strong> Water purity testing per AAMI/ISO 23500. Endotoxin levels must strictly test &lt; 0.25 EU/mL and microbial count &lt; 50 CFU/100mL.
              </li>
              <li>
                <strong>Bio-Waste &amp; Sharps:</strong> Yellow clinical waste bags and rigid sharp containers must be collected daily by DM-approved hazardous waste logistics (e.g. Averda) with digital manifest documentation. Storage cold room maintained below 4°C.
              </li>
            </ul>
          </div>

          {/* Section 3: Dubai Civil Defence & DEWA */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
              <Flame className="w-4 h-4 text-amber-600" />
              <h4>3. Dubai Civil Defence (DCD) &amp; Electrical Life Safety</h4>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-slate-700 leading-relaxed">
              <li>
                <strong>Hassantuk Direct Telemetry:</strong> 24/7 continuous IoT monitoring connection between the hospital fire alarm control panel (FACP) and Dubai Civil Defence Operations Command (997).
              </li>
              <li>
                <strong>Emergency Generators (Life Safety):</strong> Automatic Transfer Switch (ATS) must initiate and supply full hospital critical branch load (ICUs, OTs, MGPS) within 10 seconds of utility power interruption.
              </li>
              <li>
                <strong>Uninterruptible Power Supply (UPS):</strong> 400 kVA static battery banks must guarantee zero-millisecond power transfer for life-support ventilators and surgical lights with 60-minute autonomy.
              </li>
            </ul>
          </div>

          {/* Section 4: Soft FM Hospital Sanitation & Security */}
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
            <div className="flex items-center gap-2 text-teal-950 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <h4>4. Soft FM Services (Clinical Cleaning, Security, Pest &amp; Linen)</h4>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-slate-700 leading-relaxed">
              <li>
                <strong>Clinical Housekeeping &amp; IPC:</strong> Color-coded microfibre cleaning protocol; ATP surface bioluminescence testing (&lt;50 RLU in surgical suites); mandatory UV-C / H2O2 terminal fogging between infected patient discharges.
              </li>
              <li>
                <strong>Hospital Clinical Security:</strong> SIRA-licensed 24/7 security guarding; Infant abduction (Code Pink) RFID tagging; biometric controlled drug (CD) vault logging; 120-day high-definition CCTV video retention.
              </li>
              <li>
                <strong>Linen &amp; Barrier Laundry:</strong> Thermal wash cycle at minimum 71°C for 3 minutes; separate soiled and sterile transit paths (RABC EN 14065); 72-hour emergency linen stock reserves.
              </li>
              <li>
                <strong>Integrated Pest Management (IPM):</strong> Dubai Municipality Public Health approved non-toxic, odorless gel formulations in clinical zones; zero pest tolerance in inpatient dietary kitchens.
              </li>
            </ul>
          </div>

          {/* Section 5: JCI FMS 8th Edition Standards */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
            <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
              <Activity className="w-4 h-4 text-purple-600" />
              <h4>5. JCI (Joint Commission International) FMS Chapters (FMS.01 - FMS.10)</h4>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-slate-700 leading-relaxed">
              <li>
                <strong>FMS.01 &amp; FMS.02:</strong> Leadership, statutory compliance, and annual comprehensive Facility Risk Assessment.
              </li>
              <li>
                <strong>FMS.03 &amp; FMS.04:</strong> Physical facility safety, security safeguarding, and incident reporting.
              </li>
              <li>
                <strong>FMS.05:</strong> Hazardous materials, chemical SDS registry, and bio-waste chain-of-custody tracking.
              </li>
              <li>
                <strong>FMS.06:</strong> Fire safety program, smoke barrier maintenance, and quarterly multi-shift evacuation drills.
              </li>
              <li>
                <strong>FMS.07 &amp; FMS.08:</strong> Medical equipment life-cycle maintenance, and uninterrupted utility systems (power, water, MGPS) redundancy testing.
              </li>
              <li>
                <strong>FMS.09 &amp; FMS.10:</strong> Emergency &amp; disaster preparedness, plus Pre-Construction Risk Assessment (PCRA/ICRA) during all hospital renovation works.
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            AGM All In One • Dubai Hospital Facility Compliance Framework
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
