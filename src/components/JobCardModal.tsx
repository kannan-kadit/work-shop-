import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Bike,
  Wrench,
  Info
} from 'lucide-react';
import { 
  JobCard, 
  BikeBrand, 
  ServiceStatus, 
  JobCardItem, 
  VehicleComplaint, 
  DamagePoint,
  SparePart,
  Mechanic,
  ServicePackage
} from '../types';

interface JobCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: Omit<JobCard, 'id' | 'createdAt' | 'liveUpdates'>) => void;
  initialData?: JobCard | null;
  mechanics: Mechanic[];
  servicePackages: ServicePackage[];
  spareParts: SparePart[];
}

const BRANDS: BikeBrand[] = [
  'Royal Enfield',
  'Yamaha',
  'Honda',
  'TVS',
  'KTM',
  'Hero',
  'Bajaj',
  'Suzuki',
  'Other'
];

export const JobCardModal: React.FC<JobCardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mechanics,
  servicePackages,
  spareParts,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('Kottar, Nagercoil');
  const [vehicleNumber, setVehicleNumber] = useState('TN 74 ');
  const [vehicleBrand, setVehicleBrand] = useState<BikeBrand>('Royal Enfield');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState<number>(new Date().getFullYear());
  const [odometerKm, setOdometerKm] = useState<number>(10000);
  const [fuelLevel, setFuelLevel] = useState<'E' | '1/4' | '1/2' | '3/4' | 'F'>('1/2');
  const [assignedMechanicId, setAssignedMechanicId] = useState('');
  const [status, setStatus] = useState<ServiceStatus>('Received');
  const [servicePackage, setServicePackage] = useState('');
  const [complaints, setComplaints] = useState<VehicleComplaint[]>([]);
  const [newComplaintText, setNewComplaintText] = useState('');
  const [damagePoints, setDamagePoints] = useState<DamagePoint[]>([]);
  const [items, setItems] = useState<JobCardItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [gstRate, setGstRate] = useState<number>(18);
  const [notes, setNotes] = useState('');
  const [estimatedHours, setEstimatedHours] = useState<number>(4);

  // Selected spare part to add
  const [selectedPartId, setSelectedPartId] = useState('');
  const [selectedPartQty, setSelectedPartQty] = useState<number>(1);
  const [customLaborName, setCustomLaborName] = useState('');
  const [customLaborCost, setCustomLaborCost] = useState<number>(300);

  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName);
      setCustomerPhone(initialData.customerPhone);
      setCustomerAddress(initialData.customerAddress);
      setVehicleNumber(initialData.vehicleNumber);
      setVehicleBrand(initialData.vehicleBrand);
      setVehicleModel(initialData.vehicleModel);
      setVehicleYear(initialData.vehicleYear);
      setOdometerKm(initialData.odometerKm);
      setFuelLevel(initialData.fuelLevel);
      setAssignedMechanicId(initialData.assignedMechanicId);
      setStatus(initialData.status);
      setServicePackage(initialData.servicePackage);
      setComplaints(initialData.complaints || []);
      setDamagePoints(initialData.damagePoints || []);
      setItems(initialData.items || []);
      setDiscount(initialData.discount || 0);
      setGstRate(initialData.gstRate !== undefined ? initialData.gstRate : 18);
      setNotes(initialData.notes || '');
    } else {
      // Reset defaults
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('Kottar, Nagercoil');
      setVehicleNumber('TN 74 ');
      setVehicleBrand('Royal Enfield');
      setVehicleModel('Classic 350');
      setVehicleYear(2023);
      setOdometerKm(15000);
      setFuelLevel('1/2');
      setAssignedMechanicId(mechanics[0]?.id || '');
      setStatus('Received');
      setServicePackage(servicePackages[0]?.title || 'General Periodic Maintenance');
      setComplaints([
        { id: '1', text: 'General Service & 32-point inspection', completed: false },
        { id: '2', text: 'Oil change and filter replacement', completed: false },
      ]);
      setDamagePoints([]);
      
      const defaultPkg = servicePackages[0];
      setItems([
        {
          id: 'item-init',
          name: defaultPkg ? defaultPkg.title + ' (Labor)' : 'General Service Labor',
          quantity: 1,
          unitPrice: defaultPkg ? defaultPkg.price : 650,
          total: defaultPkg ? defaultPkg.price : 650,
          isLabor: true,
        },
      ]);
      setDiscount(0);
      setGstRate(18);
      setNotes('');
    }
  }, [initialData, isOpen, mechanics, servicePackages]);

  if (!isOpen) return null;

  const handleSelectPackage = (pkgTitle: string) => {
    setServicePackage(pkgTitle);
    const pkg = servicePackages.find(p => p.title === pkgTitle);
    if (pkg) {
      setEstimatedHours(pkg.estimatedHours);
      const existingLaborIdx = items.findIndex(i => i.isLabor);
      const newLaborItem: JobCardItem = {
        id: 'labor-' + Date.now(),
        name: `${pkg.title} (Labor)`,
        quantity: 1,
        unitPrice: pkg.price,
        total: pkg.price,
        isLabor: true,
      };

      if (existingLaborIdx >= 0) {
        const updated = [...items];
        updated[existingLaborIdx] = newLaborItem;
        setItems(updated);
      } else {
        setItems([newLaborItem, ...items]);
      }
    }
  };

  const handleAddComplaint = () => {
    if (!newComplaintText.trim()) return;
    setComplaints([
      ...complaints,
      { id: Date.now().toString(), text: newComplaintText.trim(), completed: false },
    ]);
    setNewComplaintText('');
  };

  const handleRemoveComplaint = (id: string) => {
    setComplaints(complaints.filter(c => c.id !== id));
  };

  const handleAddPartItem = () => {
    if (!selectedPartId) return;
    const part = spareParts.find(p => p.id === selectedPartId);
    if (!part) return;

    const newItem: JobCardItem = {
      id: 'part-' + Date.now(),
      partId: part.id,
      name: part.name,
      quantity: selectedPartQty,
      unitPrice: part.sellingPrice,
      total: part.sellingPrice * selectedPartQty,
      isLabor: false,
    };

    setItems([...items, newItem]);
    setSelectedPartId('');
    setSelectedPartQty(1);
  };

  const handleAddLaborItem = () => {
    if (!customLaborName.trim() || customLaborCost <= 0) return;
    const newItem: JobCardItem = {
      id: 'labor-' + Date.now(),
      name: customLaborName.trim() + ' (Labor)',
      quantity: 1,
      unitPrice: customLaborCost,
      total: customLaborCost,
      isLabor: true,
    };
    setItems([...items, newItem]);
    setCustomLaborName('');
    setCustomLaborCost(200);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleDiagramClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const desc = prompt('Enter damage / scratch details for this spot:', 'Scratch on side panel');
    if (!desc) return;

    const newPoint: DamagePoint = {
      id: Date.now().toString(),
      x,
      y,
      description: desc,
      type: 'scratch',
    };
    setDamagePoints([...damagePoints, newPoint]);
  };

  const handleRemoveDamagePoint = (id: string) => {
    setDamagePoints(damagePoints.filter(p => p.id !== id));
  };

  const laborCost = items.filter(i => i.isLabor).reduce((sum, i) => sum + i.total, 0);
  const partsCost = items.filter(i => !i.isLabor).reduce((sum, i) => sum + i.total, 0);
  const subtotal = laborCost + partsCost - discount;
  const gstAmount = Math.round(subtotal * (gstRate / 100));
  const totalAmount = Math.max(0, subtotal + gstAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !vehicleNumber) {
      alert('Please fill customer name, phone number, and vehicle registration number.');
      return;
    }

    const assignedMech = mechanics.find(m => m.id === assignedMechanicId);
    const estimatedDate = new Date();
    estimatedDate.setHours(estimatedDate.getHours() + (estimatedHours || 4));

    onSave({
      customerName,
      customerPhone,
      customerAddress,
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      odometerKm: Number(odometerKm) || 0,
      fuelLevel,
      assignedMechanicId,
      assignedMechanicName: assignedMech ? assignedMech.name : 'Murugan (Chief Mechanic)',
      status,
      servicePackage,
      complaints,
      damagePoints,
      items,
      laborCost,
      partsCost,
      discount: Number(discount) || 0,
      gstRate: Number(gstRate) || 0,
      totalAmount,
      paymentStatus: initialData ? initialData.paymentStatus : 'Pending',
      paymentMethod: initialData ? initialData.paymentMethod : 'GPay / UPI',
      estimatedCompletion: estimatedDate.toISOString(),
      customerApprovedEstimate: true,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-2xl my-8 overflow-hidden text-slate-900 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-700 border border-amber-300 rounded-xl">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 font-display">
                {initialData ? `Edit Job Card (${initialData.id})` : 'New Job Card - Kottar Workshop'}
              </h2>
              <p className="text-xs text-slate-500">Annam Motors Service Intake & Diagnostic Sheet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* Section 1: Customer & Bike Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Details */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Customer Details
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A. Senthil Nathan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98432 55102"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address / Area in Nagercoil</label>
                <input
                  type="text"
                  placeholder="e.g. Chettikulam, Kottar"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5" /> Bike Information
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Reg No *</label>
                  <input
                    type="text"
                    required
                    placeholder="TN 74 AX 4419"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono font-bold text-amber-700 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand</label>
                  <select
                    value={vehicleBrand}
                    onChange={(e) => setVehicleBrand(e.target.value as BikeBrand)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    {BRANDS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Model & Color</label>
                <input
                  type="text"
                  placeholder="e.g. Classic 350 Stealth Black"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Odometer (KM)</label>
                  <input
                    type="number"
                    value={odometerKm}
                    onChange={(e) => setOdometerKm(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mfg Year</label>
                  <input
                    type="number"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Fuel & Mechanic Assignment */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> Service Parameters
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fuel Gauge Level</label>
                <div className="flex gap-1.5">
                  {(['E', '1/4', '1/2', '3/4', 'F'] as const).map(lvl => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setFuelLevel(lvl)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                        fuelLevel === lvl
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Mechanic</label>
                <select
                  value={assignedMechanicId}
                  onChange={(e) => setAssignedMechanicId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                >
                  {mechanics.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.specialty.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Package</label>
                <select
                  value={servicePackage}
                  onChange={(e) => handleSelectPackage(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                >
                  {servicePackages.map(p => (
                    <option key={p.id} value={p.title}>
                      {p.title} - ₹{p.price}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Complaints & Visual Damage Pinning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Customer Complaints List */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Customer Complaints & Work Checklist
                </h3>
                <span className="text-[11px] text-slate-500">{complaints.length} issues logged</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add problem e.g. Front brake disc squeak, engine vibration..."
                  value={newComplaintText}
                  onChange={(e) => setNewComplaintText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddComplaint(); } }}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddComplaint}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {complaints.map(c => (
                  <div key={c.id} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 text-xs shadow-sm">
                    <span className="text-slate-800 font-medium">• {c.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveComplaint(c.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Scratch & Damage Inspector Diagram */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Vehicle Damage & Scratch Spotter
                </h3>
                <span className="text-[11px] text-slate-500">Click diagram to pin scratches/dents</span>
              </div>

              <div 
                onClick={handleDiagramClick}
                className="relative w-full h-44 bg-white rounded-xl border border-dashed border-slate-300 flex items-center justify-center cursor-crosshair overflow-hidden group select-none shadow-sm"
              >
                {/* SVG Motorbike Outline */}
                <svg viewBox="0 0 400 200" className="w-full h-full text-slate-400 p-2 opacity-80 group-hover:opacity-100 transition">
                  <circle cx="80" cy="140" r="35" stroke="currentColor" strokeWidth="4" fill="none" />
                  <circle cx="320" cy="140" r="35" stroke="currentColor" strokeWidth="4" fill="none" />
                  <circle cx="80" cy="140" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="320" cy="140" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M 80 140 L 140 80 L 220 80 L 260 120 L 320 140" stroke="currentColor" strokeWidth="6" fill="none" />
                  <path d="M 140 80 L 170 50 L 190 50" stroke="currentColor" strokeWidth="5" fill="none" />
                  <path d="M 170 50 L 185 35" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path d="M 160 70 Q 200 40 230 75 Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="3" />
                  <path d="M 230 75 Q 270 70 290 90 L 240 90 Z" fill="currentColor" opacity="0.5" stroke="currentColor" strokeWidth="3" />
                  <rect x="160" y="95" width="60" height="45" rx="5" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.2" />
                  <path d="M 180 135 L 280 145 L 340 140" stroke="currentColor" strokeWidth="5" fill="none" />
                </svg>

                <div className="absolute top-2 left-2 text-[10px] text-slate-600 bg-white/90 border border-slate-200 px-2 py-0.5 rounded shadow-sm">
                  Tap anywhere on bike outline to log scratches
                </div>

                {/* Render Damage Pins */}
                {damagePoints.map((point) => (
                  <div
                    key={point.id}
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group/pin"
                  >
                    <div className="w-5 h-5 bg-rose-600 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-lg animate-bounce">
                      !
                    </div>
                    <div className="hidden group-hover/pin:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20 items-center gap-1 shadow-lg">
                      <span>{point.description}</span>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveDamagePoint(point.id); }}
                        className="text-rose-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {damagePoints.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {damagePoints.map(p => (
                    <span key={p.id} className="text-[10px] bg-rose-50 text-rose-700 border border-rose-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                      • {p.description}
                      <button type="button" onClick={() => handleRemoveDamagePoint(p.id)} className="hover:text-rose-900">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Parts & Labor Line Items */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-between">
              <span>Spare Parts & Labor Estimation</span>
              <span className="text-[11px] text-slate-500 font-normal">Directly linked to Kottar Workshop Inventory</span>
            </h3>

            {/* Adder Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-200">
              {/* Add Spare Part */}
              <div className="flex gap-2">
                <select
                  value={selectedPartId}
                  onChange={(e) => setSelectedPartId(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                >
                  <option value="">-- Add Part from Inventory --</option>
                  {spareParts.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                      {p.name} (₹{p.sellingPrice}) - Stock: {p.stock}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={selectedPartQty}
                  onChange={(e) => setSelectedPartQty(Math.max(1, Number(e.target.value)))}
                  className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 text-center focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddPartItem}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                >
                  + Add Part
                </button>
              </div>

              {/* Add Custom Labor */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Custom labor/fitting e.g. Fork Bend Removal"
                  value={customLaborName}
                  onChange={(e) => setCustomLaborName(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="₹"
                  value={customLaborCost}
                  onChange={(e) => setCustomLaborCost(Number(e.target.value))}
                  className="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 text-center focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddLaborItem}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                >
                  + Labor
                </button>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-800">{item.name}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.isLabor ? 'bg-cyan-50 text-cyan-800 border border-cyan-300' : 'bg-amber-50 text-amber-800 border border-amber-300'
                        }`}>
                          {item.isLabor ? 'LABOR' : 'PART'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center text-slate-700">{item.quantity}</td>
                      <td className="py-2 px-3 text-right text-slate-700">₹{item.unitPrice}</td>
                      <td className="py-2 px-3 text-right font-black text-slate-900">₹{item.total}</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-slate-400">
                        No parts or labor added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Summary & GST */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 gap-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div>
                  <label className="text-slate-600 font-semibold block mb-0.5">Discount (₹)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-24 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-semibold block mb-0.5">GST Rate (%)</label>
                  <select
                    value={gstRate}
                    onChange={(e) => setGstRate(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 font-semibold"
                  >
                    <option value={0}>0% (No GST)</option>
                    <option value={18}>18% (Standard GST)</option>
                    <option value={28}>28% (Lubricants / Auto)</option>
                  </select>
                </div>
              </div>

              <div className="text-right space-y-1 w-full sm:w-auto">
                <div className="text-xs text-slate-600">
                  Labor: <span className="text-slate-900 font-bold">₹{laborCost}</span> | Parts: <span className="text-slate-900 font-bold">₹{partsCost}</span> | GST ({gstRate}%): <span className="text-slate-900 font-bold">₹{gstAmount}</span>
                </div>
                <div className="text-xl font-black text-amber-700 font-display">
                  Net Total: ₹{totalAmount}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mechanic Special Instructions / Kottar Customer Requests
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Keep old parts in bag for customer inspection. Wash bike carefully around speedometer..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 bg-slate-50 -mx-6 -mb-6 p-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {initialData ? 'Update Job Card' : 'Create Job Card & Log Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
