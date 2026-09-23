import React, { useState, useMemo } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { getCategoryById } from '../data/conditions-data';
import { ConditionCard } from '../components/ui/ConditionCard';
import { ArrowLeft, Search, X, Shield } from 'lucide-react';
import { useAnatomyStore } from '../stores/anatomy-store';

export const CategoryDetailRoute: React.FC = () => {
  const { categoryId } = useParams({ from: '/conditions/$categoryId' });
  const category = getCategoryById(categoryId || '');
  const { setSelectedCategory } = useAnatomyStore();
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [categoryId, setSelectedCategory]);

  const filteredConditions = useMemo(() => {
    if (!category) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return category.conditions;
    return category.conditions.filter(
      (cond) =>
        cond.name.toLowerCase().includes(q) ||
        cond.shortDescription.toLowerCase().includes(q) ||
        cond.anatomicalRegion.toLowerCase().includes(q)
    );
  }, [category, searchQuery]);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#0B132B]">Category Not Found</h2>
        <p className="text-xs text-slate-500 my-4">
          The requested category could not be located in our database.
        </p>
        <Link
          to="/conditions"
          className="px-4 py-2 rounded-xl bg-[#0B132B] text-white text-xs font-bold"
        >
          Back to Condition Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAFBFC] pb-20">
      {/* Category Header with Accent Gradient */}
      <div className="sticky top-16 z-30 glass-panel border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link
              to="/conditions"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Category {String(category.number).padStart(2, '0')} of 23
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-[#ED248F] px-3 py-0.5 rounded-full bg-[#ED248F]/10">
              3D Region: {category.regionBadge}
            </span>
            {category.icd11Block && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 px-2.5 py-0.5 rounded-full bg-slate-100">
                <Shield className="w-3 h-3 text-slate-400" />
                {category.icd11Block}
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0B132B] tracking-tight">
                {category.name}
              </h1>
              <p className="text-xs font-medium text-slate-500 font-mono mt-0.5">
                {category.subtitle} · Reference: NIH, ICD-11, WHO
              </p>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                {category.description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2 rounded-xl bg-slate-100 font-mono text-xs text-slate-700">
                <strong className="text-[#0B132B]">{category.conditions.length}</strong> Conditions
              </div>
              <div className="px-4 py-2 rounded-xl bg-[#06B6D4]/10 font-mono text-xs text-[#06B6D4] font-bold">
                {category.activeTrialsCount} Active Studies
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-extrabold text-[#0B132B]">
              Medical Conditions & Clinical Trial Hubs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a condition to view symptom frequencies, standard of care, pipeline drugs, and live trials.
            </p>
          </div>

          {/* In-category Search Filter */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${category.conditions.length} conditions...`}
              className="w-full pl-8 pr-8 py-2 text-xs bg-white border border-slate-200/80 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ED248F] focus:border-[#ED248F]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {filteredConditions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-sm font-bold text-[#0B132B]">No conditions matched your search</p>
            <p className="text-xs text-slate-500 mt-1">Try another keyword or clear the search.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConditions.map((cond) => (
              <ConditionCard key={cond.id} condition={cond} categoryId={category.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
