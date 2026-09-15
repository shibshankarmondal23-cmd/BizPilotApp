import React, { useState } from 'react';
import { Clock, RotateCcw, Copy, Check, DollarSign, Calendar, ShieldCheck } from 'lucide-react';
import { copyTextSafely } from '../../utils/clipboard';

interface Props {
  onNotify?: (msg: string) => void;
}

export const HourlyRateCalculator: React.FC<Props> = ({ onNotify }) => {
  const [annualIncome, setAnnualIncome] = useState<string>('95000');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('30');
  const [weeksPerYear, setWeeksPerYear] = useState<string>('48');
  const [overheadPercent, setOverheadPercent] = useState<string>('25'); // 25% for taxes, healthcare, expenses, unbillable admin
  const [copied, setCopied] = useState<boolean>(false);

  const numIncome = parseFloat(annualIncome);
  const numHours = parseFloat(hoursPerWeek);
  const numWeeks = parseFloat(weeksPerYear);
  const numOverhead = parseFloat(overheadPercent) || 0;

  const isValid =
    !isNaN(numIncome) &&
    !isNaN(numHours) &&
    !isNaN(numWeeks) &&
    numIncome > 0 &&
    numHours > 0 &&
    numWeeks > 0 &&
    numWeeks <= 52 &&
    numHours <= 168;

  // Billable hours per year
  const totalBillableHoursPerYear = isValid ? numHours * numWeeks : 0;

  // With overhead: Gross revenue needed = desired take-home / (1 - overhead%)
  // or simple overhead addition: income * (1 + overhead%/100)
  const adjustedGrossTarget = isValid ? numIncome * (1 + numOverhead / 100) : 0;
  const suggestedHourlyRate = isValid && totalBillableHoursPerYear > 0 ? adjustedGrossTarget / totalBillableHoursPerYear : 0;
  const suggestedDailyRate = suggestedHourlyRate * (isValid && numHours > 0 ? Math.min(8, numHours / 5) : 8);
  const baselineRateWithoutOverhead = isValid && totalBillableHoursPerYear > 0 ? numIncome / totalBillableHoursPerYear : 0;

  const handleReset = () => {
    setAnnualIncome('');
    setHoursPerWeek('');
    setWeeksPerYear('');
    setOverheadPercent('0');
    if (onNotify) onNotify('Hourly rate calculator reset');
  };

  const copyResult = async () => {
    const summary = `Suggested Freelance Hourly Rate: $${suggestedHourlyRate.toFixed(2)}/hr (Based on $${annualIncome}/yr, ${hoursPerWeek} billable hrs/wk, ${weeksPerYear} wks/yr)`;
    const success = await copyTextSafely(summary);
    if (success) {
      setCopied(true);
      if (onNotify) onNotify('Copied hourly rate recommendation');
      setTimeout(() => setCopied(false), 2000);
    } else {
      if (onNotify) onNotify(`Suggested Rate: $${suggestedHourlyRate.toFixed(2)}/hr`);
    }
  };

  return (
    <div id="hourly-rate-calculator-tool" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Hourly Rate Calculator</h3>
            <p className="text-sm text-slate-500">Calculate the exact rate you need to charge to reach your annual income goals</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg self-start sm:self-auto font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Includes freelance overhead &amp; taxes</span>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <label htmlFor="desired-income-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Desired Annual Take-Home Income ($)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 font-semibold">$</span>
              <input
                id="desired-income-input"
                type="number"
                step="1000"
                min="0"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                placeholder="95000"
                className="w-full pl-8 pr-4 py-2.5 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {['60000', '85000', '120000', '150000'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAnnualIncome(preset)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-600 transition-colors"
                >
                  ${parseInt(preset).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hours-per-week-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Billable Hours / Week
              </label>
              <input
                id="hours-per-week-input"
                type="number"
                min="1"
                max="80"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                placeholder="30"
                className="w-full px-4 py-2.5 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Freelancers spend 10–15h on non-billable admin. 25–32 billable hrs is realistic.
              </p>
            </div>

            <div>
              <label htmlFor="weeks-per-year-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Working Weeks / Year
              </label>
              <input
                id="weeks-per-year-input"
                type="number"
                min="1"
                max="52"
                value={weeksPerYear}
                onChange={(e) => setWeeksPerYear(e.target.value)}
                placeholder="48"
                className="w-full px-4 py-2.5 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Accounts for 4 weeks off (vacation, holidays, and sick days).
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="overhead-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Overhead &amp; Self-Employment Tax Buffer ({overheadPercent}%)
              </label>
              <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                +${isValid ? (numIncome * (numOverhead / 100)).toLocaleString('en-US', { maximumFractionDigits: 0 }) : 0} for taxes &amp; ops
              </span>
            </div>
            <input
              id="overhead-input"
              type="range"
              min="0"
              max="50"
              step="5"
              value={overheadPercent}
              onChange={(e) => setOverheadPercent(e.target.value)}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>0% (No buffer)</span>
              <span>25% (Standard US Freelancer)</span>
              <span>50% (High overhead)</span>
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
              Reset
            </button>
            <span className="text-xs text-slate-400">Updates dynamically</span>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 bg-slate-50/90 rounded-xl p-6 border border-slate-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">Recommended Rates</span>
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
                  <Copy className="w-3.5 h-3.5" /> Copy Rate
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Suggested Hourly Rate */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-500 font-medium">Suggested Hourly Rate</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-slate-900 font-mono">
                    ${isValid ? Math.ceil(suggestedHourlyRate) : 0}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">/ hour</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  Exact: ${isValid ? suggestedHourlyRate.toFixed(2) : '0.00'}/hr
                </div>
              </div>

              {/* Day Rate & Hours */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">Daily Rate (Est.)</div>
                  <div className="text-xl font-bold text-slate-800 mt-1 font-mono">
                    ${isValid ? Math.ceil(suggestedDailyRate).toLocaleString() : 0}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Based on standard day</div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">Billable Hours/Yr</div>
                  <div className="text-xl font-bold text-slate-800 mt-1 font-mono">
                    {isValid ? totalBillableHoursPerYear.toLocaleString() : 0} hrs
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{numWeeks || 0} active weeks</div>
                </div>
              </div>

              {/* Breakdown detail */}
              <div className="bg-amber-50/70 text-amber-950 p-3.5 rounded-xl border border-amber-100 text-xs space-y-1.5">
                <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-700" />
                  <span>Gross Business Revenue Needed:</span>
                </div>
                <div className="font-mono text-sm font-bold text-amber-800">
                  ${isValid ? Math.round(adjustedGrossTarget).toLocaleString() : 0} / year
                </div>
                <p className="text-[11px] text-amber-800/80 leading-relaxed">
                  (Baseline rate without tax buffer would be ${isValid ? baselineRateWithoutOverhead.toFixed(2) : 0}/hr, which leaves you vulnerable at tax season.)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs text-slate-400 text-center">
            Standard US freelance pricing formulation
          </div>
        </div>
      </div>
    </div>
  );
};
