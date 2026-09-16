import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Trash2,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  DollarSign
} from 'lucide-react';
import { InvoiceData, LineItem } from '../../types';
import { generateInvoicePDF, formatMoney, getCurrencySymbol } from '../../utils/pdfGenerator';

interface Props {
  onNotify?: (msg: string) => void;
  onOpenUpgradeModal?: () => void;
}

const DEFAULT_INVOICE: InvoiceData = {
  businessName: 'Apex Creative Studio',
  businessEmail: 'billing@apexstudio.io',
  businessPhone: '(555) 349-8201',
  businessAddress: '100 Innovation Way, Suite 400, Austin, TX 78701',
  clientName: 'Sarah Jenkins',
  clientEmail: 's.jenkins@horizonventures.com',
  clientAddress: 'Horizon Ventures, 450 Market St, San Francisco, CA 94105',
  invoiceNumber: 'INV-2026-001',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: 'USD',
  items: [
    {
      id: 'item-1',
      description: 'Brand Identity Strategy & Design System',
      quantity: 1,
      unitPrice: 2400,
    },
    {
      id: 'item-2',
      description: 'Responsive Landing Page UI/UX Prototype',
      quantity: 1,
      unitPrice: 1600,
    },
    {
      id: 'item-3',
      description: 'Design System Documentation & Asset Export',
      quantity: 8,
      unitPrice: 125,
    },
  ],
  discountPercent: 5,
  taxPercent: 8.25,
  notes: 'Payment is due within 14 days of invoice date via ACH or wire transfer. Thank you for your partnership!',
};

