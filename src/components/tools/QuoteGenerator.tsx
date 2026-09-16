import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Calendar
} from 'lucide-react';
import { QuoteData, LineItem } from '../../types';
import { generateQuotePDF, formatMoney, getCurrencySymbol } from '../../utils/pdfGenerator';

interface Props {
  onNotify?: (msg: string) => void;
  onOpenUpgradeModal?: () => void;
}

const DEFAULT_QUOTE: QuoteData = {
  businessName: 'Vanguard Digital Solutions',
  businessEmail: 'contact@vanguarddigital.io',
  businessPhone: '(555) 782-4190',
  businessAddress: '742 Evergreen Terrace, Suite 200, Denver, CO 80202',
  clientName: 'David Miller',
  clientEmail: 'david@greenleaflogistics.com',
  clientAddress: 'Greenleaf Logistics, 1200 Industrial Blvd, Dallas, TX 75207',
  quoteNumber: 'QT-2026-042',
  quoteDate: new Date().toISOString().split('T')[0],
  validUntil: '30 Days from issue',
  currency: 'USD',
  items: [
    {
      id: 'item-1',
      description: 'Custom Business Web Application Architecture & MVP Build',
      quantity: 1,
      unitPrice: 4800,
    },
    {
      id: 'item-2',
      description: 'API Integration & Real-Time Sync Pipeline',
      quantity: 1,
      unitPrice: 1850,
    },
    {
      id: 'item-3',
      description: 'Dedicated Quality Assurance, Staging Deployment & Training',
      quantity: 12,
      unitPrice: 120,
    },
  ],
  discountPercent: 10,
  taxPercent: 7.5,
  notes: 'This quote is valid for 30 days. A 50% deposit is required upon project kickoff. The remaining balance is payable upon delivery and client sign-off.',
};

