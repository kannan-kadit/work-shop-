export type BikeBrand = 
  | 'Royal Enfield' 
  | 'Yamaha' 
  | 'Honda' 
  | 'TVS' 
  | 'KTM' 
  | 'Hero' 
  | 'Bajaj' 
  | 'Suzuki' 
  | 'Other';

export type ServiceStatus = 
  | 'Received' 
  | 'Inspection' 
  | 'In Progress' 
  | 'Parts Pending' 
  | 'Quality Check' 
  | 'Ready for Delivery' 
  | 'Delivered';

export type PaymentStatus = 'Pending' | 'Partial' | 'Paid';

export type PaymentMethod = 'Cash' | 'GPay / UPI' | 'Card' | 'Credit';

export interface JobCardItem {
  id: string;
  partId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  isLabor: boolean;
}

export interface VehicleComplaint {
  id: string;
  text: string;
  completed: boolean;
}

export interface DamagePoint {
  id: string;
  x: number; // percentage from 0 to 100
  y: number; // percentage from 0 to 100
  description: string;
  type: 'scratch' | 'dent' | 'broken' | 'oil_leak';
}

export interface LiveUpdate {
  id: string;
  timestamp: string;
  stage: ServiceStatus;
  message: string;
  photoUrl?: string;
}

export interface JobCard {
  id: string; // e.g. "JC-7401"
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  vehicleNumber: string; // e.g. "TN 74 AB 3542"
  vehicleBrand: BikeBrand;
  vehicleModel: string;
  vehicleYear: number;
  odometerKm: number;
  fuelLevel: 'E' | '1/4' | '1/2' | '3/4' | 'F';
  assignedMechanicId: string;
  assignedMechanicName: string;
  status: ServiceStatus;
  servicePackage: string;
  complaints: VehicleComplaint[];
  damagePoints: DamagePoint[];
  items: JobCardItem[];
  laborCost: number;
  partsCost: number;
  discount: number;
  gstRate: number; // 0, 5, 12, 18, 28
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  estimatedCompletion: string;
  completedAt?: string;
  customerApprovedEstimate: boolean;
  notes: string;
  liveUpdates: LiveUpdate[];
}

export interface SparePart {
  id: string;
  partNumber: string;
  name: string;
  tamilName?: string;
  category: 
    | 'Engine Oils & Lubricants' 
    | 'Braking System' 
    | 'Chain & Drive' 
    | 'Electrical & Batteries' 
    | 'Filters & Plugs' 
    | 'Suspension & Bearings' 
    | 'Body & Cables' 
    | 'Tyres & Tubes';
  compatibleBrands: BikeBrand[];
  stock: number;
  minThreshold: number;
  unitCost: number;
  sellingPrice: number;
  hsnCode: string;
  rackLocation: string;
  imageUrl?: string;
}

export interface Mechanic {
  id: string;
  name: string;
  tamilName: string;
  phone: string;
  specialty: string;
  avatar: string;
  experienceYears: number;
  activeJobs: number;
  rating: number;
}

export interface ServicePackage {
  id: string;
  title: string;
  tamilTitle: string;
  description: string;
  price: number;
  estimatedHours: number;
  includedServices: string[];
  recommendedInterval: string;
  popular?: boolean;
}

export interface BreakdownRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  location: string;
  vehicleNumber: string;
  bikeModel: string;
  issue: string;
  status: 'Pending' | 'Mechanic Dispatched' | 'Resolved';
  timestamp: string;
  assignedMechanic?: string;
}

export interface WorkshopStats {
  todayVehiclesCount: number;
  inProgressCount: number;
  readyForDeliveryCount: number;
  completedThisMonth: number;
  monthlyRevenue: number;
  pendingPaymentTotal: number;
  lowStockItemsCount: number;
}
