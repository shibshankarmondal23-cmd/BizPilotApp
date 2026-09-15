import React, { useState } from 'react';
import { Percent, RotateCcw, Copy, Check, ArrowRight, Info } from 'lucide-react';
import { copyTextSafely } from '../../utils/clipboard';

interface Props {
  onNotify?: (msg: string) => void;
}

export const PercentageCalculator: React.FC<Props> = ({ onNotify }) => {
  const [calculationType, setCalculationType] = useState<'whatIs' | 'change' | 'addSubtract'>('whatIs');

  // Mode 1: What is P% of X?
  const [percentage, setPercentage] = useState<string>('15');
  const [originalValue, setOriginalValue] = useState<string>('250');

  // Mode 2: % Increase/Decrease from X to Y
  const [valFrom, setValFrom] = useState<string>('100');
  const [valTo, setValTo] = useState<string>('125');

  // Mode 3: Add / Subtract P% to X
  const [baseVal, setBaseVal] = useState<string>('150');
  const [taxPercent, setTaxPercent] = useState<string>('8.25');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');

  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = async (text: string) => {
    const success = await copyTextSafely(text);
    if (success) {
      setCopied(true);
      if (onNotify) onNotify(`Copied "${text}" to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } else {
      if (onNotify) onNotify(`Result: ${text}`);
    }
  };

  const handleReset = () => {
    if (calculationType === 'whatIs') {
      setPercentage('');
      setOriginalValue('');
    } else if (calculationType === 'change') {
      setValFrom('');
      setValTo('');
    } else {
      setBaseVal('');
      setTaxPercent('');
    }
    if (onNotify) onNotify('Calculator reset');
  };

  // Calculations
  // Mode 1
  const numPerc = parseFloat(percentage);
  const numOrig = parseFloat(originalValue);
  const isMode1Valid = !isNaN(numPerc) && !isNaN(numOrig);
  const percentageAmount = isMode1Valid ? (numPerc / 100) * numOrig : 0;
  const totalWithAdded = isMode1Valid ? numOrig + percentageAmount : 0;
  const totalWithSubtracted = isMode1Valid ? numOrig - percentageAmount : 0;

  // Mode 2
  const numFrom = parseFloat(valFrom);
  const numTo = parseFloat(valTo);
  const isFromZero = numFrom === 0;
  const isMode2Valid = !isNaN(numFrom) && !isNaN(numTo) && !isFromZero;
  const diff = (!isNaN(numFrom) && !isNaN(numTo)) ? numTo - numFrom : 0;
  const percentChange = isMode2Valid ? (diff / Math.abs(numFrom)) * 100 : 0;

  // Mode 3
  const numBase = parseFloat(baseVal);
  const numTax = parseFloat(taxPercent);
  const isMode3Valid = !isNaN(numBase) && !isNaN(numTax);
  const addSubAmount = isMode3Valid ? (numTax / 100) * numBase : 0;
  const finalAddSub = isMode3Valid
    ? operation === 'add'
      ? numBase + addSubAmount
      : numBase - addSubAmount
    : 0;

  return (
    <div id="percentage-calculator-tool" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Percentage Calculator</h3>
            <p className="text-sm text-slate-500">Calculate percentage values, taxes, discounts, and margins</p>
          </div>
        </div>

        {/* Sub-modes tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setCalculationType('whatIs')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              calculationType === 'whatIs' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            What is X% of Y?
          </button>
          <button
            type="button"
            onClick={() => setCalculationType('addSubtract')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              calculationType === 'addSubtract' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Add/Discount %
          </button>
          <button
            type="button"
            onClick={() => setCalculationType('change')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              calculationType === 'change' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            % Change
          </button>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Controls */}
        <div className="lg:col-span-7 space-y-5">
          {calculationType === 'whatIs' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="percentage-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Percentage (%)
                </label>
                <div className="relative">
                  <input
                    id="percentage-input"
                    type="number"
                    step="any"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full px-4 py-2.5 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all pr-10 font-mono"
                  />
                  <span className="absolute right-3.5 top-3 text-slate-400 font-semibold">%</span>
                </div>
              </div>

              <div>
                <label htmlFor="original-value-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Original Value ($ or units)
                </label>
                <div className="relative">
                  <input
                    id="original-value-input"
                    type="number"
                    step="any"
                    value={originalValue}
                    onChange={(e) => setOriginalValue(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full px-4 py-2.5 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Quick shortcut pills */}
              <div className="pt-2">
                <span className="text-xs text-slate-500 block mb-2 font-medium">Common percentages:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[5, 10, 15, 20, 25, 50, 75].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPercentage(preset.toString())}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 transition-colors"
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {calculationType === 'addSubtract' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="base-value-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Base Amount ($)
                </label>
                <input
                  id="base-value-input"
                  type="number"
                  step="any"
                  value={baseVal}
                  onChange={(e) => setBaseVal(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full px-4 py-2.5 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="operation-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Operation
                  </label>
                  <select
                    id="operation-select"
                    value={operation}
                    onChange={(e) => setOperation(e.target.value as 'add' | 'subtract')}
                    className="w-full px-3 py-2.5 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium"
                  >
                    <option value="add">+ Add (e.g. Tax/Tip/Markup)</option>
                    <option value="subtract">- Subtract (e.g. Discount)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="tax-percent-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      id="tax-percent-input"
                      type="number"
                      step="any"
                      value={taxPercent}
                      onChange={(e) => setTaxPercent(e.target.value)}
                      placeholder="e.g. 8.25"
                      className="w-full px-4 py-2.5 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all pr-8 font-mono"
                    />
                    <span className="absolute right-3 top-3 text-slate-400 font-semibold">%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {calculationType === 'change' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="initial-value-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Initial Value (From)
                </label>
                <input
                  id="initial-value-input"
                  type="number"
                  step="any"
                  value={valFrom}
                  onChange={(e) => setValFrom(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2.5 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-mono"
                />
              </div>

              <div>
                <label htmlFor="final-value-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Final Value (To)
                </label>
                <input
                  id="final-value-input"
                  type="number"
                  step="any"
                  value={valTo}
                  onChange={(e) => setValTo(e.target.value)}
                  placeholder="e.g. 125"
                  className="w-full px-4 py-2.5 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <span className="text-xs text-slate-400">Updates automatically as you type</span>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 bg-slate-50/90 rounded-xl p-6 border border-slate-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">Calculated Results</span>
              {copied ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Copied!
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const res =
                      calculationType === 'whatIs'
                        ? `${percentageAmount.toFixed(2)}`
                        : calculationType === 'addSubtract'
                        ? `${finalAddSub.toFixed(2)}`
                        : `${percentChange.toFixed(2)}%`;
                    copyToClipboard(res);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Result
                </button>
              )}
            </div>

            {calculationType === 'whatIs' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">Percentage Amount ({isMode1Valid ? numPerc : 0}%)</div>
                  <div className="text-3xl font-extrabold text-blue-600 mt-1 font-mono">
                    {isMode1Valid ? percentageAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-xs text-slate-500 font-medium">+ Added to Original</div>
                    <div className="text-lg font-bold text-slate-800 mt-0.5 font-mono">
                      {isMode1Valid ? totalWithAdded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-xs text-slate-500 font-medium">- Deducted from Original</div>
                    <div className="text-lg font-bold text-slate-800 mt-0.5 font-mono">
                      {isMode1Valid ? totalWithSubtracted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 bg-blue-50/70 text-blue-900 p-3 rounded-lg flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    Formula: <code className="font-mono font-semibold">({numPerc || 0} ÷ 100) × {numOrig || 0} = {percentageAmount.toFixed(2)}</code>
                  </span>
                </div>
              </div>
            )}

            {calculationType === 'addSubtract' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">
                    Final Result ({operation === 'add' ? `+${numTax || 0}%` : `-${numTax || 0}%`})
                  </div>
                  <div className="text-3xl font-extrabold text-blue-600 mt-1 font-mono">
                    ${isMode3Valid ? finalAddSub.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">Adjustment Amount</div>
                  <div className="text-base font-bold text-slate-800 mt-0.5 font-mono">
                    {operation === 'add' ? '+' : '-'}${isMode3Valid ? addSubAmount.toFixed(2) : '0.00'}
                  </div>
                </div>
              </div>
            )}

            {calculationType === 'change' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">Percentage Change</div>
                  <div
                    className={`text-3xl font-extrabold mt-1 font-mono ${
                      !isMode2Valid && isFromZero && !isNaN(numTo)
                        ? 'text-amber-600 text-xl'
                        : percentChange > 0
                        ? 'text-emerald-600'
                        : percentChange < 0
                        ? 'text-rose-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {!isMode2Valid && isFromZero && !isNaN(numTo)
                      ? 'Undefined (Base cannot be 0)'
                      : isMode2Valid
                      ? `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(2)}%`
                      : '0.00%'}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">Absolute Difference</div>
                  <div className="text-base font-bold text-slate-800 mt-0.5 font-mono">
                    {isMode2Valid ? `${diff > 0 ? '+' : ''}${diff.toFixed(2)}` : '0.00'}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs text-slate-400 text-center">
            Valid client-side calculation • No data sent to any server
          </div>
        </div>
      </div>
    </div>
  );
};
