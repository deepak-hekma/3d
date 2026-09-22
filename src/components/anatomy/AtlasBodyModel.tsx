import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useAnatomyStore } from '../../stores/anatomy-store';
import { CATEGORIES_DATA } from '../../data/conditions-data';
import type { AtlasSystemMesh } from '../../lib/atlas/useAtlas';
import type { SystemId } from '../../lib/atlas/types';
import {
  ORGAN_SYSTEMS,
  PICK_SYSTEMS,
  categoryForSystem,
  systemsForRegion,
} from '../../lib/atlas/region-map';

interface AtlasBodyModelProps {
  meshes: AtlasSystemMesh[];
  onRegionClick?: (categoryId: string) => void;
}

// Rich medical palette with physically accurate roughness & clearcoat gloss
const NATURAL_PALETTE: Record<
  string,
  {
    color: string;
    opacity: number;
    emissive: string;
    emissiveIntensity: number;
    roughness: number;
    clearcoat: number;
    clearcoatRoughness: number;
    metalness: number;
  }
> = {
  skeletal: {
    color: '#EFE8DA',
    opacity: 0.98,
    emissive: '#2A241C',
    emissiveIntensity: 0.03,
    roughness: 0.42,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
    metalness: 0.05,
  },
  muscular: {
    color: '#A3433B',
    opacity: 0.20,
    emissive: '#261210',
    emissiveIntensity: 0.02,
    roughness: 0.38,
    clearcoat: 0.2,
    clearcoatRoughness: 0.3,
    metalness: 0.04,
  },
  cardiac: {
    color: '#DC2626',
    opacity: 1.0,
    emissive: '#450A0A',
    emissiveIntensity: 0.05,
    roughness: 0.22,
    clearcoat: 0.85,
    clearcoatRoughness: 0.1,
    metalness: 0.08,
  },
  sensory: {
    color: '#06B6D4',
    opacity: 1.0,
    emissive: '#164E63',
    emissiveIntensity: 0.05,
    roughness: 0.2,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08,
    metalness: 0.1,
  },
  nervous: {
    color: '#F59E0B',
    opacity: 1.0,
    emissive: '#78350F',
    emissiveIntensity: 0.05,
    roughness: 0.28,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
    metalness: 0.06,
  },
  respiratory: {
    color: '#DB7093',
    opacity: 1.0,
    emissive: '#500724',
    emissiveIntensity: 0.05,
    roughness: 0.32,
    clearcoat: 0.65,
    clearcoatRoughness: 0.12,
    metalness: 0.05,
  },
  endocrine: {
    color: '#A855F7',
    opacity: 1.0,
    emissive: '#3B0764',
    emissiveIntensity: 0.05,
    roughness: 0.28,
    clearcoat: 0.7,
    clearcoatRoughness: 0.12,
    metalness: 0.06,
  },
  digestive: {
    color: '#C4683C',
    opacity: 1.0,
    emissive: '#431407',
    emissiveIntensity: 0.05,
    roughness: 0.25,
    clearcoat: 0.8,
    clearcoatRoughness: 0.12,
    metalness: 0.06,
  },
  urinary: {
    color: '#D97706',
    opacity: 1.0,
    emissive: '#451A03',
    emissiveIntensity: 0.05,
    roughness: 0.25,
    clearcoat: 0.75,
    clearcoatRoughness: 0.12,
    metalness: 0.06,
  },
  lymphatic: {
    color: '#10B981',
    opacity: 1.0,
    emissive: '#064E3B',
    emissiveIntensity: 0.05,
    roughness: 0.3,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
    metalness: 0.06,
  },
};

function pickFromIntersections(intersections: THREE.Intersection[]): SystemId | null {
  const organ = intersections.find((hit) => ORGAN_SYSTEMS.has(hit.object.userData.system as SystemId));
  if (organ) return organ.object.userData.system as SystemId;
  const bone = intersections.find((hit) => hit.object.userData.system === 'skeletal');
  if (bone) return 'skeletal';
  const muscle = intersections.find((hit) => hit.object.userData.system === 'muscular');
  if (muscle) return 'muscular';
  return null;
}