export const QuoteGenerator: React.FC<Props> = ({ onNotify, onOpenUpgradeModal }) => {
  const [data, setData] = useState<QuoteData>(DEFAULT_QUOTE);
  const [showLivePreview, setShowLivePreview] = useState<boolean>(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const handleAddService = () => {
    const newItem: LineItem = {
      id: `service-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    setData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    if (onNotify) onNotify('Added new service to quote');
  };

  const handleRemoveService = (id: string) => {
    if (data.items.length <= 1) {
      if (onNotify) onNotify('Quotes must have at least one service item');
      return;
    }
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
    if (onNotify) onNotify('Removed service item');
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
      quoteNumber: `QT-${new Date().getFullYear()}-001`,
      quoteDate: new Date().toISOString().split('T')[0],
      validUntil: '30 Days',
      currency: 'USD',
      items: [{ id: `service-${Date.now()}`, description: '', quantity: 1, unitPrice: 0 }],
      discountPercent: 0,
      taxPercent: 0,
      notes: '',
    });
    if (onNotify) onNotify('Quote form reset to blank');
  };

  const handleLoadSample = () => {
    setData(DEFAULT_QUOTE);
    if (onNotify) onNotify('Loaded sample project quote');
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
      generateQuotePDF(data);
      setIsGeneratingPdf(false);
      if (onNotify) onNotify(`Quote #${data.quoteNumber || 'QT-001'} downloaded as PDF!`);
    } catch (err) {
      setIsGeneratingPdf(false);
      console.error('Error generating Quote PDF:', err);
      if (onNotify) onNotify('Failed to generate PDF. Please verify input values.');
    }
  };

  const currencySymbol = getCurrencySymbol(data.currency);

  return (
    <div id="quote-generator-tool" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0 shadow-2xs">
            <FileSpreadsheet className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Quote Generator</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200/80 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>BizPilot Premium</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Draft formal price estimates &amp; service quotes. Your quote is generated in your browser.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Sample Quote
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Compiling PDF…' : 'Download Quote'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs */}
        <div className={showLivePreview ? 'lg:col-span-7 space-y-6' : 'lg:col-span-12 space-y-6'}>
          {/* Section 1: Business Details */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              Business Details (From)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Business Name</label>
                <input
                  type="text"
                  value={data.businessName}
                  onChange={(e) => setData({ ...data, businessName: e.target.value })}
                  placeholder="e.g. Vanguard Digital Solutions LLC"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={data.businessEmail}
                  onChange={(e) => setData({ ...data, businessEmail: e.target.value })}
                  placeholder="contact@yourbusiness.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
                <input
                  type="text"
                  value={data.businessPhone}
                  onChange={(e) => setData({ ...data, businessPhone: e.target.value })}
                  placeholder="(555) 000-0000"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
                <input
                  type="text"
                  value={data.businessAddress}
                  onChange={(e) => setData({ ...data, businessAddress: e.target.value })}
                  placeholder="City, State, ZIP"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none bg-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Client Details */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Client Details (Prepared For)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Client Name / Business</label>
                <input
                  type="text"
                  value={data.clientName}
                  onChange={(e) => setData({ ...data, clientName: e.target.value })}
                  placeholder="e.g. David Miller / Greenleaf Logistics"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Client Email</label>
                <input
                  type="email"
                  value={data.clientEmail}
                  onChange={(e) => setData({ ...data, clientEmail: e.target.value })}
                  placeholder="david@clientdomain.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none bg-white font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Client Address</label>
                <input
                  type="text"
                  value={data.clientAddress}
                  onChange={(e) => setData({ ...data, clientAddress: e.target.value })}
                  placeholder="Client office location, City, State, ZIP"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none bg-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Quote Details */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              Quote Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Quote #</label>
                <input
                  type="text"
                  value={data.quoteNumber}
                  onChange={(e) => setData({ ...data, quoteNumber: e.target.value })}
                  placeholder="QT-001"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none bg-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Quote Date</label>
                <input
                  type="date"
                  value={data.quoteDate}
                  onChange={(e) => setData({ ...data, quoteDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Valid Until</label>
                <input
                  type="text"
                  value={data.validUntil}
                  onChange={(e) => setData({ ...data, validUntil: e.target.value })}
                  placeholder="e.g. 30 Days"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Currency</label>
                <select
                  value={data.currency}
                  onChange={(e) => setData({ ...data, currency: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none bg-white font-semibold text-slate-800"
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

          {/* Section 4: Services / Items */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Services / Deliverables
              </h4>
              <button
                type="button"
                onClick={handleAddService}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Service
              </button>
            </div>

            <div className="space-y-3">
              {data.items.map((item) => {
                const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs grid grid-cols-12 gap-2.5 items-center"
                  >
                    <div className="col-span-12 sm:col-span-6">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                        Service Scope / Item Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        placeholder="e.g. Frontend development & QA..."
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-teal-500 outline-none font-medium"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                        Qty / Hours
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-teal-500 outline-none font-mono text-right"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                        Rate ({currencySymbol})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-teal-500 outline-none font-mono text-right"
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
                        onClick={() => handleRemoveService(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Adjustments & Terms */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Estimate Adjustments &amp; Acceptance Terms</h4>

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
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none bg-white font-mono"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Estimated Tax (%):</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={data.taxPercent}
                    onChange={(e) => setData({ ...data, taxPercent: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none bg-white font-mono"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Acceptance Terms &amp; Scope Notes</label>
                <textarea
                  rows={2}
                  value={data.notes}
                  onChange={(e) => setData({ ...data, notes: e.target.value })}
                  placeholder="e.g. 50% deposit required upon project commencement..."
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none bg-white leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-center justify-between gap-3 text-xs text-teal-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                <strong>100% In-Browser Privacy:</strong> Your quote is generated in your browser. No project rates or client details are sent to a remote database.
              </span>
            </div>
            {onOpenUpgradeModal && (
              <button
                type="button"
                onClick={onOpenUpgradeModal}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 underline shrink-0 cursor-pointer"
              >
                $5 deal details
              </button>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        {showLivePreview && (
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Quote Preview</span>
                </div>
                <span className="text-xs font-mono text-slate-400">#{data.quoteNumber || 'QT-001'}</span>
              </div>

              {/* Sheet preview */}
              <div className="mt-5 bg-white text-slate-900 rounded-2xl p-5 shadow-sm text-xs space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900">{data.businessName || 'Your Business Name'}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{data.businessEmail || 'email@business.com'}</p>
                    <p className="text-[11px] text-slate-400">{data.businessAddress || 'City, State'}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-teal-600 text-base">PRICE QUOTE</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Valid: {data.validUntil || '30 Days'}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Prepared For</span>
                  <div className="font-bold text-slate-800 mt-0.5">{data.clientName || 'Client Name'}</div>
                  <div className="text-[11px] text-slate-500">{data.clientEmail || 'client@email.com'}</div>
                  {data.clientAddress && <div className="text-[10px] text-slate-400 mt-0.5">{data.clientAddress}</div>}
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 pb-1">
                    <span>Service Scope</span>
                    <span>Total</span>
                  </div>
                  {data.items.map((item, i) => {
                    const total = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                    return (
                      <div key={item.id || i} className="flex justify-between items-center text-[11px] py-1">
                        <span className="truncate pr-2 font-medium text-slate-700">
                          {item.description || 'Service'} × {item.quantity || 1}
                        </span>
                        <span className="font-mono font-bold text-slate-900 shrink-0">
                          {formatMoney(total, data.currency)}
                        </span>
                      </div>
                    );
                  })}
                </div>

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
                      <span>Est. Tax ({data.taxPercent}%):</span>
                      <span className="font-mono font-medium">+{formatMoney(taxAmount, data.currency)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm font-black text-slate-900 border-t border-slate-200 pt-2 mt-1">
                    <span>Estimated Total:</span>
                    <span className="text-base text-teal-600 font-mono">{formatMoney(grandTotal, data.currency)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPdf}
                  className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingPdf ? 'Generating PDF…' : 'Download Quote (PDF)'}</span>
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  Ready to email to clients or print for in-person review.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
