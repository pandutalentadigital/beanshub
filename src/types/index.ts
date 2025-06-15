export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Roaster' | 'Staff';
  phone?: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin: Date | null;
}

export interface GreenBean {
  id: string;
  supplierName: string;
  variety: string;
  origin: string;
  quantity: number; // kg
  purchasePricePerKg: number;
  entryDate: Date;
  batchNumber: string;
  lowStockThreshold: number;
}

export interface RoastingProfile {
  id: string;
  name: string;
  temperatureCurve: string;
  targetDuration: number; // minutes
  notes: string;
  createdBy: string;
  createdAt: Date;
}

export interface RoastingSession {
  id: string;
  greenBeanId: string;
  greenBeanQuantity: number; // kg
  roastedQuantity: number; // kg (auto-calculated)
  profileId: string;
  roastDate: Date;
  roasterId: string;
  qualityScore?: number;
  notes?: string;
  batchNumber: string;
}

export interface Sale {
  id: string;
  productType: 'green' | 'roasted';
  productId: string;
  quantity: number; // kg
  pricePerKg: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Card' | 'Transfer';
  customerName?: string;
  customerPhone?: string;
  saleDate: Date;
  staffId: string;
}

export interface PricingData {
  greenBeanCost: number;
  roastedBeanCost: number;
  operatingCosts: number;
  suggestedRetailPrice: number;
  margin: number;
}

export interface FinancialReport {
  period: string;
  revenue: number;
  costs: number;
  profit: number;
  inventoryValue: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId?: string; // Added for Firestore filtering
}