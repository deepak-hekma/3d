import React, { useEffect, useRef, useState } from 'react';
import { CATEGORIES_DATA, type CategoryData } from '../../data/conditions-data';
import { useAnatomyStore } from '../../stores/anatomy-store';
import { Eye, Film, ArrowRight } from 'lucide-react';

interface RealBodySceneProps {
  onRegionClick?: (categoryId: string) => void;
}

export const RealBodyScene: React.FC<RealBodySceneProps> = ({ onRegionClick }) => {
  const { hoveredRegion, setHoveredRegion } = useAnatomyStore();
  const [displayMode, setDisplayMode] = useState<'video' | 'reveal'>('video');
  const [mounted, setMounted] = useState(false);

  // Find active category based on hoveredRegion
  const activeCategory = CATEGORIES_DATA.find((c) => c.regionId === hoveredRegion) || null;

  // Video management
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeVideoSrc = activeCategory?.videoSrc || '/videos/full_body_idle.mp4';

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (!video || !video.duration) return;
    const loopStart = Math.max(0, video.duration - 1.0);
    if (video.currentTime >= video.duration - 0.08) {
      video.currentTime = loopStart;
      video.play().catch(() => {});
    }
  };

  // Reveal lens management
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: -999, y: -999 });
  const smoothPointerRef = useRef({ x: -999, y: -999 });
  const radiusRef = useRef({ current: 0, target: 220 });
  const frameIdRef = useRef<number | null>(null);
  const isPointerInsideRef = useRef(false);

  useEffect(() => {
    setMounted(true);

    const updateFrame = () => {
      const container = containerRef.current;
      if (!container) {
        frameIdRef.current = requestAnimationFrame(updateFrame);
        return;
      }

      const rect = container.getBoundingClientRect();
      let targetX = pointerRef.current.x;
      let targetY = pointerRef.current.y;

      if (!isPointerInsideRef.current && activeCategory) {
        targetX = (activeCategory.hotspot.x / 100) * rect.width;
        targetY = (activeCategory.hotspot.y / 100) * rect.height;
        radiusRef.current.target = 240;
      } else if (!isPointerInsideRef.current) {
        targetX = rect.width * 0.5;
        targetY = rect.height * 0.35;
        radiusRef.current.target = 200;
      } else {
        radiusRef.current.target = 230;
      }

      if (smoothPointerRef.current.x === -999) {
        smoothPointerRef.current.x = targetX;
        smoothPointerRef.current.y = targetY;
      } else {
        smoothPointerRef.current.x += (targetX - smoothPointerRef.current.x) * 0.14;
        smoothPointerRef.current.y += (targetY - smoothPointerRef.current.y) * 0.14;
      }

      radiusRef.current.current += (radiusRef.current.target - radiusRef.current.current) * 0.12;

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
  }, [activeCategory]);

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    isPointerInsideRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    isPointerInsideRef.current = true;
  };

  const handlePointerLeave = () => {
    isPointerInsideRef.current = false;
  };

  const handleHotspotClick = (category: CategoryData) => {
    if (onRegionClick) {
      onRegionClick(category.id);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full h-full min-h-[520px] lg:min-h-screen overflow-hidden select-none bg-gradient-to-b from-[#FAFBFC] via-white to-[#F1F5F9] text-slate-900 touch-none transition-opacity duration-700 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        ['--reveal-x' as any]: '-999px',
        ['--reveal-y' as any]: '-999px',
        ['--reveal-radius' as any]: '0px',
      }}
    >
      {/* Subtle Medical Blueprint Background Grid */}
      <div className="absolute inset-0 pointer-events-none tech-grid opacity-35" aria-hidden="true" />

      {/* MODE A: CINEMATIC MEDICAL VIDEO (CanvasBodySequence) */}
      {displayMode === 'video' && (
        <div className="absolute inset-0 z-10 transition-opacity duration-500">
          <video
            key={activeVideoSrc}
            ref={videoRef}
            src={activeVideoSrc}
            autoPlay
            muted
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            style={{
              imageRendering: '-webkit-optimize-contrast' as any,
              filter: 'contrast(1.16) brightness(0.96)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
              maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            }}
            className="w-full h-full object-contain lg:object-cover object-center transform-gpu will-change-transform"
          />
        </div>
      )}

      {/* MODE B: DUAL-LAYER REAL BODY ANATOMICAL REVEAL */}
      {displayMode === 'reveal' && (
        <div className="absolute inset-0 z-10 transition-opacity duration-500">
          {/* Base Layer */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-95 animate-fade-scale"
              style={{ backgroundImage: `url('/images/Full_body_base.png')` }}
            />
          </div>

          {/* Reveal Layer with radial mask */}
          <div className="absolute inset-0 pointer-events-none select-none reveal-mask">
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: `url('/images/Full_body_reveal.png')` }}
            />
          </div>

          {/* Glowing Lens Boundary */}
          <div
            className="absolute pointer-events-none rounded-full border-2 border-[#06B6D4]/70 shadow-[0_0_30px_rgba(6,182,212,0.4)] mix-blend-screen transition-opacity duration-300"
            style={{
              left: 'var(--reveal-x)',
              top: 'var(--reveal-y)',
              width: 'calc(var(--reveal-radius) * 2)',
              height: 'calc(var(--reveal-radius) * 2)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      )}

      {/* INTERACTIVE BODY HOTSPOTS (Zero permanent dots/pins - invisible hitboxes) */}
      <div className="absolute inset-0 z-30 pointer-events-auto">
        {CATEGORIES_DATA.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleHotspotClick(cat)}
            onMouseEnter={() => setHoveredRegion(cat.regionId)}
            onMouseLeave={() => setHoveredRegion(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full cursor-pointer focus:outline-none"
            style={{ left: `${cat.hotspot.x}%`, top: `${cat.hotspot.y}%` }}
            aria-label={`Inspect ${cat.name} (${cat.hotspot.label})`}
          />
        ))}
      </div>

      {/* HOVER-ONLY PULSING TARGET NODE RING & GLASS HUD CARD */}
      {activeCategory && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none transition-all duration-300"
          style={{ left: `${activeCategory.hotspot.x}%`, top: `${activeCategory.hotspot.y}%` }}
        >
          {/* Animated Pulsing Target Node */}
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-[#ED248F]/60 opacity-90" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ED248F] border-2 border-white shadow-xl" />
          </div>

          {/* Translucent Glassmorphic Video HUD Badge (Hover Only) */}
          <div
            onClick={() => handleHotspotClick(activeCategory)}
            className={`absolute pointer-events-auto cursor-pointer right-full mr-4 w-68 sm:w-76 glass-panel rounded-2xl p-4 text-[#0B132B] shadow-2xl border border-white/80 bg-white/95 backdrop-blur-xl animate-fade-up hover:border-[#ED248F] transition-all duration-300 group ${
              activeCategory.hotspot.y < 25 ? 'top-0 translate-y-2' : 'top-1/2 -translate-y-1/2'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold text-white shadow-md"
                style={{ backgroundColor: activeCategory.accentColor }}
              >
                {activeCategory.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[#0B132B] line-clamp-1 group-hover:text-[#ED248F] transition-colors">
                  {activeCategory.name}
                </div>
                <div className="text-[10px] text-[#06B6D4] font-mono font-semibold">
                  {activeCategory.activeTrialsCount} active trials
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3 font-medium">
              {activeCategory.description}
            </p>

            <div className="text-[11px] font-bold text-[#ED248F] flex items-center justify-between group-hover:translate-x-1 transition-transform">
              <span>Inspect Anatomical Focus</span>
              <span className="font-mono text-xs flex items-center gap-1">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TOP CONTROLS: Mode Switcher & Real Body Badge */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40 flex items-center gap-2 pointer-events-auto">
        <div className="glass-panel p-1 rounded-2xl flex items-center gap-1 border border-slate-200/90 shadow-sm bg-white/90">
          <button
            onClick={() => setDisplayMode('video')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              displayMode === 'video'
                ? 'bg-[#0B132B] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Cinematic Video</span>
          </button>

          <button
            onClick={() => setDisplayMode('reveal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              displayMode === 'reveal'
                ? 'bg-[#0B132B] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Anatomical Lens</span>
          </button>
        </div>
      </div>

      {/* BOTTOM STATUS INDICATOR */}
      <div className="absolute bottom-5 left-5 right-5 z-40 glass-panel border border-slate-200/80 bg-white/90 px-4 py-2.5 rounded-2xl flex items-center justify-between text-slate-800 pointer-events-none shadow-lg max-w-md mx-auto sm:mx-0">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ED248F] animate-pulse" />
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
              {activeCategory ? 'Targeted Organ Region' : 'Interactive Anatomical Viewport'}
            </div>
            <div className="text-xs font-bold text-[#0B132B] truncate max-w-[240px]">
              {activeCategory ? activeCategory.hotspot.label : 'Hover cards or body to spotlight organs'}
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#06B6D4] font-bold uppercase tracking-wider bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200">
          Zero Static Pins
        </span>
      </div>
    </div>
  );
};
