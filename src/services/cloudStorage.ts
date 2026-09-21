import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';
import { db } from '../firebase.ts';
import { 
  HospitalAsset, 
  PPMTask, 
  Vendor, 
  StaffMember, 
  ShiftTimingConfig,
  AirQualityRecord,
  WaterQualityRecord,
  RFQ,
  VendorQuotation
} from '../types.ts';
import { 
  INITIAL_ASSETS, 
  INITIAL_PPM_TASKS, 
  INITIAL_VENDORS, 
  INITIAL_STAFF_MEMBERS, 
  DEFAULT_SHIFT_CONFIG,
  INITIAL_AIR_TESTS,
  INITIAL_WATER_TESTS,
  INITIAL_RFQS,
  INITIAL_QUOTATIONS
} from '../data/mockData.ts';

const ASSETS_COLLECTION = 'assets';
const PPM_COLLECTION = 'ppmTasks';
const VENDORS_COLLECTION = 'vendors';
const STAFF_COLLECTION = 'facilityStaff';
const CONFIG_COLLECTION = 'fmConfig';
const AIR_COLLECTION = 'airTests';
const WATER_COLLECTION = 'waterTests';
const RFQ_COLLECTION = 'rfqs';
const QUOTE_COLLECTION = 'quotations';

/**
 * Synchronize and seed initial hospital records to Firestore if collections are empty
 */
