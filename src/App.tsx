import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { JobCardList } from './components/JobCardList';
import { JobCardModal } from './components/JobCardModal';
import { InvoiceGenerator } from './components/InvoiceGenerator';
import { InventoryManager } from './components/InventoryManager';
import { MechanicView } from './components/MechanicView';
import { CustomerPortal } from './components/CustomerPortal';
import { MobileAppView } from './components/MobileAppView';
import { BreakdownManager } from './components/BreakdownManager';
import { storage } from './services/storage';
import { 
  JobCard, 
  SparePart, 
  Mechanic, 
  ServicePackage, 
  BreakdownRequest, 
  ServiceStatus, 
  PaymentStatus, 
  PaymentMethod,
  WorkshopStats
} from './types';
import { WORKSHOP_DETAILS } from './data/mockData';

export function App() {
  const [currentTab, setCurrentTab] = useState<
    'dashboard' | 'inventory' | 'mechanic' | 'customer' | 'mobile-sim' | 'breakdown'
  >('dashboard');

  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [breakdownRequests, setBreakdownRequests] = useState<BreakdownRequest[]>([]);
  const [stats, setStats] = useState<WorkshopStats>(storage.getStats());

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isJobCardModalOpen, setIsJobCardModalOpen] = useState<boolean>(false);
  const [editingJobCard, setEditingJobCard] = useState<JobCard | null>(null);
  const [viewingInvoiceJobCard, setViewingInvoiceJobCard] = useState<JobCard | null>(null);

  // Load data from StorageService
  const refreshData = () => {
    setJobCards(storage.getJobCards());
    setSpareParts(storage.getParts());
    setMechanics(storage.getMechanics());
    setServicePackages(storage.getPackages());
    setBreakdownRequests(storage.getBreakdownRequests());
    setStats(storage.getStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Job Card Handlers
  const handleCreateOrUpdateJobCard = (cardData: Omit<JobCard, 'id' | 'createdAt' | 'liveUpdates'>) => {
    if (editingJobCard) {
      storage.updateJobCard(editingJobCard.id, cardData);
    } else {
      storage.createJobCard(cardData);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
    refreshData();
    setIsJobCardModalOpen(false);
    setEditingJobCard(null);
  };

  const handleEditJobCard = (card: JobCard) => {
    setEditingJobCard(card);
    setIsJobCardModalOpen(true);
  };

  const handleDeleteJobCard = (id: string) => {
    if (confirm(`Are you sure you want to delete Job Card ${id}?`)) {
      storage.deleteJobCard(id);
      refreshData();
    }
  };

  const handleUpdateStatus = (id: string, newStatus: ServiceStatus, message?: string) => {
    storage.updateJobStatus(id, newStatus, message);
    if (newStatus === 'Ready for Delivery' || newStatus === 'Delivered') {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.7 },
      });
    }
    refreshData();
  };

  const handleUpdatePayment = (jobCardId: string, status: PaymentStatus, method: PaymentMethod) => {
    storage.updateJobCard(jobCardId, { paymentStatus: status, paymentMethod: method });
    if (status === 'Paid') {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    refreshData();
    if (viewingInvoiceJobCard && viewingInvoiceJobCard.id === jobCardId) {
      setViewingInvoiceJobCard({ ...viewingInvoiceJobCard, paymentStatus: status, paymentMethod: method });
    }
  };

  // Inventory Handlers
  const handleRestockPart = (partId: string, quantity: number) => {
    storage.restockPart(partId, quantity);
    refreshData();
  };

  const handleAddPart = (newPart: Omit<SparePart, 'id'>) => {
    storage.addPart(newPart);
    refreshData();
  };

  // Mechanic checklist toggle
  const handleToggleComplaint = (jobCardId: string, complaintId: string) => {
    const card = jobCards.find(c => c.id === jobCardId);
    if (!card) return;
    const updatedComplaints = card.complaints.map(c => 
      c.id === complaintId ? { ...c, completed: !c.completed } : c
    );
    storage.updateJobCard(jobCardId, { complaints: updatedComplaints });
    refreshData();
  };

  // Mechanic Bay Note
  const handleAddBayNote = (jobCardId: string, note: string) => {
    const card = jobCards.find(c => c.id === jobCardId);
    if (!card) return;
    const newUpdate = {
      id: 'u-' + Date.now(),
      timestamp: new Date().toISOString(),
      stage: card.status,
      message: note,
    };
    storage.updateJobCard(jobCardId, {
      liveUpdates: [...(card.liveUpdates || []), newUpdate],
    });
    refreshData();
  };

  // Customer Online Booking
  const handleBookService = (booking: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    vehicleNumber: string;
    vehicleBrand: any;
    vehicleModel: string;
    packageTitle: string;
    notes: string;
    bookingType: 'Doorstep Pickup' | 'Workshop Drop-in';
  }) => {
    const pkg = servicePackages.find(p => p.title === booking.packageTitle) || servicePackages[0];
    const initialMech = mechanics[0];

    storage.createJobCard({
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      customerAddress: booking.customerAddress,
      vehicleNumber: booking.vehicleNumber,
      vehicleBrand: booking.vehicleBrand,
      vehicleModel: booking.vehicleModel,
      vehicleYear: new Date().getFullYear(),
      odometerKm: 10000,
      fuelLevel: '1/2',
      assignedMechanicId: initialMech.id,
      assignedMechanicName: initialMech.name,
      status: 'Received',
      servicePackage: pkg.title,
      complaints: [
        { id: '1', text: `${booking.bookingType}: ${pkg.title}`, completed: false },
        { id: '2', text: booking.notes || 'Full diagnostic inspection', completed: false },
      ],
      damagePoints: [],
      items: [
        {
          id: 'item-1',
          name: `${pkg.title} (Labor)`,
          quantity: 1,
          unitPrice: pkg.price,
          total: pkg.price,
          isLabor: true,
        },
      ],
      laborCost: pkg.price,
      partsCost: 0,
      discount: 0,
      gstRate: 18,
      totalAmount: Math.round(pkg.price * 1.18),
      paymentStatus: 'Pending',
      paymentMethod: 'GPay / UPI',
      estimatedCompletion: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      customerApprovedEstimate: true,
      notes: `${booking.bookingType} requested from ${booking.customerAddress}. Notes: ${booking.notes}`,
    });

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
    });
    refreshData();
  };

  // Emergency Kottar Breakdown Handlers
  const handleRequestBreakdown = (req: Omit<BreakdownRequest, 'id' | 'timestamp' | 'status'>) => {
    storage.createBreakdownRequest(req);
    refreshData();
  };

  const handleUpdateBreakdownStatus = (id: string, status: 'Pending' | 'Mechanic Dispatched' | 'Resolved', mechanicName?: string) => {
    storage.updateBreakdownStatus(id, status, mechanicName);
    refreshData();
  };

  const handleConvertBreakdownToJobCard = (req: BreakdownRequest) => {
    const defaultPkg = servicePackages[0];
    const mech = mechanics.find(m => req.assignedMechanic?.includes(m.name)) || mechanics[0];

    storage.createJobCard({
      customerName: req.customerName,
      customerPhone: req.customerPhone,
      customerAddress: req.location,
      vehicleNumber: req.vehicleNumber,
      vehicleBrand: 'Royal Enfield',
      vehicleModel: req.bikeModel,
      vehicleYear: 2022,
      odometerKm: 12000,
      fuelLevel: '1/2',
      assignedMechanicId: mech.id,
      assignedMechanicName: mech.name,
      status: 'In Progress',
      servicePackage: 'Emergency Breakdown Repair',
      complaints: [
        { id: 'c1', text: `Roadside issue: ${req.issue}`, completed: false },
      ],
      damagePoints: [],
      items: [
        {
          id: 'item-sos',
          name: 'Roadside Breakdown Assistance & Tuning (Labor)',
          quantity: 1,
          unitPrice: 450,
          total: 450,
          isLabor: true,
        },
      ],
      laborCost: 450,
      partsCost: 0,
      discount: 0,
      gstRate: 18,
      totalAmount: Math.round(450 * 1.18),
      paymentStatus: 'Pending',
      paymentMethod: 'Cash',
      estimatedCompletion: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      customerApprovedEstimate: true,
      notes: `Breakdown in Kottar: ${req.location}. Reported problem: ${req.issue}`,
    });

    storage.updateBreakdownStatus(req.id, 'Resolved');
    refreshData();
    setCurrentTab('dashboard');
  };

  const handleResetData = () => {
    if (confirm('Reset all demo data back to default sample records for Annam Motors Kottar?')) {
      storage.resetAll();
      refreshData();
    }
  };

  const pendingBreakdownsCount = breakdownRequests.filter(r => r.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewJobCard={() => {
          setEditingJobCard(null);
          setIsJobCardModalOpen(true);
        }}
        onResetData={handleResetData}
        pendingBreakdownsCount={pendingBreakdownsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <JobCardList
            jobCards={jobCards}
            stats={stats}
            onNewJobCard={() => {
              setEditingJobCard(null);
              setIsJobCardModalOpen(true);
            }}
            onEditJobCard={handleEditJobCard}
            onDeleteJobCard={handleDeleteJobCard}
            onViewInvoice={(card) => setViewingInvoiceJobCard(card)}
            onUpdateStatus={handleUpdateStatus}
            searchQuery={searchQuery}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryManager
            spareParts={spareParts}
            onRestock={handleRestockPart}
            onAddPart={handleAddPart}
          />
        )}

        {currentTab === 'mechanic' && (
          <MechanicView
            mechanics={mechanics}
            jobCards={jobCards}
            spareParts={spareParts}
            onUpdateStatus={handleUpdateStatus}
            onToggleComplaint={handleToggleComplaint}
            onAddBayNote={handleAddBayNote}
          />
        )}

        {currentTab === 'customer' && (
          <CustomerPortal
            jobCards={jobCards}
            servicePackages={servicePackages}
            onBookService={handleBookService}
            onRequestBreakdown={handleRequestBreakdown}
          />
        )}

        {currentTab === 'breakdown' && (
          <BreakdownManager
            requests={breakdownRequests}
            mechanics={mechanics}
            onUpdateStatus={handleUpdateBreakdownStatus}
            onConvertBreakdownToJobCard={handleConvertBreakdownToJobCard}
          />
        )}

        {currentTab === 'mobile-sim' && (
          <MobileAppView
            jobCards={jobCards}
            spareParts={spareParts}
            servicePackages={servicePackages}
            mechanics={mechanics}
            onNewJobCard={() => {
              setEditingJobCard(null);
              setIsJobCardModalOpen(true);
            }}
            onViewInvoice={(card) => setViewingInvoiceJobCard(card)}
            onBookService={handleBookService}
          />
        )}
      </main>

      {/* Modals */}
      <JobCardModal
        isOpen={isJobCardModalOpen}
        onClose={() => {
          setIsJobCardModalOpen(false);
          setEditingJobCard(null);
        }}
        onSave={handleCreateOrUpdateJobCard}
        initialData={editingJobCard}
        mechanics={mechanics}
        servicePackages={servicePackages}
        spareParts={spareParts}
      />

      {viewingInvoiceJobCard && (
        <InvoiceGenerator
          jobCard={viewingInvoiceJobCard}
          onClose={() => setViewingInvoiceJobCard(null)}
          onUpdatePayment={handleUpdatePayment}
        />
      )}

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 text-center shadow-inner">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src="/assets/logo.jpg" alt="Logo" className="w-5 h-5 rounded-full object-cover" />
            <span className="font-bold text-slate-800">Annam Motors Bike Workshop & Service Center</span>
            <span>•</span>
            <span>Kottar, Nagercoil</span>
          </div>
          <div>
            Helpline: <a href={`tel:${WORKSHOP_DETAILS.phones[0]}`} className="text-amber-600 font-bold hover:underline">{WORKSHOP_DETAILS.phones[0]}</a> | GSTIN: {WORKSHOP_DETAILS.gstin}
          </div>
        </div>
      </footer>
    </div>
  );

}

export default App;
