import React from 'react';

interface AtlasSkeletonProps {
  progress?: number;
}

export const AtlasSkeleton: React.FC<AtlasSkeletonProps> = ({ progress = 0 }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#FAFBFC]/60 backdrop-blur-md z-10">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#ED248F]/20 animate-ping" />
          <div className="w-16 h-16 rounded-full border-2 border-t-[#ED248F] border-r-transparent border-b-[#06B6D4] border-l-transparent animate-spin" />
        </div>
        <p className="text-xs font-semibold text-[#0B132B]/70 tracking-wide font-mono">
          Loading 3D Anatomical Model... {Math.max(0, Math.min(100, progress))}%
        </p>
      </div>
    </div>
  );
};
