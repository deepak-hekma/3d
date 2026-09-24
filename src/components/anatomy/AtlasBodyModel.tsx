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

// Calibrated medical palette with balanced, natural contrast & soft clearcoat gloss
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
    color: '#D2CABC', // Soft pearl bone ivory with gentle definition
    opacity: 0.37, // Balanced bone visibility without overpowering internal organs
    emissive: '#262018',
    emissiveIntensity: 0.02,
    roughness: 0.40,
    clearcoat: 0.30,
    clearcoatRoughness: 0.20,
    metalness: 0.03,
  },
  muscular: {
    color: '#9A4B42', // Soft anatomical muscle tone
    opacity: 0.13, // Gentle silhouette contour for limbs and torso without heavy darkness
    emissive: '#38130F',
    emissiveIntensity: 0.02,
    roughness: 0.38,
    clearcoat: 0.25,
    clearcoatRoughness: 0.25,
    metalness: 0.02,
  },
  cardiac: {
    color: '#C0323C', // Balanced arterial crimson
    opacity: 1.0,
    emissive: '#450A0A',
    emissiveIntensity: 0.09,
    roughness: 0.22,
    clearcoat: 0.88,
    clearcoatRoughness: 0.09,
    metalness: 0.06,
  },
  sensory: {
    color: '#CEC4B5', // Natural anatomical tissue / cartilage tone for ears, eyes & wrist retinaculum
    opacity: 0.90,
    emissive: '#262018',
    emissiveIntensity: 0.02,
    roughness: 0.36,
    clearcoat: 0.30,
    clearcoatRoughness: 0.20,
    metalness: 0.03,
  },
  nervous: {
    color: '#D68819', // Warm neural amber
    opacity: 1.0,
    emissive: '#451A03',
    emissiveIntensity: 0.08,
    roughness: 0.24,
    clearcoat: 0.78,
    clearcoatRoughness: 0.11,
    metalness: 0.05,
  },
  respiratory: {
    color: '#CA5879', // Soft pulmonary rose/coral for lungs
    opacity: 0.94,
    emissive: '#4C051B',
    emissiveIntensity: 0.07,
    roughness: 0.27,
    clearcoat: 0.72,
    clearcoatRoughness: 0.11,
    metalness: 0.04,
  },
  endocrine: {
    color: '#A855F7', // Soft orchid/purple for glands & pancreas
    opacity: 1.0,
    emissive: '#3B0764',
    emissiveIntensity: 0.07,
    roughness: 0.25,
    clearcoat: 0.76,
    clearcoatRoughness: 0.11,
    metalness: 0.05,
  },
  digestive: {
    color: '#BC5C1D', // Warm anatomical terracotta with natural shading
    opacity: 1.0,
    emissive: '#381404',
    emissiveIntensity: 0.06,
    roughness: 0.24,
    clearcoat: 0.82,
    clearcoatRoughness: 0.11,
    metalness: 0.05,
  },
  urinary: {
    color: '#D97706', // Warm amber-orange for kidneys & bladder
    opacity: 1.0,
    emissive: '#431407',
    emissiveIntensity: 0.06,
    roughness: 0.25,
    clearcoat: 0.76,
    clearcoatRoughness: 0.11,
    metalness: 0.05,
  },
  lymphatic: {
    color: '#16A34A', // Soft clinical emerald for lymph nodes
    opacity: 1.0,
    emissive: '#052E16',
    emissiveIntensity: 0.06,
    roughness: 0.28,
    clearcoat: 0.68,
    clearcoatRoughness: 0.13,
    metalness: 0.05,
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
    hoveredSystem,
    setHoveredSystem,
    setHoveredRegion,
    setPointerPos,
    selectedCategoryId,
  } = useAnatomyStore();

  const materials = useMemo(() => {
    const map = new Map<SystemId, THREE.MeshPhysicalMaterial>();
    for (const { system } of meshes) {
      const natural = NATURAL_PALETTE[system] ?? NATURAL_PALETTE.skeletal;
      const isTranslucent = system === 'muscular' || system === 'skeletal';
      const material = new THREE.MeshPhysicalMaterial({
        color: natural.color,
        emissive: natural.emissive,
        emissiveIntensity: natural.emissiveIntensity,
        roughness: natural.roughness,
        metalness: natural.metalness,
        clearcoat: natural.clearcoat,
        clearcoatRoughness: natural.clearcoatRoughness,
        transparent: isTranslucent,
        opacity: natural.opacity,
        side: THREE.DoubleSide,
        depthWrite: !isTranslucent,
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
    if (hoveredSystem) return new Set<SystemId>([hoveredSystem as SystemId]);
    const fromCard = systemsForRegion(hoveredCardRegion);
    if (fromCard.size) return fromCard;
    const category = CATEGORIES_DATA.find((entry) => entry.id === selectedCategoryId);
    return systemsForRegion(category?.regionId ?? null);
  }, [hoveredSystem, hoveredCardRegion, selectedCategoryId]);

  useEffect(() => {
    const hasHighlight = highlighted.size > 0;
    const isInternalOrganTargeted = Array.from(highlighted).some((sys) => ORGAN_SYSTEMS.has(sys));

    materials.forEach((material, system) => {
      const natural = NATURAL_PALETTE[system] ?? NATURAL_PALETTE.skeletal;
      const isOn = highlighted.has(system);
      if (hasHighlight) {
        if (isOn) {
          // TARGET ORGAN / SYSTEM: Vivid highlight with natural warm glow (no blue tint)
          material.color.set(natural.color);
          material.opacity = 1.0;
          material.transparent = false;
          material.depthWrite = true;
          material.roughness = Math.max(0.15, natural.roughness - 0.06);
          material.clearcoat = 0.90;

          if (system === 'skeletal') {
            material.emissive.set('#3D3425');
            material.emissiveIntensity = 0.14;
          } else if (system === 'muscular') {
            material.emissive.set('#4A1510');
            material.emissiveIntensity = 0.14;
          } else {
            material.emissive.set(natural.emissive);
            material.emissiveIntensity = Math.min(0.20, natural.emissiveIntensity * 2.2);
          }
        } else if (isInternalOrganTargeted && (system === 'skeletal' || system === 'muscular')) {
          // SMART AUTO-PEELING: Ghost anterior bones & muscles while keeping contour
          material.color.set(natural.color);
          material.emissive.set(natural.emissive);
          material.emissiveIntensity = 0.01;
          material.opacity = system === 'muscular' ? 0.04 : 0.08;
          material.transparent = true;
          material.depthWrite = false;
        } else {
          // Non-targeted organs or structures
          material.color.set(natural.color);
          material.emissive.set(natural.emissive);
          material.emissiveIntensity = 0.01;
          material.opacity = system === 'muscular' ? 0.06 : 0.22;
          material.transparent = true;
          material.depthWrite = false;
        }
      } else {
        // NATURAL RESTING STATE
        const isTranslucent = system === 'muscular' || system === 'skeletal';
        material.color.set(natural.color);
        material.emissive.set(natural.emissive);
        material.emissiveIntensity = natural.emissiveIntensity;
        material.roughness = natural.roughness;
        material.clearcoat = natural.clearcoat;
        material.opacity = natural.opacity;
        material.transparent = isTranslucent;
        material.depthWrite = !isTranslucent;
      }
    });
  }, [highlighted, materials]);

  const handlePointerMove = (event: {
    stopPropagation: () => void;
    intersections: THREE.Intersection[];
    nativeEvent?: PointerEvent | MouseEvent;
  }) => {
    const system = pickFromIntersections(event.intersections);
    if (!system) return;
    event.stopPropagation();
    setHoveredSystem(system);
    const mapping = categoryForSystem(system);
    setHoveredRegion(mapping?.regionId ?? null);
    const native = event.nativeEvent;
    if (native && 'clientX' in native) {
      setPointerPos({ x: native.clientX + 14, y: native.clientY + 18 });
    }
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (event: { intersections: THREE.Intersection[] }) => {
    const system = pickFromIntersections(event.intersections);
    if (system) return;
    setHoveredSystem(null);
    setHoveredRegion(null);
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

  // Define renderOrder priority:
  // Organs render first (solid, depthWrite: true).
  // Translucent skeletal & muscular wrap around them.
  // Highlighted target system gets top priority so it shines through everything.
  const getRenderOrder = (system: SystemId) => {
    if (highlighted.has(system)) return 35;
    if (ORGAN_SYSTEMS.has(system)) return 10;
    if (system === 'skeletal') return 20;
    return 25; // muscular
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
