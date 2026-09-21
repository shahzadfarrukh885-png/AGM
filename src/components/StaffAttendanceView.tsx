import React, { useState, useMemo } from 'react';
import { 
  StaffMember, 
  AttendanceCode, 
  ShiftTimingConfig, 
  ShiftType 
} from '../types.ts';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Sun, 
  Moon, 
  Palmtree, 
  Search, 
  Filter, 
  Download, 
  Settings2, 
  X, 
  Save, 
  Sparkles, 
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

interface StaffAttendanceViewProps {
  staffList: StaffMember[];
  onSaveStaff: (staff: StaffMember) => Promise<void>;
  onDeleteStaff: (staffId: string) => Promise<void>;
  shiftConfig: ShiftTimingConfig;
  onSaveShiftConfig: (config: ShiftTimingConfig) => Promise<void>;
  isCloudSynced?: boolean;
}

export const StaffAttendanceView: React.FC<StaffAttendanceViewProps> = ({
  staffList,
  onSaveStaff,
  onDeleteStaff,
  shiftConfig,
  onSaveShiftConfig,
  isCloudSynced = true
}) => {
  // Current month / year state (Defaults to current September 2026 or selected)
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // September (1-12)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('All');

  // Modal states
  const [isStaffModalOpen, setIsStaffModalOpen] = useState<boolean>(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState<boolean>(false);
  const [tempShiftConfig, setTempShiftConfig] = useState<ShiftTimingConfig>(shiftConfig);

  // Form states for Add/Edit Staff
  const [formData, setFormData] = useState<{
    id: string;
    employeeCode: string;
    name: string;
    designation: string;
    department: string;
    shift: ShiftType;
    shiftTiming: string;
    contactPhone: string;
    joiningDate: string;
    isActive: boolean;
  }>({
    id: '',
    employeeCode: '',
    name: '',
    designation: '',
    department: 'Hospital FM Operations',
    shift: 'Morning',
    shiftTiming: '',
    contactPhone: '',
    joiningDate: '2026-09-01',
    isActive: true
  });

  // Calculate number of days in selected month (28, 29, 30, or 31)
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  // Departments list
  const departments = useMemo(() => {
    const set = new Set<string>();
    staffList.forEach(s => {
      if (s.department) set.add(s.department);
    });
    return ['All', ...Array.from(set)];
  }, [staffList]);

  // Filtered staff
  const filteredStaff = useMemo(() => {
    return staffList.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDepartment === 'All' || staff.department === selectedDepartment;
      const matchesShift = selectedShiftFilter === 'All' || staff.shift === selectedShiftFilter;
      return matchesSearch && matchesDept && matchesShift;
    });
  }, [staffList, searchQuery, selectedDepartment, selectedShiftFilter]);

  // Summary counts for current month across all filtered staff
  const overallSummary = useMemo(() => {
    let totalPresent = 0;
    let totalOff = 0;
    let totalAbsent = 0;
    let totalPH = 0;

    filteredStaff.forEach(staff => {
      daysArray.forEach(day => {
        const code = staff.attendanceRecords?.[day];
        if (code === 'P') totalPresent++;
        else if (code === 'O') totalOff++;
        else if (code === 'A') totalAbsent++;
        else if (code === 'PH') totalPH++;
      });
    });

    const totalMarked = totalPresent + totalOff + totalAbsent + totalPH;
    const dutyDays = totalPresent + totalAbsent; // Expected working days
    const attendancePercentage = dutyDays > 0 ? Math.round((totalPresent / dutyDays) * 100) : 100;

    return {
      totalPresent,
      totalOff,
      totalAbsent,
      totalPH,
      totalMarked,
      attendancePercentage
    };
  }, [filteredStaff, daysArray]);

  // Handle cell attendance code change (Cycle or direct click: P -> O -> A -> PH -> clear)
  const handleToggleAttendance = async (staff: StaffMember, day: number) => {
    const currentCode = staff.attendanceRecords?.[day] || '';
    let nextCode: AttendanceCode = 'P';
    if (currentCode === 'P') nextCode = 'O';
    else if (currentCode === 'O') nextCode = 'A';
    else if (currentCode === 'A') nextCode = 'PH';
    else if (currentCode === 'PH') nextCode = '';
    else nextCode = 'P';

    const updatedRecords = {
      ...(staff.attendanceRecords || {}),
      [day]: nextCode
    };

    const updatedStaff: StaffMember = {
      ...staff,
      attendanceRecords: updatedRecords
    };

    await onSaveStaff(updatedStaff);
  };

  // Bulk set for a day or quick row fill
  const handleQuickFillMonth = async (staff: StaffMember, defaultDutyCode: AttendanceCode = 'P') => {
    const updatedRecords: Record<number, AttendanceCode> = { ...(staff.attendanceRecords || {}) };
    daysArray.forEach(day => {
      const dateObj = new Date(selectedYear, selectedMonth - 1, day);
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6; // Sunday or Saturday (Dubai Fri/Sat or Sat/Sun)
      if (isWeekend) {
        updatedRecords[day] = 'O';
      } else {
        updatedRecords[day] = defaultDutyCode;
      }
    });

    const updatedStaff: StaffMember = {
      ...staff,
      attendanceRecords: updatedRecords
    };

    await onSaveStaff(updatedStaff);
  };

  // Open Add Staff Modal
  const handleOpenAddStaff = () => {
    setEditingStaff(null);
    const nextNum = staffList.length + 101;
    setFormData({
      id: `STF-${Date.now()}`,
      employeeCode: `AGM-FM-${nextNum}`,
      name: '',
      designation: '',
      department: 'Hard FM Operations',
      shift: 'Morning',
      shiftTiming: shiftConfig.morningShift || '07:00 AM - 03:30 PM',
      contactPhone: '',
      joiningDate: new Date().toISOString().split('T')[0],
      isActive: true
    });
    setIsStaffModalOpen(true);
  };

  // Open Edit Staff Modal
  const handleOpenEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormData({
      id: staff.id,
      employeeCode: staff.employeeCode,
      name: staff.name,
      designation: staff.designation,
      department: staff.department || 'Hard FM Operations',
      shift: staff.shift || 'Morning',
      shiftTiming: staff.shiftTiming || (staff.shift === 'Morning' ? shiftConfig.morningShift : shiftConfig.eveningShift),
      contactPhone: staff.contactPhone || '',
      joiningDate: staff.joiningDate || '',
      isActive: staff.isActive !== false
    });
    setIsStaffModalOpen(true);
  };

  // Save Staff form submit
  const handleSaveStaffForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.designation.trim()) {
      alert('Please fill in Staff Name and Designation.');
      return;
    }

    const staffToSave: StaffMember = {
      id: formData.id || `STF-${Date.now()}`,
      employeeCode: formData.employeeCode,
      name: formData.name.trim(),
      designation: formData.designation.trim(),
      department: formData.department,
      shift: formData.shift,
      shiftTiming: formData.shiftTiming || (formData.shift === 'Morning' ? shiftConfig.morningShift : shiftConfig.eveningShift),
      contactPhone: formData.contactPhone.trim(),
      joiningDate: formData.joiningDate,
      isActive: formData.isActive,
      attendanceRecords: editingStaff?.attendanceRecords || {}
    };

    await onSaveStaff(staffToSave);
    setIsStaffModalOpen(false);
  };

  // Delete staff confirmation
  const handleDeleteStaffPrompt = async (staff: StaffMember) => {
    if (window.confirm(`Are you sure you want to remove ${staff.name} (${staff.employeeCode}) from the Facility Team roster?`)) {
      await onDeleteStaff(staff.id);
    }
  };

  // Save shift timing config
  const handleSaveShiftModal = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveShiftConfig(tempShiftConfig);
    setIsShiftModalOpen(false);
  };

  // Helper to format month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper badge for code
  const renderAttendanceBadge = (code?: AttendanceCode) => {
    switch (code) {
      case 'P':
        return (
          <span className="w-6 h-6 flex items-center justify-center font-black text-xs rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            P
          </span>
        );
      case 'O':
        return (
          <span className="w-6 h-6 flex items-center justify-center font-bold text-xs rounded bg-blue-100 text-blue-800 border border-blue-300">
            O
          </span>
        );
      case 'A':
        return (
          <span className="w-6 h-6 flex items-center justify-center font-black text-xs rounded bg-rose-100 text-rose-800 border border-rose-300">
            A
          </span>
        );
      case 'PH':
        return (
          <span className="w-6 h-6 flex items-center justify-center font-black text-[10px] rounded bg-purple-100 text-purple-800 border border-purple-300">
            PH
          </span>
        );
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-slate-300 text-xs font-mono">
            -
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Facility Operations Staff Roster
              </span>
              {isCloudSynced && (
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-200 text-[11px] font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-sky-400" />
                  Cloud Synced
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              30-Day Hospital Facility Team Attendance &amp; Shift Register
            </h2>
            <p className="text-slate-300 text-xs max-w-2xl">
              Manage daily duty records for MEP engineers, medical gas specialists, and soft FM supervisors. Track shift rosters, configure Morning/Evening shift timings, and review end-of-month attendance summaries.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setTempShiftConfig(shiftConfig);
                setIsShiftModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-2 border border-white/10 backdrop-blur-xs"
            >
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Shift Timings ({shiftConfig.morningShift || 'Default'})</span>
            </button>

            <button
              onClick={handleOpenAddStaff}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center gap-2 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Staff Member</span>
            </button>
          </div>
        </div>

        {/* Legend Ribbon */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-300 font-semibold text-[11px] uppercase tracking-wider">Attendance Codes:</span>
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
              <span className="w-4 h-4 rounded bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">P</span>
              <span className="text-slate-200 text-[11px] font-medium">Present</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
              <span className="w-4 h-4 rounded bg-blue-500 text-white font-black text-[10px] flex items-center justify-center">O</span>
              <span className="text-slate-200 text-[11px] font-medium">Off Duty</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
              <span className="w-4 h-4 rounded bg-rose-500 text-white font-black text-[10px] flex items-center justify-center">A</span>
              <span className="text-slate-200 text-[11px] font-medium">Absent</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
              <span className="w-5 h-4 rounded bg-purple-500 text-white font-black text-[10px] flex items-center justify-center">PH</span>
              <span className="text-slate-200 text-[11px] font-medium">Public Holiday</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Click any day box in the grid to cycle: <strong>P &rarr; O &rarr; A &rarr; PH &rarr; Clear</strong></span>
          </div>
        </div>
      </div>

      {/* Control Bar: Month Selector, Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Month & Year Pickers */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <Calendar className="w-4 h-4 text-slate-500 ml-2" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent text-xs font-black text-slate-800 py-1.5 px-2 focus:outline-none cursor-pointer"
              >
                {monthNames.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name} ({index + 1})
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-slate-700 py-1.5 px-2 focus:outline-none cursor-pointer border-l border-slate-300"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2025}>2025</option>
              </select>
            </div>

            <span className="text-xs font-semibold text-slate-500">
              {daysInMonth} Days in {monthNames[selectedMonth - 1]}
            </span>
          </div>

          {/* Quick Filter Inputs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff name or code..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>Dept: {dept}</option>
              ))}
            </select>

            <select
              value={selectedShiftFilter}
              onChange={(e) => setSelectedShiftFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none"
            >
              <option value="All">All Shifts</option>
              <option value="Morning">Morning Shift</option>
              <option value="Evening">Evening Shift</option>
              <option value="Night">Night Shift</option>
            </select>
          </div>
        </div>

        {/* Active Shift Timing Banner */}
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              Current Hospital Shift Schedules:
            </span>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold">Morning:</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                {shiftConfig.morningShift || '07:00 AM - 03:30 PM'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-semibold">Evening:</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                {shiftConfig.eveningShift || '03:00 PM - 11:30 PM'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setTempShiftConfig(shiftConfig);
              setIsShiftModalOpen(true);
            }}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
          >
            <Settings2 className="w-3 h-3" />
            Edit Timings
          </button>
        </div>
      </div>

      {/* Main 30-Day Spreadsheet Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <h3 className="font-black text-slate-900 text-sm">
              Monthly Daily Attendance Sheet &bull; {monthNames[selectedMonth - 1]} {selectedYear}
            </h3>
            <span className="text-xs text-slate-500">
              ({filteredStaff.length} Staff Members)
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Tip: Click on a day box to change status
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                {/* Fixed Info Columns */}
                <th className="p-3 w-12 text-center border-r border-slate-200 sticky left-0 bg-slate-100 z-10">
                  #
                </th>
                <th className="p-3 min-w-[180px] border-r border-slate-200 sticky left-12 bg-slate-100 z-10">
                  Staff Name &amp; Code
                </th>
                <th className="p-3 min-w-[140px] border-r border-slate-200">
                  Designation
                </th>
                <th className="p-3 min-w-[100px] border-r border-slate-200">
                  Shift
                </th>

                {/* Day Columns 1 to 31 */}
                {daysArray.map(day => {
                  const dateObj = new Date(selectedYear, selectedMonth - 1, day);
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'narrow' });
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                  return (
                    <th
                      key={day}
                      className={`p-1 text-center min-w-[32px] max-w-[32px] border-r border-slate-200 ${
                        isWeekend ? 'bg-slate-200/70 text-slate-800' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="text-[9px] font-normal uppercase text-slate-500">{dayName}</div>
                      <div className="font-bold text-[11px]">{day}</div>
                    </th>
                  );
                })}

                {/* Summary Columns */}
                <th className="p-2 text-center min-w-[40px] bg-emerald-50 text-emerald-900 border-r border-slate-200 font-black">
                  P
                </th>
                <th className="p-2 text-center min-w-[40px] bg-blue-50 text-blue-900 border-r border-slate-200 font-black">
                  O
                </th>
                <th className="p-2 text-center min-w-[40px] bg-rose-50 text-rose-900 border-r border-slate-200 font-black">
                  A
                </th>
                <th className="p-2 text-center min-w-[40px] bg-purple-50 text-purple-900 border-r border-slate-200 font-black">
                  PH
                </th>
                <th className="p-2 text-center min-w-[50px] bg-slate-50 text-slate-900 border-r border-slate-200 font-black">
                  %
                </th>
                <th className="p-2 text-center min-w-[80px] bg-slate-100 text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={daysArray.length + 10} className="p-8 text-center text-slate-400">
                    No facility staff found matching current criteria. Click "Add Staff Member" to add team members.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff, index) => {
                  // Calculate staff personal month stats
                  let pCount = 0;
                  let oCount = 0;
                  let aCount = 0;
                  let phCount = 0;

                  daysArray.forEach(day => {
                    const code = staff.attendanceRecords?.[day];
                    if (code === 'P') pCount++;
                    else if (code === 'O') oCount++;
                    else if (code === 'A') aCount++;
                    else if (code === 'PH') phCount++;
                  });

                  const dutyDays = pCount + aCount;
                  const pct = dutyDays > 0 ? Math.round((pCount / dutyDays) * 100) : 100;

                  return (
                    <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* # Index */}
                      <td className="p-2 text-center font-mono text-[11px] text-slate-400 border-r border-slate-200 sticky left-0 bg-white z-10">
                        {index + 1}
                      </td>

                      {/* Staff Name & ID Code */}
                      <td className="p-2.5 border-r border-slate-200 sticky left-12 bg-white z-10">
                        <div className="font-bold text-slate-900 text-xs truncate max-w-[160px]" title={staff.name}>
                          {staff.name}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                          <span>{staff.employeeCode}</span>
                          {staff.contactPhone && (
                            <span className="text-slate-400">&bull; {staff.contactPhone}</span>
                          )}
                        </div>
                      </td>

                      {/* Designation */}
                      <td className="p-2.5 border-r border-slate-200">
                        <div className="text-xs font-medium text-slate-800 line-clamp-1" title={staff.designation}>
                          {staff.designation}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {staff.department}
                        </div>
                      </td>

                      {/* Shift Badge & Timing */}
                      <td className="p-2 border-r border-slate-200">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          staff.shift === 'Morning' 
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : staff.shift === 'Evening'
                            ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}>
                          {staff.shift === 'Morning' ? <Sun className="w-3 h-3 text-amber-500" /> : <Moon className="w-3 h-3 text-indigo-500" />}
                          {staff.shift}
                        </span>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                          {staff.shiftTiming || (staff.shift === 'Morning' ? shiftConfig.morningShift : shiftConfig.eveningShift)}
                        </div>
                      </td>

                      {/* 1 to 31 Attendance Interactive Cells */}
                      {daysArray.map(day => {
                        const code = staff.attendanceRecords?.[day];
                        const dateObj = new Date(selectedYear, selectedMonth - 1, day);
                        const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                        return (
                          <td
                            key={day}
                            onClick={() => handleToggleAttendance(staff, day)}
                            className={`p-0 text-center border-r border-slate-200 cursor-pointer select-none transition-colors hover:bg-emerald-50/50 ${
                              isWeekend ? 'bg-slate-50' : 'bg-white'
                            }`}
                            title={`Day ${day}: Click to toggle attendance`}
                          >
                            <div className="w-full h-8 flex items-center justify-center">
                              {renderAttendanceBadge(code)}
                            </div>
                          </td>
                        );
                      })}

                      {/* Summary Columns */}
                      <td className="p-2 text-center font-bold text-emerald-800 bg-emerald-50/50 border-r border-slate-200">
                        {pCount}
                      </td>
                      <td className="p-2 text-center font-bold text-blue-800 bg-blue-50/50 border-r border-slate-200">
                        {oCount}
                      </td>
                      <td className="p-2 text-center font-bold text-rose-800 bg-rose-50/50 border-r border-slate-200">
                        {aCount}
                      </td>
                      <td className="p-2 text-center font-bold text-purple-800 bg-purple-50/50 border-r border-slate-200">
                        {phCount}
                      </td>
                      <td className="p-2 text-center font-black text-xs border-r border-slate-200">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                          pct >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {pct}%
                        </span>
                      </td>

                      {/* Action Menu (Edit, Fill, Delete) */}
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditStaff(staff)}
                            className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                            title="Edit Staff Member"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleQuickFillMonth(staff, 'P')}
                            className="p-1 rounded-lg hover:bg-emerald-100 text-emerald-600 hover:text-emerald-800 transition-colors"
                            title="Quick Fill Full Month (Present with Weekend Offs)"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStaffPrompt(staff)}
                            className="p-1 rounded-lg hover:bg-rose-100 text-rose-500 hover:text-rose-700 transition-colors"
                            title="Remove Staff"
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

            {/* Table Footer: Total Monthly Summary Totals */}
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-xs text-slate-800">
              <tr>
                <td colSpan={4} className="p-3 text-right pr-4 font-black border-r border-slate-200">
                  Total Team Monthly Attendance Aggregates:
                </td>

                {/* Day-by-Day Total Present Counters */}
                {daysArray.map(day => {
                  let dayPresents = 0;
                  filteredStaff.forEach(s => {
                    if (s.attendanceRecords?.[day] === 'P') dayPresents++;
                  });

                  return (
                    <td key={day} className="p-1 text-center border-r border-slate-200 text-[10px] font-mono text-emerald-700">
                      {dayPresents > 0 ? dayPresents : '-'}
                    </td>
                  );
                })}

                <td className="p-2 text-center font-black text-emerald-800 bg-emerald-100 border-r border-slate-200">
                  {overallSummary.totalPresent}
                </td>
                <td className="p-2 text-center font-black text-blue-800 bg-blue-100 border-r border-slate-200">
                  {overallSummary.totalOff}
                </td>
                <td className="p-2 text-center font-black text-rose-800 bg-rose-100 border-r border-slate-200">
                  {overallSummary.totalAbsent}
                </td>
                <td className="p-2 text-center font-black text-purple-800 bg-purple-100 border-r border-slate-200">
                  {overallSummary.totalPH}
                </td>
                <td className="p-2 text-center font-black text-xs border-r border-slate-200 bg-slate-200">
                  {overallSummary.attendancePercentage}%
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* End-of-Month Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg">
            P
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Total Present Duties</div>
            <div className="text-xl font-black text-slate-900">{overallSummary.totalPresent} <span className="text-xs font-normal text-slate-400">shifts</span></div>
            <div className="text-[10px] text-emerald-600 font-medium">On-Duty Compliance</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-blue-200 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg">
            O
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Total Scheduled Offs</div>
            <div className="text-xl font-black text-slate-900">{overallSummary.totalOff} <span className="text-xs font-normal text-slate-400">days</span></div>
            <div className="text-[10px] text-blue-600 font-medium">Rest &amp; Rotational Offs</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-lg">
            A
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Total Unplanned Absences</div>
            <div className="text-xl font-black text-slate-900">{overallSummary.totalAbsent} <span className="text-xs font-normal text-slate-400">days</span></div>
            <div className="text-[10px] text-rose-600 font-medium">Leaves or Emergency</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-purple-200 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-lg">
            PH
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Public Holidays (PH)</div>
            <div className="text-xl font-black text-slate-900">{overallSummary.totalPH} <span className="text-xs font-normal text-slate-400">days</span></div>
            <div className="text-[10px] text-purple-600 font-medium">UAE Statutory Holidays</div>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD OR EDIT STAFF MEMBER */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <UserPlus className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {editingStaff ? 'Edit Staff Member Details' : 'Add New Staff Member'}
                </h3>
              </div>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStaffForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Employee Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    placeholder="e.g. AGM-FM-109"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="Hard FM Operations">Hard FM Operations</option>
                    <option value="Critical Plant Utilities">Critical Plant Utilities</option>
                    <option value="Soft Services & IPC">Soft Services &amp; IPC</option>
                    <option value="BMS Central Control Room">BMS Central Control Room</option>
                    <option value="Hospital FM Operations">Hospital FM Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Muhammad Farrukh Shahzad"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Designation *
                </label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. HVAC Senior Engineer / MGPS Specialist"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Default Shift
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) => {
                      const newShift = e.target.value as ShiftType;
                      setFormData({ 
                        ...formData, 
                        shift: newShift,
                        shiftTiming: newShift === 'Morning' ? shiftConfig.morningShift : shiftConfig.eveningShift
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="Morning">Morning Shift</option>
                    <option value="Evening">Evening Shift</option>
                    <option value="Night">Night Shift</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Custom Shift Timing
                  </label>
                  <input
                    type="text"
                    value={formData.shiftTiming}
                    onChange={(e) => setFormData({ ...formData, shiftTiming: e.target.value })}
                    placeholder="e.g. 07:00 AM - 03:30 PM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone (UAE)
                  </label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+971 50 123 4567"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingStaff ? 'Update Staff Member' : 'Save New Staff'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SHIFT TIMINGS CONFIGURATION */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Clock className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Hospital Shift Timings Configuration
                </h3>
              </div>
              <button
                onClick={() => setIsShiftModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Define the official operational working hours for Morning and Evening facility shifts across the hospital.
            </p>

            <form onSubmit={handleSaveShiftModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Morning Shift Working Hours
                </label>
                <input
                  type="text"
                  required
                  value={tempShiftConfig.morningShift}
                  onChange={(e) => setTempShiftConfig({ ...tempShiftConfig, morningShift: e.target.value })}
                  placeholder="e.g. 07:00 AM - 03:30 PM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Includes 30 min meal break for plant technicians.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  Evening Shift Working Hours
                </label>
                <input
                  type="text"
                  required
                  value={tempShiftConfig.eveningShift}
                  onChange={(e) => setTempShiftConfig({ ...tempShiftConfig, eveningShift: e.target.value })}
                  placeholder="e.g. 03:00 PM - 11:30 PM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Seamless hand-over with Morning shift supervisor.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Night Shift / Emergency Standby (Optional)
                </label>
                <input
                  type="text"
                  value={tempShiftConfig.nightShift || ''}
                  onChange={(e) => setTempShiftConfig({ ...tempShiftConfig, nightShift: e.target.value })}
                  placeholder="e.g. 11:00 PM - 07:30 AM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsShiftModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Shift Timings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
