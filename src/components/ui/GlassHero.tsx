import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Activity, ArrowRight } from 'lucide-react';

export const GlassHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: -999, y: -999 });
  const smoothPointerRef = useRef({ x: -999, y: -999 });
  const radiusRef = useRef({ current: 0, target: 0 });
  const frameIdRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateFrame = () => {
      const container = containerRef.current;
      if (!container) {
        frameIdRef.current = requestAnimationFrame(updateFrame);
        return;
      }

      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const lerpFactorPos = prefersReduced ? 1 : 0.14;
      const lerpFactorRad = prefersReduced ? 1 : 0.12;

      const rawX = pointerRef.current.x;
      const rawY = pointerRef.current.y;

      if (smoothPointerRef.current.x === -999) {
        smoothPointerRef.current.x = rawX;
      } else {
        smoothPointerRef.current.x += (rawX - smoothPointerRef.current.x) * lerpFactorPos;
      }

      if (smoothPointerRef.current.y === -999) {
        smoothPointerRef.current.y = rawY;
      } else {
        smoothPointerRef.current.y += (rawY - smoothPointerRef.current.y) * lerpFactorPos;
      }

      const isMobile = window.innerWidth < 768;
      const maxRadius = isMobile ? 160 : 250;
      radiusRef.current.target = isHoveredRef.current ? maxRadius : 0;

      radiusRef.current.current +=
        (radiusRef.current.target - radiusRef.current.current) * lerpFactorRad;

      container.style.setProperty('--reveal-x', `${smoothPointerRef.current.x}px`);
      container.style.setProperty('--reveal-y', `${smoothPointerRef.current.y}px`);
      container.style.setProperty('--reveal-radius', `${radiusRef.current.current}px`);

      frameIdRef.current = requestAnimationFrame(updateFrame);
    };

    frameIdRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isHoveredRef.current = true;
    pointerRef.current = { x, y };
    smoothPointerRef.current = { x, y };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pointerRef.current = { x, y };
  };

  const handlePointerLeave = () => {
    isHoveredRef.current = false;
  };

  return (
    <main
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full min-h-[calc(100vh-4rem)] overflow-hidden select-none bg-[#0B132B] text-white flex flex-col justify-between touch-none ${
        mounted ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-500`}
      style={{
        ['--reveal-x' as any]: '-999px',
        ['--reveal-y' as any]: '-999px',
        ['--reveal-radius' as any]: '0px',
      }}
    >
      {/* 1. Base Portrait Layer */}
      <div className="absolute inset-0 z-10 select-none pointer-events-none" aria-hidden="true">
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-[position:right_center] animate-fade-scale"
          style={{
            backgroundImage: `url('/images/Base_image_desktop.png')`,
          }}
        />
        <div
          className="block md:hidden absolute inset-0 bg-center bg-no-repeat bg-cover animate-fade-scale"
          style={{
            backgroundImage: `url('/images/Base_image_mobile.png')`,
          }}
        />
      </div>

      {/* 2. Reveal Portrait Layer (Masked Anatomical Twin) */}
      <div className="absolute inset-0 z-20 select-none pointer-events-none reveal-mask" aria-hidden="true">
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-[position:right_center]"
          style={{
            backgroundImage: `url('/images/Reveal_image_desktop.png')`,
          }}
        />
        <div
          className="block md:hidden absolute inset-0 bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url('/images/Reveal_image_mobile.png')`,
          }}
        />
      </div>

      {/* 2.5. Smooth Gradient Overlay for Contrast */}
      <div
        className="absolute inset-0 z-25 pointer-events-none select-none bg-gradient-to-r from-[#0B132B] via-[#0B132B]/85 to-transparent w-full md:w-[60%]"
        aria-hidden="true"
      />

      {/* 3. SVG Technical Grid Overlay */}
      <div className="absolute inset-0 z-30 select-none pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 tech-grid opacity-40" />
      </div>

      {/* 4. Headline and Copy Content */}
      <section className="relative z-40 w-full px-6 sm:px-10 lg:px-16 flex-1 flex flex-col justify-center py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full max-w-7xl mx-auto">
          <div className="md:col-span-8 flex flex-col items-start text-left max-w-2xl">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-[#06B6D4]/10 px-4 py-1.5 rounded-full border border-[#06B6D4]/30 text-[#06B6D4] text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-[#ED248F] animate-pulse" />
              Hybrid 3D Anatomical Atlas & Clinical Trial Matcher
            </div>

            {/* Giant Stacked Title */}
            <h1 className="text-white uppercase tracking-tight leading-[0.92] font-extrabold text-[clamp(2.8rem,5.5vw,6.5rem)] animate-fade-up">
              Anatomy
              <br />
              Meets
              <br />
              <span className="text-gradient-pink tracking-normal normal-case font-serif italic block pt-1">
                Access.
              </span>
            </h1>

            {/* Subtext Description */}
            <p className="mt-6 text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg animate-fade-up">
              HEKMA brings clarity, connection, and calm to living with serious illness. Explore the 3D anatomical atlas and match with live recruiting clinical trials globally.
            </p>

            {/* Primary Action Button */}
            <div className="mt-8 flex flex-wrap items-center gap-4 animate-fade-up">
              <Link
                to="/conditions"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-extrabold bg-gradient-to-r from-[#ED248F] via-[#7948A5] to-[#06B6D4] text-white hover:opacity-95 transition-all shadow-xl shadow-[#ED248F]/25 min-h-[48px]"
              >
                <Activity className="w-5 h-5 mr-2" />
                Explore 3D Anatomy Atlas
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:col-span-4 justify-end text-right select-none pointer-events-none">
            <div className="font-mono text-xs tracking-[0.25em] text-slate-400 leading-loose uppercase animate-fade-up">
              REAL HUMAN ANATOMY
              <br />
              CLINICAL INTEL
              <br />
              <span className="text-[#ED248F] font-bold">VERSION 3.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance / Certification Badges Footer */}
      <footer className="relative z-40 w-full px-6 sm:px-10 lg:px-16 pb-8 pt-4">
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              CERTIFIED & COMPLIANT:
            </span>
            <span className="px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-semibold text-slate-300 bg-white/5">
              ✓ HIPAA certified
            </span>
            <span className="px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-semibold text-slate-300 bg-white/5">
              ✓ GDPR compliant
            </span>
            <span className="px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-semibold text-slate-300 bg-white/5">
              ✓ SOC 2 Type II
            </span>
          </div>
          <div className="text-[10px] font-sans text-slate-400 text-center md:text-right">
            © 2026 HEKMA Health. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
};
