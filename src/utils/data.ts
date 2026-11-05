import {
  Equipment,
  Technician,
  TechnicianAlert,
  StaffAnnouncement,
  InspectionTask,
  MaintenanceInvoice,
  LatePaymentNotice,
  CalculatedInvoice,
  ApartmentSettings,
  HouseOwnerProfile,
} from '../types';

export const CURRENT_DATE_STRING = '2026-09-10';

export const DEFAULT_RATE_PER_SQFT = 1.5; // Society AGM approved maintenance rate: ₹1.5 per sq ft

export const calculateMaintenanceByCarpetArea = (carpetArea: number, ratePerSqFt: number = DEFAULT_RATE_PER_SQFT): number => {
  if (isNaN(carpetArea) || carpetArea <= 0) return 0;
  return Math.round(carpetArea * ratePerSqFt * 100) / 100;
};

export interface FlatPreset {
  flatNumber: string;
  defaultOwner: string;
  carpetArea: number;
  bhkType: string;
  wing: string;
  phone: string;
  email: string;
}

export const SAMPLE_APARTMENT_FLATS: FlatPreset[] = [
  {
    flatNumber: 'Flat A-304',
    defaultOwner: 'Amitabh Joshi',
    carpetArea: 1150,
    bhkType: '3 BHK',
    wing: 'Wing A',
    phone: '+91 98200 11223',
    email: 'amitabh.joshi@gmail.com',
  },
  {
    flatNumber: 'Flat B-201',
    defaultOwner: 'Sunita Mehra',
    carpetArea: 850,
    bhkType: '2 BHK',
    wing: 'Wing B',
    phone: '+91 98190 33445',
    email: 'sunita.mehra@yahoo.co.in',
  },
  {
    flatNumber: 'Flat A-502',
    defaultOwner: 'Deepak Shah',
    carpetArea: 1150,
    bhkType: '3 BHK',
    wing: 'Wing A',
    phone: '+91 98330 99887',
    email: 'deepak.shah@rediffmail.com',
  },
  {
    flatNumber: 'Flat B-104',
    defaultOwner: 'Pooja Agarwal',
    carpetArea: 550,
    bhkType: '1 BHK',
    wing: 'Wing B',
    phone: '+91 98211 44556',
    email: 'pooja.agarwal@gmail.com',
  },
  {
    flatNumber: 'Flat A-102',
    defaultOwner: 'Rameshwar Patel',
    carpetArea: 920,
    bhkType: '2 BHK',
    wing: 'Wing A',
    phone: '+91 98201 44521',
    email: 'rameshwar.patel@gmail.com',
  },
];

export const DEFAULT_OWNER_PROFILE: HouseOwnerProfile = {
  isLoggedIn: false,
  ownerName: '',
  flatNumber: '',
  carpetArea: 850,
  ratePerSqFt: DEFAULT_RATE_PER_SQFT,
  calculatedMaintenance: 1275, // 850 * 1.5 = ₹1,275
  phone: '',
  email: '',
  wing: '',
};

