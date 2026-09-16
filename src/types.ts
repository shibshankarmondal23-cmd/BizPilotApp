export type ToolCategory = 'All' | 'Business' | 'Calculators' | 'Productivity' | 'Marketing';

export type SubscriptionStatus = 'free' | 'active' | 'cancelled' | 'expired' | 'loading';

export type SubscriptionPlanId = 'free' | 'monthly-promo' | '3-months' | '6-months' | '1-year';

export type SubscriptionTier = 'free' | 'monthly' | '3-months' | '6-months' | '1-year';

export interface SubscriptionEntitlement {
  status: SubscriptionStatus;
  tier: SubscriptionTier;
  planId: SubscriptionPlanId;
  planName: string;
  startsAt: string | null;
  expiresAt: string | null;
  renewsAt: string | null;
  cancelAtPeriodEnd: boolean;
  isPromotionalRate: boolean;
  customerId?: string | null;
  subscriptionId?: string | null;
}

export interface SubscriptionState extends SubscriptionEntitlement {
  // Convenience getters
  isPremium?: boolean;
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

export interface CashfreeOrderResponse {
  success: boolean;
  order_id?: string;
  payment_session_id?: string;
  order_amount?: number;
  order_currency?: string;
  order_status?: string;
  environment?: 'sandbox' | 'production';
  plan_id?: SubscriptionPlanId;
  plan_name?: string;
  isSandboxPreview?: boolean;
  error?: string;
  code?: string;
}

export interface CashfreeVerificationResponse {
  verified: boolean;
  order_id: string;
  cf_order_id?: string | number;
  order_status: string;
  plan_id?: SubscriptionPlanId;
  plan_name?: string;
  amount?: number;
  currency?: string;
  paid_at?: string;
  customer_email?: string;
  customer_name?: string;
  error?: string;
  entitlement?: SubscriptionState;
  isSandboxPreview?: boolean;
}

export interface CashfreeGatewayConfig {
  isConfigured: boolean;
  environment: 'sandbox' | 'production';
  currency: string;
}