export async function initializeFirestoreData() {
  try {
    const assetsSnapshot = await getDocs(collection(db, ASSETS_COLLECTION));
    if (assetsSnapshot.empty) {
      console.log('Seeding initial hospital assets to Cloud Firestore...');
      const batch = writeBatch(db);
      for (const asset of INITIAL_ASSETS) {
        const assetRef = doc(db, ASSETS_COLLECTION, asset.id);
        batch.set(assetRef, {
          ...asset,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      await batch.commit();
      console.log('Hospital assets successfully seeded to Firestore.');
    }

    // Seed staff attendance if empty
    const staffSnapshot = await getDocs(collection(db, STAFF_COLLECTION));
    if (staffSnapshot.empty) {
      console.log('Seeding initial facility staff members to Cloud Firestore...');
      const batch = writeBatch(db);
      for (const staff of INITIAL_STAFF_MEMBERS) {
        const staffRef = doc(db, STAFF_COLLECTION, staff.id);
        batch.set(staffRef, {
          ...staff,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      // Seed shift timings
      const shiftRef = doc(db, CONFIG_COLLECTION, 'shiftTimings');
      batch.set(shiftRef, DEFAULT_SHIFT_CONFIG);
      await batch.commit();
      console.log('Facility staff members successfully seeded to Firestore.');
    }

    // Seed PPM tasks if empty
    const ppmSnapshot = await getDocs(collection(db, PPM_COLLECTION));
    if (ppmSnapshot.empty) {
      const batch = writeBatch(db);
      for (const task of INITIAL_PPM_TASKS) {
        const taskRef = doc(db, PPM_COLLECTION, task.id);
        batch.set(taskRef, task);
      }
      await batch.commit();
    }

    // Seed Air Quality tests if empty
    const airSnapshot = await getDocs(collection(db, AIR_COLLECTION));
    if (airSnapshot.empty) {
      const batch = writeBatch(db);
      for (const air of INITIAL_AIR_TESTS) {
        const airRef = doc(db, AIR_COLLECTION, air.id);
        batch.set(airRef, air);
      }
      await batch.commit();
    }

    // Seed Water Quality tests if empty
    const waterSnapshot = await getDocs(collection(db, WATER_COLLECTION));
    if (waterSnapshot.empty) {
      const batch = writeBatch(db);
      for (const water of INITIAL_WATER_TESTS) {
        const waterRef = doc(db, WATER_COLLECTION, water.id);
        batch.set(waterRef, water);
      }
      await batch.commit();
    }

    // Seed Vendors if empty
    const vendorSnapshot = await getDocs(collection(db, VENDORS_COLLECTION));
    if (vendorSnapshot.empty) {
      const batch = writeBatch(db);
      for (const v of INITIAL_VENDORS) {
        const vRef = doc(db, VENDORS_COLLECTION, v.id);
        batch.set(vRef, v);
      }
      await batch.commit();
    }

    // Seed RFQs if empty
    const rfqSnapshot = await getDocs(collection(db, RFQ_COLLECTION));
    if (rfqSnapshot.empty) {
      const batch = writeBatch(db);
      for (const r of INITIAL_RFQS) {
        const rRef = doc(db, RFQ_COLLECTION, r.id);
        batch.set(rRef, r);
      }
      await batch.commit();
    }

    // Seed Quotations if empty
    const quoteSnapshot = await getDocs(collection(db, QUOTE_COLLECTION));
    if (quoteSnapshot.empty) {
      const batch = writeBatch(db);
      for (const q of INITIAL_QUOTATIONS) {
        const qRef = doc(db, QUOTE_COLLECTION, q.id);
        batch.set(qRef, q);
      }
      await batch.commit();
    }
  } catch (err) {
    console.error('Error initializing Firestore data:', err);
  }
}

/**
 * Subscribe to live real-time updates for hospital assets from Firestore
 */
export function subscribeToAssets(
  onUpdate: (assets: HospitalAsset[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, ASSETS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_ASSETS);
      } else {
        const assets: HospitalAsset[] = [];
        snapshot.forEach((docSnap) => {
          assets.push({ id: docSnap.id, ...(docSnap.data() as Omit<HospitalAsset, 'id'>) });
        });
        // Sort by tag number
        assets.sort((a, b) => a.tagNumber.localeCompare(b.tagNumber));
        onUpdate(assets);
      }
    },
    (err) => {
      console.error('Error listening to assets Firestore:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save or update a single hospital asset to Cloud Firestore
 */
export async function saveAssetToCloud(asset: HospitalAsset): Promise<void> {
  const assetRef = doc(db, ASSETS_COLLECTION, asset.id);
  await setDoc(
    assetRef,
    {
      ...asset,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );
}

/**
 * Delete an asset from Cloud Firestore
 */
export async function deleteAssetFromCloud(assetId: string): Promise<void> {
  const assetRef = doc(db, ASSETS_COLLECTION, assetId);
  await deleteDoc(assetRef);
}

/**
 * Save PPM tasks to Firestore
 */
export async function savePpmTaskToCloud(task: PPMTask): Promise<void> {
  const taskRef = doc(db, PPM_COLLECTION, task.id);
  await setDoc(taskRef, task, { merge: true });
}

/**
 * Subscribe to staff members list and attendance records from Cloud Firestore
 */
export function subscribeToStaff(
  onUpdate: (staff: StaffMember[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, STAFF_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_STAFF_MEMBERS);
      } else {
        const staffList: StaffMember[] = [];
        snapshot.forEach((docSnap) => {
          staffList.push({ id: docSnap.id, ...(docSnap.data() as Omit<StaffMember, 'id'>) });
        });
        // Sort by employee code
        staffList.sort((a, b) => (a.employeeCode || '').localeCompare(b.employeeCode || ''));
        onUpdate(staffList);
      }
    },
    (err) => {
      console.error('Error listening to staff members Firestore:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save or update staff member in Cloud Firestore
 */
export async function saveStaffToCloud(staff: StaffMember): Promise<void> {
  const staffRef = doc(db, STAFF_COLLECTION, staff.id);
  await setDoc(
    staffRef,
    {
      ...staff,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );
}

/**
 * Delete a staff member from Cloud Firestore
 */
export async function deleteStaffFromCloud(staffId: string): Promise<void> {
  const staffRef = doc(db, STAFF_COLLECTION, staffId);
  await deleteDoc(staffRef);
}

/**
 * Subscribe to Shift Timing configurations
 */
export function subscribeToShiftConfig(
  onUpdate: (config: ShiftTimingConfig) => void
) {
  const configRef = doc(db, CONFIG_COLLECTION, 'shiftTimings');
  return onSnapshot(
    configRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as ShiftTimingConfig);
      } else {
        onUpdate(DEFAULT_SHIFT_CONFIG);
      }
    },
    (err) => {
      console.error('Error listening to shift config Firestore:', err);
    }
  );
}

/**
 * Save updated Shift Timings to Cloud Firestore
 */
export async function saveShiftConfigToCloud(config: ShiftTimingConfig): Promise<void> {
  const configRef = doc(db, CONFIG_COLLECTION, 'shiftTimings');
  await setDoc(configRef, config, { merge: true });
}

// ---------------------- PPM TASKS CLOUD SYNC ----------------------
export function subscribeToPpmTasks(
  onUpdate: (tasks: PPMTask[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, PPM_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_PPM_TASKS);
      } else {
        const tasks: PPMTask[] = [];
        snapshot.forEach((docSnap) => {
          tasks.push({ id: docSnap.id, ...(docSnap.data() as Omit<PPMTask, 'id'>) });
        });
        onUpdate(tasks);
      }
    },
    (err) => {
      console.error('Error listening to PPM tasks Firestore:', err);
      if (onError) onError(err);
    }
  );
}

export async function deletePpmTaskFromCloud(taskId: string): Promise<void> {
  const taskRef = doc(db, PPM_COLLECTION, taskId);
  await deleteDoc(taskRef);
}

// ---------------------- AIR & WATER QUALITY TESTS CLOUD SYNC ----------------------
export function subscribeToAirTests(
  onUpdate: (records: AirQualityRecord[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, AIR_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_AIR_TESTS);
      } else {
        const records: AirQualityRecord[] = [];
        snapshot.forEach((docSnap) => {
          records.push({ id: docSnap.id, ...(docSnap.data() as Omit<AirQualityRecord, 'id'>) });
        });
        onUpdate(records);
      }
    },
    (err) => {
      console.error('Error listening to air tests Firestore:', err);
      if (onError) onError(err);
    }
  );
}

export async function saveAirTestToCloud(record: AirQualityRecord): Promise<void> {
  const testRef = doc(db, AIR_COLLECTION, record.id);
  await setDoc(testRef, record, { merge: true });
}

export function subscribeToWaterTests(
  onUpdate: (records: WaterQualityRecord[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, WATER_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_WATER_TESTS);
      } else {
        const records: WaterQualityRecord[] = [];
        snapshot.forEach((docSnap) => {
          records.push({ id: docSnap.id, ...(docSnap.data() as Omit<WaterQualityRecord, 'id'>) });
        });
        onUpdate(records);
      }
    },
    (err) => {
      console.error('Error listening to water tests Firestore:', err);
      if (onError) onError(err);
    }
  );
}

export async function saveWaterTestToCloud(record: WaterQualityRecord): Promise<void> {
  const testRef = doc(db, WATER_COLLECTION, record.id);
  await setDoc(testRef, record, { merge: true });
}

// ---------------------- VENDORS CLOUD SYNC ----------------------
export function subscribeToVendors(
  onUpdate: (vendors: Vendor[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, VENDORS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_VENDORS);
      } else {
        const list: Vendor[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Vendor, 'id'>) });
        });
        onUpdate(list);
      }
    },
    (err) => {
      console.error('Error listening to vendors Firestore:', err);
      if (onError) onError(err);
    }
  );
}

