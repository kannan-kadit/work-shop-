import React, { useState } from 'react';
import { 
  Bike, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Boxes, 
  Share2,
  Smartphone
} from 'lucide-react';
import { JobCard, SparePart, ServicePackage, Mechanic } from '../types';
import { WORKSHOP_DETAILS } from '../data/mockData';

interface MobileAppViewProps {
  jobCards: JobCard[];
  spareParts: SparePart[];
  servicePackages: ServicePackage[];
  mechanics: Mechanic[];
  onNewJobCard: () => void;
  onViewInvoice: (card: JobCard) => void;
  onBookService: (booking: any) => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  jobCards,
  spareParts,
  servicePackages,
  onViewInvoice,
}) => {
  const [mobileTab, setMobileTab] = useState<'home' | 'track' | 'packages' | 'spares' | 'sos'>('home');
  const [mobileRole, setMobileRole] = useState<'customer' | 'mechanic'>('customer');
  const [activeTrackingNumber] = useState('TN 74 AX 4419');

  const trackingCard = jobCards.find(c => c.vehicleNumber.toLowerCase().includes(activeTrackingNumber.toLowerCase())) || jobCards[0];

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* Device Frame Top Controls */}
      <div className="flex items-center justify-between w-full max-w-sm mb-4 px-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-bold">App Mode:</span>
          <button
            onClick={() => setMobileRole('customer')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              mobileRole === 'customer' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-white text-slate-600 border border-slate-300'
            }`}
          >
            Customer App
          </button>
          <button
            onClick={() => setMobileRole('mechanic')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              mobileRole === 'mechanic' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-white text-slate-600 border border-slate-300'
            }`}
          >
            Mechanic App
          </button>
        </div>

        <div className="text-[11px] text-cyan-800 font-bold flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5" /> PWA Ready
        </div>
      </div>

      {/* Simulated Smartphone Container */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-slate-50 border-[10px] border-slate-800 rounded-[48px] shadow-2xl overflow-hidden flex flex-col justify-between select-none">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 mr-2"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80"></div>
        </div>

        {/* Mobile Status Bar */}
        <div className="pt-3 px-6 pb-2 flex justify-between items-center text-[10px] font-bold text-slate-700 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-100">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Scrollable Mobile Screen Content */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 text-slate-900 no-scrollbar pb-16 bg-slate-50">
          {/* Mobile Header Banner */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <img src="/assets/logo.jpg" alt="Logo" className="w-9 h-9 rounded-full border border-amber-500 shadow-sm object-cover" />
              <div>
                <h3 className="text-sm font-black tracking-tight text-slate-900 font-display">ANNAM MOTORS</h3>
                <p className="text-[10px] text-amber-700 font-bold">Kottar, Nagercoil</p>
              </div>
            </div>

            <a
              href={`tel:${WORKSHOP_DETAILS.phones[0]}`}
              className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full shadow-sm"
              title="Call Workshop"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* TAB: Home */}
          {mobileTab === 'home' && (
            <div className="space-y-4">
              {/* Hero Banner */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <img 
                  src="/assets/workshop-hero.jpg" 
                  alt="Annam Motors Workshop" 
                  className="w-full h-36 object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Premium Two-Wheeler Care</span>
                  <h4 className="text-xs font-bold text-white">Royal Enfield, Yamaha, Honda & TVS Specialist</h4>
                </div>
              </div>

              {/* Quick Action Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setMobileTab('track')}
                  className="bg-white border border-slate-200 p-3 rounded-2xl text-left space-y-1 hover:border-amber-500 transition shadow-sm"
                >
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-xl w-fit">
                    <Bike className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-black text-slate-900">Track Service</h5>
                  <p className="text-[10px] text-slate-500">Live bay status & bill</p>
                </button>

                <button
                  onClick={() => setMobileTab('packages')}
                  className="bg-white border border-slate-200 p-3 rounded-2xl text-left space-y-1 hover:border-cyan-500 transition shadow-sm"
                >
                  <div className="p-2 bg-cyan-50 text-cyan-700 rounded-xl w-fit">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-black text-slate-900">Book Service</h5>
                  <p className="text-[10px] text-slate-500">Doorstep Kottar pickup</p>
                </button>

                <button
                  onClick={() => setMobileTab('spares')}
                  className="bg-white border border-slate-200 p-3 rounded-2xl text-left space-y-1 hover:border-emerald-500 transition shadow-sm"
                >
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl w-fit">
                    <Boxes className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-black text-slate-900">Oils & Spares</h5>
                  <p className="text-[10px] text-slate-500">Motul, Castrol, Genuine</p>
                </button>

                <button
                  onClick={() => setMobileTab('sos')}
                  className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-left space-y-1 hover:border-rose-400 transition shadow-sm"
                >
                  <div className="p-2 bg-rose-100 text-rose-700 rounded-xl w-fit animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-black text-rose-900">Breakdown SOS</h5>
                  <p className="text-[10px] text-rose-700">Urgent mechanic dispatch</p>
                </button>
              </div>

              {/* Active Bike Status Card */}
              {trackingCard && (
                <div className="bg-white border border-amber-300 p-3.5 rounded-2xl space-y-2 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-amber-800">{trackingCard.vehicleNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                      {trackingCard.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{trackingCard.vehicleModel}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                    <span>Est. Delivery: Today</span>
                    <button
                      onClick={() => setMobileTab('track')}
                      className="text-amber-800 font-bold hover:underline flex items-center gap-0.5"
                    >
                      View Live Tracker →
                    </button>
                  </div>
                </div>
              )}

              {/* Kottar Workshop Highlights */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2 text-xs shadow-sm">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Kottar, Nagercoil Workshop</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {WORKSHOP_DETAILS.address}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Hours: {WORKSHOP_DETAILS.workingHours}
                </p>
              </div>
            </div>
          )}

          {/* TAB: Live Track */}
          {mobileTab === 'track' && trackingCard && (
            <div className="space-y-4">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Vehicle Live Status</span>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-mono font-bold text-amber-800 text-sm">{trackingCard.vehicleNumber}</h4>
                    <p className="text-xs font-bold text-slate-900">{trackingCard.vehicleModel}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-600">₹{trackingCard.totalAmount}</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Mechanic: <strong className="text-slate-900">{trackingCard.assignedMechanicName}</strong>
                </p>
              </div>

              {/* Timeline */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs shadow-sm">
                <h5 className="font-black text-slate-900 text-xs">Progress Stages:</h5>
                <div className="space-y-3 pl-2">
                  {['Received', 'Inspection', 'In Progress', 'Quality Check', 'Ready for Delivery'].map((stage, idx) => {
                    const isDone = stage === trackingCard.status || idx < 2;
                    return (
                      <div key={stage} className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                          isDone ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={isDone ? 'font-bold text-slate-900' : 'text-slate-400'}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* View Bill Button */}
              <button
                onClick={() => onViewInvoice(trackingCard)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>View / Share GST Invoice</span>
              </button>
            </div>
          )}

          {/* TAB: Service Packages */}
          {mobileTab === 'packages' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Service Packages
              </h4>
              {servicePackages.map(pkg => (
                <div key={pkg.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{pkg.title}</h5>
                      <p className="text-[10px] text-amber-700 font-semibold">{pkg.tamilTitle}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-600">₹{pkg.price}</span>
                  </div>
                  <p className="text-[10px] text-slate-600">{pkg.description}</p>
                  <button
                    onClick={() => {
                      alert(`Booking for ${pkg.title} selected! Call 9842178450 or submit online form.`);
                    }}
                    className="w-full bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 text-[11px] font-bold py-1.5 rounded-lg transition border border-slate-200"
                  >
                    Book This Service
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB: Spares Catalog */}
          {mobileTab === 'spares' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                In-Stock Genuine Spares & Oils
              </h4>
              <div className="space-y-2">
                {spareParts.slice(0, 6).map(part => (
                  <div key={part.id} className="bg-white p-2.5 rounded-xl border border-slate-200 flex justify-between items-center text-xs shadow-sm">
                    <div>
                      <h5 className="font-bold text-slate-900 text-[11px]">{part.name}</h5>
                      <span className="text-[10px] text-slate-500">{part.category}</span>
                    </div>
                    <span className="font-black text-emerald-600">₹{part.sellingPrice}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SOS */}
          {mobileTab === 'sos' && (
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-300 p-4 rounded-2xl text-center space-y-2 shadow-sm">
                <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-slate-900">Emergency Roadside Assistance</h4>
                <p className="text-[10px] text-slate-600">
                  Instant mechanic dispatch anywhere in Kottar, Chettikulam, Vadasery & Nagercoil.
                </p>
                <a
                  href={`tel:${WORKSHOP_DETAILS.phones[0]}`}
                  className="inline-flex items-center gap-1.5 bg-rose-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md mt-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {WORKSHOP_DETAILS.phones[0]}</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex justify-around items-center text-[10px] font-bold text-slate-500 z-50">
          <button
            onClick={() => setMobileTab('home')}
            className={`flex flex-col items-center gap-0.5 p-1 ${mobileTab === 'home' ? 'text-amber-600' : 'hover:text-slate-800'}`}
          >
            <Bike className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setMobileTab('track')}
            className={`flex flex-col items-center gap-0.5 p-1 ${mobileTab === 'track' ? 'text-amber-600' : 'hover:text-slate-800'}`}
          >
            <Clock className="w-4 h-4" />
            <span>Tracker</span>
          </button>

          <button
            onClick={() => setMobileTab('packages')}
            className={`flex flex-col items-center gap-0.5 p-1 ${mobileTab === 'packages' ? 'text-amber-600' : 'hover:text-slate-800'}`}
          >
            <Calendar className="w-4 h-4" />
            <span>Packages</span>
          </button>

          <button
            onClick={() => setMobileTab('spares')}
            className={`flex flex-col items-center gap-0.5 p-1 ${mobileTab === 'spares' ? 'text-amber-600' : 'hover:text-slate-800'}`}
          >
            <Boxes className="w-4 h-4" />
            <span>Spares</span>
          </button>

          <button
            onClick={() => setMobileTab('sos')}
            className={`flex flex-col items-center gap-0.5 p-1 ${mobileTab === 'sos' ? 'text-rose-600' : 'hover:text-slate-800'}`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>SOS</span>
          </button>
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400 rounded-full z-50 pointer-events-none"></div>
      </div>
    </div>
  );
};
