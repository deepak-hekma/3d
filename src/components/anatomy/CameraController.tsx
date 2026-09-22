import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useAnatomyStore } from '../../stores/anatomy-store';
import { CATEGORIES_DATA } from '../../data/conditions-data';

const DEFAULT_POS = new THREE.Vector3(0.4, 1.05, 3.05);
const DEFAULT_TARGET = new THREE.Vector3(0, 0.85, 0);

// Tuned close-up camera positions for optimal organ zoom and framing
const REGION_CAMERA_MAP: Record<
  string,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  cranium: { position: [0.08, 1.54, 1.25], target: [0, 1.52, 0] },
  thorax: { position: [0.10, 1.20, 1.35], target: [0, 1.18, 0] },
  'thorax-left': { position: [0.22, 1.18, 1.15], target: [0.06, 1.16, 0] },
  'thorax-right': { position: [-0.18, 1.18, 1.25], target: [-0.04, 1.16, 0] },
  abdomen: { position: [0.08, 0.92, 1.25], target: [0, 0.90, 0] },
  'abdomen-lower': { position: [0.08, 0.70, 1.25], target: [0, 0.68, 0] },
  skeleton: { position: [0.15, 0.60, 2.10], target: [0, 0.55, 0] },
};

export function CameraController() {
  const { camera, controls } = useThree();
  const { hoveredCardRegion, selectedCategoryId } = useAnatomyStore();

  const targetPosRef = useRef(new THREE.Vector3());
  const targetLookAtRef = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    // Determine target position based on card hover or selection
    let desiredPos = DEFAULT_POS;
    let desiredTarget = DEFAULT_TARGET;

    if (hoveredCardRegion && REGION_CAMERA_MAP[hoveredCardRegion]) {
      const config = REGION_CAMERA_MAP[hoveredCardRegion];
      targetPosRef.current.set(...config.position);
      targetLookAtRef.current.set(...config.target);
      desiredPos = targetPosRef.current;
      desiredTarget = targetLookAtRef.current;
    } else if (selectedCategoryId) {
      const category = CATEGORIES_DATA.find((c) => c.id === selectedCategoryId);
      if (category && REGION_CAMERA_MAP[category.regionId]) {
        const config = REGION_CAMERA_MAP[category.regionId];
        targetPosRef.current.set(...config.position);
        targetLookAtRef.current.set(...config.target);
        desiredPos = targetPosRef.current;
        desiredTarget = targetLookAtRef.current;
      }
    }

    // Frame-rate independent smooth dampening (smooth ease-out)
    const dampFactor = 1 - Math.exp(-4.5 * delta);

    // Smoothly interpolate camera position
    camera.position.lerp(desiredPos, dampFactor);

    // Smoothly interpolate orbit controls target
    const orbit = controls as OrbitControls | null;
    if (orbit && 'target' in orbit) {
      orbit.target.lerp(desiredTarget, dampFactor);
      orbit.update();
    } else {
      camera.lookAt(desiredTarget);
    }
  });

  return null;
}
