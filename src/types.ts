export type ToolCategory = 'All' | 'Business' | 'Calculators' | 'Productivity' | 'Marketing';

export type SubscriptionStatus = 'free' | 'premium' | 'expired' | 'loading';

export type SubscriptionPlanId = 'free' | 'monthly_promo_5' | '3_months' | '6_months' | 'yearly';

export interface SubscriptionState {
  status: SubscriptionStatus;
  planId?: SubscriptionPlanId;
  planName?: string;
  expiresAt?: string | null;
  isTrialPromo?: boolean;
  renewsAt?: string | null;
}

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  tagline: string;
  description: string;
  isPremium: boolean;
  iconName: string;
  badge?: string;
  actionLabel: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  duration: string;
  price: string;
  promotionalPrice?: string;
  regularPrice?: string;
  period: string;
  monthlyEquivalent?: string;
  popular?: boolean;
  bestValue?: boolean;
  savings?: string;
  features: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export type InfoModalType = 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | null;

export interface LineItem {
  id: string;
  description: string;
  quantity: number | string;
  unitPrice: number | string;
}

export interface InvoiceData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  items: LineItem[];
  discountPercent: number | string;
  taxPercent: number | string;
  notes: string;
}

export interface QuoteData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  quoteNumber: string;
  quoteDate: string;
  validUntil: string;
  currency: string;
  items: LineItem[];
  discountPercent: number | string;
  taxPercent: number | string;
  notes: string;
}

export interface ProposalData {
  businessName: string;
  contactName: string;
  businessEmail: string;
  businessPhone: string;
  clientName: string;
  companyName: string;
  clientEmail: string;
  proposalTitle: string;
  projectDescription: string;
  scopeOfWork: string;
  deliverables: string;
  timeline: string;
  pricing: string;
  paymentTerms: string;
  additionalNotes: string;
  proposalDate: string;
  currency: string;
}
