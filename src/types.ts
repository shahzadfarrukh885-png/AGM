export type ServiceDomain = 'Hard FM' | 'Soft FM' | 'Environmental & Testing' | 'Life Safety & DCD' | 'Medical Equipment & MGPS';

export type TaskStatus = 'overdue' | 'pending' | 'in-progress' | 'completed';

export type Frequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';

export type HospitalZone = 'Zone A - Critical (OT / ICU / Dialysis / MGPS)' | 'Zone B - Inpatient & Clinical Wards' | 'Zone C - General & Public Services';

export interface PPMTask {
  id: string;
  code: string; // e.g. PPM-H-104
  title: string;
  domain: ServiceDomain;
  category: 'HVAC & Chillers' | 'Medical Gas (MGPS)' | 'Electrical & UPS' | 'Water Treatment' | 'Plumbing & Drainage' | 'Fire & Life Safety' | 'Housekeeping & Infection Control' | 'Bio-Waste & Sharps' | 'Pest Control' | 'Lifts & Transport' | 'Air Quality & Pressure';
  equipment: string;
  assetTag: string;
  location: string;
  zone: HospitalZone;
  frequency: Frequency;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  complianceBody: 'DHA' | 'Dubai Municipality' | 'Dubai Civil Defence (DCD)' | 'JCI' | 'FANR' | 'Internal SOP';
  assignedVendor: string;
  vendorId?: string;
  costAED?: number;
  lastServiceDate: string;
  technicianNotes?: string;
  criticality: 'High' | 'Medium' | 'Standard';
}

export interface AirQualityRecord {
  id: string;
  roomName: string;
  department: string; // e.g. Main OT-3, Isolation Ward 4A, Bone Marrow Transplant
  roomType: 'Operating Theatre (Positive)' | 'Airborne Infection Isolation (Negative)' | 'Protective Environment' | 'General Ward';
  differentialPressurePa: number; // e.g. +15 Pa or -3.5 Pa
  requiredPressureMin: number;
  airChangesPerHour: number; // e.g. 24 ACH (req min 20 for OT)
  requiredACH: number;
  temperatureC: number;
  humidityPercent: number;
  hepaIntegrityDOP: number; // e.g. 99.98%
  particleCountIsoClass: string; // e.g. 'ISO Class 5'
  testDate: string;
  nextDueDate: string;
  testedBy: string;
  status: 'Compliant' | 'Warning' | 'Critical Failure';
  dhaCompliant: boolean;
}

export interface WaterQualityRecord {
  id: string;
  sampleLocation: string; // e.g. Dialysis RO Loop Port 3, Cooling Tower A Basin, Domestic Water Tank 1, Pediatric Ward Distal Tap
  testType: 'Legionella Pneumophila' | 'Dialysis RO Microbial & Endotoxin' | 'Potability & Chemical' | 'Free Residual Chlorine';
  resultValue: string; // e.g. "< 10 CFU/L" or "0.08 EU/mL"
  thresholdLimit: string; // e.g. "< 100 CFU/L (DM Code)" or "< 0.25 EU/mL"
  unit: string;
  testDate: string;
  nextDueDate: string;
  accreditedLab: string; // Dubai Municipality Accredited Lab
  status: 'Pass' | 'Action Required' | 'Immediate Isolation';
  dmCompliant: boolean;
}