export const DEFAULT_APARTMENT_SETTINGS: ApartmentSettings = {
  apartmentName: 'Aashapura Apartment',
  societyRegNo: 'MAH/MUM/HSG/2018/8921',
  address: 'Station Road, Near Jain Temple, Mumbai 400072',
  wings: 'Wing A & Wing B (64 Residential Flats)',
  secretaryName: 'Rameshwar Patel (Hon. Secretary)',
  secretaryContact: '+91 98201 44521',
  treasurerEmail: 'accounts@aashapura-apartment.org',
  upiId: 'aashapura.society@okhdfcbank',
  currencySymbol: '₹',
  defaultFixedFine: 250, // ₹250 fixed overdue penalty
  defaultDailyFineRate: 50, // ₹50 per day overdue
};

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'TECH-1',
    name: 'Rajesh Kumar',
    specialty: 'Lift & Elevator AMC Specialist',
    phone: '+91 98210 55432',
    email: 'rajesh.kumar@otis-amc.in',
    status: 'on_duty',
    activeAlertsCount: 2,
    avatarColor: 'bg-blue-600',
  },
  {
    id: 'TECH-2',
    name: 'Vikas Sharma',
    specialty: 'Master Electrician & DG Generator Engineer',
    phone: '+91 98765 43210',
    email: 'vikas.power@aashapura.org',
    status: 'dispatched',
    activeAlertsCount: 3,
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'TECH-3',
    name: 'Dinesh Patil',
    specialty: 'Plumbing & Submersible Pump Tech',
    phone: '+91 99301 22849',
    email: 'dinesh.pumps@gmail.com',
    status: 'available',
    activeAlertsCount: 1,
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'TECH-4',
    name: 'Sunil Shinde',
    specialty: 'Fire Life-Safety & CCTV Systems',
    phone: '+91 98199 87654',
    email: 'sunil.firesafety@gmail.com',
    status: 'available',
    activeAlertsCount: 0,
    avatarColor: 'bg-indigo-600',
  },
];

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'EQ-101',
    name: 'Passenger Elevator #1 (Wing A)',
    category: 'Mechanical',
    serialNumber: 'OTIS-IND-9941',
    location: 'Wing A Main Lobby to 12th Floor',
    status: 'critical',
    healthScore: 42,
    assignedTechnicianId: 'TECH-1',
    assignedTechnicianName: 'Rajesh Kumar',
    lastServicedDate: '2026-06-15',
    nextInspectionDate: '2026-09-08', // Overdue!
    manufacturer: 'Otis India',
    model: 'Gen2 Life ARD 8-Passenger',
    installYear: 2019,
    criticalNotes: 'Door interlock safety sensor intermittent fault. Inspection 2 days overdue.',
  },
  {
    id: 'EQ-102',
    name: 'Backup Silent Diesel Generator 125kVA',
    category: 'Electrical',
    serialNumber: 'KIRL-GEN-8910',
    location: 'Ground Floor Utility Yard (Rear)',
    status: 'needs_inspection',
    healthScore: 68,
    assignedTechnicianId: 'TECH-2',
    assignedTechnicianName: 'Vikas Sharma',
    lastServicedDate: '2026-07-10',
    nextInspectionDate: '2026-09-10', // Due today!
    manufacturer: 'Kirloskar Green Power',
    model: 'KG-125WS Silent Enclosure',
    installYear: 2020,
    criticalNotes: 'Monthly automatic mains failure (AMF) transfer switch test & battery check due today.',
  },
  {
    id: 'EQ-103',
    name: 'Hydro-Pneumatic Submersible Water Pump #2',
    category: 'Hydraulics',
    serialNumber: 'CG-PUMP-402',
    location: 'Underground Water Sump Room',
    status: 'under_repair',
    healthScore: 55,
    assignedTechnicianId: 'TECH-3',
    assignedTechnicianName: 'Dinesh Patil',
    lastServicedDate: '2026-08-01',
    nextInspectionDate: '2026-09-11',
    manufacturer: 'Crompton Greaves',
    model: '15 HP Multi-Stage Borewell Pump',
    installYear: 2021,
    criticalNotes: 'Thrust bearing and carbon mechanical seal kit replacement under progress.',
  },
  {
    id: 'EQ-104',
    name: 'Rooftop Solar Water Heating System (5000 LPD)',
    category: 'HVAC',
    serialNumber: 'TATA-SOLAR-500',
    location: 'Terrace Roof Top (Wing A & B)',
    status: 'operational',
    healthScore: 92,
    assignedTechnicianId: 'TECH-3',
    assignedTechnicianName: 'Dinesh Patil',
    lastServicedDate: '2026-08-20',
    nextInspectionDate: '2026-10-15',
    manufacturer: 'Tata Power Solar',
    model: 'Thermosiphon Evacuated Tube System',
    installYear: 2022,
  },
  {
    id: 'EQ-105',
    name: 'Emergency Fire Wet Riser Booster Pump #1',
    category: 'Safety',
    serialNumber: 'KIRL-FIRE-3310',
    location: 'Basement Fire Pump Room',
    status: 'critical',
    healthScore: 38,
    assignedTechnicianId: 'TECH-4',
    assignedTechnicianName: 'Sunil Shinde',
    lastServicedDate: '2026-05-12',
    nextInspectionDate: '2026-09-05', // Overdue by 5 days!
    manufacturer: 'Kirloskar Brothers Ltd',
    model: 'Multi-stage Fire Booster 900 LPM',
    installYear: 2018,
    criticalNotes: 'Jockey pump pressure dropping below 6.5 kg/cm². Mandatory fire NOC inspection overdue.',
  },
  {
    id: 'EQ-106',
    name: 'Automatic Boom Barrier & Security CCTV Hub',
    category: 'Electrical',
    serialNumber: 'HIK-SEC-64CH',
    location: 'Main Security Gate & Guard House',
    status: 'operational',
    healthScore: 88,
    assignedTechnicianId: 'TECH-4',
    assignedTechnicianName: 'Sunil Shinde',
    lastServicedDate: '2026-08-14',
    nextInspectionDate: '2026-09-24',
    manufacturer: 'Hikvision & Magnetic Autocontrol',
    model: 'Toll-Pro Barrier + 64CH 4K NVR',
    installYear: 2023,
  },
];

