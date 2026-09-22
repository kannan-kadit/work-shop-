import { 
  JobCard, 
  SparePart, 
  Mechanic, 
  ServicePackage, 
  BreakdownRequest, 
  ServiceStatus, 
  WorkshopStats,
  LiveUpdate
} from '../types';
import { 
  INITIAL_JOB_CARDS, 
  INITIAL_PARTS, 
  INITIAL_MECHANICS, 
  INITIAL_SERVICE_PACKAGES, 
  INITIAL_BREAKDOWN_REQUESTS 
} from '../data/mockData';

const KEYS = {
  JOB_CARDS: 'annam_motors_job_cards_v1',
  PARTS: 'annam_motors_parts_v1',
  MECHANICS: 'annam_motors_mechanics_v1',
  PACKAGES: 'annam_motors_packages_v1',
  BREAKDOWN: 'annam_motors_breakdown_v1',
};

class StorageService {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(KEYS.JOB_CARDS)) {
      localStorage.setItem(KEYS.JOB_CARDS, JSON.stringify(INITIAL_JOB_CARDS));
    }
    if (!localStorage.getItem(KEYS.PARTS)) {
      localStorage.setItem(KEYS.PARTS, JSON.stringify(INITIAL_PARTS));
    }
    if (!localStorage.getItem(KEYS.MECHANICS)) {
      localStorage.setItem(KEYS.MECHANICS, JSON.stringify(INITIAL_MECHANICS));
    }
    if (!localStorage.getItem(KEYS.PACKAGES)) {
      localStorage.setItem(KEYS.PACKAGES, JSON.stringify(INITIAL_SERVICE_PACKAGES));
    }
    if (!localStorage.getItem(KEYS.BREAKDOWN)) {
      localStorage.setItem(KEYS.BREAKDOWN, JSON.stringify(INITIAL_BREAKDOWN_REQUESTS));
    }
  }

  // Job Cards
  getJobCards(): JobCard[] {
    try {
      const data = localStorage.getItem(KEYS.JOB_CARDS);
      return data ? JSON.parse(data) : INITIAL_JOB_CARDS;
    } catch (e) {
      console.error(e);
      return INITIAL_JOB_CARDS;
    }
  }

  saveJobCards(cards: JobCard[]): void {
    localStorage.setItem(KEYS.JOB_CARDS, JSON.stringify(cards));
  }

  getJobCardById(id: string): JobCard | undefined {
    const cards = this.getJobCards();
    return cards.find(c => c.id.toLowerCase() === id.toLowerCase() || c.vehicleNumber.replace(/\s+/g, '').toLowerCase() === id.replace(/\s+/g, '').toLowerCase());
  }

  createJobCard(card: Omit<JobCard, 'id' | 'createdAt' | 'liveUpdates'>): JobCard {
    const cards = this.getJobCards();
    const nextNum = 7400 + cards.length + 1;
    const newId = `JC-${nextNum}`;
    
    const initialUpdate: LiveUpdate = {
      id: 'u-' + Date.now(),
      timestamp: new Date().toISOString(),
      stage: card.status || 'Received',
      message: `Job Card ${newId} created for ${card.vehicleNumber} (${card.vehicleModel}) at Annam Motors Kottar.`,
    };

    const newCard: JobCard = {
      ...card,
      id: newId,
      createdAt: new Date().toISOString(),
      liveUpdates: [initialUpdate],
    };

    // Deduct parts stock if any parts were attached
    newCard.items.forEach(item => {
      if (item.partId && !item.isLabor) {
        this.deductPartStock(item.partId, item.quantity);
      }
    });

    cards.unshift(newCard);
    this.saveJobCards(cards);
    return newCard;
  }

  updateJobCard(id: string, updates: Partial<JobCard>): JobCard | null {
    const cards = this.getJobCards();
    const index = cards.findIndex(c => c.id === id);
    if (index === -1) return null;

    const oldCard = cards[index];
    const updatedCard: JobCard = {
      ...oldCard,
      ...updates,
    };

    // Recalculate totals if items or discount or gst changed
    if (updates.items || updates.discount !== undefined || updates.gstRate !== undefined) {
      const items = updatedCard.items;
      const laborCost = items.filter(i => i.isLabor).reduce((sum, i) => sum + (i.total || (i.quantity * i.unitPrice)), 0);
      const partsCost = items.filter(i => !i.isLabor).reduce((sum, i) => sum + (i.total || (i.quantity * i.unitPrice)), 0);
      const subtotal = laborCost + partsCost - (updatedCard.discount || 0);
      const gstAmount = Math.round(subtotal * ((updatedCard.gstRate || 0) / 100));
      const totalAmount = Math.max(0, subtotal + gstAmount);

      updatedCard.laborCost = laborCost;
      updatedCard.partsCost = partsCost;
      updatedCard.totalAmount = totalAmount;
    }

    cards[index] = updatedCard;
    this.saveJobCards(cards);
    return updatedCard;
  }

  updateJobStatus(id: string, newStatus: ServiceStatus, updateMessage?: string): JobCard | null {
    const cards = this.getJobCards();
    const index = cards.findIndex(c => c.id === id);
    if (index === -1) return null;

    const card = cards[index];
    const newUpdate: LiveUpdate = {
      id: 'u-' + Date.now(),
      timestamp: new Date().toISOString(),
      stage: newStatus,
      message: updateMessage || `Status updated to ${newStatus}.`,
    };

    card.status = newStatus;
    if (newStatus === 'Delivered') {
      card.completedAt = new Date().toISOString();
    }
    card.liveUpdates = [...(card.liveUpdates || []), newUpdate];

    cards[index] = card;
    this.saveJobCards(cards);
    return card;
  }

  deleteJobCard(id: string): boolean {
    const cards = this.getJobCards();
    const filtered = cards.filter(c => c.id !== id);
    if (filtered.length !== cards.length) {
      this.saveJobCards(filtered);
      return true;
    }
    return false;
  }

  // Parts / Inventory
  getParts(): SparePart[] {
    try {
      const data = localStorage.getItem(KEYS.PARTS);
      return data ? JSON.parse(data) : INITIAL_PARTS;
    } catch (e) {
      console.error(e);
      return INITIAL_PARTS;
    }
  }

  saveParts(parts: SparePart[]): void {
    localStorage.setItem(KEYS.PARTS, JSON.stringify(parts));
  }

  addPart(part: Omit<SparePart, 'id'>): SparePart {
    const parts = this.getParts();
    const newPart: SparePart = {
      ...part,
      id: 'PRT-' + (parts.length + 1).toString().padStart(2, '0'),
    };
    parts.push(newPart);
    this.saveParts(parts);
    return newPart;
  }

  updatePart(id: string, updates: Partial<SparePart>): SparePart | null {
    const parts = this.getParts();
    const index = parts.findIndex(p => p.id === id);
    if (index === -1) return null;
    parts[index] = { ...parts[index], ...updates };
    this.saveParts(parts);
    return parts[index];
  }

  deductPartStock(partId: string, quantity: number): void {
    const parts = this.getParts();
    const part = parts.find(p => p.id === partId);
    if (part) {
      part.stock = Math.max(0, part.stock - quantity);
      this.saveParts(parts);
    }
  }

  restockPart(partId: string, addedQuantity: number): void {
    const parts = this.getParts();
    const part = parts.find(p => p.id === partId);
    if (part) {
      part.stock += addedQuantity;
      this.saveParts(parts);
    }
  }

  // Mechanics
  getMechanics(): Mechanic[] {
    try {
      const data = localStorage.getItem(KEYS.MECHANICS);
      return data ? JSON.parse(data) : INITIAL_MECHANICS;
    } catch (e) {
      console.error(e);
      return INITIAL_MECHANICS;
    }
  }

  saveMechanics(mechanics: Mechanic[]): void {
    localStorage.setItem(KEYS.MECHANICS, JSON.stringify(mechanics));
  }

  // Service Packages
  getPackages(): ServicePackage[] {
    try {
      const data = localStorage.getItem(KEYS.PACKAGES);
      return data ? JSON.parse(data) : INITIAL_SERVICE_PACKAGES;
    } catch (e) {
      console.error(e);
      return INITIAL_SERVICE_PACKAGES;
    }
  }

  // Emergency Kottar Breakdown Requests
  getBreakdownRequests(): BreakdownRequest[] {
    try {
      const data = localStorage.getItem(KEYS.BREAKDOWN);
      return data ? JSON.parse(data) : INITIAL_BREAKDOWN_REQUESTS;
    } catch (e) {
      console.error(e);
      return INITIAL_BREAKDOWN_REQUESTS;
    }
  }

  saveBreakdownRequests(requests: BreakdownRequest[]): void {
    localStorage.setItem(KEYS.BREAKDOWN, JSON.stringify(requests));
  }

  createBreakdownRequest(req: Omit<BreakdownRequest, 'id' | 'timestamp' | 'status'>): BreakdownRequest {
    const list = this.getBreakdownRequests();
    const newReq: BreakdownRequest = {
      ...req,
      id: 'BRK-' + (740 + list.length + 1),
      timestamp: new Date().toISOString(),
      status: 'Pending',
    };
    list.unshift(newReq);
    this.saveBreakdownRequests(list);
    return newReq;
  }

  updateBreakdownStatus(id: string, status: 'Pending' | 'Mechanic Dispatched' | 'Resolved', assignedMechanic?: string): BreakdownRequest | null {
    const list = this.getBreakdownRequests();
    const index = list.findIndex(r => r.id === id);
    if (index === -1) return null;
    list[index].status = status;
    if (assignedMechanic) list[index].assignedMechanic = assignedMechanic;
    this.saveBreakdownRequests(list);
    return list[index];
  }

  // Analytics Stats
  getStats(): WorkshopStats {
    const cards = this.getJobCards();
    const parts = this.getParts();

    const todayStr = new Date().toISOString().split('T')[0];
    const todayVehiclesCount = cards.filter(c => c.createdAt.startsWith(todayStr)).length;
    const inProgressCount = cards.filter(c => ['Received', 'Inspection', 'In Progress', 'Parts Pending', 'Quality Check'].includes(c.status)).length;
    const readyForDeliveryCount = cards.filter(c => c.status === 'Ready for Delivery').length;
    const completedThisMonth = cards.filter(c => c.status === 'Delivered').length;
    const monthlyRevenue = cards
      .filter(c => c.paymentStatus === 'Paid')
      .reduce((sum, c) => sum + c.totalAmount, 0);
    const pendingPaymentTotal = cards
      .filter(c => c.paymentStatus === 'Pending' || c.paymentStatus === 'Partial')
      .reduce((sum, c) => sum + c.totalAmount, 0);
    const lowStockItemsCount = parts.filter(p => p.stock <= p.minThreshold).length;

    return {
      todayVehiclesCount,
      inProgressCount,
      readyForDeliveryCount,
      completedThisMonth,
      monthlyRevenue,
      pendingPaymentTotal,
      lowStockItemsCount,
    };
  }

  resetAll(): void {
    localStorage.removeItem(KEYS.JOB_CARDS);
    localStorage.removeItem(KEYS.PARTS);
    localStorage.removeItem(KEYS.MECHANICS);
    localStorage.removeItem(KEYS.PACKAGES);
    localStorage.removeItem(KEYS.BREAKDOWN);
    this.init();
  }
}

export const storage = new StorageService();