export interface Vendor {
  id: string;
  serialNumber?: number; // S.No e.g. 1, 2, 3...
  name: string;
  tradeCategory: 'HVAC & Refrigeration' | 'Medical Gas Systems (MGPS)' | 'Water Treatment & Lab' | 'Fire Fighting & Alarm (DCD)' | 'Biomedical & Life Support' | 'Bio-Waste & Hazardous Disposal' | 'Hospital Pest Control' | 'Electrical & Generators' | 'Building Automation (BMS)';
  // Contract Dates & Duration
  contractStartDate: string; // YYYY-MM-DD e.g. '2026-01-01'
  contractEndDate: string; // YYYY-MM-DD e.g. '2027-01-01'
  contractDuration: '1 Year' | '2 Years' | '3 Years' | '6 Months' | 'Custom'; // Yearly, 2 Year, etc.
  // Payment Terms & Billing Cycle
  paymentTerms: '30 Days Credit' | '60 Days PDC' | 'Monthly' | 'Quarterly' | 'Bi-Annual' | 'Yearly Advance' | 'On-Demand / Milestone' | '100% Post Completion';
  contractValueAED?: number; // Total contract amount in AED
  billingCycleNotes?: string; // Additional details on payment/invoicing
  // Statutory and License Data
  tradeLicenseNo: string;
  tradeLicenseExpiry: string; // YYYY-MM-DD
  dmDhaApprovalNo: string;
  dhaPermitExpiry: string;
  contactPerson: string;
  designation: string;
  phone: string;
  emergencyHotline24x7: string;
  email: string;
  officeAddress: string;
  activeAmcStatus: 'Active Contract' | 'Expiring Soon (<30d)' | 'Expired' | 'On-Call Basis';
  amcExpiryDate: string;
  slaResponseTimeHours: number; // e.g. 1 hour emergency response
  rating: number; // 1 to 5
  documentsCount: number;
  completedJobsCount: number;
  notes: string;
}

export interface QuotationItem {
  description: string;
  quantity: number;
  unit: string;
  unitRateAED: number;
  totalAED: number;
}

export interface VendorQuotation {
  id: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  quoteReference: string;
  dateSubmitted: string;
  validUntil: string;
  subtotalAED: number;
  vat5PercentAED: number;
  grandTotalAED: number;
  leadTimeDays: number;
  warrantyMonths: number;
  paymentTerms: string; // e.g. "30 Days PDC", "100% on Completion & DHA Signoff"
  scopeInclusions: string[];
  scopeExclusions: string[];
  complianceScore: number; // 1 to 100 based on technical compliance
  dhaCertificationIncluded: boolean;
  status: 'under_review' | 'recommended' | 'approved' | 'rejected';
  managerNotes?: string;
}

export interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  domain: ServiceDomain;
  department: string;
  budgetAED: number;
  createdDate: string;
  deadlineDate: string;
  scopeOfWork: string;
  requiredCompletionDays: number;
  mandatoryCompliance: string[]; // e.g. ["DHA OT Certification", "ISO Class 5 Validation", "DM Lab Report"]
  status: 'Open for Bids' | 'Comparing Quotes' | 'Awarded' | 'Completed';
  awardedQuoteId?: string;
}

export interface AutoMatchComparisonResult {
  rfqId: string;
  lowestPriceQuoteId: string;
  fastestLeadTimeQuoteId: string;
  highestWarrantyQuoteId: string;
  highestTechnicalQuoteId: string;
  recommendedQuoteId: string;
  recommendationReason: string;
  averageQuoteAED: number;
  potentialSavingsAED: number;
  quotesCount: number;
}

export type AssetCategory = 
  | 'HVAC & Air Handling (AHU/FCU)'
  | 'Chillers & Cooling Towers'
  | 'Medical Gas Pipeline (MGPS)'
  | 'Electrical, Switchgear & UPS'
  | 'Emergency Diesel Generators'
  | 'Water Treatment & RO Plants'
  | 'Fire Fighting & Alarm (DCD)'
  | 'Biomedical & Life Support'
  | 'Operating Theatre (OT) Systems'
  | 'Plumbing & Drainage'
  | 'Lifts & Vertical Transport';

export type AssetCriticality = 'Critical - Life Safety' | 'Essential - Clinical' | 'Standard - Facility';

export type AssetStatus = 'Operational / In-Service' | 'Under Maintenance' | 'Standby / Backup' | 'Decommissioned / Replaced';