export const INITIAL_ALERTS: TechnicianAlert[] = [
  {
    id: 'ALT-901',
    equipmentId: 'EQ-101',
    equipmentName: 'Passenger Elevator #1 (Wing A)',
    technicianId: 'TECH-1',
    technicianName: 'Rajesh Kumar',
    type: 'critical_repair',
    priority: 'urgent',
    title: 'CRITICAL: Wing A Lift Door Sensor Sensor Tripping',
    message: 'ARD controller reported door interlock fault on 7th floor. Dispatched automated alert for urgent elevator inspection.',
    timestamp: '2026-09-10 08:15',
    status: 'active',
    automated: true,
    channel: 'SMS',
  },
  {
    id: 'ALT-902',
    equipmentId: 'EQ-105',
    equipmentName: 'Emergency Fire Wet Riser Booster Pump #1',
    technicianId: 'TECH-4',
    technicianName: 'Sunil Shinde',
    type: 'inspection_overdue',
    priority: 'urgent',
    title: 'OVERDUE: Fire NOC Safety Audit 5 Days Late',
    message: 'Mandatory fire department compliance audit was due on 2026-09-05. Escalated automated dispatch to Sunil Shinde.',
    timestamp: '2026-09-10 07:00',
    status: 'active',
    automated: true,
    channel: 'Push Alert',
  },
  {
    id: 'ALT-903',
    equipmentId: 'EQ-102',
    equipmentName: 'Backup Silent Diesel Generator 125kVA',
    technicianId: 'TECH-2',
    technicianName: 'Vikas Sharma',
    type: 'inspection_due',
    priority: 'high',
    title: 'TODAY: Scheduled Generator Load Test (15 min)',
    message: 'Monthly routine power changeover and battery gravity check scheduled for today 2026-09-10.',
    timestamp: '2026-09-10 06:30',
    status: 'acknowledged',
    automated: true,
    channel: 'SMS',
    acknowledgedAt: '2026-09-10 07:45',
  },
  {
    id: 'ALT-904',
    equipmentId: 'EQ-103',
    equipmentName: 'Hydro-Pneumatic Submersible Water Pump #2',
    technicianId: 'TECH-3',
    technicianName: 'Dinesh Patil',
    type: 'critical_repair',
    priority: 'medium',
    title: 'Pump Repair Update: New Carbon Seal Arrived',
    message: 'Replacement seal kit delivered to Aashapura Apartment security office. Ready for installation.',
    timestamp: '2026-09-09 16:40',
    status: 'in_progress',
    automated: false,
    channel: 'Radio/Pager',
  },
];

