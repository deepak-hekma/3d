import React from 'react';
import { Link } from '@tanstack/react-router';
import { Activity, ShieldCheck, Sparkles } from 'lucide-react';
import { useAnatomyStore } from '../../stores/anatomy-store';
import type { RegionFilter } from '../../stores/anatomy-store';

interface NavbarProps {
  onOpenEligibility?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEligibility }) => {
  const { regionFilter, setRegionFilter } = useAnatomyStore();

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0B132B] via-[#7948A5] to-[#ED248F] p-0.5 shadow-md group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#ED248F]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-[#0B132B]">HEKMA</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ED248F]/10 text-[#ED248F] font-bold font-mono tracking-wider">
                HOVER
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 leading-none">Clinical Trial Intelligence</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-semibold text-slate-600 hover:text-[#ED248F] transition-colors"
          >
            Home
          </Link>
          <Link
            to="/conditions"
            className="text-sm font-semibold text-slate-600 hover:text-[#ED248F] transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4 text-[#ED248F]" />
            3D Atlas
          </Link>
        </nav>

        {/* Region Filter + CTA */}
        <div className="flex items-center gap-3">
          {/* US / UAE / All Region Selector */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            {(['all', 'us', 'uae'] as RegionFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setRegionFilter(f)}
                className={`px-2.5 py-1 rounded-lg uppercase text-[11px] transition-all font-mono ${
                  regionFilter === f
                    ? 'bg-white text-[#ED248F] shadow-sm font-bold border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenEligibility}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ED248F] to-[#7948A5] text-white text-xs font-bold shadow-md shadow-[#ED248F]/20 hover:shadow-lg hover:shadow-[#ED248F]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Check Eligibility
          </button>
        </div>
      </div>
    </header>
  );
};
