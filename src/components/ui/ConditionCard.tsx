import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { ConditionDetail } from '../../data/conditions-data';
import { ArrowRight, Activity } from 'lucide-react';

interface ConditionCardProps {
  condition: ConditionDetail;
  categoryId: string;
}

export const ConditionCard: React.FC<ConditionCardProps> = ({ condition, categoryId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      to: '/conditions/$categoryId/$conditionId',
      params: { categoryId, conditionId: condition.id },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="glass-panel p-6 rounded-2xl cursor-pointer glass-panel-hover group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider font-mono px-2.5 py-1 rounded-full bg-[#ED248F]/10 text-[#ED248F]">
            {condition.anatomicalRegion}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {condition.prevalence}
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-[#0B132B] group-hover:text-[#ED248F] transition-colors mb-2">
          {condition.name}
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {condition.shortDescription}
        </p>
      </div>

      <div>
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-[#06B6D4]">
            <Activity className="w-4 h-4" />
            {condition.fallbackTrials.length} Recruiting Studies
          </span>

          <span className="inline-flex items-center gap-1 text-[#ED248F] font-bold group-hover:translate-x-1 transition-transform">
            Explore <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