export const INITIAL_ANNOUNCEMENTS: StaffAnnouncement[] = [
  {
    id: 'ANN-001',
    title: '⚠️ CRITICAL REPAIR OVERDUE: Fire Wet Riser Booster Pump - Basement Plant',
    type: 'overdue_repair',
    severity: 'urgent',
    content: 'All residents of Aashapura Apartment: The mandatory Fire Booster Pump inspection is 5 days overdue awaiting high-pressure flange delivery. Secondary riser hoses remain active. Please do not obstruct basement safety corridors.',
    equipmentId: 'EQ-105',
    equipmentName: 'Emergency Fire Wet Riser Booster Pump #1',
    affectedAreas: ['Wing A & B Basement', 'Ground Floor Riser', 'Wing A Stairwell'],
    effectiveDate: '2026-09-08',
    pinned: true,
    author: 'Aashapura Managing Committee',
    createdAt: '2026-09-08 09:00',
    automated: true,
    acknowledgedCount: 54,
  },
  {
    id: 'ANN-002',
    title: '🚨 UPCOMING CRITICAL REPAIR: Wing A Lift Maintenance Window (11:00 AM - 3:00 PM)',
    type: 'critical_repair',
    severity: 'urgent',
    content: 'Urgent door sensor replacement scheduled for Passenger Elevator #1 in Wing A. The lift will remain out of service between 11:00 AM and 3:00 PM today. Residents are requested to kindly use Wing B service stairs or plan accordingly.',
    equipmentId: 'EQ-101',
    equipmentName: 'Passenger Elevator #1 (Wing A)',
    affectedAreas: ['Wing A Flats (Floors 1-12)', 'Wing A Lobby'],
    effectiveDate: '2026-09-10',
    pinned: true,
    author: 'Society Operations Desk',
    createdAt: '2026-09-10 08:20',
    automated: true,
    acknowledgedCount: 78,
  },
  {
    id: 'ANN-003',
    title: 'Scheduled DG Power Backup Trial: Today at 4:00 PM (15 Minutes)',
    type: 'scheduled_inspection',
    severity: 'warning',
    content: 'Vikas Sharma will conduct a 15-minute load test on the 125kVA generator. Brief 10-second changeover light flicker may occur. No disruption to normal water or elevator circuits.',
    equipmentId: 'EQ-102',
    equipmentName: 'Backup Silent Diesel Generator 125kVA',
    affectedAreas: ['Common Area Lighting', 'Ground Floor Yard'],
    effectiveDate: '2026-09-10',
    pinned: false,
    author: 'Hon. Secretary Office',
    createdAt: '2026-09-09 14:00',
    automated: false,
    acknowledgedCount: 46,
  },
];

