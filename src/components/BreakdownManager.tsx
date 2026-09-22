import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Navigation
} from 'lucide-react';
import { BreakdownRequest, Mechanic } from '../types';
import { CustomSelect } from './CustomSelect';

interface BreakdownManagerProps {
  requests: BreakdownRequest[];
  mechanics: Mechanic[];
  onUpdateStatus: (id: string, status: 'Pending' | 'Mechanic Dispatched' | 'Resolved', mechanicName?: string) => void;
  onConvertBreakdownToJobCard: (req: BreakdownRequest) => void;
}

export const BreakdownManager: React.FC<BreakdownManagerProps> = ({
  requests,
  mechanics,
  onUpdateStatus,
  onConvertBreakdownToJobCard,
}) => {
  const [selectedMechanicMap, setSelectedMechanicMap] = useState<{ [reqId: string]: string }>({});

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const dispatchedRequests = requests.filter(r => r.status === 'Mechanic Dispatched');
  const resolvedRequests = requests.filter(r => r.status === 'Resolved');

  const handleDispatch = (reqId: string) => {
    const mechId = selectedMechanicMap[reqId] || mechanics[0]?.id;
    const mech = mechanics.find(m => m.id === mechId);
    const mechLabel = mech ? `${mech.name} (${mech.phone})` : 'Vignesh Kumar (+91 88701 56329)';
    onUpdateStatus(reqId, 'Mechanic Dispatched', mechLabel);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-rose-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> 24/7 Kottar & Nagercoil Roadside SOS Dispatcher
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-display mt-1">
              Live Breakdown Requests ({requests.length})
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Immediate mechanic response team for punctures, cable snaps, electrical failures and tow assistance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-rose-50 text-rose-700 border border-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold animate-pulse">
              {pendingRequests.length} Needs Dispatch
            </span>
            <span className="bg-amber-50 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold">
              {dispatchedRequests.length} On Route
            </span>
          </div>
        </div>
      </div>

      {/* Requests Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Pending Action */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> 1. Pending Dispatch ({pendingRequests.length})
            </h3>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-xs text-slate-400">
              No pending breakdown requests.
            </div>
          ) : (
            pendingRequests.map(req => (
              <div key={req.id} className="bg-white border border-rose-300 rounded-2xl p-4 space-y-3 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-amber-800 text-sm block">{req.vehicleNumber}</span>
                    <span className="text-xs font-bold text-slate-900">{req.bikeModel}</span>
                  </div>
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-300">
                    PENDING
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-slate-800 font-medium">Customer: {req.customerName}</p>
                  <a href={`tel:${req.customerPhone}`} className="text-emerald-700 font-bold flex items-center gap-1 hover:underline">
                    <Phone className="w-3 h-3" /> {req.customerPhone}
                  </a>
                  <p className="text-slate-600 flex items-start gap-1 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{req.location}</span>
                  </p>
                </div>

                <div className="bg-rose-50/50 p-2.5 rounded-xl border border-rose-200 text-xs text-rose-800">
                  <strong>Issue:</strong> {req.issue}
                </div>

                {/* Dispatch Controls */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-[10px] text-slate-600 font-semibold">Select Mechanic to Dispatch:</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <CustomSelect
                        value={selectedMechanicMap[req.id] || mechanics[0]?.id}
                        onChange={(val) => setSelectedMechanicMap({ ...selectedMechanicMap, [req.id]: String(val) })}
                        buttonClassName="text-xs py-1.5 rounded-lg"
                        options={mechanics.map(m => ({
                          value: m.id,
                          label: m.name,
                          sublabel: m.specialty,
                          badge: m.activeJobs > 0 ? `${m.activeJobs} Active` : 'Available'
                        }))}
                      />
                    </div>
                    <button
                      onClick={() => handleDispatch(req.id)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1 shadow-sm shrink-0"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Dispatch</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Column 2: Mechanic Dispatched & On Route */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> 2. Mechanic On Route ({dispatchedRequests.length})
            </h3>
          </div>

          {dispatchedRequests.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-xs text-slate-400">
              No mechanics currently on active roadside trips.
            </div>
          ) : (
            dispatchedRequests.map(req => (
              <div key={req.id} className="bg-white border border-amber-300 rounded-2xl p-4 space-y-3 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-amber-800 text-sm block">{req.vehicleNumber}</span>
                    <span className="text-xs font-bold text-slate-900">{req.bikeModel}</span>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    DISPATCHED
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-700">
                  <p>Customer: <strong>{req.customerName}</strong> ({req.customerPhone})</p>
                  <p className="text-slate-600 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{req.location}</span>
                  </p>
                  <p className="text-blue-700 pt-1 font-semibold">
                    👨‍🔧 <strong>Assigned:</strong> {req.assignedMechanic}
                  </p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <strong>Reported Problem:</strong> {req.issue}
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onConvertBreakdownToJobCard(req)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-1.5 rounded-lg text-xs transition flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Job Card</span>
                  </button>
                  <button
                    onClick={() => onUpdateStatus(req.id, 'Resolved')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition shadow-sm"
                  >
                    Resolved ✓
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Column 3: Resolved */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 3. Resolved Breakdowns ({resolvedRequests.length})
            </h3>
          </div>

          {resolvedRequests.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-xs text-slate-400">
              No resolved breakdown history yet today.
            </div>
          ) : (
            resolvedRequests.map(req => (
              <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-slate-800">{req.vehicleNumber}</span>
                  <span className="text-emerald-700 font-bold text-[10px]">RESOLVED</span>
                </div>
                <p className="text-slate-600">{req.customerName} • {req.location}</p>
                <p className="text-slate-500 text-[11px]">{req.issue}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
