import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { getCategoryById } from '../data/conditions-data';
import { ConditionCard } from '../components/ui/ConditionCard';
import { ArrowLeft } from 'lucide-react';
import { useAnatomyStore } from '../stores/anatomy-store';

export const CategoryDetailRoute: React.FC = () => {
  const { categoryId } = useParams({ from: '/conditions/$categoryId' });
  const category = getCategoryById(categoryId || '');
  const { setSelectedCategory } = useAnatomyStore();

  React.useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [categoryId, setSelectedCategory]);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#0B132B]">Category Not Found</h2>
        <p className="text-xs text-slate-500 my-4">The requested category could not be located in our database.</p>
        <Link to="/conditions" className="px-4 py-2 rounded-xl bg-[#0B132B] text-white text-xs font-bold">
          Back to 3D Atlas
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAFBFC] pb-20">
      {/* Category Header with Accent Gradient */}
      <div className="sticky top-16 z-30 glass-panel border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-3">
            <Link
              to="/conditions"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-[#ED248F] px-3 py-1 rounded-full bg-[#ED248F]/10">
              3D Region: {category.regionBadge}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0B132B] tracking-tight">
                {category.name}
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                {category.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-slate-100 font-mono text-xs text-slate-700">
                <strong className="text-[#0B132B]">{category.conditions.length}</strong> Conditions
              </div>
              <div className="px-4 py-2 rounded-xl bg-[#06B6D4]/10 font-mono text-xs text-[#06B6D4] font-bold">
                {category.activeTrialsCount} Active Recruiting Studies
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-[#0B132B]">
            Medical Conditions & Clinical Trial Hubs
          </h2>
          <p className="text-xs text-slate-500">
            Select a condition to view symptom frequency, standard of care, pipeline drugs, and live trials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.conditions.map((cond) => (
            <ConditionCard key={cond.id} condition={cond} categoryId={category.id} />
          ))}
        </div>
      </div>
    </div>
  );
};
