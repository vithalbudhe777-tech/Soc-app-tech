export type EquipmentStatus = 'operational' | 'needs_inspection' | 'under_repair' | 'critical' | 'offline';

export type EquipmentCategory = 'HVAC' | 'Electrical' | 'Mechanical' | 'Hydraulics' | 'Safety' | 'Pneumatics';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  serialNumber: string;
  location: string;
  status: EquipmentStatus;
  healthScore: number; // 0 - 100
  assignedTechnicianId: string;
  assignedTechnicianName: string;
  lastServicedDate: string;
  nextInspectionDate: string;
  manufacturer: string;
  model: string;
  installYear: number;
  criticalNotes?: string;
}

export interface Technician {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  status: 'available' | 'on_duty' | 'dispatched' | 'off_duty';
  activeAlertsCount: number;
  avatarColor: string;
}

export type AlertPriority = 'low' | 'medium' | 'high' | 'urgent';

export type AlertType = 'critical_repair' | 'inspection_due' | 'inspection_overdue' | 'system_fault' | 'late_payment_hold';

export interface TechnicianAlert {
  id: string;
  equipmentId: string;
  equipmentName: string;
  technicianId: string;
  technicianName: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'in_progress' | 'resolved';
  automated: boolean;
  channel: 'SMS' | 'Push Alert' | 'Radio/Pager' | 'Email';
  acknowledgedAt?: string;
}

export interface StaffAnnouncement {
  id: string;
  title: string;
  type: 'critical_repair' | 'overdue_repair' | 'scheduled_inspection' | 'general';
  severity: 'urgent' | 'warning' | 'info';
  content: string;
  equipmentId?: string;
  equipmentName?: string;
  affectedAreas: string[];
  effectiveDate: string;
  expiresDate?: string;
  pinned: boolean;
  author: string;
  createdAt: string;
  automated: boolean;
  acknowledgedCount: number;
}

export interface InspectionTask {
  id: string;
  title: string;
  equipmentId: string;
  equipmentName: string;
  category: EquipmentCategory;
  assignedTechnicianId: string;
  assignedTechnicianName: string;
  dueDate: string; // ISO date string
  priority: 'routine' | 'mandatory' | 'compliance_critical';
  status: 'pending' | 'in_progress' | 'completed' | 'snoozed';
  notes: string;
  checklist: {
    id: string;
    task: string;
    done: boolean;
  }[];
  reminderWindowHours: number; // e.g., 24h, 4h, 1h
  snoozedUntil?: string;
  completedAt?: string;
  completedBy?: string;
}

export type PaymentStatus = 'pending' | 'overdue' | 'paid';

export interface ApartmentSettings {
  apartmentName: string;
  societyRegNo: string;
  address: string;
  wings: string; // e.g. "Wing A & Wing B (64 Flats)"
  secretaryName: string;
  secretaryContact: string;
  treasurerEmail: string;
  upiId: string;
  currencySymbol: string;
  defaultFixedFine: number; // in ₹
  defaultDailyFineRate: number; // in ₹
}

export interface MaintenanceInvoice {
  id: string;
  invoiceNumber: string;
  title: string;
  flatOrEntity?: string; // e.g. "Flat A-304", "Wing B Lift AMC", "Society Common Fund"
  equipmentId?: string;
  equipmentName?: string;
  recipient: string; // Resident / Contractor / Vendor
  recipientEmail: string;
  recipientPhone: string;
  serviceType: 'Monthly Society Maintenance' | 'Lift AMC & Repair' | 'DG Generator Diesel & Service' | 'Water Pump Overhaul' | 'CCTV & Security Tech' | 'Emergency Repair Parts' | 'Contract Maintenance';
  issueDate: string;
  dueDate: string;
  baseAmount: number;
  fixedPenaltyFee: number; // in ₹
  dailyFineRate: number; // in ₹ per day overdue
  status: PaymentStatus;
  paidAt?: string;
  paymentMethod?: string;
  transactionId?: string;
  lateNoticesSentCount: number;
  lastNoticeSentDate?: string;
  notes?: string;
}

export interface LatePaymentNotice {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  recipient: string;
  recipientEmail: string;
  originalAmount: number;
  fineAmount: number;
  totalDue: number;
  daysOverdue: number;
  noticeStage: 'First Reminder' | 'Second Warning' | 'Final Demand Notice';
  generatedAt: string;
  status: 'sent' | 'delivered';
  message: string;
}

export interface CalculatedInvoice extends MaintenanceInvoice {
  daysOverdue: number;
  accruedFine: number;
  totalAmountDue: number;
}

export interface HouseOwnerProfile {
  isLoggedIn: boolean;
  ownerName: string;
  flatNumber: string;
  carpetArea: number; // in square feet
  ratePerSqFt: number; // ₹1.5 per sq. ft.
  calculatedMaintenance: number; // carpetArea * ratePerSqFt (in ₹)
  phone?: string;
  email?: string;
  wing?: string;
  lastLoginDate?: string;
}

export type ActiveTab = 'dashboard' | 'equipment' | 'alerts' | 'announcements' | 'inspections' | 'payments';
