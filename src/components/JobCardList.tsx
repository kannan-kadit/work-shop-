import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Bike, 
  Wrench, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  Edit3, 
  Trash2,
  Phone,
  Calendar,
  LayoutGrid,
  List,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { JobCard, ServiceStatus, BikeBrand, WorkshopStats } from '../types';

interface JobCardListProps {
  jobCards: JobCard[];
  stats: WorkshopStats;
  onNewJobCard: () => void;
  onEditJobCard: (card: JobCard) => void;
  onDeleteJobCard: (id: string) => void;
  onViewInvoice: (card: JobCard) => void;
  onUpdateStatus: (id: string, newStatus: ServiceStatus) => void;
  searchQuery: string;
}

const STAGES: { status: ServiceStatus; label: string; color: string; bg: string; border: string }[] = [
  { status: 'Received', label: '1. Received', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  { status: 'Inspection', label: '2. Inspection', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
  { status: 'In Progress', label: '3. In Progress', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  { status: 'Quality Check', label: '4. Quality Check', color: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  { status: 'Ready for Delivery', label: '5. Ready for Pickup', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { status: 'Delivered', label: '6. Delivered', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
];

const STAGE_ORDER: ServiceStatus[] = [
  'Received',
  'Inspection',
  'In Progress',
  'Quality Check',
  'Ready for Delivery',
  'Delivered'
];

export const JobCardList: React.FC<JobCardListProps> = ({
  jobCards,
  stats,
  onNewJobCard,
  onEditJobCard,
  onDeleteJobCard,
  onViewInvoice,
  onUpdateStatus,
  searchQuery,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('ALL');

  // Filter job cards
  const filteredCards = jobCards.filter(card => {
    const matchesSearch = 
      !searchQuery ||
      card.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.customerPhone.includes(searchQuery) ||
      card.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatusFilter === 'ALL' || card.status === selectedStatusFilter;
    const matchesBrand = selectedBrandFilter === 'ALL' || card.vehicleBrand === selectedBrandFilter;

    return matchesSearch && matchesStatus && matchesBrand;
  });

  const getNextStage = (current: ServiceStatus): ServiceStatus | null => {
    const idx = STAGE_ORDER.indexOf(current);
    if (idx >= 0 && idx < STAGE_ORDER.length - 1) {
      return STAGE_ORDER[idx + 1];
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
            <span>Today's Intake</span>
            <Bike className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-display mt-1">
            {stats.todayVehiclesCount}
          </div>
          <div className="text-[10px] text-blue-600 font-bold mt-0.5">Kottar Bay</div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
            <span>On Bay / Servicing</span>
            <Wrench className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-display mt-1">
            {stats.inProgressCount}
          </div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Active Work</div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
            <span>Ready for Pickup</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-display mt-1">
            {stats.readyForDeliveryCount}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Washed & Polished</div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
            <span>Month Delivered</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-display mt-1">
            {stats.completedThisMonth}
          </div>
          <div className="text-[10px] text-purple-600 font-bold mt-0.5">Completed</div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
            <span>Revenue</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-600 font-display mt-1">
            ₹{stats.monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Collected</div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
            <span>Low Spares Alert</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 font-display mt-1">
            {stats.lowStockItemsCount}
          </div>
          <div className="text-[10px] text-rose-600 font-bold mt-0.5">Needs Restock</div>
        </div>
      </div>

      {/* Filter and View Toggles Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Statuses ({jobCards.length})</option>
            {STAGES.map(s => (
              <option key={s.status} value={s.status}>{s.label}</option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrandFilter}
            onChange={(e) => setSelectedBrandFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Brands</option>
            <option value="Royal Enfield">Royal Enfield</option>
            <option value="Yamaha">Yamaha</option>
            <option value="Honda">Honda</option>
            <option value="TVS">TVS</option>
            <option value="KTM">KTM</option>
            <option value="Hero">Hero</option>
          </select>
        </div>

        {/* View Switcher: Kanban vs Table */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
              viewMode === 'kanban' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kanban Board</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
              viewMode === 'table' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List View</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const cardsInStage = filteredCards.filter(c => c.status === stage.status);
            return (
              <div
                key={stage.status}
                className="bg-slate-100/90 border border-slate-200 rounded-2xl p-3 flex flex-col min-w-[260px] shadow-sm"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.color.replace('text-', 'bg-')}`}></span>
                    <h3 className={`text-xs font-black uppercase tracking-wider ${stage.color}`}>
                      {stage.label}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-700">
                    {cardsInStage.length}
                  </span>
                </div>

                {/* Cards in Column */}
                <div className="space-y-3 mt-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {cardsInStage.map(card => {
                    const nextStage = getNextStage(card.status);
                    const completedComplaints = card.complaints.filter(c => c.completed).length;
                    
                    return (
                      <div
                        key={card.id}
                        className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-3.5 space-y-3 shadow-sm hover:shadow-md transition group"
                      >
                        {/* Reg Number & Brand */}
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono font-black text-sm text-amber-700 tracking-wide block">
                              {card.vehicleNumber}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {card.vehicleModel}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-600 font-mono">
                            {card.id}
                          </span>
                        </div>

                        {/* Customer & Location */}
                        <div className="text-xs text-slate-600 space-y-0.5">
                          <div className="text-slate-800 font-semibold">{card.customerName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> {card.customerPhone}
                          </div>
                        </div>

                        {/* Progress meter */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                            <span>Complaints ({completedComplaints}/{card.complaints.length})</span>
                            <span>Fuel: {card.fuelLevel}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className="bg-amber-500 h-full rounded-full transition-all"
                              style={{ width: `${card.complaints.length > 0 ? (completedComplaints / card.complaints.length) * 100 : 50}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Mechanic & Amount */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <span className="text-[11px] text-slate-600 truncate max-w-[120px] font-medium" title={card.assignedMechanicName}>
                            👨‍🔧 {card.assignedMechanicName.split(' ')[0]}
                          </span>
                          <span className="font-black text-slate-900">
                            ₹{card.totalAmount}
                          </span>
                        </div>

                        {/* Quick Action Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-1">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onViewInvoice(card)}
                              title="Generate GST Bill"
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-lg border border-slate-200 transition"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-600" />
                            </button>
                            <button
                              onClick={() => onEditJobCard(card)}
                              title="Edit Job Card"
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-lg border border-slate-200 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteJobCard(card.id)}
                              title="Delete"
                              className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {nextStage && (
                            <button
                              onClick={() => onUpdateStatus(card.id, nextStage)}
                              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 px-2 py-1 rounded-lg text-[11px] font-bold shadow-sm transition"
                              title={`Advance to ${nextStage}`}
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {cardsInStage.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-300 rounded-xl bg-white/50">
                      No vehicles in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">JC ID</th>
                  <th className="py-3 px-4">Vehicle Reg No & Model</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Mechanic</th>
                  <th className="py-3 px-4">Stage / Status</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4 text-right">Total (₹)</th>
                  <th className="py-3 px-4 text-center">Payment</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCards.map(card => (
                  <tr key={card.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-amber-700">{card.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{card.vehicleNumber}</div>
                      <div className="text-[11px] text-slate-500">{card.vehicleBrand} - {card.vehicleModel}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{card.customerName}</div>
                      <div className="text-[11px] text-slate-500">{card.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {card.assignedMechanicName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                        {card.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-xs">{card.servicePackage}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">₹{card.totalAmount}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        card.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-rose-50 text-rose-700 border border-rose-300'
                      }`}>
                        {card.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewInvoice(card)}
                          title="View GST Bill"
                          className="p-1.5 bg-slate-100 hover:bg-amber-100 text-amber-700 rounded-lg border border-slate-200"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditJobCard(card)}
                          title="Edit"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteJobCard(card.id)}
                          title="Delete"
                          className="p-1.5 bg-slate-100 hover:bg-rose-100 text-rose-600 rounded-lg border border-slate-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
