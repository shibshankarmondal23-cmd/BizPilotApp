import React, { useState } from 'react';
import { TrendingUp, RotateCcw, Copy, Check, Info, AlertTriangle } from 'lucide-react';
import { copyTextSafely } from '../../utils/clipboard';

interface Props {
  onNotify?: (msg: string) => void;
}

export const ProfitMarginCalculator: React.FC<Props> = ({ onNotify }) => {
  const [revenue, setRevenue] = useState<string>('5000');
  const [cost, setCost] = useState<string>('2800');
  const [copied, setCopied] = useState<boolean>(false);

  const numRevenue = parseFloat(revenue);
  const numCost = parseFloat(cost);

  const isValid = !isNaN(numRevenue) && !isNaN(numCost) && numRevenue >= 0 && numCost >= 0;

  // Calculations
  const grossProfit = isValid ? numRevenue - numCost : 0;
  const profitMarginPercent = isValid && numRevenue > 0 ? (grossProfit / numRevenue) * 100 : 0;
  const markupPercent = isValid && numCost > 0 ? (grossProfit / numCost) * 100 : 0;

  const handleReset = () => {
    setRevenue('');
    setCost('');
    if (onNotify) onNotify('Profit calculator reset');
  };

  const copyResult = async () => {
    const summary = `Revenue: $${revenue || 0} | Cost: $${cost || 0} | Profit: $${grossProfit.toFixed(2)} | Margin: ${profitMarginPercent.toFixed(1)}%`;
    const success = await copyTextSafely(summary);
    if (success) {
      setCopied(true);
      if (onNotify) onNotify('Copied profit breakdown to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      if (onNotify) onNotify(`Profit: $${grossProfit.toFixed(2)}`);
    }
  };

  // Health assessment
  let healthLabel = 'Neutral';
  let healthColor = 'text-slate-600 bg-slate-100 border-slate-200';
  if (grossProfit < 0) {
    healthLabel = 'Operating at a Loss';
    healthColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (profitMarginPercent >= 40) {
    healthLabel = 'Excellent Margin (>40%)';
    healthColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (profitMarginPercent >= 20) {
    healthLabel = 'Healthy Margin (20%–40%)';
    healthColor = 'text-blue-700 bg-blue-50 border-blue-200';
  } else if (profitMarginPercent > 0) {
    healthLabel = 'Tight Margin (<20%)';
    healthColor = 'text-amber-700 bg-amber-50 border-amber-200';
  }

  return (
    <div id="profit-margin-calculator-tool" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Profit Margin Calculator</h3>
            <p className="text-sm text-slate-500">Calculate gross profit, net margins, and price markup</p>
          </div>
        </div>

        {isValid && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${healthColor}`}>
            {healthLabel}
          </span>
        )}
      </div>

      {/* Calculator Body */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <label htmlFor="revenue-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Total Revenue (Selling Price) ($)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 font-semibold">$</span>
              <input
                id="revenue-input"
                type="number"
                step="any"
                min="0"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="5000"
                className="w-full pl-8 pr-4 py-2.5 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Total cash received from your client or customer.</p>
          </div>

          <div>
            <label htmlFor="cost-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Total Cost of Goods / Project Expenses ($)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 font-semibold">$</span>
              <input
                id="cost-input"
                type="number"
                step="any"
                min="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="2800"
                className="w-full pl-8 pr-4 py-2.5 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Direct labor, subcontractor fees, software, materials, etc.</p>
          </div>

          {/* Quick preset examples */}
          <div className="pt-1">
            <span className="text-xs text-slate-500 block mb-2 font-medium">Quick industry presets:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { setRevenue('3500'); setCost('1200'); }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors"
              >
                Freelance Web Design ($3.5k)
              </button>
              <button
                type="button"
                onClick={() => { setRevenue('10000'); setCost('4500'); }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors"
              >
                Consulting Retainer ($10k)
              </button>
              <button
                type="button"
                onClick={() => { setRevenue('150'); setCost('60'); }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors"
              >
                Physical Product ($150)
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Values
            </button>
            <span className="text-xs text-slate-400">Updates live</span>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 bg-slate-50/90 rounded-xl p-6 border border-slate-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">Calculated Profitability</span>
              {copied ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Copied!
                </span>
              ) : (
                <button
                  type="button"
                  onClick={copyResult}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Summary
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Gross Profit */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-500 font-medium">Gross Profit</div>
                <div
                  className={`text-3xl font-extrabold mt-1 font-mono ${
                    grossProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {isValid
                    ? `${grossProfit < 0 ? '-' : ''}$${Math.abs(grossProfit).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : '$0.00'}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Revenue minus Expenses</div>
              </div>

              {/* Profit Margin & Markup */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">Profit Margin</div>
                  <div
                    className={`text-2xl font-bold mt-1 font-mono ${
                      profitMarginPercent >= 0 ? 'text-blue-600' : 'text-rose-600'
                    }`}
                  >
                    {isValid ? `${profitMarginPercent.toFixed(1)}%` : '0.0%'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-sans">(Profit ÷ Revenue)</div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">Markup Percentage</div>
                  <div className="text-2xl font-bold text-slate-800 mt-1 font-mono">
                    {isValid ? `${markupPercent.toFixed(1)}%` : '0.0%'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-sans">(Profit ÷ Cost)</div>
                </div>
              </div>

              {/* Educational Difference Box */}
              <div className="text-xs text-slate-600 bg-emerald-50/70 text-emerald-950 p-3.5 rounded-xl border border-emerald-100/60 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold text-emerald-900">Margin vs. Markup Rule:</div>
                  <p className="text-[12px] leading-relaxed text-emerald-800">
                    <strong>Margin</strong> is your profit as a percentage of total revenue. <strong>Markup</strong> is the percentage added on top of your cost to arrive at the selling price.
                  </p>
                </div>
              </div>

              {grossProfit < 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Your expenses exceed revenue. Adjust pricing or reduce costs to avoid debt.</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs text-slate-400 text-center">
            Standard US business formula • 100% Client-side
          </div>
        </div>
      </div>
    </div>
  );
};