export async function saveVendorToCloud(vendor: Vendor): Promise<void> {
  const vRef = doc(db, VENDORS_COLLECTION, vendor.id);
  await setDoc(vRef, vendor, { merge: true });
}

export async function deleteVendorFromCloud(vendorId: string): Promise<void> {
  const vRef = doc(db, VENDORS_COLLECTION, vendorId);
  await deleteDoc(vRef);
}

// ---------------------- RFQS & QUOTATIONS CLOUD SYNC ----------------------
export function subscribeToRfqs(
  onUpdate: (rfqs: RFQ[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, RFQ_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_RFQS);
      } else {
        const list: RFQ[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<RFQ, 'id'>) });
        });
        onUpdate(list);
      }
    },
    (err) => {
      console.error('Error listening to RFQs Firestore:', err);
      if (onError) onError(err);
    }
  );
}

export async function saveRfqToCloud(rfq: RFQ): Promise<void> {
  const rRef = doc(db, RFQ_COLLECTION, rfq.id);
  await setDoc(rRef, rfq, { merge: true });
}

export function subscribeToQuotations(
  onUpdate: (quotations: VendorQuotation[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, QUOTE_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_QUOTATIONS);
      } else {
        const list: VendorQuotation[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<VendorQuotation, 'id'>) });
        });
        onUpdate(list);
      }
    },
    (err) => {
      console.error('Error listening to quotations Firestore:', err);
      if (onError) onError(err);
    }
  );
}

export async function saveQuotationToCloud(quote: VendorQuotation): Promise<void> {
  const qRef = doc(db, QUOTE_COLLECTION, quote.id);
  await setDoc(qRef, quote, { merge: true });
}