export const InvoiceGenerator: React.FC<Props> = ({ onNotify, onOpenUpgradeModal }) => {
  const [data, setData] = useState<InvoiceData>(DEFAULT_INVOICE);
  const [showLivePreview, setShowLivePreview] = useState<boolean>(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Line item handlers
  const handleAddItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    setData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    if (onNotify) onNotify('Added new line item');
  };

  const handleRemoveItem = (id: string) => {
    if (data.items.length <= 1) {
      if (onNotify) onNotify('Invoices must have at least one line item');
      return;
    }
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
    if (onNotify) onNotify('Removed line item');
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      }),
    }));
  };

  const handleReset = () => {
    setData({
      businessName: '',
      businessEmail: '',
      businessPhone: '',
      businessAddress: '',
      clientName: '',
      clientEmail: '',
      clientAddress: '',
      invoiceNumber: `INV-${new Date().getFullYear()}-001`,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      currency: 'USD',
      items: [{ id: `item-${Date.now()}`, description: '', quantity: 1, unitPrice: 0 }],
      discountPercent: 0,
      taxPercent: 0,
      notes: '',
    });
    if (onNotify) onNotify('Invoice form reset to blank');
  };

  const handleLoadSample = () => {
    setData(DEFAULT_INVOICE);
    if (onNotify) onNotify('Loaded sample business invoice');
  };

  // Calculations
  const subtotal = data.items.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return acc + qty * price;
  }, 0);

  const discountAmount = (subtotal * (Number(data.discountPercent) || 0)) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * (Number(data.taxPercent) || 0)) / 100;
  const grandTotal = taxableAmount + taxAmount;

  // PDF Generation
  const handleDownloadPDF = () => {
    try {
      setIsGeneratingPdf(true);
      generateInvoicePDF(data);
      setIsGeneratingPdf(false);
      if (onNotify) onNotify(`Invoice #${data.invoiceNumber || 'INV-001'} downloaded as PDF!`);
    } catch (err) {
      setIsGeneratingPdf(false);
      console.error('Error generating PDF:', err);
      if (onNotify) onNotify('Failed to generate PDF. Please verify all inputs.');
    }
  };

  const currencySymbol = getCurrencySymbol(data.currency);

  return (
    <div id="invoice-generator-tool" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      {/* Header Banner with Dev Notice */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0 shadow-2xs">
            <Receipt className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Invoice Generator</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>BizPilot Premium</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Create professional, client-ready PDF invoices. Your invoice is generated in your browser.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Sample Data
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
          >
            {showLivePreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showLivePreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Compiling PDF…' : 'Download Invoice'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Preview Right */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (7 cols on large, or full width if preview hidden) */}
        <div className={showLivePreview ? 'lg:col-span-7 space-y-6' : 'lg:col-span-12 space-y-6'}>
          {/* Section 1: Business Details */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Business Details (From)
              </h4>
              <span className="text-[11px] text-slate-400">Your details appear on invoice header</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Business Name</label>
                <input
                  type="text"
                  value={data.businessName}
                  onChange={(e) => setData({ ...data, businessName: e.target.value })}
                  placeholder="e.g. Apex Creative Studio LLC"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Business Email</label>
                <input
                  type="email"
                  value={data.businessEmail}
                  onChange={(e) => setData({ ...data, businessEmail: e.target.value })}
                  placeholder="billing@yourbusiness.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Business Phone</label>
                <input
                  type="text"
                  value={data.businessPhone}
                  onChange={(e) => setData({ ...data, businessPhone: e.target.value })}
                  placeholder="(555) 000-0000"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Business Address</label>
                <input
                  type="text"
                  value={data.businessAddress}
                  onChange={(e) => setData({ ...data, businessAddress: e.target.value })}
                  placeholder="City, State, ZIP"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Client Details */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Client Details (Billed To)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Client / Company Name</label>
                <input
                  type="text"
                  value={data.clientName}
                  onChange={(e) => setData({ ...data, clientName: e.target.value })}
                  placeholder="e.g. Acme Corp / Sarah Jenkins"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Client Email</label>
                <input
                  type="email"
                  value={data.clientEmail}
                  onChange={(e) => setData({ ...data, clientEmail: e.target.value })}
                  placeholder="client@company.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Client Address</label>
                <input
                  type="text"
                  value={data.clientAddress}
                  onChange={(e) => setData({ ...data, clientAddress: e.target.value })}
                  placeholder="Client street address, Suite, City, State, ZIP"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Invoice Metadata */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              Invoice Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Invoice #</label>
                <input
                  type="text"
                  value={data.invoiceNumber}
                  onChange={(e) => setData({ ...data, invoiceNumber: e.target.value })}
                  placeholder="INV-001"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={data.invoiceDate}
                  onChange={(e) => setData({ ...data, invoiceDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date</label>
                <input
                  type="date"
                  value={data.dueDate}
                  onChange={(e) => setData({ ...data, dueDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Currency</label>
                <select
                  value={data.currency}
                  onChange={(e) => setData({ ...data, currency: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-semibold text-slate-800"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (CA$)</option>
                  <option value="AUD">AUD (AU$)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Line Items */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Line Items
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {data.items.map((item, index) => {
                const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs grid grid-cols-12 gap-2.5 items-center"
                  >
                    <div className="col-span-12 sm:col-span-6">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        placeholder="Service or product description..."
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none font-medium"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none font-mono text-right"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                        Unit Price ({currencySymbol})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none font-mono text-right"
                      />
                    </div>

                    <div className="col-span-3 sm:col-span-1 text-right">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Total</div>
                      <div className="text-xs font-bold text-slate-900 font-mono">
                        {formatMoney(lineTotal, data.currency)}
                      </div>
                    </div>

                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Adjustments & Notes */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Tax, Discount &amp; Notes</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Discount (%):</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={data.discountPercent}
                    onChange={(e) => setData({ ...data, discountPercent: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white font-mono"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tax Rate (%):</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={data.taxPercent}
                    onChange={(e) => setData({ ...data, taxPercent: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white font-mono"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Terms &amp; Notes</label>
                <textarea
                  rows={2}
                  value={data.notes}
                  onChange={(e) => setData({ ...data, notes: e.target.value })}
                  placeholder="e.g. Payment due via wire transfer within 14 days..."
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Privacy statement banner */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between gap-3 text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Zero Server Uploads:</strong> Your invoice is generated in your browser. All business details stay completely private.
              </span>
            </div>
            {onOpenUpgradeModal && (
              <button
                type="button"
                onClick={onOpenUpgradeModal}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 underline shrink-0 cursor-pointer"
              >
                Learn about $5 early deal
              </button>
            )}
          </div>
        </div>

        {/* Live Preview Panel (5 cols on large) */}
        {showLivePreview && (
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Invoice Preview</span>
                </div>
                <span className="text-xs font-mono text-slate-400">#{data.invoiceNumber || 'INV-001'}</span>
              </div>

              {/* Document Sheet Simulation */}
              <div className="mt-5 bg-white text-slate-900 rounded-2xl p-5 shadow-sm text-xs space-y-4">
                {/* Header Row */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900">{data.businessName || 'Your Business Name'}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{data.businessEmail || 'email@business.com'}</p>
                    <p className="text-[11px] text-slate-400">{data.businessAddress || 'City, State'}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-blue-600 text-base">INVOICE</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Due: {data.dueDate || 'Upon receipt'}</p>
                  </div>
                </div>

                {/* Bill To */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Billed To</span>
                  <div className="font-bold text-slate-800 mt-0.5">{data.clientName || 'Client Name'}</div>
                  <div className="text-[11px] text-slate-500">{data.clientEmail || 'client@email.com'}</div>
                  {data.clientAddress && <div className="text-[10px] text-slate-400 mt-0.5">{data.clientAddress}</div>}
                </div>

                {/* Items Mini List */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 pb-1">
                    <span>Description</span>
                    <span>Total</span>
                  </div>
                  {data.items.map((item, i) => {
                    const total = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                    return (
                      <div key={item.id || i} className="flex justify-between items-center text-[11px] py-1">
                        <span className="truncate pr-2 font-medium text-slate-700">
                          {item.description || 'Line Item'} × {item.quantity || 1}
                        </span>
                        <span className="font-mono font-bold text-slate-900 shrink-0">
                          {formatMoney(total, data.currency)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Calculation Totals */}
                <div className="border-t border-slate-200 pt-3 space-y-1 text-right text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-mono font-medium">{formatMoney(subtotal, data.currency)}</span>
                  </div>

                  {data.discountPercent > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Discount ({data.discountPercent}%):</span>
                      <span className="font-mono font-medium">-{formatMoney(discountAmount, data.currency)}</span>
                    </div>
                  )}

                  {data.taxPercent > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Tax ({data.taxPercent}%):</span>
                      <span className="font-mono font-medium">+{formatMoney(taxAmount, data.currency)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm font-black text-slate-900 border-t border-slate-200 pt-2 mt-1">
                    <span>Total Due:</span>
                    <span className="text-base text-blue-600 font-mono">{formatMoney(grandTotal, data.currency)}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPdf}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingPdf ? 'Generating PDF…' : 'Download Invoice (PDF)'}</span>
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  Formatted for US Letter print &amp; digital sending.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