export const INITIAL_INSPECTIONS: InspectionTask[] = [
  {
    id: 'INSP-301',
    title: 'Basement Fire Booster Pump - Maharashtra Fire NOC Audit',
    equipmentId: 'EQ-105',
    equipmentName: 'Emergency Fire Wet Riser Booster Pump #1',
    category: 'Safety',
    assignedTechnicianId: 'TECH-4',
    assignedTechnicianName: 'Sunil Shinde',
    dueDate: '2026-09-05', // 5 days overdue!
    priority: 'compliance_critical',
    status: 'pending',
    notes: 'Mandatory annual society life-safety audit. Check pressure gauge calibration, hose cabinet reels, and jockey pump auto-start.',
    checklist: [
      { id: 'chk-1', task: 'Check suction & delivery pressure gauges (> 7 kg/cm²)', done: true },
      { id: 'chk-2', task: 'Inspect diesel drive cooling water strainer & battery', done: false },
      { id: 'chk-3', task: 'Verify control panel audio buzzer and alarm annunciator', done: false },
      { id: 'chk-4', task: 'Conduct 10-minute wet riser discharge flow test', done: false },
    ],
    reminderWindowHours: 24,
  },
  {
    id: 'INSP-302',
    title: 'Wing A Otis Passenger Lift Door & Safety Governor Check',
    equipmentId: 'EQ-101',
    equipmentName: 'Passenger Elevator #1 (Wing A)',
    category: 'Mechanical',
    assignedTechnicianId: 'TECH-1',
    assignedTechnicianName: 'Rajesh Kumar',
    dueDate: '2026-09-08', // 2 days overdue!
    priority: 'mandatory',
    status: 'in_progress',
    notes: 'Urgent check of optical infrared curtain sensors and overspeed governor brake cams.',
    checklist: [
      { id: 'chk-5', task: 'Inspect ARD (Automatic Rescue Device) battery pack', done: true },
      { id: 'chk-6', task: 'Clean and realign 7th floor door interlock contacts', done: true },
      { id: 'chk-7', task: 'Test emergency cabin alarm and intercom to guard room', done: false },
      { id: 'chk-8', task: 'Check traction steel wire rope tension & lubrication', done: false },
    ],
    reminderWindowHours: 4,
  },
  {
    id: 'INSP-303',
    title: 'Silent Diesel Generator 125kVA Monthly Maintenance Run',
    equipmentId: 'EQ-102',
    equipmentName: 'Backup Silent Diesel Generator 125kVA',
    category: 'Electrical',
    assignedTechnicianId: 'TECH-2',
    assignedTechnicianName: 'Vikas Sharma',
    dueDate: '2026-09-10', // Due today!
    priority: 'mandatory',
    status: 'pending',
    notes: 'Check AMF panel contactors, coolant level, engine oil viscosity, and 12V Exide battery cranking voltage.',
    checklist: [
      { id: 'chk-9', task: 'Inspect diesel fuel level (> 80% tank capacity)', done: false },
      { id: 'chk-10', task: 'Check engine oil level & coolant radiator cap', done: false },
      { id: 'chk-11', task: 'Run 15-minute scheduled load test', done: false },
      { id: 'chk-12', task: 'Record 3-phase output voltage (415V, 50Hz)', done: false },
    ],
    reminderWindowHours: 2,
  },
  {
    id: 'INSP-304',
    title: 'Submersible Water Pump #2 Post-Repair Pressure Test',
    equipmentId: 'EQ-103',
    equipmentName: 'Hydro-Pneumatic Submersible Water Pump #2',
    category: 'Hydraulics',
    assignedTechnicianId: 'TECH-3',
    assignedTechnicianName: 'Dinesh Patil',
    dueDate: '2026-09-11', // Due tomorrow
    priority: 'mandatory',
    status: 'pending',
    notes: 'Check overhead tank delivery line pressure and motor winding insulation resistance with Megger.',
    checklist: [
      { id: 'chk-13', task: 'Inspect mechanical shaft seal alignment', done: false },
      { id: 'chk-14', task: 'Check pump control panel star-delta timer relay', done: false },
      { id: 'chk-15', task: 'Fill overhead water tank and record ampere draw', done: false },
    ],
    reminderWindowHours: 24,
  },
  {
    id: 'INSP-305',
    title: 'Terrace Solar Water Heater Collector Cleaning & Flushing',
    equipmentId: 'EQ-104',
    equipmentName: 'Rooftop Solar Water Heating System (5000 LPD)',
    category: 'HVAC',
    assignedTechnicianId: 'TECH-3',
    assignedTechnicianName: 'Dinesh Patil',
    dueDate: '2026-09-24',
    priority: 'routine',
    status: 'pending',
    notes: 'Descaling of solar evacuated glass tubes and cleaning dust from glass manifolds.',
    checklist: [
      { id: 'chk-16', task: 'Clean dust from evacuated glass solar tubes', done: false },
      { id: 'chk-17', task: 'Check insulated hot water return line valves for leaks', done: false },
    ],
    reminderWindowHours: 48,
  },
];

