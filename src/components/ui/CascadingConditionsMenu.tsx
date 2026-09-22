import React, { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ChevronRight, X, ArrowRight, Activity } from 'lucide-react';
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

  // Extract unique anatomical sub-regions from the category conditions
  const subRegions = React.useMemo(() => {
    const list: string[] = [];
    category.conditions.forEach((c) => {
      if (!list.includes(c.anatomicalRegion)) {
        list.push(c.anatomicalRegion);
      }
    });
    return list;
  }, [category]);

  const selectedRegion =
    activeSubRegion && subRegions.includes(activeSubRegion) ? activeSubRegion : null;

  const activeConditions = React.useMemo(() => {
    if (!selectedRegion) return [];
    return category.conditions.filter((c) => c.anatomicalRegion === selectedRegion);
  }, [category, selectedRegion]);

  // Close on outside click
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
      className="relative flex flex-col md:flex-row items-start gap-2.5 z-50 pointer-events-auto filter drop-shadow-2xl"
    >
      {/* 1. LEFT MAIN MENU CARD (Category Header & Sub-Regions) */}
      <div className="w-72 sm:w-80 bg-white/95 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border border-white/90 shadow-[0_20px_50px_rgba(11,19,43,0.12)]">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 mb-2 border-b border-slate-100/90">
          <div>
            <h3 className="text-base font-extrabold text-[#0B132B] tracking-tight">
              {category.name}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium leading-snug">
              ({category.subtitle})
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
        <div className="space-y-1 mt-2">
          {subRegions.map((region) => {
            const isSelected = region === selectedRegion;
            return (
              <button
                key={region}
                type="button"
                onClick={() => setActiveSubRegion(region)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFF7ED] text-[#0B132B] font-bold shadow-xs'
                    : 'text-slate-700 font-medium hover:bg-slate-50'
                }`}
              >
                <span className="text-xs tracking-tight line-clamp-1">{region}</span>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isSelected ? 'text-[#ED248F] translate-x-0.5' : 'text-slate-400'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {selectedRegion && (
        <motion.div
          key={selectedRegion}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="w-72 sm:w-84 bg-white/95 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border border-white/90 shadow-[0_20px_50px_rgba(11,19,43,0.12)]"
        >
          <div className="pb-2.5 mb-2 border-b border-slate-100/90 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              {selectedRegion}
            </span>
            <span className="text-[10px] font-mono font-bold text-[#06B6D4] flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {activeConditions.length} Condition{activeConditions.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-2">
            {activeConditions.map((cond) => (
              <div
                key={cond.id}
                onClick={() => handleConditionSelect(cond.id)}
                className="p-3 rounded-xl hover:bg-[#FFF7ED] transition-all duration-150 cursor-pointer group/item border border-transparent hover:border-amber-200/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#0B132B] group-hover/item:text-[#ED248F] transition-colors leading-snug">
                    {cond.name}
                  </h4>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-[#ED248F] group-hover/item:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {cond.shortDescription}
                </p>

                <div className="flex items-center gap-2 mt-2 pt-1 text-[10px] font-mono text-slate-400">
                  <span>{cond.prevalence}</span>
                  <span>•</span>
                  <span className="text-[#06B6D4] font-semibold">
                    {cond.fallbackTrials.length || 1} Recruiting Trial
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
