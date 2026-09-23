import React, { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { getConditionById } from '../data/conditions-data';
import { useTrials } from '../hooks/useTrials';
import { TrialCard } from '../components/ui/TrialCard';
import { EligibilityModal } from '../components/ui/EligibilityModal';
import {
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ConditionDetailRoute: React.FC = () => {
  const { categoryId, conditionId } = useParams({
    from: '/conditions/$categoryId/$conditionId',
  });

  const condition = getConditionById(categoryId || '', conditionId || '');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'symptoms' | 'treatments' | 'pipeline' | 'trials' | 'stories' | 'faq' | 'resources'
  >('overview');

  const [isEligibilityOpen, setIsEligibilityOpen] = useState<boolean>(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Live ClinicalTrials.gov v2 fetch hook with fallback
  const { trials, loading, isLiveApi } = useTrials(
    condition?.name || '',
    condition?.fallbackTrials || []
  );

  if (!condition) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#0B132B]">Condition Not Found</h2>
        <p className="text-xs text-slate-500 my-4">Requested condition details are unavailable.</p>
        <Link to="/conditions" className="px-4 py-2 rounded-xl bg-[#0B132B] text-white text-xs font-bold">
          Back to 3D Atlas
        </Link>
      </div>
    );
  }

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'symptoms', label: 'Symptoms' },
    { id: 'treatments', label: 'Treatments' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'trials', label: `Live Trials (${trials.length})` },
    { id: 'stories', label: 'Patient Stories' },
    { id: 'faq', label: 'FAQ' },
    { id: 'resources', label: 'PAG Resources' },
  ] as const;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAFBFC] pb-24">
      {/* Header Banner */}
      <div className="glass-panel border-b border-slate-200/80 bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Link
              to="/conditions/$categoryId"
              params={{ categoryId: categoryId || '' }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              to="/conditions"
              className="text-xs font-semibold text-slate-500 hover:text-[#0B132B]"
            >
              Categories
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              to="/conditions/$categoryId"
              params={{ categoryId: categoryId || '' }}
              className="text-xs font-semibold text-slate-500 hover:text-[#0B132B] truncate max-w-[200px]"
            >
              Category Detail
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-[#ED248F] px-3 py-1 rounded-full bg-[#ED248F]/10">
              {condition.anatomicalRegion}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B132B] tracking-tight">
                {condition.name}
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
                {condition.shortDescription}
              </p>
            </div>

            <button
              onClick={() => setIsEligibilityOpen(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ED248F] to-[#7948A5] text-white font-extrabold text-sm shadow-lg shadow-[#ED248F]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <ShieldCheck className="w-5 h-5" />
              Check My Eligibility
            </button>
          </div>

          {/* 8 Tabs Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-8 border-t border-slate-100 mt-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#0B132B] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="glass-panel p-8 rounded-3xl bg-white border border-slate-200">
              <h3 className="text-xl font-extrabold text-[#0B132B] mb-4">
                What is {condition.name}?
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed text-justify">
                {condition.whatIsText}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Prevalence & Risk
                  </span>
                  <span className="text-base font-extrabold text-[#0B132B]">
                    {condition.prevalence}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Primary Target Region
                  </span>
                  <span className="text-base font-extrabold text-[#ED248F]">
                    {condition.anatomicalRegion}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. SYMPTOMS TAB */}
        {activeTab === 'symptoms' && (
          <div className="glass-panel p-8 rounded-3xl bg-white border border-slate-200">
            <h3 className="text-xl font-extrabold text-[#0B132B] mb-2">
              Symptom Frequency & Clinical Presentation
            </h3>
            <p className="text-xs text-slate-500 mb-8">
              Based on patient registry data and clinical trial baseline surveys.
            </p>

            <div className="space-y-6">
              {condition.symptomBars.map((symptom, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#0B132B]">{symptom.name}</span>
                    <span className="text-[#ED248F] font-mono">{symptom.percentage}% reporting</span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${symptom.percentage}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-[#ED248F] to-[#06B6D4] rounded-full"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500">{symptom.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. TREATMENTS TAB */}
        {activeTab === 'treatments' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {condition.treatmentOptions.map((item, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#7948A5]/10 text-[#7948A5] mb-3 inline-block">
                    {item.type}
                  </span>
                  <h4 className="text-base font-extrabold text-[#0B132B] mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. PIPELINE TAB */}
        {activeTab === 'pipeline' && (
          <div className="glass-panel p-8 rounded-3xl bg-white border border-slate-200">
            <h3 className="text-xl font-extrabold text-[#0B132B] mb-2">
              Investigational Pipeline & R&D
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Next-generation compounds undergoing late-stage clinical evaluation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {condition.pipeline.map((p, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#06B6D4]/10 text-[#06B6D4] uppercase">
                      {p.phase}
                    </span>
                    <h4 className="text-lg font-extrabold text-[#0B132B] mt-2">{p.drugName}</h4>
                    <p className="text-xs text-slate-600 font-medium mt-1">Mechanism: {p.mechanism}</p>
                    <span className="text-[11px] text-slate-500 mt-3 block">
                      Sponsor: <strong>{p.sponsor}</strong> • Est. Completion: {p.completionYear}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. LIVE TRIALS TAB */}
        {activeTab === 'trials' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel bg-white border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[#0B132B]">
                  {isLiveApi ? 'ClinicalTrials.gov v2 Live Stream' : 'Sample Seed Fallback Active'}
                </span>
              </div>

              <button
                onClick={() => setIsEligibilityOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#ED248F] text-white font-bold text-xs shadow-sm hover:opacity-90"
              >
                Match Eligibility Matrix
              </button>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="w-10 h-10 border-2 border-t-[#ED248F] border-slate-200 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-mono text-slate-500">Querying ClinicalTrials.gov API...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trials.map((trial) => (
                  <TrialCard
                    key={trial.nctId}
                    trial={trial}
                    onCheckEligibility={() => setIsEligibilityOpen(true)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. PATIENT STORIES TAB */}
        {activeTab === 'stories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {condition.stories.map((story, idx) => (
              <div key={idx} className="glass-panel p-8 rounded-3xl bg-white border border-slate-200">
                <blockquote className="text-base font-semibold text-[#0B132B] italic mb-4 leading-relaxed">
                  "{story.quote}"
                </blockquote>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {story.storyText}
                </p>
                <div className="flex items-center justify-between text-xs font-bold pt-4 border-t border-slate-100">
                  <span className="text-[#0B132B]">
                    {story.author}, {story.age} ({story.location})
                  </span>
                  <span className="text-[#ED248F] font-mono">Trial: {story.trialName}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 7. FAQ TAB */}
        {activeTab === 'faq' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {condition.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-2xl bg-white border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  className="w-full p-6 text-left font-bold text-base text-[#0B132B] flex items-center justify-between hover:bg-slate-50"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      openFaqIdx === idx ? 'rotate-180 text-[#ED248F]' : ''
                    }`}
                  />
                </button>

                {openFaqIdx === idx && (
                  <div className="px-6 pb-6 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 8. RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {condition.pags.map((pag, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-extrabold text-[#0B132B] mb-2">{pag.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{pag.description}</p>
                </div>

                <a
                  href={pag.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#06B6D4] hover:underline"
                >
                  Visit Official Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Eligibility Modal Screener */}
      <EligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
        initialCondition={condition.name}
      />
    </div>
  );
};
