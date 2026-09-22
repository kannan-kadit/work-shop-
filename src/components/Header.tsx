import React from 'react';
import { 
  Wrench, 
  Smartphone, 
  Search, 
  PhoneCall, 
  MapPin, 
  Sparkles, 
  AlertTriangle,
  RotateCcw,
  LayoutDashboard,
  Boxes,
  UserCheck
} from 'lucide-react';
import { WORKSHOP_DETAILS } from '../data/mockData';

interface HeaderProps {
  currentTab: 'dashboard' | 'inventory' | 'mechanic' | 'customer' | 'mobile-sim' | 'breakdown';
  setCurrentTab: (tab: 'dashboard' | 'inventory' | 'mechanic' | 'customer' | 'mobile-sim' | 'breakdown') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewJobCard: () => void;
  onResetData: () => void;
  pendingBreakdownsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  onNewJobCard,
  onResetData,
  pendingBreakdownsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner with Kottar Location & Emergency Helpline */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-1.5 text-xs text-white font-medium flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="bg-black/25 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">Kottar • Nagercoil</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {WORKSHOP_DETAILS.landmark}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden sm:inline-block font-semibold">GSTIN: {WORKSHOP_DETAILS.gstin}</span>
          <a 
            href={`tel:${WORKSHOP_DETAILS.phones[0]}`}
            className="flex items-center gap-1 font-bold hover:underline bg-white/20 px-2 py-0.5 rounded transition"
          >
            <PhoneCall className="w-3 h-3" /> Breakdown Helpline: {WORKSHOP_DETAILS.phones[0]}
          </a>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo and Brand Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="relative group">
              <img 
                src="/assets/logo.jpg" 
                alt="Annam Motors Logo" 
                className="w-12 h-12 rounded-full border-2 border-amber-500 shadow-md object-cover transform group-hover:rotate-12 transition duration-300" 
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-white" title="Workshop Open"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display">
                  ANNAM <span className="text-amber-600">MOTORS</span>
                </h1>
                <span className="text-xs font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-300 rounded-full hidden md:inline-block">
                  Kottar
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                அன்னம் மோட்டார்ஸ் • Two-Wheeler Multi-Brand Specialist
              </p>
            </div>
          </div>

          {/* Search Bar for TN 74 registrations or Customer Name */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search TN 74 Reg No, Customer, Mobile or JC ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons: New Job Card, Mobile App Sim, Reset */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onNewJobCard}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              <span className="hidden sm:inline">+ Create Job Card</span>
              <span className="sm:hidden">+ New</span>
            </button>

            {/* Mobile App Toggle */}
            <button
              onClick={() => setCurrentTab(currentTab === 'mobile-sim' ? 'dashboard' : 'mobile-sim')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                currentTab === 'mobile-sim'
                  ? 'bg-cyan-50 text-cyan-700 border-cyan-400 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-cyan-500 hover:text-cyan-700'
              }`}
              title="Toggle Interactive Mobile App Simulator"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden md:inline">Mobile App View</span>
            </button>

            {/* Emergency Breakdown Requests Badge */}
            {pendingBreakdownsCount > 0 && (
              <button
                onClick={() => setCurrentTab('breakdown')}
                className="relative flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold hover:bg-rose-100 transition animate-pulse"
                title="Pending Roadside Breakdown Requests"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">Kottar SOS</span>
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {pendingBreakdownsCount}
                </span>
              </button>
            )}

            {/* Reset Demo Data */}
            <button
              onClick={onResetData}
              title="Reset Sample Data"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-t border-slate-200 py-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              currentTab === 'dashboard'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Workshop Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('inventory')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              currentTab === 'inventory'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Spare Parts & Oil Inventory</span>
          </button>

          <button
            onClick={() => setCurrentTab('mechanic')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              currentTab === 'mechanic'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Mechanic Workstation</span>
          </button>

          <button
            onClick={() => setCurrentTab('customer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              currentTab === 'customer'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Customer Live Tracker & Booking</span>
          </button>

          <button
            onClick={() => setCurrentTab('breakdown')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              currentTab === 'breakdown'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Roadside SOS Assistance</span>
          </button>

          <button
            onClick={() => setCurrentTab('mobile-sim')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              currentTab === 'mobile-sim'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-cyan-700 hover:text-cyan-900 hover:bg-cyan-50'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile App Interface</span>
          </button>
        </div>
      </div>
    </header>
  );
};
