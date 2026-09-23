import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { BodyScene } from '../components/anatomy/BodyScene';
import { CategoryCard } from '../components/ui/CategoryCard';
import { CascadingConditionsMenu } from '../components/ui/CascadingConditionsMenu';
import { CATEGORIES_DATA } from '../data/conditions-data';
import { useAnatomyStore } from '../stores/anatomy-store';
import {
  Info,
  RefreshCw,
  Layers,
  Search,
  X,
  Shield,
  ArrowRight,
  Filter,
} from 'lucide-react';

type SystemGroupFilter =
  | 'all'
  | 'oncology'
  | 'cardiorespiratory'
  | 'neuro-mental'
  | 'metabolic-gi'
  | 'immune-infectious'
  | 'musculoskeletal-skin'
  | 'specialty';

const GROUP_MAPPING: Record<SystemGroupFilter, string[]> = {
  all: [],
  oncology: ['cancer'],
  cardiorespiratory: ['cardiovascular', 'respiratory'],
  'neuro-mental': ['neurological', 'mental-health'],
  'metabolic-gi': ['endocrine-metabolic', 'digestive-liver', 'kidney-urinary'],
  'immune-infectious': [
    'blood-disorders',
    'immune-autoimmune',
    'infectious-diseases',
    'tropical-diseases',
  ],
  'musculoskeletal-skin': ['musculoskeletal', 'skin-diseases', 'injuries-trauma'],
  specialty: [
    'womens-health',
    'mens-health',
    'eye-diseases',
    'ear-hearing',
    'oral-dental',
    'genetic-rare',
    'pediatric',
    'maternal-health',
  ],
};

const FILTER_TABS: { id: SystemGroupFilter; label: string }[] = [
  { id: 'all', label: 'All Categories (23)' },
  { id: 'oncology', label: 'Cancer' },
  { id: 'cardiorespiratory', label: 'Cardio & Lung' },
  { id: 'neuro-mental', label: 'Brain & Mental' },
  { id: 'metabolic-gi', label: 'Metabolic & GI' },
  { id: 'immune-infectious', label: 'Immune & Infectious' },
  { id: 'musculoskeletal-skin', label: 'Bone, Joint & Skin' },
  { id: 'specialty', label: 'Specialty Disciplines' },
];

