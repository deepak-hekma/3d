import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Activity, Brain, Heart, Wind, Zap, Compass, Bone } from 'lucide-react';
import type { CategoryData } from '../../data/conditions-data';
import { useAnatomyStore } from '../../stores/anatomy-store';

interface CategoryCardProps {
  category: CategoryData;
}

const ICON_MAP: Record<string, any> = {
  Brain,
  Activity,
  Heart,
  Wind,
  Zap,
  Compass,
  Bone,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const navigate = useNavigate();
  const {
    hoveredCardRegion,
    setHoveredCardRegion,
    setSelectedCategory,
    selectedCategoryId,
  } = useAnatomyStore();

  const isHovered = hoveredCardRegion === category.regionId;
  const isSelected = selectedCategoryId === category.id;

  const IconComponent = ICON_MAP[category.iconName] || Activity;

  const handleMouseEnter = () => {
    setHoveredCardRegion(category.regionId);
  };

  const handleMouseLeave = () => {
    setHoveredCardRegion(null);
  };

  const handleClick = () => {
    setSelectedCategory(category.id);
    navigate({ to: '/conditions/$categoryId', params: { categoryId: category.id } });
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`glass-panel p-5 rounded-2xl cursor-pointer transition-all duration-300 relative group overflow-hidden ${
        isHovered || isSelected ? 'glass-card-active scale-[1.02]' : 'hover:border-[#ED248F]/40'
      }`}
    >
      {/* Decorative accent top line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
        style={{
          backgroundColor: category.accentColor,
          opacity: isHovered || isSelected ? 1 : 0.4,
        }}
      />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{
              backgroundColor: `${category.accentColor}15`,
              color: category.accentColor,
            }}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0B132B] group-hover:text-[#ED248F] transition-colors">
              {category.name}
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              {category.regionBadge}
            </span>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#ED248F] group-hover:text-white transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
        {category.description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold">
        <span className="text-slate-500">
          <strong className="text-[#0B132B] font-bold">{category.conditionsCount}</strong> Conditions
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] font-mono text-[11px]">
          {category.activeTrialsCount} Active Trials
        </span>
      </div>
    </div>
  );
};
