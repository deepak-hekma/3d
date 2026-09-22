import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { AtlasBodyModel } from './AtlasBodyModel';
import { CameraController } from './CameraController';
import { AtlasSkeleton } from './AtlasSkeleton';
import { RegionHighlight } from './RegionHighlight';
import { useAtlas } from '../../lib/atlas/useAtlas';
import { useAnatomyStore } from '../../stores/anatomy-store';

interface BodySceneProps {
  onRegionClick?: (categoryId: string) => void;
}

export const BodyScene: React.FC<BodySceneProps> = ({ onRegionClick }) => {
  const [retry, setRetry] = useState(0);
  const [contextLost, setContextLost] = useState(false);
  const { activeLayerFilter, setActiveLayerFilter } = useAnatomyStore();
  const { status, progress, error, meshes } = useAtlas(retry);
  const failed = status === 'error' || contextLost;
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const dpr: [number, number] = [1, mobile ? 1.5 : 2];

  useEffect(() => {
    setContextLost(false);
  }, [retry]);

  return (
    <div
      className="relative h-full w-full pointer-events-auto overflow-hidden bg-[#FAFBFC]"
      data-atlas-status={status}
      data-atlas-meshes={meshes.length}
    >
      {status === 'ready' && !contextLost && (
        <Canvas
          camera={{ position: [0.4, 1.05, 3.05], fov: 34 }}
          shadows
          dpr={dpr}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          style={{ width: '100%', height: '100%' }}
          onCreated={({ gl }) => {
            const canvas = gl.domElement;
            canvas.addEventListener(
              'webglcontextlost',
              (event) => {
                event.preventDefault();
                setContextLost(true);
              },
              { once: true },
            );
          }}
        >
          {/* Studio IBL Environment for realistic specular reflections on physical materials */}
          <Environment preset="studio" />

          {/* Balanced lighting with clear shadows & depth */}
          <ambientLight intensity={0.35} />
          
          {/* Key Light (Front-Right) */}
          <directionalLight
            position={[5, 10, 7]}
            intensity={1.4}
            color="#FFFFFF"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          
          {/* Fill Light (Soft Cool Medical Fill from Front-Left) */}
          <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#E0F2FE" />
          
          {/* Rim / Silhouette Back Light (Enhances organ edge separation) */}
          <directionalLight position={[0, 6, -6]} intensity={0.8} color="#F8FAFC" />
          
          {/* Subtle Pink Medical Accent Light */}
          <pointLight position={[0, 2, 2.5]} intensity={0.3} color="#ED248F" />

          <AtlasBodyModel meshes={meshes} onRegionClick={onRegionClick} />
          <CameraController />

          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom={true}
            enableDamping={true}
            dampingFactor={0.06}
            rotateSpeed={0.85}
            zoomSpeed={1.2}
            minDistance={0.8}
            maxDistance={6.0}
            maxPolarAngle={Math.PI / 1.75}
            minPolarAngle={Math.PI / 3.4}
            target={[0, 0.85, 0]}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
          />
        </Canvas>
      )}

      {status === 'loading' && <AtlasSkeleton progress={progress} />}

      {failed && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#FAFBFC]/80 backdrop-blur-md">
          <div className="glass-panel max-w-md mx-4 p-6 rounded-2xl border border-slate-200/80 bg-white/95 text-center">
            <p className="text-sm font-bold text-[#0B132B]">
              {contextLost ? 'The 3D viewer lost its graphics context.' : 'The 3D anatomy model could not be loaded.'}
            </p>
            <p className="text-xs text-slate-600 mt-2">
              {contextLost
                ? 'Please retry to restore the 3D viewer.'
                : error ?? 'Please retry to load the anatomy model.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setRetry((value) => value + 1)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0B132B] text-white"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'ready' && !contextLost && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-0.5 p-0.5 rounded-xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm pointer-events-auto">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'organs', label: 'Organs' },
              { id: 'skeleton', label: 'Skeleton' },
              { id: 'muscular', label: 'Muscular' },
            ] as const
          ).map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayerFilter(layer.id)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold leading-none transition-all cursor-pointer ${
                activeLayerFilter === layer.id
                  ? 'bg-[#0B132B] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      )}

      {status === 'ready' && !contextLost && (
        <a
          href="/ATTRIBUTION.md"
          className="absolute bottom-4 left-4 z-20 text-[10px] font-medium text-slate-500 hover:text-slate-700 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-lg pointer-events-auto"
        >
          Anatomy: BodyParts3D · CC BY 4.0
        </a>
      )}

      <RegionHighlight />
    </div>
  );
};

export default BodyScene;