export const ConditionsIndexRoute: React.FC = () => {
  const {
    regionFilter,
    resetCamera,
    activeCascadingCategory,
    openCascadingMenu,
    closeCascadingMenu,
  } = useAnatomyStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<SystemGroupFilter>('all');

  const handleRegionClick = (categoryId: string) => {
    const category = CATEGORIES_DATA.find((c) => c.id === categoryId);
    if (category) {
      openCascadingMenu(category);
    }
  };

  // Filtered categories based on system tab, search query, and global region filter
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return CATEGORIES_DATA.filter((cat) => {
      // 1. Regional trials filter
      if (regionFilter === 'us' && cat.activeTrialsCount < 130) return false;
      if (regionFilter === 'uae' && cat.activeTrialsCount < 140) return false;

      // 2. System Group Tab filter
      if (selectedGroup !== 'all') {
        const allowed = GROUP_MAPPING[selectedGroup] || [];
        if (!allowed.includes(cat.id)) return false;
      }

      // 3. Search query filter
      if (q) {
        const matchesCategory =
          cat.name.toLowerCase().includes(q) ||
          cat.subtitle.toLowerCase().includes(q) ||
          cat.description.toLowerCase().includes(q) ||
          cat.regionBadge.toLowerCase().includes(q) ||
          (cat.icd11Block && cat.icd11Block.toLowerCase().includes(q));

        const matchesAnyCondition = cat.conditions.some((cond) =>
          cond.name.toLowerCase().includes(q)
        );

        return matchesCategory || matchesAnyCondition;
      }

      return true;
    });
  }, [searchQuery, selectedGroup, regionFilter]);

  // Direct condition matches for instant search jump
  const matchingConditions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const matches: { categoryId: string; categoryName: string; conditionId: string; conditionName: string }[] = [];
    CATEGORIES_DATA.forEach((cat) => {
      cat.conditions.forEach((cond) => {
        if (cond.name.toLowerCase().includes(q)) {
          matches.push({
            categoryId: cat.id,
            categoryName: cat.name,
            conditionId: cond.id,
            conditionName: cond.name,
          });
        }
      });
    });
    return matches.slice(0, 8); // Top 8 matches
  }, [searchQuery]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#FAFBFC]">
      {/* 3D WebGL Canvas Anatomical Viewport */}
      <div className="relative h-[480px] sm:h-[560px] w-full lg:fixed lg:top-16 lg:right-0 lg:bottom-0 lg:h-auto lg:w-1/2 z-0">
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

      {/* LEFT SCROLLABLE DIRECTORY PANE */}
      <div className="relative z-10 w-full lg:w-1/2 px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-between min-h-[calc(54vh-0px)] lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto no-scrollbar">
        <div>
          {/* Top Atlas Status and Reset Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="glass-panel px-3.5 py-1.5 rounded-2xl flex items-center gap-2.5 border border-slate-200/90 shadow-sm bg-white/90">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ED248F] animate-pulse" />
              <Layers className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span className="text-[11px] font-extrabold text-[#0B132B] uppercase tracking-wider font-mono">
                3D WebGL Canvas Atlas
              </span>
            </div>

            <button
              onClick={resetCamera}
              className="glass-panel px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#ED248F] flex items-center gap-1.5 border border-slate-200/80 bg-white/90 transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset 3D View
            </button>
          </div>

          {/* MAIN HEADER & NIH/ICD-11/WHO REFERENCE */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#ED248F]/10 text-[#ED248F] border border-[#ED248F]/20">
                <Shield className="w-3 h-3 text-[#ED248F]" />
                Reference: NIH · ICD 11 · WHO
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-slate-600 bg-slate-100 font-semibold">
                23 Categories · 260+ Conditions
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B132B] tracking-tight">
              Condition categories
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">
              Explore medical condition categories structured by international clinical reference standards. Click any organ or category card to inspect indications and recruiting clinical trials.
            </p>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="space-y-3 mb-6">
            {/* Live Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across 23 categories or 260+ conditions (e.g. Lung, Melanoma, Asthma, Crohn's)..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-slate-200/90 text-xs sm:text-sm text-[#0B132B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ED248F]/30 focus:border-[#ED248F] shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Direct Condition Matching Chips (Quick Links) */}
            {matchingConditions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-white/95 rounded-2xl border border-[#06B6D4]/30 shadow-xs"
              >
                <div className="text-[10px] font-mono uppercase font-bold text-[#06B6D4] mb-2 flex items-center gap-1.5">
                  <Filter className="w-3 h-3" />
                  Matching Conditions ({matchingConditions.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchingConditions.map((match) => (
                    <Link
                      key={`${match.categoryId}-${match.conditionId}`}
                      to="/conditions/$categoryId/$conditionId"
                      params={{ categoryId: match.categoryId, conditionId: match.conditionId }}
                      className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-[#FFF7ED] text-[11px] font-semibold text-[#0B132B] hover:text-[#ED248F] border border-slate-200/70 hover:border-amber-200 transition-all flex items-center gap-1 group"
                    >
                      <span>{match.conditionName}</span>
                      <span className="text-[9px] text-slate-400 group-hover:text-slate-600 font-mono">
                        ({match.categoryName})
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#ED248F] group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* System Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {FILTER_TABS.map((tab) => {
                const isActive = selectedGroup === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedGroup(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0B132B] text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CATEGORIES GRID */}
          {filteredCategories.length === 0 ? (
            <div className="py-16 text-center bg-white/70 rounded-3xl border border-dashed border-slate-200 p-8 my-4">
              <h3 className="text-base font-extrabold text-[#0B132B]">No categories found</h3>
              <p className="text-xs text-slate-500 my-2">
                No medical categories or conditions matched "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGroup('all');
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-[#0B132B] text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
              {filteredCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>

        {/* Footer Info Callout */}
        <div className="pt-2 pb-4">
          <div className="glass-panel px-4 py-3 rounded-2xl text-xs text-slate-600 font-medium flex items-center gap-3 bg-white/90 border border-slate-200/80 shadow-sm">
            <Info className="w-4 h-4 text-[#06B6D4] shrink-0" />
            <span>
              Hover the 3D model to focus an anatomical system. Click an organ or category card to inspect conditions and active clinical trials.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
