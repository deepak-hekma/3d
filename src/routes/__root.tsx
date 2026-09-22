import React, { useState } from 'react';
import { Outlet, Link } from '@tanstack/react-router';
import { Navbar } from '../components/ui/Navbar';
import { EligibilityModal } from '../components/ui/EligibilityModal';

export const RootRoute: React.FC = () => {
  const [isEligibilityOpen, setIsEligibilityOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC] text-[#0B132B] selection:bg-[#ED248F]/20 selection:text-[#ED248F]">
      {/* Global Header Navigation */}
      <Navbar onOpenEligibility={() => setIsEligibilityOpen(true)} />

      {/* Main Page Outlet */}
      <main className="flex-1 relative">
        <Outlet />
      </main>

      {/* Global Footer */}
      <footer className="z-10 bg-[#0B132B] text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-extrabold text-xl tracking-tight">HEKMA</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ED248F]/20 text-[#ED248F]">
                HOVER
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Patient-first clinical intelligence. Connecting patients with life-changing research.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              3D Anatomy Regions
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>Cranium & Central Nervous System</li>
              <li>Thoracic Mammary & Lung Tissue</li>
              <li>Cardiovascular Myocardium</li>
              <li>Pancreas & Endocrine System</li>
              <li>Musculoskeletal Bone Structure</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Compliance & Security
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>✓ HIPAA Compliant Infrastructure</li>
              <li>✓ GDPR & UAE PDPL Privacy Ready</li>
              <li>✓ ClinicalTrials.gov v2 Real-time API</li>
              <li>✓ Confidential Patient Intake</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Clinical Trial Matcher
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Find zero-cost recruiting clinical trials tailored to your medical condition.
            </p>
            <button
              onClick={() => setIsEligibilityOpen(true)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ED248F] to-[#7948A5] text-white text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
            >
              Start Eligibility Match →
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 HEKMA Health. Interactive 3D Anatomical Atlas. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/conditions" className="hover:text-white">3D Atlas</Link>
            <span>•</span>
            <button onClick={() => setIsEligibilityOpen(true)} className="hover:text-white">
              Eligibility Screener
            </button>
          </div>
        </div>
      </footer>

      {/* Global Screener Modal */}
      <EligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
      />
    </div>
  );
};
