import React from 'react';
import {
  ArrowRight,
  Activity,
  Brain,
  Heart,
  Wind,
  Zap,
  Compass,
  Bone,
  Shield,
  Smile,
  User,
  Eye,
  Ear,
  Sparkles,
  Dna,
} from 'lucide-react';
import type { CategoryData } from '../../data/conditions-data';
import { useAnatomyStore } from '../../stores/anatomy-store';

interface CategoryCardProps {
  category: CategoryData;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Activity,
  Heart,
  Wind,
  Zap,
  Compass,
  Bone,
  Shield,
  Smile,
  User,
  Eye,
  Ear,
  Sparkles,
  Dna,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const {
    hoveredCardRegion,
    hoveredRegion,
    setHoveredCardRegion,
    openCascadingMenu,
    activeCascadingCategory,
  } = useAnatomyStore();

  const isHovered =
    hoveredCardRegion === category.regionId || hoveredRegion === category.regionId;
  const isSelected = activeCascadingCategory?.id === category.id;

  const IconComponent = ICON_MAP[category.iconName] || Activity;

  const handleMouseEnter = () => {
    setHoveredCardRegion(category.regionId);
  };

  const handleMouseLeave = () => {
    if (!activeCascadingCategory) {
      setHoveredCardRegion(null);
    }
  };

  const handleClick = () => {
    openCascadingMenu(category);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`glass-panel p-5 rounded-2xl cursor-pointer transition-all duration-300 relative group overflow-hidden border border-slate-200/80 bg-white/90 shadow-sm ${
        isHovered || isSelected
          ? 'glass-card-active scale-[1.015] shadow-lg border-[#ED248F]/50 ring-1 ring-[#ED248F]/20'
          : 'hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Decorative accent top line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
        style={{
          backgroundColor: category.accentColor,
          opacity: isHovered || isSelected ? 1 : 0.45,
        }}
      />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs"
            style={{
              backgroundColor: `${category.accentColor}18`,
              color: category.accentColor,
            }}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                {String(category.number).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono truncate max-w-[170px]">
                {category.regionBadge}
              </span>
            </div>
            <h3 className="font-extrabold text-base text-[#0B132B] group-hover:text-[#ED248F] transition-colors leading-snug">
              {category.name}
            </h3>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#ED248F] group-hover:text-white transition-all shrink-0">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
        {category.description}
      </p>

      {category.icd11Block && (
        <div className="mb-3">
          <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200/60 truncate max-w-full">
            {category.icd11Block}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold">
        <span className="text-slate-500">
          <strong className="text-[#0B132B] font-bold">{category.conditionsCount}</strong> Conditions
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] font-mono text-[11px] font-bold">
          {category.activeTrialsCount} Active Trials
        </span>
      </div>
    </div>
  );
};
