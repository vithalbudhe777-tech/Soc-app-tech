import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { EquipmentTracker } from './components/EquipmentTracker';
import { TechnicianAlerts } from './components/TechnicianAlerts';
import { StaffAnnouncements } from './components/StaffAnnouncements';
import { InspectionReminders } from './components/InspectionReminders';
import { PaymentFinesManager } from './components/PaymentFinesManager';
import { LateNoticeModal } from './components/LateNoticeModal';
import { NewEquipmentModal } from './components/NewEquipmentModal';
import { EditEquipmentModal } from './components/EditEquipmentModal';
import { NewAlertModal } from './components/NewAlertModal';
import { NewAnnouncementModal } from './components/NewAnnouncementModal';
import { NewInspectionModal } from './components/NewInspectionModal';
import { NewInvoiceModal } from './components/NewInvoiceModal';
import { PaymentCheckoutModal } from './components/PaymentCheckoutModal';
import { ApartmentSettingsModal } from './components/ApartmentSettingsModal';
import { OwnerLoginModal } from './components/OwnerLoginModal';

import {
  Equipment,
  Technician,
  TechnicianAlert,
  StaffAnnouncement,
  InspectionTask,
  MaintenanceInvoice,
  LatePaymentNotice,
  CalculatedInvoice,
  ActiveTab,
  EquipmentStatus,
  ApartmentSettings,
  HouseOwnerProfile,
} from './types';

import {
  INITIAL_EQUIPMENT,
  INITIAL_TECHNICIANS,
  INITIAL_ALERTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_INSPECTIONS,
  INITIAL_INVOICES,
  INITIAL_LATE_NOTICES,
  DEFAULT_APARTMENT_SETTINGS,
  DEFAULT_OWNER_PROFILE,
  CURRENT_DATE_STRING,
  calculateInvoice,
  loadStoredData,
  saveStoredData,
  STORAGE_KEYS,
  formatINR,
} from './utils/data';

import { sounds } from './utils/sound';
import { CheckCircle2, AlertTriangle, Sparkles, X, Info, Check } from 'lucide-react';