export interface HospitalAsset {
  id: string;
  tagNumber: string; // e.g. "AGM-AST-AHU-01" or "DHA-MGPS-LOX-01"
  name: string; // e.g. "Operating Theatre 1 Hygienic AHU Unit"
  category: AssetCategory;
  department: string; // e.g. "Main Surgical Wing", "Central Plant Room", "ICU 2nd Floor"
  location: string; // e.g. "Roof Level Plant Room - Bay 4"
  zone: HospitalZone;
  manufacturer: string; // e.g. "Daikin / Carrier / BeaconMedæs / Cummins"
  model: string;
  serialNumber: string;
  installationDate: string; // YYYY-MM-DD
  warrantyExpiryDate: string;
  criticality: AssetCriticality;
  status: AssetStatus;
  assignedVendor: string;
  vendorId?: string;
  ppmFrequency: Frequency;
  lastPpmDate: string;
  nextPpmDate: string;
  purchaseCostAED: number;
  rfidBarcode: string; // e.g. "849201948291"
  dhaInspectionRequired: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Dubai Healthcare FM Scope Category (DHA & JCI FMS standard)
export type DubaiFmServiceCategory = 
  // Hard FM Services
  | 'MEP & HVAC Air Handling'
  | 'Cryogenic Medical Gas Pipeline (MGPS)'
  | 'Power, UPS & Emergency Generators'
  | 'Water Treatment, RO & Legionella Control'
  | 'Fire Protection & DCD Hassantuk Life Safety'
  | 'Building Management System (BMS) & Automation'
  | 'Building Fabric, Civil & Architectural Works'
  | 'Lifts, Escalators & Vertical Mobility'
  // Soft FM Services
  | 'Clinical Housekeeping & Infection Prevention (IPC)'
  | 'Hazardous & Medical Bio-Waste (Dubai Municipality / Wekaya)'
  | 'Hospital Security, CCTV & Access Safeguarding'
  | 'Hospital Pest Control (Dubai Municipality Food/Health Standard)'
  | 'Hospital Linen, Laundry & Barrier Wash'
  | 'Patient Portering & Bed Transport Services'
  | 'Landscaping & External Grounds Management'
  // Governance & Quality
  | 'JCI FMS & DHA Regulatory Compliance Programs';

export interface HospitalServiceItem {
  id: string;
  title: string;
  type: 'Hard FM' | 'Soft FM' | 'Compliance & Safety';
  category: DubaiFmServiceCategory;
  description: string;
  dubaiRegulatoryRef: string; // e.g., "DHA-HFG Part E", "Dubai Municipality Order 11", "DCD UAE Fire Code Chapter 9", "JCI FMS.08"
  primarySlaHours: number;
  frequency: Frequency;
  complianceAuditor: 'Dubai Health Authority (DHA)' | 'Dubai Municipality (DM)' | 'Dubai Civil Defence (DCD)' | 'JCI Accreditation' | 'Federal Authority for Nuclear Regulation (FANR)';
  activeVendor: string;
  inspectionCycle: string;
  auditKpiTarget: string;
  status: 'Compliant / Active' | 'Audit Due Soon' | 'Action Required';
  keyChecks: string[];
}

// Facility Team Daily & Monthly Attendance Types
export type AttendanceCode = 'P' | 'O' | 'A' | 'PH' | '';

export type ShiftType = 'Morning' | 'Evening' | 'Night' | 'Custom';

export interface ShiftTimingConfig {
  morningShift: string; // e.g., "07:00 AM - 03:30 PM"
  eveningShift: string; // e.g., "03:00 PM - 11:30 PM"
  nightShift?: string;  // e.g., "11:00 PM - 07:30 AM"
}

export interface StaffMember {
  id: string;
  employeeCode: string; // e.g. "AGM-FM-101"
  name: string;
  designation: string; // e.g. "HVAC Supervisor", "Biomedical Engineer", "Civil Tech", "MGPS Specialist"
  department: string; // e.g. "Hard FM Operations", "Soft Services & IPC", "Central Plant"
  shift: ShiftType;
  shiftTiming?: string; // Custom timing if specified
  contactPhone?: string;
  joiningDate?: string;
  isActive: boolean;
  // Map of day (1 to 31) -> AttendanceCode ('P' | 'O' | 'A' | 'PH')
  attendanceRecords: Record<number, AttendanceCode>;
}



