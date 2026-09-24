import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { AtlasBodyModel } from './AtlasBodyModel';
import { CameraController } from './CameraController';
import { AtlasSkeleton } from './AtlasSkeleton';
import { RegionHighlight } from './RegionHighlight';
import { useAtlas } from '../../lib/atlas/useAtlas';
import { useAnatomyStore } from '../../stores/anatomy-store';

interface BodySceneProps {
  onRegionClick?: (categoryId: string) => void;
}

function clearModelHover() {
  const store = useAnatomyStore.getState();
  store.setHoveredSystem(null);
  store.setHoveredRegion(null);
  store.setPointerPos(null);
  document.body.style.cursor = 'auto';
}

export const BodyScene: React.FC<BodySceneProps> = ({ onRegionClick }) => {
  const [retry, setRetry] = useState(0);
  const [contextLost, setContextLost] = useState(false);
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
      style={{
        background:
          'radial-gradient(ellipse 70% 80% at 52% 48%, rgba(238, 236, 232, 0.35) 0%, rgba(245, 243, 240, 0.18) 55%, rgba(250, 251, 252, 1) 100%)',
      }}
      data-atlas-status={status}
      data-atlas-meshes={meshes.length}
      onPointerLeave={clearModelHover}
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
            toneMappingExposure: 1.0,
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
          {/* Studio IBL Environment for soft realistic specular gloss */}
          <Environment preset="studio" environmentIntensity={0.45} />

          {/* Balanced ambient light for natural shadow transitions */}
          <ambientLight intensity={0.28} />
          
          {/* Key Light (Front-Right) - smooth form definition without harsh highlights */}
          <directionalLight
            position={[4.5, 9, 6]}
            intensity={1.15}
            color="#FFFFFF"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          
          {/* Fill Light (Soft neutral fill from Front-Left, zero blue tint) */}
          <directionalLight position={[-5, 3.5, 3]} intensity={0.35} color="#FFFFFF" />
          
          {/* Rim / Silhouette Back Light - crisp neutral white edge separation */}
          <directionalLight position={[0, 5, -5]} intensity={0.85} color="#FFFFFF" />

          {/* Secondary lower rim light for subtle leg & arm contour */}
          <directionalLight position={[0, -2, -4]} intensity={0.35} color="#F5F3EF" />
          
          {/* Subtle medical accent light */}
          <pointLight position={[0, 1.2, 2.2]} intensity={0.16} color="#ED248F" />

          {/* Contact Shadows grounding the body model on the floor */}
          <ContactShadows
            position={[0, 0.02, 0]}
            opacity={0.32}
            scale={2.6}
            blur={2.6}
            far={1.6}
            color="#0F172A"
          />

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

      <RegionHighlight />
    </div>
  );
};

export default BodyScene;