export default function App() {
  // Apartment Society Configuration State
  const [apartmentSettings, setApartmentSettings] = useState<ApartmentSettings>(() =>
    loadStoredData(STORAGE_KEYS.APARTMENT_SETTINGS, DEFAULT_APARTMENT_SETTINGS)
  );

  // State Initialization from LocalStorage or seed data
  const [equipment, setEquipment] = useState<Equipment[]>(() =>
    loadStoredData(STORAGE_KEYS.EQUIPMENT, INITIAL_EQUIPMENT)
  );

  const [technicians, setTechnicians] = useState<Technician[]>(() =>
    loadStoredData(STORAGE_KEYS.TECHNICIANS, INITIAL_TECHNICIANS)
  );

  const [alerts, setAlerts] = useState<TechnicianAlert[]>(() =>
    loadStoredData(STORAGE_KEYS.ALERTS, INITIAL_ALERTS)
  );

  const [announcements, setAnnouncements] = useState<StaffAnnouncement[]>(() =>
    loadStoredData(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS)
  );

  const [inspections, setInspections] = useState<InspectionTask[]>(() =>
    loadStoredData(STORAGE_KEYS.INSPECTIONS, INITIAL_INSPECTIONS)
  );

  const [invoices, setInvoices] = useState<MaintenanceInvoice[]>(() =>
    loadStoredData(STORAGE_KEYS.INVOICES, INITIAL_INVOICES)
  );

  const [lateNotices, setLateNotices] = useState<LatePaymentNotice[]>(() =>
    loadStoredData(STORAGE_KEYS.NOTICES, INITIAL_LATE_NOTICES)
  );

  // House Owner Login & Carpet Area Profile
  const [ownerProfile, setOwnerProfile] = useState<HouseOwnerProfile>(() =>
    loadStoredData(STORAGE_KEYS.OWNER_PROFILE, DEFAULT_OWNER_PROFILE)
  );
  const [isOwnerLoginModalOpen, setIsOwnerLoginModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isScanning, setIsScanning] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'warning' | 'info';
    text: string;
  } | null>(null);

  // Modals state
  const [isApartmentSettingsModalOpen, setIsApartmentSettingsModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<CalculatedInvoice | null>(null);
  const [selectedEquipmentForEdit, setSelectedEquipmentForEdit] = useState<Equipment | null>(null);
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
  const [isNewAlertModalOpen, setIsNewAlertModalOpen] = useState(false);
  const [selectedEquipmentForAlert, setSelectedEquipmentForAlert] = useState<Equipment | null>(null);
  const [isNewAnnouncementModalOpen, setIsNewAnnouncementModalOpen] = useState(false);
  const [isNewInspectionModalOpen, setIsNewInspectionModalOpen] = useState(false);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [selectedInvoiceForNotice, setSelectedInvoiceForNotice] = useState<CalculatedInvoice | null>(null);

  // First-time House Owner Login check:
  // "First ask the owner of the house about his carpet area while logging in and accordingly the maintenence is rupees 1.5 per square feet and calculate the the owners maintenence amount"
  useEffect(() => {
    if (!ownerProfile.isLoggedIn) {
      const timer = setTimeout(() => {
        setIsOwnerLoginModalOpen(true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [ownerProfile.isLoggedIn]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Sync state changes to storage
  useEffect(() => {
    saveStoredData(STORAGE_KEYS.OWNER_PROFILE, ownerProfile);
  }, [ownerProfile]);

  // Sync state changes to storage
  useEffect(() => {
    saveStoredData(STORAGE_KEYS.APARTMENT_SETTINGS, apartmentSettings);
  }, [apartmentSettings]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.EQUIPMENT, equipment);
  }, [equipment]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.TECHNICIANS, technicians);
  }, [technicians]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.ALERTS, alerts);
  }, [alerts]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }, [announcements]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.INSPECTIONS, inspections);
  }, [inspections]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.INVOICES, invoices);
  }, [invoices]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.NOTICES, lateNotices);
  }, [lateNotices]);

  // Computed invoices with dynamic fine calculation in Rupees
  const calculatedInvoices: CalculatedInvoice[] = useMemo(() => {
    return invoices.map((inv) => calculateInvoice(inv, CURRENT_DATE_STRING));
  }, [invoices]);

  // Total pending amount for navbar & dashboard
  const totalPendingAmount = useMemo(() => {
    return calculatedInvoices
      .filter((i) => i.status !== 'paid')
      .reduce((acc, curr) => acc + curr.totalAmountDue, 0);
  }, [calculatedInvoices]);

  // Active counts
  const activeAlertsCount = useMemo(() => {
    return alerts.filter((a) => a.status === 'active' || a.status === 'acknowledged').length;
  }, [alerts]);

  const criticalAnnouncementsCount = useMemo(() => {
    return announcements.filter(
      (a) => a.severity === 'urgent' || a.type === 'critical_repair' || a.type === 'overdue_repair'
    ).length;
  }, [announcements]);

  const dueInspectionsCount = useMemo(() => {
    return inspections.filter((t) => {
      if (t.status === 'completed') return false;
      const isOverdue = new Date(t.dueDate).getTime() < new Date(CURRENT_DATE_STRING).getTime();
      const isToday = t.dueDate === CURRENT_DATE_STRING;
      return isOverdue || isToday;
    }).length;
  }, [inspections]);

  // --- ACTIONS & HANDLERS ---

  // Apartment Settings Update
  const handleSaveApartmentSettings = (newSettings: ApartmentSettings) => {
    setApartmentSettings(newSettings);
    sounds.playSuccessSound();
    setToastMessage({
      type: 'success',
      text: `Society settings for "${newSettings.apartmentName}" saved successfully!`,
    });
  };

  // 1. Equipment Status Change
  const handleUpdateEquipmentStatus = (id: string, newStatus: EquipmentStatus, notes?: string) => {
    setEquipment((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            status: newStatus,
            criticalNotes: notes || item.criticalNotes,
            healthScore:
              newStatus === 'critical'
                ? Math.min(item.healthScore, 40)
                : newStatus === 'operational'
                ? Math.max(item.healthScore, 85)
                : item.healthScore,
          };

          // If changed to critical, automatically schedule a technician alert & staff announcement!
          if (newStatus === 'critical') {
            const newAlert: TechnicianAlert = {
              id: `ALT-AUTO-${Date.now()}`,
              equipmentId: item.id,
              equipmentName: item.name,
              technicianId: item.assignedTechnicianId,
              technicianName: item.assignedTechnicianName,
              type: 'critical_repair',
              priority: 'urgent',
              title: `AUTOMATED CRITICAL ALERT: ${item.name} Breakdown`,
              message: notes || `Equipment status flagged as CRITICAL at ${apartmentSettings.apartmentName}. Immediate technician dispatch required.`,
              timestamp: '2026-09-10 09:48',
              status: 'active',
              automated: true,
              channel: 'SMS',
            };

            setAlerts((a) => [newAlert, ...a]);

            const newAnn: StaffAnnouncement = {
              id: `ANN-AUTO-${Date.now()}`,
              title: `⚠️ CRITICAL REPAIR SCHEDULED: ${item.name} (${item.location})`,
              type: 'critical_repair',
              severity: 'urgent',
              content: `Attention all residents and staff of ${apartmentSettings.apartmentName}: ${item.name} is currently offline for critical repair. ${notes || 'Repair technicians have been dispatched.'}`,
              equipmentId: item.id,
              equipmentName: item.name,
              affectedAreas: [item.location],
              effectiveDate: CURRENT_DATE_STRING,
              pinned: true,
              author: `${apartmentSettings.apartmentName} Facility Management`,
              createdAt: '2026-09-10 09:48',
              automated: true,
              acknowledgedCount: 1,
            };

            setAnnouncements((ann) => [newAnn, ...ann]);
            sounds.playUrgentAlert();

            setToastMessage({
              type: 'warning',
              text: `Equipment marked CRITICAL. Automated technician alert & resident notice broadcasted!`,
            });
          } else {
            setToastMessage({
              type: 'success',
              text: `Equipment status updated to ${newStatus.toUpperCase()}`,
            });
          }

          return updated;
        }
        return item;
      })
    );
  };

  // Edit Existing Equipment Specs
  const handleEditEquipment = (updated: Equipment) => {
    setEquipment((prev) => prev.map((eq) => (eq.id === updated.id ? updated : eq)));
    sounds.playSuccessSound();
    setToastMessage({
      type: 'success',
      text: `Updated equipment specifications for ${updated.name}`,
    });
  };

  // 2. Add new equipment
  const handleAddEquipment = (newEq: Omit<Equipment, 'id'>) => {
    const id = `EQ-${Math.floor(200 + Math.random() * 800)}`;
    setEquipment((prev) => [{ id, ...newEq }, ...prev]);
    sounds.playSuccessSound();
    setToastMessage({
      type: 'success',
      text: `Added equipment: ${newEq.name} (${id})`,
    });
  };

  // 3. Technician Alert Actions
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, status: 'acknowledged', acknowledgedAt: '2026-09-10 09:50' }
          : a
      )
    );
    sounds.playReminderChime();
    setToastMessage({
      type: 'info',
      text: `Technician alert acknowledged`,
    });
  };

  const handleUpdateAlertStatus = (
    alertId: string,
    status: 'active' | 'acknowledged' | 'in_progress' | 'resolved'
  ) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status } : a))
    );
    if (status === 'resolved') {
      sounds.playSuccessSound();
    }
  };

  const handleDispatchAlert = (alertData: Omit<TechnicianAlert, 'id'>) => {
    const newAlert: TechnicianAlert = {
      id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
      ...alertData,
    };
    setAlerts((prev) => [newAlert, ...prev]);

    // Update technician assigned count
    setTechnicians((prev) =>
      prev.map((t) =>
        t.id === alertData.technicianId
          ? { ...t, activeAlertsCount: t.activeAlertsCount + 1, status: 'dispatched' }
          : t
      )
    );

    setToastMessage({
      type: 'success',
      text: `Automated alert dispatched to ${alertData.technicianName} via ${alertData.channel}`,
    });
  };

  // 4. Staff Announcements Actions
  const handleAcknowledgeAnnouncement = (announcementId: string) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === announcementId
          ? { ...a, acknowledgedCount: a.acknowledgedCount + 1 }
          : a
      )
    );
    sounds.playReminderChime();
    setToastMessage({
      type: 'success',
      text: `Signed staff acknowledgement for notice`,
    });
  };

  const handlePublishAnnouncement = (ann: Omit<StaffAnnouncement, 'id'>) => {
    const newAnn: StaffAnnouncement = {
      id: `ANN-${Math.floor(100 + Math.random() * 900)}`,
      ...ann,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    setToastMessage({
      type: 'success',
      text: `Announcement broadcasted to ${apartmentSettings.apartmentName} staff & residents`,
    });
  };

  // 5. Inspection Reminders Actions
  const handleToggleChecklist = (taskId: string, checkId: string) => {
    setInspections((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedChecklist = task.checklist.map((c) =>
            c.id === checkId ? { ...c, done: !c.done } : c
          );
          return { ...task, checklist: updatedChecklist };
        }
        return task;
      })
    );
  };

  const handleCompleteInspection = (taskId: string) => {
    setInspections((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedChecklist = task.checklist.map((c) => ({ ...c, done: true }));
          return {
            ...task,
            status: 'completed',
            checklist: updatedChecklist,
            completedAt: '2026-09-10 09:55',
            completedBy: task.assignedTechnicianName,
          };
        }
        return task;
      })
    );
    sounds.playSuccessSound();
    setToastMessage({
      type: 'success',
      text: `Inspection signed off & compliance logged for safety audit`,
    });
  };

  const handleSnoozeInspection = (taskId: string, hours: number) => {
    setInspections((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            snoozedUntil: `Snoozed +${hours}h`,
          };
        }
        return task;
      })
    );
    setToastMessage({
      type: 'info',
      text: `Inspection reminder snoozed for ${hours} hours`,
    });
  };

  const handleAddInspection = (newTask: Omit<InspectionTask, 'id'>) => {
    const id = `INSP-${Math.floor(400 + Math.random() * 600)}`;
    setInspections((prev) => [{ id, ...newTask }, ...prev]);
    sounds.playSuccessSound();
    setToastMessage({
      type: 'success',
      text: `Scheduled inspection reminder task: ${newTask.title}`,
    });
  };

  // 6. Payments & Automatic Ticking of Overdue Payments
  const handlePaymentSuccess = (invoiceId: string, txnId: string, paymentMethod: string) => {
    const targetInvoice = calculatedInvoices.find((i) => i.id === invoiceId);

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'paid',
              paidAt: CURRENT_DATE_STRING,
              paymentMethod: paymentMethod,
              transactionId: txnId,
            }
          : inv
      )
    );

    sounds.playSuccessSound();

    setToastMessage({
      type: 'success',
      text: targetInvoice
        ? `✓ Payment of ${formatINR(targetInvoice.totalAmountDue)} received! Bill ${targetInvoice.invoiceNumber} automatically ticked & settled.`
        : `✓ Payment received! Bill successfully ticked & cleared.`,
    });
  };

  const handleSettlePayment = (invoiceId: string) => {
    const txnId = `TXN-OFFLINE-${Date.now().toString().slice(-6)}`;
    handlePaymentSuccess(invoiceId, txnId, 'Society Direct Counter Cash/Cheque');
  };

  // Automated Notification System for Late Payment Notices in Rupees (₹)
  const handleRunLatePaymentDispatcher = () => {
    const overdueList = calculatedInvoices.filter((i) => i.status === 'overdue');

    if (overdueList.length === 0) {
      setToastMessage({
        type: 'info',
        text: 'Zero overdue invoices found. All payments are currently in good standing.',
      });
      return;
    }

    const newNoticesGenerated: LatePaymentNotice[] = [];

    overdueList.forEach((inv) => {
      let stage: 'First Reminder' | 'Second Warning' | 'Final Demand Notice' = 'First Reminder';
      if (inv.daysOverdue >= 14) {
        stage = 'Final Demand Notice';
      } else if (inv.daysOverdue >= 7) {
        stage = 'Second Warning';
      }

      const notice: LatePaymentNotice = {
        id: `NOT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        recipient: inv.recipient,
        recipientEmail: inv.recipientEmail,
        originalAmount: inv.baseAmount,
        fineAmount: inv.accruedFine,
        totalDue: inv.totalAmountDue,
        daysOverdue: inv.daysOverdue,
        noticeStage: stage,
        generatedAt: '2026-09-10 09:52',
        status: 'delivered',
        message: `Automated ${stage} from ${apartmentSettings.apartmentName}: Bill ${inv.invoiceNumber} is ${inv.daysOverdue} days past due date (${inv.dueDate}). A late penalty fine of ${formatINR(inv.accruedFine)} has accrued. Total payable is ${formatINR(inv.totalAmountDue)}. Pay online via UPI to automatically tick and settle your overdue payment.`,
      };

      newNoticesGenerated.push(notice);
    });

    // Update invoices with notice count
    setInvoices((prev) =>
      prev.map((inv) => {
        const match = overdueList.find((o) => o.id === inv.id);
        if (match) {
          return {
            ...inv,
            lateNoticesSentCount: (inv.lateNoticesSentCount || 0) + 1,
            lastNoticeSentDate: CURRENT_DATE_STRING,
          };
        }
        return inv;
      })
    );

    setLateNotices((prev) => [...newNoticesGenerated, ...prev]);
    sounds.playSuccessSound();

    const totalFinesAccrued = overdueList.reduce((acc, curr) => acc + curr.accruedFine, 0);

    setToastMessage({
      type: 'warning',
      text: `Automated Dispatcher: Sent ${newNoticesGenerated.length} late notices with ${formatINR(totalFinesAccrued)} accrued fines!`,
    });
  };

  const handleSendSingleLateNotice = (invoice: CalculatedInvoice) => {
    let stage: 'First Reminder' | 'Second Warning' | 'Final Demand Notice' = 'First Reminder';
    if (invoice.daysOverdue >= 14) {
      stage = 'Final Demand Notice';
    } else if (invoice.daysOverdue >= 7) {
      stage = 'Second Warning';
    }

    const notice: LatePaymentNotice = {
      id: `NOT-${Date.now()}`,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      recipient: invoice.recipient,
      recipientEmail: invoice.recipientEmail,
      originalAmount: invoice.baseAmount,
      fineAmount: invoice.accruedFine,
      totalDue: invoice.totalAmountDue,
      daysOverdue: invoice.daysOverdue,
      noticeStage: stage,
      generatedAt: '2026-09-10 09:55',
      status: 'delivered',
      message: `Direct notice from ${apartmentSettings.apartmentName}: Invoice ${invoice.invoiceNumber} is ${invoice.daysOverdue} days overdue. Accrued fine: ${formatINR(invoice.accruedFine)}. Total due: ${formatINR(invoice.totalAmountDue)}. Please pay immediately via UPI to clear late penalties.`,
    };

    setLateNotices((prev) => [notice, ...prev]);

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoice.id
          ? {
              ...inv,
              lateNoticesSentCount: (inv.lateNoticesSentCount || 0) + 1,
              lastNoticeSentDate: CURRENT_DATE_STRING,
            }
          : inv
      )
    );

    sounds.playSuccessSound();
    setToastMessage({
      type: 'success',
      text: `Delinquency notice dispatched to ${invoice.recipientEmail}`,
    });
  };

  const handleAddInvoice = (newInv: Omit<MaintenanceInvoice, 'id'>) => {
    const id = `INV-${Date.now()}`;
    setInvoices((prev) => [{ id, ...newInv }, ...prev]);
    sounds.playSuccessSound();
    setToastMessage({
      type: 'success',
      text: `Created maintenance bill: ${newInv.invoiceNumber} in Rupees (₹)`,
    });
  };

  // House Owner Login & Carpet Area Calculation handler
  const handleSaveOwnerProfile = (newProfile: HouseOwnerProfile) => {
    setOwnerProfile(newProfile);

    // Sync or generate invoice for this house owner
    setInvoices((prev) => {
      const existingIdx = prev.findIndex((inv) => {
        if (newProfile.flatNumber && inv.flatOrEntity) {
          const cleanFlat = newProfile.flatNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
          const cleanInvFlat = inv.flatOrEntity.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (cleanInvFlat.includes(cleanFlat) || cleanFlat.includes(cleanInvFlat)) return true;
        }
        if (newProfile.ownerName && inv.recipient) {
          if (inv.recipient.toLowerCase().includes(newProfile.ownerName.toLowerCase())) return true;
        }
        return false;
      });

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          baseAmount: newProfile.calculatedMaintenance,
          recipient: newProfile.ownerName,
          flatOrEntity: newProfile.flatNumber,
          notes: `Calculated for ${newProfile.carpetArea} sq ft carpet area @ ₹1.50/sq ft`,
        };
        return updated;
      } else {
        const newInvoice: MaintenanceInvoice = {
          id: `INV-OWNER-${Date.now()}`,
          invoiceNumber: `AA-2026-${Math.floor(200 + Math.random() * 700)}`,
          title: `Monthly Society Maintenance (${newProfile.flatNumber})`,
          recipient: newProfile.ownerName,
          flatOrEntity: newProfile.flatNumber,
          recipientEmail: newProfile.email || 'owner@aashapura.in',
          recipientPhone: newProfile.phone || '+91 98200 11223',
          serviceType: 'Monthly Society Maintenance',
          issueDate: CURRENT_DATE_STRING,
          dueDate: '2026-09-20',
          baseAmount: newProfile.calculatedMaintenance,
          fixedPenaltyFee: apartmentSettings.defaultFixedFine || 250,
          dailyFineRate: apartmentSettings.defaultDailyFineRate || 25,
          status: 'pending',
          lateNoticesSentCount: 0,
          notes: `Carpet Area: ${newProfile.carpetArea} sq. ft. @ ₹1.50/sq ft = ₹${newProfile.calculatedMaintenance}/month`,
        };
        return [newInvoice, ...prev];
      }
    });

    setToastMessage({
      type: 'success',
      text: `Welcome ${newProfile.ownerName} (${newProfile.flatNumber})! Carpet Area: ${newProfile.carpetArea} sq ft. Maintenance calculated: ₹${newProfile.calculatedMaintenance}/mo.`,
    });
  };

  const handleOwnerLogout = () => {
    setOwnerProfile(DEFAULT_OWNER_PROFILE);
    sounds.playSuccessSound();
    setToastMessage({
      type: 'info',
      text: 'Logged out of House Owner profile. You can browse the portal or log in with another flat.',
    });
  };

  // Fleet-wide Auto-Scan Simulator
  const handleTriggerAutoScan = () => {
    setIsScanning(true);
    sounds.playReminderChime();

    setTimeout(() => {
      setIsScanning(false);
      sounds.playSuccessSound();

      // Check overdue inspections and flag
      const overdueInsps = inspections.filter(
        (i) => i.status !== 'completed' && new Date(i.dueDate).getTime() < new Date(CURRENT_DATE_STRING).getTime()
      );

      const overdueBills = calculatedInvoices.filter((i) => i.status === 'overdue');

      setToastMessage({
        type: 'info',
        text: `Society Scan Complete: ${equipment.length} equipment units checked. ${overdueInsps.length} inspections due. ${overdueBills.length} late bills monitored for ${apartmentSettings.apartmentName}.`,
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 font-sans flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold max-w-md ${
              toastMessage.type === 'warning'
                ? 'bg-amber-900 text-amber-50 border-amber-800'
                : toastMessage.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-indigo-900 text-white border-indigo-800'
            }`}
          >
            {toastMessage.type === 'warning' ? (
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            ) : (
              <Check className="h-4 w-4 text-emerald-400 stroke-[3] shrink-0" />
            )}
            <span className="flex-1">{toastMessage.text}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-white/60 hover:text-white p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        apartmentSettings={apartmentSettings}
        ownerProfile={ownerProfile}
        onOpenOwnerLogin={() => setIsOwnerLoginModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalPendingAmount={totalPendingAmount}
        activeAlertsCount={activeAlertsCount}
        criticalAnnouncementsCount={criticalAnnouncementsCount}
        dueInspectionsCount={dueInspectionsCount}
        alerts={alerts}
        announcements={announcements}
        onTriggerAutoScan={handleTriggerAutoScan}
        onOpenSettings={() => setIsApartmentSettingsModalOpen(true)}
        isScanning={isScanning}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            equipment={equipment}
            alerts={alerts}
            announcements={announcements}
            inspections={inspections}
            invoices={calculatedInvoices}
            lateNotices={lateNotices}
            apartmentSettings={apartmentSettings}
            ownerProfile={ownerProfile}
            onOpenOwnerLogin={() => setIsOwnerLoginModalOpen(true)}
            setActiveTab={setActiveTab}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onAcknowledgeAnnouncement={handleAcknowledgeAnnouncement}
            onQuickToggleInspectionCheck={handleToggleChecklist}
            onCompleteInspection={handleCompleteInspection}
            onRunLatePaymentDispatcher={handleRunLatePaymentDispatcher}
            onOpenNoticeModal={(inv) => setSelectedInvoiceForNotice(inv)}
            onOpenPaymentModal={(inv) => setSelectedInvoiceForPayment(inv)}
            onSelectEquipmentForAlert={(eq) => {
              setSelectedEquipmentForAlert(eq);
              setIsNewAlertModalOpen(true);
            }}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentTracker
            equipment={equipment}
            technicians={technicians}
            onUpdateStatus={handleUpdateEquipmentStatus}
            onOpenAddModal={() => setIsAddEquipmentModalOpen(true)}
            onOpenEditModal={(eq) => setSelectedEquipmentForEdit(eq)}
            onDispatchAlert={(eq) => {
              setSelectedEquipmentForAlert(eq);
              setIsNewAlertModalOpen(true);
            }}
            onScheduleInspection={(eq) => {
              setSelectedEquipmentForAlert(eq);
              setIsNewInspectionModalOpen(true);
            }}
          />
        )}

        {activeTab === 'alerts' && (
          <TechnicianAlerts
            alerts={alerts}
            technicians={technicians}
            equipment={equipment}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onUpdateAlertStatus={handleUpdateAlertStatus}
            onOpenNewAlertModal={() => {
              setSelectedEquipmentForAlert(null);
              setIsNewAlertModalOpen(true);
            }}
          />
        )}

        {activeTab === 'announcements' && (
          <StaffAnnouncements
            announcements={announcements}
            equipment={equipment}
            onAcknowledgeAnnouncement={handleAcknowledgeAnnouncement}
            onOpenNewAnnouncementModal={() => setIsNewAnnouncementModalOpen(true)}
          />
        )}

        {activeTab === 'inspections' && (
          <InspectionReminders
            inspections={inspections}
            equipment={equipment}
            technicians={technicians}
            onToggleChecklist={handleToggleChecklist}
            onCompleteInspection={handleCompleteInspection}
            onSnoozeInspection={handleSnoozeInspection}
            onOpenNewInspectionModal={() => setIsNewInspectionModalOpen(true)}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentFinesManager
            invoices={calculatedInvoices}
            lateNotices={lateNotices}
            equipment={equipment}
            apartmentSettings={apartmentSettings}
            ownerProfile={ownerProfile}
            onOpenOwnerLogin={() => setIsOwnerLoginModalOpen(true)}
            onSettlePayment={handleSettlePayment}
            onOpenPaymentModal={(inv) => setSelectedInvoiceForPayment(inv)}
            onSendSingleLateNotice={handleSendSingleLateNotice}
            onRunLatePaymentDispatcher={handleRunLatePaymentDispatcher}
            onOpenNoticeModal={(inv) => setSelectedInvoiceForNotice(inv)}
            onOpenNewInvoiceModal={() => setIsNewInvoiceModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">{apartmentSettings.apartmentName}</span>
            <span>&bull;</span>
            <span>Maintenance, Automated Alert & In-App Payment Portal (Rupees ₹)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsApartmentSettingsModalOpen(true)}
              className="text-slate-700 hover:text-slate-950 font-semibold underline"
            >
              Edit Society Settings
            </button>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              UPI & Payment Gateway Online
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 0. House Owner Login & Carpet Area Maintenance Calculator Modal */}
      <OwnerLoginModal
        currentProfile={ownerProfile}
        apartmentSettings={apartmentSettings}
        isOpen={isOwnerLoginModalOpen}
        onClose={() => setIsOwnerLoginModalOpen(false)}
        onSaveProfile={handleSaveOwnerProfile}
        onLogout={handleOwnerLogout}
      />

      {/* 1. Apartment Settings Modal (Edit Society Name, UPI, Fine Policy) */}
      {isApartmentSettingsModalOpen && (
        <ApartmentSettingsModal
          settings={apartmentSettings}
          onClose={() => setIsApartmentSettingsModalOpen(false)}
          onSave={handleSaveApartmentSettings}
        />
      )}

      {/* 2. In-App Payment Checkout Modal (UPI, QR Code, Cards, NetBanking in Rupees ₹) */}
      {selectedInvoiceForPayment && (
        <PaymentCheckoutModal
          invoice={selectedInvoiceForPayment}
          apartmentSettings={apartmentSettings}
          onClose={() => setSelectedInvoiceForPayment(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* 3. Edit Equipment Modal */}
      {selectedEquipmentForEdit && (
        <EditEquipmentModal
          equipment={selectedEquipmentForEdit}
          technicians={technicians}
          onClose={() => setSelectedEquipmentForEdit(null)}
          onSave={handleEditEquipment}
        />
      )}

      {/* 4. Formal Late Notice Letter Modal */}
      {selectedInvoiceForNotice && (
        <LateNoticeModal
          invoice={selectedInvoiceForNotice}
          apartmentSettings={apartmentSettings}
          onClose={() => setSelectedInvoiceForNotice(null)}
          onSettlePayment={handleSettlePayment}
          onOpenPaymentModal={(inv) => {
            setSelectedInvoiceForNotice(null);
            setSelectedInvoiceForPayment(inv);
          }}
        />
      )}

      {/* 5. Add Equipment Modal */}
      {isAddEquipmentModalOpen && (
        <NewEquipmentModal
          technicians={technicians}
          onClose={() => setIsAddEquipmentModalOpen(false)}
          onAddEquipment={handleAddEquipment}
        />
      )}

      {/* 6. New Alert Modal */}
      {isNewAlertModalOpen && (
        <NewAlertModal
          equipmentList={equipment}
          technicians={technicians}
          preSelectedEquipment={selectedEquipmentForAlert}
          onClose={() => {
            setIsNewAlertModalOpen(false);
            setSelectedEquipmentForAlert(null);
          }}
          onDispatchAlert={handleDispatchAlert}
        />
      )}

      {/* 7. New Announcement Modal */}
      {isNewAnnouncementModalOpen && (
        <NewAnnouncementModal
          equipmentList={equipment}
          onClose={() => setIsNewAnnouncementModalOpen(false)}
          onPublishAnnouncement={handlePublishAnnouncement}
        />
      )}

      {/* 8. New Inspection Modal */}
      {isNewInspectionModalOpen && (
        <NewInspectionModal
          equipmentList={equipment}
          technicians={technicians}
          onClose={() => setIsNewInspectionModalOpen(false)}
          onAddInspection={handleAddInspection}
        />
      )}

      {/* 9. New Invoice Modal */}
      {isNewInvoiceModalOpen && (
        <NewInvoiceModal
          equipmentList={equipment}
          apartmentSettings={apartmentSettings}
          onClose={() => setIsNewInvoiceModalOpen(false)}
          onAddInvoice={handleAddInvoice}
        />
      )}
    </div>
  );
}