// Invoices in Rupees (₹) for Aashapura Apartment
export const INITIAL_INVOICES: MaintenanceInvoice[] = [
  {
    id: 'INV-1',
    invoiceNumber: 'AASH-2026-081',
    title: 'Monthly Society Maintenance Bill - Flat A-304',
    flatOrEntity: 'Flat A-304 (3 BHK, Wing A)',
    equipmentId: 'EQ-101',
    equipmentName: 'Passenger Elevator #1 (Wing A)',
    recipient: 'Amitabh Joshi (Flat A-304)',
    recipientEmail: 'amitabh.joshi@gmail.com',
    recipientPhone: '+91 98200 11223',
    serviceType: 'Monthly Society Maintenance',
    issueDate: '2026-08-14',
    dueDate: '2026-08-28', // 13 days overdue!
    baseAmount: 4850.0, // ₹4,850.00
    fixedPenaltyFee: 250.0, // ₹250 fixed fine
    dailyFineRate: 50.0, // ₹50/day overdue
    status: 'overdue',
    lateNoticesSentCount: 2,
    lastNoticeSentDate: '2026-09-05',
    notes: 'Monthly maintenance includes lift power, 24/7 security guard, and water supply. Overdue by 13 days.',
  },
  {
    id: 'INV-2',
    invoiceNumber: 'AASH-2026-084',
    title: 'Quarterly Lift Modernization Contribution - Flat B-201',
    flatOrEntity: 'Flat B-201 (2 BHK, Wing B)',
    equipmentId: 'EQ-101',
    equipmentName: 'Passenger Elevator #1 (Wing A)',
    recipient: 'Sunita Mehra (Flat B-201)',
    recipientEmail: 'sunita.mehra@yahoo.co.in',
    recipientPhone: '+91 98190 33445',
    serviceType: 'Lift AMC & Repair',
    issueDate: '2026-08-20',
    dueDate: '2026-09-03', // 7 days overdue!
    baseAmount: 8500.0, // ₹8,500.00
    fixedPenaltyFee: 300.0, // ₹300 fixed fine
    dailyFineRate: 60.0, // ₹60/day overdue
    status: 'overdue',
    lateNoticesSentCount: 1,
    lastNoticeSentDate: '2026-09-04',
    notes: 'Approved AGM special levy for Otis elevator ARD kit upgrade. Overdue by 7 days.',
  },
  {
    id: 'INV-3',
    invoiceNumber: 'AASH-2026-089',
    title: 'Monthly Society Maintenance Bill - Flat A-502',
    flatOrEntity: 'Flat A-502 (3 BHK, Wing A)',
    recipient: 'Deepak Shah (Flat A-502)',
    recipientEmail: 'deepak.shah@rediffmail.com',
    recipientPhone: '+91 98330 99887',
    serviceType: 'Monthly Society Maintenance',
    issueDate: '2026-08-26',
    dueDate: '2026-09-09', // 1 day overdue!
    baseAmount: 4850.0,
    fixedPenaltyFee: 250.0,
    dailyFineRate: 50.0,
    status: 'overdue',
    lateNoticesSentCount: 0,
    notes: 'Society maintenance passed due date yesterday. Daily overdue penalty active.',
  },
  {
    id: 'INV-4',
    invoiceNumber: 'AASH-2026-092',
    title: 'DG Generator High-Speed Diesel Refill (350 Litres)',
    flatOrEntity: 'Society Common Utility Fund',
    equipmentId: 'EQ-102',
    equipmentName: 'Backup Silent Diesel Generator 125kVA',
    recipient: 'Bharat Petroleum Fuel Fleet Services',
    recipientEmail: 'commercial.mumbai@bpcl.co.in',
    recipientPhone: '+91 98205 77661',
    serviceType: 'DG Generator Diesel & Service',
    issueDate: '2026-09-02',
    dueDate: '2026-09-16', // Upcoming pending (6 days left)
    baseAmount: 32500.0, // ₹32,500
    fixedPenaltyFee: 500.0,
    dailyFineRate: 100.0,
    status: 'pending',
    lateNoticesSentCount: 0,
    notes: '350 Litres commercial low-sulfur diesel delivery for Aashapura society generator yard.',
  },
  {
    id: 'INV-5',
    invoiceNumber: 'AASH-2026-095',
    title: 'Submersible Water Pump Borewell Overhaul Parts',
    flatOrEntity: 'Water Committee Account',
    equipmentId: 'EQ-103',
    equipmentName: 'Hydro-Pneumatic Submersible Water Pump #2',
    recipient: 'Patil Pump & Motor Engineering Works',
    recipientEmail: 'patilpumps.mumbai@gmail.com',
    recipientPhone: '+91 98920 44112',
    serviceType: 'Water Pump Overhaul',
    issueDate: '2026-09-06',
    dueDate: '2026-09-20', // Upcoming pending (10 days left)
    baseAmount: 14200.0, // ₹14,200
    fixedPenaltyFee: 300.0,
    dailyFineRate: 50.0,
    status: 'pending',
    lateNoticesSentCount: 0,
    notes: 'Thrust plate, heavy-duty mechanical seal, and rewinding wire spool.',
  },
  {
    id: 'INV-6',
    invoiceNumber: 'AASH-2026-074',
    title: 'Monthly Society Maintenance - Flat B-104 (Settled)',
    flatOrEntity: 'Flat B-104 (2 BHK, Wing B)',
    recipient: 'Kiran Rao (Flat B-104)',
    recipientEmail: 'kiran.rao@gmail.com',
    recipientPhone: '+91 98211 88990',
    serviceType: 'Monthly Society Maintenance',
    issueDate: '2026-07-28',
    dueDate: '2026-08-11',
    baseAmount: 3800.0,
    fixedPenaltyFee: 250.0,
    dailyFineRate: 50.0,
    status: 'paid',
    paidAt: '2026-08-10',
    paymentMethod: 'UPI / Google Pay (Ref: UPI-98421098)',
    transactionId: 'TXN-AASH-89102',
    lateNoticesSentCount: 0,
    notes: 'Paid promptly via Aashapura Apartment app before due date.',
  },
];

