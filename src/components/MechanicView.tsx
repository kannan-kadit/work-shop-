import React, { useState } from 'react';
import { 
  Wrench, 
  CheckCircle, 
  CheckSquare, 
  Square, 
  Send, 
  Phone, 
  AlertCircle
} from 'lucide-react';
import { JobCard, Mechanic, ServiceStatus, SparePart } from '../types';

interface MechanicViewProps {
  mechanics: Mechanic[];
  jobCards: JobCard[];
  spareParts: SparePart[];
  onUpdateStatus: (id: string, newStatus: ServiceStatus, updateMessage?: string) => void;
  onToggleComplaint: (jobCardId: string, complaintId: string) => void;
  onAddBayNote: (jobCardId: string, note: string) => void;
}

export const MechanicView: React.FC<MechanicViewProps> = ({
  mechanics,
  jobCards,
  onUpdateStatus,
  onToggleComplaint,
  onAddBayNote,
}) => {
  const [selectedMechanicId, setSelectedMechanicId] = useState<string>(mechanics[0]?.id || 'MEC-01');
  const [bayNoteInput, setBayNoteInput] = useState<{ [key: string]: string }>({});

  const activeMechanic = mechanics.find(m => m.id === selectedMechanicId) || mechanics[0];
  const assignedCards = jobCards.filter(c => c.assignedMechanicId === selectedMechanicId && c.status !== 'Delivered');
  const completedCards = jobCards.filter(c => c.assignedMechanicId === selectedMechanicId && c.status === 'Delivered');

  const handleSendNote = (cardId: string) => {
    const text = bayNoteInput[cardId];
    if (!text || !text.trim()) return;
    onAddBayNote(cardId, text.trim());
    setBayNoteInput({ ...bayNoteInput, [cardId]: '' });
  };

  return (
    <div className="space-y-6">
      {/* Mechanic Selection & Profile Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
              Mechanic Workstation & Bay Terminal
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-0.5">
              Annam Motors Service Crew
            </h2>
          </div>

          {/* Mechanic Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
            {mechanics.map(m => {
              const activeCount = jobCards.filter(c => c.assignedMechanicId === m.id && c.status !== 'Delivered').length;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMechanicId(m.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                    selectedMechanicId === m.id
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                  <span>{m.name.split(' ')[0]}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    selectedMechanicId === m.id ? 'bg-black text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {activeCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Mechanic Detail Info */}
        {activeMechanic && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="flex items-center gap-3">
              <img 
                src={activeMechanic.avatar} 
                alt={activeMechanic.name} 
                className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500 shadow-sm" 
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900">{activeMechanic.name}</h3>
                <p className="text-amber-700 font-sans font-semibold">{activeMechanic.tamilName}</p>
                <p className="text-[11px] text-slate-500">{activeMechanic.specialty}</p>
              </div>
            </div>

            <div className="flex items-center justify-around bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-center">
                <span className="text-[10px] text-slate-500 font-semibold block">Experience</span>
                <span className="text-sm font-black text-slate-900 font-mono">{activeMechanic.experienceYears} Years</span>
              </div>
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="text-center">
                <span className="text-[10px] text-slate-500 font-semibold block">Rating</span>
                <span className="text-sm font-black text-amber-600 font-mono">⭐ {activeMechanic.rating}</span>
              </div>
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="text-center">
                <span className="text-[10px] text-slate-500 font-semibold block">Active Bay Bikes</span>
                <span className="text-sm font-black text-emerald-600 font-mono">{assignedCards.length}</span>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a
                href={`tel:${activeMechanic.phone}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold border border-slate-300 transition shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call {activeMechanic.phone}</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Active Work Cards for this Mechanic */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-600" />
            Active Service Jobs on Bay ({assignedCards.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Kottar Workshop Live Bay Terminal
          </span>
        </div>

        {assignedCards.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400 space-y-2">
            <CheckCircle className="w-10 h-10 mx-auto text-emerald-500" />
            <p className="text-sm font-bold text-slate-700">All current jobs completed for this mechanic!</p>
            <p className="text-xs">Select another mechanic or assign new job cards from the Dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assignedCards.map(card => {
              return (
                <div 
                  key={card.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  {/* Top Header */}
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-black text-base text-amber-700">
                          {card.vehicleNumber}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {card.vehicleBrand} - {card.vehicleModel}
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 font-mono">
                        {card.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">
                      <span>Customer: <strong className="text-slate-900">{card.customerName}</strong></span>
                      <span>•</span>
                      <span>Odo: <strong className="text-slate-900">{card.odometerKm} KM</strong></span>
                      <span>•</span>
                      <span>Fuel: <strong className="text-amber-700">{card.fuelLevel}</strong></span>
                    </div>

                    <div className="text-xs text-blue-700 font-semibold mt-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 inline-block">
                      Package: {card.servicePackage}
                    </div>
                  </div>

                  {/* Complaints & Repair Checklist */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      Mechanic Repair Checklist (Tap to Mark Completed):
                    </span>
                    <div className="space-y-1.5">
                      {card.complaints.map(comp => (
                        <div
                          key={comp.id}
                          onClick={() => onToggleComplaint(card.id, comp.id)}
                          className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition select-none ${
                            comp.completed 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 line-through' 
                              : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {comp.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <span className="text-xs font-semibold">{comp.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Damage points logged */}
                  {card.damagePoints && card.damagePoints.length > 0 && (
                    <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200 space-y-1">
                      <span className="font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Pre-existing Scratches / Notes:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {card.damagePoints.map(p => (
                          <span key={p.id} className="text-[10px] bg-white px-2 py-0.5 rounded border border-rose-200 font-semibold">
                            • {p.description}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bay Note / Mechanic Status Update */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      Post Live Bay Update to Customer:
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Drained oil, replaced spark plug, tuning carburetor..."
                        value={bayNoteInput[card.id] || ''}
                        onChange={(e) => setBayNoteInput({ ...bayNoteInput, [card.id]: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendNote(card.id); }}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleSendNote(card.id)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>

                  {/* Stage Advance Buttons */}
                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-600 font-semibold">
                      Total estimate: <strong className="text-slate-900">₹{card.totalAmount}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      {card.status === 'Received' && (
                        <button
                          onClick={() => onUpdateStatus(card.id, 'Inspection', 'Vehicle moved to lift for 32-point mechanical inspection.')}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
                        >
                          Start Inspection →
                        </button>
                      )}

                      {card.status === 'Inspection' && (
                        <button
                          onClick={() => onUpdateStatus(card.id, 'In Progress', 'Inspection complete. Mechanic began replacement & servicing.')}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
                        >
                          Begin Servicing →
                        </button>
                      )}

                      {card.status === 'In Progress' && (
                        <button
                          onClick={() => onUpdateStatus(card.id, 'Quality Check', 'Mechanical work finished. Starting road test & tuning check.')}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
                        >
                          Pass to Quality Check →
                        </button>
                      )}

                      {card.status === 'Quality Check' && (
                        <button
                          onClick={() => onUpdateStatus(card.id, 'Ready for Delivery', 'Quality check passed! Bike foam-washed, polished and ready for pickup.')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
                        >
                          Mark Ready for Delivery ✓
                        </button>
                      )}

                      {card.status === 'Ready for Delivery' && (
                        <button
                          onClick={() => onUpdateStatus(card.id, 'Delivered', 'Vehicle handed over to customer. Key & receipt delivered.')}
                          className="bg-slate-100 hover:bg-slate-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-300 transition"
                        >
                          Mark Delivered & Handed Over
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delivered History for this Mechanic */}
      {completedCards.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Delivered Bikes Today / This Week ({completedCards.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {completedCards.map(c => (
              <div key={c.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-amber-700">{c.vehicleNumber}</span>
                  <p className="text-slate-800 font-medium">{c.vehicleModel}</p>
                </div>
                <span className="text-emerald-700 font-bold">₹{c.totalAmount}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
