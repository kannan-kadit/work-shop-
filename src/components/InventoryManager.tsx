import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  X
} from 'lucide-react';
import { SparePart, BikeBrand } from '../types';

interface InventoryManagerProps {
  spareParts: SparePart[];
  onRestock: (partId: string, quantity: number) => void;
  onAddPart: (part: Omit<SparePart, 'id'>) => void;
}

const CATEGORIES = [
  'ALL',
  'Engine Oils & Lubricants',
  'Braking System',
  'Chain & Drive',
  'Electrical & Batteries',
  'Filters & Plugs',
  'Suspension & Bearings',
  'Body & Cables',
  'Tyres & Tubes'
];

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  spareParts,
  onRestock,
  onAddPart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [restockModalPart, setRestockModalPart] = useState<SparePart | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);

  // New Part Form State
  const [newPartNumber, setNewPartNumber] = useState('');
  const [newName, setNewName] = useState('');
  const [newTamilName, setNewTamilName] = useState('');
  const [newCategory, setNewCategory] = useState<SparePart['category']>('Engine Oils & Lubricants');
  const [newCompatibleBrands] = useState<BikeBrand[]>(['Royal Enfield', 'Yamaha']);
  const [newStock, setNewStock] = useState<number>(10);
  const [newMinThreshold, setNewMinThreshold] = useState<number>(5);
  const [newUnitCost, setNewUnitCost] = useState<number>(400);
  const [newSellingPrice, setNewSellingPrice] = useState<number>(550);
  const [newHsnCode, setNewHsnCode] = useState('87141090');
  const [newRackLocation, setNewRackLocation] = useState('Rack A-1 (Kottar Store)');

  // Filter parts
  const filteredParts = spareParts.filter(part => {
    const matchesCat = selectedCategory === 'ALL' || part.category === selectedCategory;
    const matchesSearch = 
      !searchQuery ||
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.rackLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.compatibleBrands.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  // Inventory Totals
  const totalItemsCount = spareParts.reduce((sum, p) => sum + p.stock, 0);
  const totalValuation = spareParts.reduce((sum, p) => sum + (p.stock * p.sellingPrice), 0);
  const totalCostValuation = spareParts.reduce((sum, p) => sum + (p.stock * p.unitCost), 0);
  const lowStockCount = spareParts.filter(p => p.stock <= p.minThreshold).length;

  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartNumber || !newName) return;

    onAddPart({
      partNumber: newPartNumber.toUpperCase().trim(),
      name: newName,
      tamilName: newTamilName,
      category: newCategory,
      compatibleBrands: newCompatibleBrands,
      stock: Number(newStock) || 0,
      minThreshold: Number(newMinThreshold) || 3,
      unitCost: Number(newUnitCost) || 0,
      sellingPrice: Number(newSellingPrice) || 0,
      hsnCode: newHsnCode,
      rackLocation: newRackLocation,
    });

    setIsAddModalOpen(false);
    setNewPartNumber('');
    setNewName('');
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restockModalPart && restockQty > 0) {
      onRestock(restockModalPart.id, restockQty);
      setRestockModalPart(null);
      setRestockQty(10);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Inventory Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
            <span>Total Spare SKUs</span>
            <Boxes className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-display mt-2">
            {spareParts.length} Parts
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Total units in stock: <span className="text-slate-900 font-bold">{totalItemsCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
            <span>Inventory Retail Value</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-display mt-2">
            ₹{totalValuation.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Cost Basis: ₹{totalCostValuation.toLocaleString()}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
            <span>Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 font-display mt-2">
            {lowStockCount} Items
          </div>
          <div className="text-xs text-rose-600 mt-1 font-semibold">
            Below safety buffer threshold
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-600">
            Kottar Workshop Stock Management
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-2 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Part / Oil</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search part name, Motul oil, HSN, rack location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-2xl no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Parts List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParts.map(part => {
          const isLowStock = part.stock <= part.minThreshold;
          const profitMargin = Math.round(((part.sellingPrice - part.unitCost) / part.sellingPrice) * 100);

          return (
            <div
              key={part.id}
              className={`bg-white border rounded-2xl p-4 flex flex-col justify-between space-y-3 transition hover:shadow-md ${
                isLowStock ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Top Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                    {part.partNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isLowStock ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  }`}>
                    {isLowStock ? 'LOW STOCK' : 'IN STOCK'}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-2 leading-snug">
                  {part.name}
                </h3>
                {part.tamilName && (
                  <p className="text-xs text-slate-500 mt-0.5 font-sans">
                    {part.tamilName}
                  </p>
                )}
                <p className="text-[11px] text-slate-500 mt-1">
                  Category: <span className="text-slate-800 font-semibold">{part.category}</span>
                </p>
              </div>

              {/* Compatible Brands & Location */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex flex-wrap gap-1">
                  {part.compatibleBrands.map(b => (
                    <span key={b} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200 font-semibold">
                      {b}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-600 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{part.rackLocation}</span>
                </div>
              </div>

              {/* Stock Count & Pricing */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Stock Qty</div>
                  <div className={`text-xl font-black font-mono ${isLowStock ? 'text-rose-600' : 'text-slate-900'}`}>
                    {part.stock} <span className="text-xs font-normal text-slate-500">units</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Min buffer: {part.minThreshold}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Selling Price</div>
                  <div className="text-xl font-black text-emerald-600 font-display">
                    ₹{part.sellingPrice}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Cost: ₹{part.unitCost} ({profitMargin}% margin)
                  </div>
                </div>
              </div>

              {/* Restock Button */}
              <button
                onClick={() => setRestockModalPart(part)}
                className="w-full bg-slate-100 hover:bg-amber-500 text-slate-800 hover:text-slate-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-200 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Restock / Add Stock</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Restock Modal */}
      {restockModalPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xl text-slate-900">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900 font-display">
                Restock Spare Part
              </h3>
              <button onClick={() => setRestockModalPart(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="font-bold text-amber-800">{restockModalPart.name}</p>
              <p className="text-slate-600">SKU: {restockModalPart.partNumber} | Current Stock: <span className="text-slate-900 font-bold">{restockModalPart.stock}</span></p>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Enter Additional Quantity to Add:</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono text-lg font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setRestockModalPart(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
                >
                  Confirm Restock (+{restockQty})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Part Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xl text-slate-900 my-8">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900 font-display">
                Add New Spare Part / Lubricant
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePart} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Part SKU / Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MOT-5100-15W50"
                    value={newPartNumber}
                    onChange={(e) => setNewPartNumber(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">HSN Code</label>
                  <input
                    type="text"
                    placeholder="27101981"
                    value={newHsnCode}
                    onChange={(e) => setNewHsnCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Part Name (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Motul 5100 15W50 Semi-Synthetic (1L)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tamil Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. மோத்துல் இன்ஜின் ஆயில்"
                  value={newTamilName}
                  onChange={(e) => setNewTamilName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as SparePart['category'])}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    {CATEGORIES.filter(c => c !== 'ALL').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rack Location (Kottar)</label>
                  <input
                    type="text"
                    value={newRackLocation}
                    onChange={(e) => setNewRackLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Alert</label>
                  <input
                    type="number"
                    value={newMinThreshold}
                    onChange={(e) => setNewMinThreshold(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cost (₹)</label>
                  <input
                    type="number"
                    value={newUnitCost}
                    onChange={(e) => setNewUnitCost(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling (₹)</label>
                  <input
                    type="number"
                    value={newSellingPrice}
                    onChange={(e) => setNewSellingPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-amber-700 text-center font-black"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-md transition"
                >
                  Save Spare Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
