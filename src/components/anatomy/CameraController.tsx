import { useEffect, useRef } from 'react';
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

  const isTransitioningRef = useRef(false);
  const targetPosRef = useRef(new THREE.Vector3().copy(DEFAULT_POS));
  const targetLookAtRef = useRef(new THREE.Vector3().copy(DEFAULT_TARGET));
  const prevTriggerRef = useRef<string | null>(null);

  // Detect when card hover or category selection triggers a camera focus change
  useEffect(() => {
    const currentTrigger = hoveredCardRegion || selectedCategoryId || null;
    if (currentTrigger !== prevTriggerRef.current) {
      prevTriggerRef.current = currentTrigger;

      if (hoveredCardRegion && REGION_CAMERA_MAP[hoveredCardRegion]) {
        const config = REGION_CAMERA_MAP[hoveredCardRegion];
        targetPosRef.current.set(...config.position);
        targetLookAtRef.current.set(...config.target);
        isTransitioningRef.current = true;
      } else if (selectedCategoryId) {
        const category = CATEGORIES_DATA.find((c) => c.id === selectedCategoryId);
        if (category && REGION_CAMERA_MAP[category.regionId]) {
          const config = REGION_CAMERA_MAP[category.regionId];
          targetPosRef.current.set(...config.position);
          targetLookAtRef.current.set(...config.target);
          isTransitioningRef.current = true;
        }
      } else {
        // Return to default full-body view
        targetPosRef.current.copy(DEFAULT_POS);
        targetLookAtRef.current.copy(DEFAULT_TARGET);
        isTransitioningRef.current = true;
      }
    }
  }, [hoveredCardRegion, selectedCategoryId]);

  useFrame((_, delta) => {
    // Only interpolate camera when an automated transition is active.
    // Once transition finishes, release control so user has 100% free OrbitControls zoom / rotate.
    if (!isTransitioningRef.current) return;

    const dampFactor = 1 - Math.exp(-5.0 * delta);

    camera.position.lerp(targetPosRef.current, dampFactor);

    const orbit = controls as OrbitControls | null;
    if (orbit && 'target' in orbit) {
      orbit.target.lerp(targetLookAtRef.current, dampFactor);
      orbit.update();
    } else {
      camera.lookAt(targetLookAtRef.current);
    }

    // When camera is close enough to target, finish transition
    const posDist = camera.position.distanceTo(targetPosRef.current);
    const targetDist = orbit && 'target' in orbit
      ? orbit.target.distanceTo(targetLookAtRef.current)
      : 0;

    if (posDist < 0.008 && targetDist < 0.008) {
      camera.position.copy(targetPosRef.current);
      if (orbit && 'target' in orbit) {
        orbit.target.copy(targetLookAtRef.current);
        orbit.update();
      }
      isTransitioningRef.current = false;
    }
  });

  return null;
}
