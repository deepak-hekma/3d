import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ChevronRight, X, ArrowRight, Activity, Search, ExternalLink } from 'lucide-react';
import type { CategoryData } from '../../data/conditions-data';
import { useAnatomyStore } from '../../stores/anatomy-store';

interface CascadingConditionsMenuProps {
  category: CategoryData;
  onClose?: () => void;
}

export const CascadingConditionsMenu: React.FC<CascadingConditionsMenuProps> = ({
  category,
  onClose,
}) => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const { activeSubRegion, setActiveSubRegion, closeCascadingMenu } = useAnatomyStore();
  const [filterQuery, setFilterQuery] = useState('');

  // Extract unique anatomical sub-regions from the category conditions
  const subRegions = useMemo(() => {
    const list: string[] = ['All Conditions'];
    category.conditions.forEach((c) => {
      if (!list.includes(c.anatomicalRegion)) {
        list.push(c.anatomicalRegion);
      }
    });
    return list;
  }, [category]);

  const selectedRegion = activeSubRegion || 'All Conditions';

  const displayedConditions = useMemo(() => {
    let list = category.conditions;
    if (selectedRegion && selectedRegion !== 'All Conditions') {
      list = list.filter((c) => c.anatomicalRegion === selectedRegion);
    }
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.anatomicalRegion.toLowerCase().includes(q)
      );
    }
    return list;
  }, [category, selectedRegion, filterQuery]);

  // Close on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeCascadingMenu();
        onClose?.();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCascadingMenu();
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeCascadingMenu, onClose]);

  const handleConditionSelect = (conditionId: string) => {
    closeCascadingMenu();
    navigate({
      to: '/conditions/$categoryId/$conditionId',
      params: { categoryId: category.id, conditionId },
    });
  };

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="relative flex flex-col md:flex-row items-start gap-3 z-50 pointer-events-auto filter drop-shadow-2xl"
    >
      {/* 1. LEFT MAIN MENU CARD (Category Header & Sub-Regions) */}
      <div className="w-72 sm:w-80 bg-white/95 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border border-white/90 shadow-[0_20px_50px_rgba(11,19,43,0.12)] flex flex-col max-h-[75vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 mb-2 border-b border-slate-100/90">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                {String(category.number).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                {category.regionBadge}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-[#0B132B] tracking-tight">
              {category.name}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium leading-snug">
              {category.subtitle}
            </p>
          </div>

          <button
            onClick={() => {
              closeCascadingMenu();
              onClose?.();
            }}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-Regions List */}
        <div className="space-y-1 mt-2 overflow-y-auto pr-1 flex-1">
          {subRegions.map((region) => {
            const isSelected = region === selectedRegion;
            const count =
              region === 'All Conditions'
                ? category.conditions.length
                : category.conditions.filter((c) => c.anatomicalRegion === region).length;
            return (
              <button
                key={region}
                type="button"
                onClick={() => setActiveSubRegion(region === 'All Conditions' ? null : region)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFF7ED] text-[#0B132B] font-bold shadow-xs'
                    : 'text-slate-700 font-medium hover:bg-slate-50'
                }`}
              >
                <span className="text-xs tracking-tight line-clamp-1">{region}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono text-slate-400">({count})</span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'text-[#ED248F] translate-x-0.5' : 'text-slate-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Category Page Link */}
        <div className="pt-3 mt-2 border-t border-slate-100">
          <Link
            to="/conditions/$categoryId"
            params={{ categoryId: category.id }}
            onClick={() => closeCascadingMenu()}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#0B132B] hover:text-white bg-slate-100 hover:bg-[#0B132B] transition-colors"
          >
            <span>Explore All {category.conditions.length} Conditions</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. RIGHT CONDITIONS LIST */}
      <motion.div
        key={selectedRegion}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className="w-80 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border border-white/90 shadow-[0_20px_50px_rgba(11,19,43,0.12)] flex flex-col max-h-[75vh]"
      >
        <div className="pb-2.5 mb-2 border-b border-slate-100/90 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono truncate max-w-[200px]">
            {selectedRegion}
          </span>
          <span className="text-[10px] font-mono font-bold text-[#06B6D4] flex items-center gap-1 shrink-0">
            <Activity className="w-3 h-3" />
            {displayedConditions.length} Condition{displayedConditions.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Quick Filter Input */}
        <div className="relative mb-2.5">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={`Filter ${category.name}...`}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ED248F] focus:border-[#ED248F]"
          />
        </div>

        {/* Conditions Scrollable List */}
        <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
          {displayedConditions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching conditions found.
            </div>
          ) : (
            displayedConditions.map((cond) => (
              <div
                key={cond.id}
                onClick={() => handleConditionSelect(cond.id)}
                className="p-2.5 rounded-xl hover:bg-[#FFF7ED] transition-all duration-150 cursor-pointer group/item border border-transparent hover:border-amber-200/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#0B132B] group-hover/item:text-[#ED248F] transition-colors leading-snug">
                    {cond.name}
                  </h4>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-[#ED248F] group-hover/item:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                  {cond.shortDescription}
                </p>

                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-400">
                  <span className="truncate max-w-[150px]">{cond.anatomicalRegion}</span>
                  <span>•</span>
                  <span className="text-[#06B6D4] font-semibold shrink-0">
                    {cond.fallbackTrials.length || 1} Recruiting Trial
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
