import React, { useState } from 'react';
import { 
  Search, 
  Bike, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  ThumbsUp, 
  Truck,
  Phone
} from 'lucide-react';
import { JobCard, ServicePackage, BreakdownRequest } from '../types';
import { WORKSHOP_DETAILS } from '../data/mockData';

interface CustomerPortalProps {
  jobCards: JobCard[];
  servicePackages: ServicePackage[];
  onBookService: (booking: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    vehicleNumber: string;
    vehicleBrand: any;
    vehicleModel: string;
    packageTitle: string;
    notes: string;
    bookingType: 'Doorstep Pickup' | 'Workshop Drop-in';
  }) => void;
  onRequestBreakdown: (req: Omit<BreakdownRequest, 'id' | 'timestamp' | 'status'>) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  jobCards,
  servicePackages,
  onBookService,
  onRequestBreakdown,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('TN 74 AX 4419');
  const [selectedCard, setSelectedCard] = useState<JobCard | null>(
    jobCards.find(c => c.vehicleNumber.includes('4419')) || jobCards[0] || null
  );

  const [activeSubTab, setActiveSubTab] = useState<'track' | 'book' | 'history' | 'sos'>('track');

  // Booking Form State
  const [bName, setBName] = useState('');
  const [bPhone, setBPhone] = useState('');
  const [bAddress, setBAddress] = useState('Kottar, Nagercoil');
  const [bVehicleNo, setBVehicleNo] = useState('TN 74 ');
  const [bBrand, setBBrand] = useState('Royal Enfield');
  const [bModel, setBModel] = useState('Classic 350');
  const [bPackage, setBPackage] = useState(servicePackages[0]?.title || 'General Periodic Maintenance');
  const [bType, setBType] = useState<'Doorstep Pickup' | 'Workshop Drop-in'>('Doorstep Pickup');
  const [bNotes, setBNotes] = useState('');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  // SOS Form State
  const [sosName, setSosName] = useState('');
  const [sosPhone, setSosPhone] = useState('');
  const [sosLocation, setSosLocation] = useState('Chettikulam Main Rd / Kottar Market');
  const [sosVehicleNo, setSosVehicleNo] = useState('TN 74 ');
  const [sosBikeModel, setSosBikeModel] = useState('Royal Enfield Bullet');
  const [sosIssue, setSosIssue] = useState('Clutch wire broken / Engine not starting');
  const [sosSuccessMsg, setSosSuccessMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const cleaned = searchQuery.replace(/\s+/g, '').toLowerCase();
    const found = jobCards.find(
      c => c.vehicleNumber.replace(/\s+/g, '').toLowerCase().includes(cleaned) ||
           c.customerPhone.includes(searchQuery.trim()) ||
           c.id.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (found) {
      setSelectedCard(found);
    } else {
      alert(`No active service record found for "${searchQuery}". Please check your TN registration number or contact Annam Motors helpline.`);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName || !bPhone || !bVehicleNo) return;

    onBookService({
      customerName: bName,
      customerPhone: bPhone,
      customerAddress: bAddress,
      vehicleNumber: bVehicleNo.toUpperCase().trim(),
      vehicleBrand: bBrand,
      vehicleModel: bModel,
      packageTitle: bPackage,
      notes: bNotes,
      bookingType: bType,
    });

    setBookingSuccessMsg(`Service booked successfully for ${bVehicleNo}! Our Kottar service advisor will contact you on ${bPhone}.`);
    setBName('');
    setBPhone('');
  };

  const handleSosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sosName || !sosPhone || !sosLocation) return;

    onRequestBreakdown({
      customerName: sosName,
      customerPhone: sosPhone,
      location: sosLocation,
      vehicleNumber: sosVehicleNo.toUpperCase().trim(),
      bikeModel: sosBikeModel,
      issue: sosIssue,
    });

    setSosSuccessMsg(`Emergency Roadside Assistance requested! Mechanic is being dispatched to ${sosLocation}. Annam Motors Kottar helpline: 9842178450.`);
  };

  const STAGES_TIMELINE = [
    { key: 'Received', label: 'Vehicle Received', desc: 'Checked in at Kottar workshop' },
    { key: 'Inspection', label: '32-Point Diagnostic', desc: 'Mechanical inspection by Chief Mechanic' },
    { key: 'In Progress', label: 'Servicing on Bay', desc: 'Oil flush, parts replacement & tuning' },
    { key: 'Quality Check', label: 'Test Drive & QC', desc: 'Road test & multi-point check' },
    { key: 'Ready for Delivery', label: 'Ready for Pickup', desc: 'Foam wash & mirror polish complete' },
  ];

  const getStageIndex = (stage: string) => {
    const idx = STAGES_TIMELINE.findIndex(s => s.key === stage);
    if (stage === 'Delivered') return 5;
    return idx >= 0 ? idx : 0;
  };

  const currentStageIndex = selectedCard ? getStageIndex(selectedCard.status) : 0;

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('track')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'track'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Live Vehicle Tracker</span>
          </button>

          <button
            onClick={() => setActiveSubTab('book')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'book'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Book Service / Doorstep Pickup</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Service Passport</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'sos'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse'
                : 'bg-rose-50 text-rose-700 hover:text-rose-900 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Kottar Breakdown SOS</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden lg:flex items-center gap-2 font-medium">
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          <span>Kottar Chettikulam, Nagercoil</span>
        </div>
      </div>

      {/* TAB 1: Live Vehicle Tracker */}
      {activeSubTab === 'track' && (
        <div className="space-y-6">
          {/* Quick Search Header */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                Real-Time Service Progress
              </span>
              <h2 className="text-2xl font-black text-slate-900 font-display mt-1">
                Track Your Bike's Repair Live
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Enter your Tamil Nadu vehicle registration number (e.g. TN 74 AX 4419) to view live bay status, replaced spare parts, and estimated delivery.
              </p>

              <form onSubmit={handleSearch} className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter Reg No: TN 74 AX 4419 or Phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono font-bold text-amber-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md"
                >
                  Track Vehicle
                </button>
              </form>

              {/* Sample quick search pills */}
              <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                <span>Quick demo:</span>
                {jobCards.slice(0, 3).map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSearchQuery(c.vehicleNumber); setSelectedCard(c); }}
                    className="bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-mono text-[11px] border border-slate-200 font-bold transition"
                  >
                    {c.vehicleNumber} ({c.vehicleModel.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Card Details */}
          {selectedCard ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Animated Timeline */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                {/* Vehicle Header Card */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-50 text-amber-700 border border-amber-300 rounded-2xl">
                      <Bike className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-lg text-amber-800">
                          {selectedCard.vehicleNumber}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                          {selectedCard.id}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {selectedCard.vehicleBrand} - {selectedCard.vehicleModel} ({selectedCard.vehicleYear})
                      </h3>
                      <p className="text-xs text-slate-600">
                        Owner: <strong className="text-slate-900">{selectedCard.customerName}</strong> • {selectedCard.customerAddress}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-500">Estimated Delivery:</div>
                    <div className="text-sm font-black text-emerald-600 flex items-center gap-1 mt-0.5">
                      <Clock className="w-4 h-4" />
                      {new Date(selectedCard.estimatedCompletion).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}, Today
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Mechanic: <span className="text-slate-900 font-bold">{selectedCard.assignedMechanicName}</span>
                    </div>
                  </div>
                </div>

                {/* Animated Stepper Progress */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Service Stage Timeline
                  </h4>

                  <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                    {STAGES_TIMELINE.map((stage, idx) => {
                      const isPast = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const isFuture = idx > currentStageIndex;

                      return (
                        <div key={stage.key} className="relative group">
                          {/* Dot Icon */}
                          <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                            isPast
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-amber-500 border-white text-slate-950 shadow-md shadow-amber-500/50 animate-pulse'
                              : 'bg-slate-100 border-slate-300 text-slate-400'
                          }`}>
                            {isPast ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[11px] font-bold">{idx + 1}</span>}
                          </div>

                          {/* Content */}
                          <div className={`pl-3 ${isFuture ? 'opacity-40' : 'opacity-100'}`}>
                            <div className="flex items-center gap-2">
                              <h5 className={`text-sm font-bold ${isCurrent ? 'text-amber-800' : 'text-slate-900'}`}>
                                {stage.label}
                              </h5>
                              {isCurrent && (
                                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300 animate-bounce">
                                  Current Stage
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">{stage.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Bay Updates & Mechanic Log */}
                {selectedCard.liveUpdates && selectedCard.liveUpdates.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5" /> Live Mechanic Log Notes
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedCard.liveUpdates.map(u => (
                        <div key={u.id} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs space-y-1 shadow-sm">
                          <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                            <span className="text-amber-700 uppercase">{u.stage}</span>
                            <span>{new Date(u.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-slate-800 font-medium">{u.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Cost Breakdown & Estimate Approval */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Service Package & Bill Details
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      selectedCard.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-amber-50 text-amber-800 border border-amber-300'
                    }`}>
                      {selectedCard.paymentStatus}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="text-slate-500 block">Active Service Plan:</span>
                    <p className="font-black text-slate-900 text-sm">{selectedCard.servicePackage}</p>
                  </div>

                  {/* Parts List */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Parts & Consumables:</span>
                    <div className="space-y-1 text-xs">
                      {selectedCard.items.map(item => (
                        <div key={item.id} className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                          <span className="truncate max-w-[180px] text-slate-800 font-medium">• {item.name}</span>
                          <span className="font-mono font-bold text-slate-900">₹{item.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Calculations */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Labor:</span>
                      <span className="text-slate-900 font-bold">₹{selectedCard.laborCost}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Parts:</span>
                      <span className="text-slate-900 font-bold">₹{selectedCard.partsCost}</span>
                    </div>
                    {selectedCard.discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Discount:</span>
                        <span>- ₹{selectedCard.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>GST (18%):</span>
                      <span className="text-slate-900 font-bold">Included</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-black text-amber-700 font-display">
                      <span>Estimated Total:</span>
                      <span>₹{selectedCard.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Estimate Approval Alert */}
                <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Estimate Approved</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Transparent pricing guaranteed. Old parts will be handed over to you during bike pickup at Kottar.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
              Please enter your vehicle registration number above to track service.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Book Service */}
      {activeSubTab === 'book' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
              Kottar & Nagercoil Doorstep Service
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-display mt-1">
              Book Two-Wheeler Service or Pickup
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              We offer free doorstep vehicle pickup across Kottar, Chettikulam, Vadasery, Asambu Rd, and Nagercoil.
            </p>
          </div>

          {bookingSuccessMsg ? (
            <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 font-display">Booking Confirmed!</h3>
              <p className="text-xs text-slate-700 max-w-md mx-auto">{bookingSuccessMsg}</p>
              <button
                onClick={() => setBookingSuccessMsg('')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                Book Another Service
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Pickup Type Toggle */}
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setBType('Doorstep Pickup')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 ${
                    bType === 'Doorstep Pickup'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Doorstep Pickup (Nagercoil)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBType('Workshop Drop-in')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 ${
                    bType === 'Workshop Drop-in'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>Direct Workshop Drop</span>
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. S. Manikandan"
                    value={bName}
                    onChange={(e) => setBName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98432 12345"
                    value={bPhone}
                    onChange={(e) => setBPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Vehicle Registration Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TN 74 AX 1234"
                    value={bVehicleNo}
                    onChange={(e) => setBVehicleNo(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-amber-800 font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bike Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Enfield Hunter 350 / Yamaha MT-15"
                    value={bModel}
                    onChange={(e) => setBModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pickup Address / Area in Nagercoil</label>
                  <input
                    type="text"
                    value={bAddress}
                    onChange={(e) => setBAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Select Service Package</label>
                  <select
                    value={bPackage}
                    onChange={(e) => setBPackage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    {servicePackages.map(p => (
                      <option key={p.id} value={p.title}>
                        {p.title} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Special Complaints / Requests</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Front brake disc squeaking, oil change with Motul 7100..."
                  value={bNotes}
                  onChange={(e) => setBNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-3 rounded-xl text-sm transition shadow-md"
              >
                Confirm Service Booking
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 3: Digital Passport */}
      {activeSubTab === 'history' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
              Digital Service Passport
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-display mt-1">
              Annam Motors Verified Maintenance Book
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Official stamp records increase the resale value and warranty reliability of your two-wheeler.
            </p>
          </div>

          <div className="space-y-4">
            {jobCards.map(c => (
              <div key={c.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-800 text-sm">{c.vehicleNumber}</span>
                    <span className="text-xs font-bold text-slate-900">({c.vehicleModel})</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Service: <strong className="text-slate-900">{c.servicePackage}</strong> • {c.odometerKm} KM
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Advisor / Mechanic: {c.assignedMechanicName} • Kottar Center
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-600 block">₹{c.totalAmount}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-700 text-xs font-bold flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Stamp</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SOS Assistance */}
      {activeSubTab === 'sos' && (
        <div className="bg-gradient-to-br from-rose-50 via-white to-white border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> 24/7 Kottar & Nagercoil Roadside SOS
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-display mt-1">
              Emergency Bike Breakdown Assistance
            </h2>
            <p className="text-xs text-slate-700 mt-1">
              Puncture, clutch wire snap, battery jump start, or sudden engine stoppage? Submit this request for immediate mechanic dispatch!
            </p>
          </div>

          {sosSuccessMsg ? (
            <div className="bg-rose-50 border border-rose-300 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-rose-600 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-slate-900 font-display">SOS Dispatched!</h3>
              <p className="text-xs text-slate-700 max-w-md mx-auto">{sosSuccessMsg}</p>
              <a
                href={`tel:${WORKSHOP_DETAILS.phones[0]}`}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>Call Emergency Helpline Now</span>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSosSubmit} className="space-y-4 max-w-xl text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand"
                  value={sosName}
                  onChange={(e) => setSosName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98421 33499"
                  value={sosPhone}
                  onChange={(e) => setSosPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Breakdown Location in Kottar / Nagercoil *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Chettikulam Junction / Tower Rd / Vadasery Bus Stand"
                  value={sosLocation}
                  onChange={(e) => setSosLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Vehicle Reg No</label>
                  <input
                    type="text"
                    value={sosVehicleNo}
                    onChange={(e) => setSosVehicleNo(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-amber-800 font-mono font-bold focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bike Model</label>
                  <input
                    type="text"
                    value={sosBikeModel}
                    onChange={(e) => setSosBikeModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Describe Issue</label>
                <textarea
                  rows={2}
                  value={sosIssue}
                  onChange={(e) => setSosIssue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Request Urgent Kottar Mechanic Dispatch</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