export const AtlasBodyModel: React.FC<AtlasBodyModelProps> = ({ meshes, onRegionClick }) => {
  const {
    hoveredCardRegion,
    setHoveredSystem,
    setPointerPos,
    selectedCategoryId,
    activeLayerFilter,
  } = useAnatomyStore();

  const materials = useMemo(() => {
    const map = new Map<SystemId, THREE.MeshPhysicalMaterial>();
    for (const { system } of meshes) {
      const natural = NATURAL_PALETTE[system] ?? NATURAL_PALETTE.skeletal;
      const material = new THREE.MeshPhysicalMaterial({
        color: natural.color,
        emissive: natural.emissive,
        emissiveIntensity: natural.emissiveIntensity,
        roughness: natural.roughness,
        metalness: natural.metalness,
        clearcoat: natural.clearcoat,
        clearcoatRoughness: natural.clearcoatRoughness,
        transparent: system === 'muscular',
        opacity: natural.opacity,
        side: THREE.DoubleSide,
        depthWrite: system !== 'muscular',
      });
      map.set(system, material);
    }
    return map;
  }, [meshes]);

  useEffect(() => {
    return () => {
      materials.forEach((material) => material.dispose());
    };
  }, [materials]);

  const highlighted = useMemo(() => {
    const fromCard = systemsForRegion(hoveredCardRegion);
    if (fromCard.size) return fromCard;
    const category = CATEGORIES_DATA.find((entry) => entry.id === selectedCategoryId);
    return systemsForRegion(category?.regionId ?? null);
  }, [hoveredCardRegion, selectedCategoryId]);

  useEffect(() => {
    const hasHighlight = highlighted.size > 0;
    const isInternalOrganTargeted = Array.from(highlighted).some((sys) => ORGAN_SYSTEMS.has(sys));

    materials.forEach((material, system) => {
      const natural = NATURAL_PALETTE[system] ?? NATURAL_PALETTE.skeletal;
      const isOn = highlighted.has(system);
      const isOrgan = ORGAN_SYSTEMS.has(system);

      // 1. Layer Isolation Filter
      if (activeLayerFilter === 'organs') {
        if (!isOrgan) {
          material.opacity = 0.02;
          material.transparent = true;
          material.depthWrite = false;
          material.emissiveIntensity = 0;
          return;
        }
      } else if (activeLayerFilter === 'skeleton') {
        if (system !== 'skeletal') {
          material.opacity = 0.02;
          material.transparent = true;
          material.depthWrite = false;
          material.emissiveIntensity = 0;
          return;
        } else {
          material.opacity = 1.0;
          material.transparent = false;
          material.depthWrite = true;
          material.color.set(natural.color);
          material.emissiveIntensity = 0.03;
          return;
        }
      } else if (activeLayerFilter === 'muscular') {
        if (system === 'muscular') {
          material.opacity = 0.85;
          material.transparent = false;
          material.depthWrite = true;
          material.color.set('#B91C1C');
          material.emissiveIntensity = 0.03;
          return;
        } else if (system === 'skeletal') {
          material.opacity = 0.45;
          material.transparent = true;
          material.depthWrite = false;
          return;
        } else {
          material.opacity = 0.04;
          material.transparent = true;
          material.depthWrite = false;
          return;
        }
      }

      // 2. Highlight & Smart Auto-Peeling when a card is targeted
      if (hasHighlight) {
        if (isOn) {
          // TARGET ORGAN / SYSTEM
          material.color.set(natural.color);
          material.opacity = 1.0;
          material.transparent = false;
          material.depthWrite = true;
          material.roughness = Math.max(0.18, natural.roughness - 0.08);
          material.clearcoat = 0.85;

          // Subtle organic rim glow rather than flat cyan wash
          if (system === 'skeletal') {
            material.emissive.set('#5EEAD4');
            material.emissiveIntensity = 0.15;
          } else {
            material.emissive.set('#38BDF8');
            material.emissiveIntensity = 0.08;
          }
        } else if (isInternalOrganTargeted && (system === 'skeletal' || system === 'muscular')) {
          // SMART AUTO-PEELING: Automatically ghost anterior bones & muscles
          material.color.set(natural.color);
          material.emissive.set(natural.emissive);
          material.emissiveIntensity = 0.0;
          material.opacity = system === 'muscular' ? 0.02 : 0.04;
          material.transparent = true;
          material.depthWrite = false;
        } else {
          // Non-targeted organs or structures
          material.color.set(natural.color);
          material.emissive.set(natural.emissive);
          material.emissiveIntensity = 0.01;
          material.opacity = system === 'muscular' ? 0.05 : 0.20;
          material.transparent = true;
          material.depthWrite = false;
        }
      } else {
        // NATURAL RESTING STATE
        material.color.set(natural.color);
        material.emissive.set(natural.emissive);
        material.emissiveIntensity = natural.emissiveIntensity;
        material.roughness = natural.roughness;
        material.clearcoat = natural.clearcoat;
        material.opacity = natural.opacity;
        material.transparent = system === 'muscular';
        material.depthWrite = system !== 'muscular';
      }
    });
  }, [highlighted, materials, activeLayerFilter]);

  const handlePointerMove = (event: any) => {
    const system = pickFromIntersections(event.intersections);
    if (!system) return;
    event.stopPropagation();
    setHoveredSystem(system);
    const clientX =
      event.clientX ??
      event.nativeEvent?.clientX ??
      (event.pointer && typeof window !== 'undefined'
        ? (event.pointer.x + 1) * 0.5 * window.innerWidth
        : undefined);
    const clientY =
      event.clientY ??
      event.nativeEvent?.clientY ??
      (event.pointer && typeof window !== 'undefined'
        ? (1 - (event.pointer.y + 1) * 0.5) * window.innerHeight
        : undefined);

    if (clientX !== undefined && clientY !== undefined) {
      setPointerPos({ x: clientX, y: clientY });
    }
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (event: any) => {
    const system = pickFromIntersections(event.intersections);
    if (system) return;
    setHoveredSystem(null);
    setPointerPos(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (event: {
    stopPropagation: () => void;
    intersections: THREE.Intersection[];
  }) => {
    const system = pickFromIntersections(event.intersections);
    if (!system) return;
    event.stopPropagation();
    const mapping = categoryForSystem(system);
    if (mapping && onRegionClick) onRegionClick(mapping.categoryId);
  };

  // Define renderOrder priority
  const getRenderOrder = (system: SystemId) => {
    if (highlighted.has(system)) return 25;
    if (ORGAN_SYSTEMS.has(system)) return 15;
    if (system === 'skeletal') return 5;
    return 1; // muscular
  };

  return (
    <group onPointerMove={handlePointerMove} onPointerOut={handlePointerOut} onClick={handleClick}>
      {meshes.map(({ system, geometry }) => (
        <mesh
          key={system}
          geometry={geometry}
          material={materials.get(system)}
          userData={{ system }}
          frustumCulled={false}
          renderOrder={getRenderOrder(system)}
          raycast={PICK_SYSTEMS.has(system) ? undefined : () => {}}
        />
      ))}
    </group>
  );
};
