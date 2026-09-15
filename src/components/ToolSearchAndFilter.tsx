import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { ToolCategory } from '../types';

interface FilterProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ToolCategory;
  onCategoryChange: (cat: ToolCategory) => void;
  totalCount: number;
  filteredCount: number;
}

export const ToolSearchAndFilter: React.FC<FilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  totalCount,
  filteredCount,
}) => {
  const categories: { label: ToolCategory; countName?: string }[] = [
    { label: 'All' },
    { label: 'Business' },
    { label: 'Calculators' },
    { label: 'Productivity' },
    { label: 'Marketing' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs mb-8" id="tools-filter-bar">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <label htmlFor="tool-search-input" className="sr-only">
            Search business tools
          </label>
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            id="tool-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search business tools… (e.g. invoice, profit, email, calculator)"
            className="w-full pl-10 pr-10 py-2.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3 p-1 text-slate-400 hover:text-slate-600 rounded-md"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Counter */}
        <div className="text-xs font-semibold text-slate-500 hidden sm:block">
          Showing <span className="text-slate-900 font-bold">{filteredCount}</span> of {totalCount} tools
        </div>
      </div>

      {/* Category Pills */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden sm:flex">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Category:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-nowrap">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => onCategoryChange(cat.label)}
                id={`filter-category-${cat.label.toLowerCase()}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Mobile counter */}
        <div className="text-xs font-semibold text-slate-500 sm:hidden ml-auto whitespace-nowrap pl-2">
          {filteredCount} tools
        </div>
      </div>
    </div>
  );
};
