import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { BodyScene } from '../components/anatomy/BodyScene';
import { CategoryCard } from '../components/ui/CategoryCard';
import { CascadingConditionsMenu } from '../components/ui/CascadingConditionsMenu';
import { CATEGORIES_DATA } from '../data/conditions-data';
import { useAnatomyStore } from '../stores/anatomy-store';
import { Info, RefreshCw, Layers } from 'lucide-react';

export const ConditionsIndexRoute: React.FC = () => {
  const {
    regionFilter,
    resetCamera,
    activeCascadingCategory,
    openCascadingMenu,
    closeCascadingMenu,
  } = useAnatomyStore();

  const filteredCategories = CATEGORIES_DATA.filter((cat) => {
    if (regionFilter === 'all') return true;
    if (regionFilter === 'us') return cat.activeTrialsCount > 130;
    if (regionFilter === 'uae') return cat.activeTrialsCount > 140;
    return true;
  });

  const handleRegionClick = (categoryId: string) => {
    const category = CATEGORIES_DATA.find((c) => c.id === categoryId);
    if (category) {
      openCascadingMenu(category);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#FAFBFC]">
      {/* 3D WebGL Canvas Anatomical Viewport */}
      <div className="relative h-[500px] sm:h-[600px] w-full lg:fixed lg:top-16 lg:right-0 lg:bottom-0 lg:h-auto lg:w-1/2 z-0">
        <BodyScene onRegionClick={handleRegionClick} />
      </div>

      {/* CASCADING CONDITIONS MENU (Triggered by Click on Card or 3D Organ) */}
      <AnimatePresence>
        {activeCascadingCategory && (
          <div className="fixed top-20 right-4 sm:right-6 lg:left-[51%] xl:left-[52%] lg:right-auto z-40 max-w-2xl w-[calc(100vw-2rem)] sm:w-auto">
            <CascadingConditionsMenu
              category={activeCascadingCategory}
              onClose={closeCascadingMenu}
            />
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full lg:w-1/2 px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-between min-h-[calc(54vh-0px)] lg:min-h-[calc(100vh-4rem)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="glass-panel px-4 py-2 rounded-2xl flex items-center gap-2.5 border border-slate-200/90 shadow-sm bg-white/90">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ED248F] animate-pulse" />
            <Layers className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span className="text-xs font-extrabold text-[#0B132B] uppercase tracking-wider font-mono">
              3D WebGL Canvas Atlas
            </span>
          </div>

          <button
            onClick={resetCamera}
            className="glass-panel px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#ED248F] flex items-center gap-1.5 border border-slate-200/80 bg-white/90 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset View
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8">
          {filteredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="pt-2 pb-4">
          <div className="glass-panel px-4 py-3 rounded-2xl text-xs text-slate-600 font-medium flex items-center gap-3 bg-white/90 border border-slate-200/80 shadow-sm">
            <Info className="w-4 h-4 text-[#06B6D4] shrink-0" />
            <span>
              Hover a category card to spotlight that system on the 3D model. Click a card to explore conditions and recruiting trials.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