export const INITIAL_LATE_NOTICES: LatePaymentNotice[] = [
  {
    id: 'NOT-101',
    invoiceId: 'INV-1',
    invoiceNumber: 'AASH-2026-081',
    recipient: 'Amitabh Joshi (Flat A-304)',
    recipientEmail: 'amitabh.joshi@gmail.com',
    originalAmount: 4850.0,
    fineAmount: 900.0, // ₹250 base + 13 days * ₹50 = ₹900
    totalDue: 5750.0,
    daysOverdue: 13,
    noticeStage: 'Second Warning',
    generatedAt: '2026-09-05 09:00',
    status: 'delivered',
    message: 'Second automated notice: Outstanding society maintenance for Flat A-304 (Bill AASH-2026-081) is 13 days overdue. Accrued late fine of ₹900.00 has been added. Please pay via UPI/NetBanking to clear overdue balance.',
  },
  {
    id: 'NOT-102',
    invoiceId: 'INV-2',
    invoiceNumber: 'AASH-2026-084',
    recipient: 'Sunita Mehra (Flat B-201)',
    recipientEmail: 'sunita.mehra@yahoo.co.in',
    originalAmount: 8500.0,
    fineAmount: 720.0, // ₹300 base + 7 days * ₹60 = ₹720
    totalDue: 9220.0,
    daysOverdue: 7,
    noticeStage: 'First Reminder',
    generatedAt: '2026-09-04 10:15',
    status: 'delivered',
    message: 'Automated notice: Lift Modernization Contribution for Flat B-201 was due on 2026-09-03. Late fee of ₹720.00 has been assessed as per Aashapura Apartment society by-laws.',
  },
];

// Format Indian Rupee currency with symbol
export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Helper to compute overdue days and accrued fines in Rupees
export function calculateInvoice(
  invoice: MaintenanceInvoice,
  currentDateStr: string = CURRENT_DATE_STRING
): CalculatedInvoice {
  if (invoice.status === 'paid') {
    return {
      ...invoice,
      daysOverdue: 0,
      accruedFine: 0,
      totalAmountDue: invoice.baseAmount,
    };
  }

  const cur = new Date(currentDateStr).getTime();
  const due = new Date(invoice.dueDate).getTime();
  const diffDays = Math.floor((cur - due) / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    const daysOverdue = diffDays;
    // Late fine calculation in ₹: Fixed penalty + daily overdue fee
    const accruedFine = invoice.fixedPenaltyFee + (daysOverdue * invoice.dailyFineRate);
    const totalAmountDue = invoice.baseAmount + accruedFine;

    return {
      ...invoice,
      status: 'overdue',
      daysOverdue,
      accruedFine,
      totalAmountDue,
    };
  }

  return {
    ...invoice,
    status: 'pending',
    daysOverdue: 0,
    accruedFine: 0,
    totalAmountDue: invoice.baseAmount,
  };
}

// Local Storage helpers with Aashapura prefix
const STORAGE_KEYS = {
  SETTINGS: 'aashapura_apartment_settings_v1',
  APARTMENT_SETTINGS: 'aashapura_apartment_settings_v1',
  OWNER_PROFILE: 'aashapura_owner_profile_v1',
  EQUIPMENT: 'aashapura_apartment_equipment_v1',
  TECHNICIANS: 'aashapura_apartment_technicians_v1',
  ALERTS: 'aashapura_apartment_alerts_v1',
  ANNOUNCEMENTS: 'aashapura_apartment_announcements_v1',
  INSPECTIONS: 'aashapura_apartment_inspections_v1',
  INVOICES: 'aashapura_apartment_invoices_v1',
  NOTICES: 'aashapura_apartment_notices_v1',
};

export function loadStoredData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Failed to load ${key} from storage:`, err);
    return fallback;
  }
}

export function saveStoredData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save ${key} to storage:`, err);
  }
}

export { STORAGE_KEYS };
