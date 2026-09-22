import React from 'react';
import type { TrialResult } from '../../hooks/useTrials';
import { ExternalLink, MapPin, Award, Sparkles } from 'lucide-react';

interface TrialCardProps {
  trial: TrialResult;
  onCheckEligibility: () => void;
}

export const TrialCard: React.FC<TrialCardProps> = ({ trial, onCheckEligibility }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 hover:border-[#ED248F]/40 transition-all shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {/* Live vs Sample badge */}
          {trial.isLive ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live API
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Sample Seed
            </span>
          )}

          <span className="text-[11px] font-bold font-mono px-2.5 py-1 rounded-full bg-[#0B132B] text-white">
            {trial.phase}
          </span>
          <span className="text-xs font-mono text-slate-500">{trial.nctId}</span>
        </div>

        {/* AI Match score badge */}
        <div className="flex items-center gap-1 bg-gradient-to-r from-[#ED248F]/10 to-[#06B6D4]/10 text-[#ED248F] px-3 py-1 rounded-full font-bold text-xs border border-[#ED248F]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{trial.matchScore}% AI Match</span>
        </div>
      </div>

      <h4 className="text-base font-extrabold text-[#0B132B] mb-2 leading-snug">
        {trial.title}
      </h4>

      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
        {trial.summary}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Award className="w-4 h-4 text-[#7948A5]" />
            {trial.sponsor}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-[#06B6D4]" />
            {trial.locationsCount} Locations {trial.hasRemoteOption && '• Remote Option'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://clinicaltrials.gov/study/${trial.nctId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-400 hover:text-[#0B132B] hover:bg-slate-100 transition-colors"
            title="View on ClinicalTrials.gov"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={onCheckEligibility}
            className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#ED248F] text-white font-bold text-xs transition-colors shadow-sm"
          >
            Check Eligibility
          </button>
        </div>
      </div>
    </div>
  );
};
