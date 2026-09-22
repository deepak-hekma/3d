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

// Rich medical palette with physically accurate roughness & clearcoat gloss matching human-atlas
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
    color: '#E8E2D5',
    opacity: 0.32, // Translucent pearl bone in default view so internal organs (brain, lungs, heart) are clearly visible
    emissive: '#1F1B16',
    emissiveIntensity: 0.02,
    roughness: 0.45,
    clearcoat: 0.25,
    clearcoatRoughness: 0.2,
    metalness: 0.04,
  },
  muscular: {
    color: '#A85B50',
    opacity: 0.08, // Soft ghost muscle fibers so they do not block internal organs
    emissive: '#200D0B',
    emissiveIntensity: 0.02,
    roughness: 0.4,
    clearcoat: 0.15,
    clearcoatRoughness: 0.3,
    metalness: 0.04,
  },
  cardiac: {
    color: '#B96760', // Vibrant heart
    opacity: 1.0,
    emissive: '#450A0A',
    emissiveIntensity: 0.08,
    roughness: 0.22,
    clearcoat: 0.85,
    clearcoatRoughness: 0.1,
    metalness: 0.08,
  },
  sensory: {
    color: '#06B6D4', // Eyes & sensory
    opacity: 1.0,
    emissive: '#164E63',
    emissiveIntensity: 0.05,
    roughness: 0.2,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08,
    metalness: 0.1,
  },
  nervous: {
    color: '#D8B565', // Rich amber gold for Brain & Nerves
    opacity: 1.0,
    emissive: '#78350F',
    emissiveIntensity: 0.08,
    roughness: 0.26,
    clearcoat: 0.7,
    clearcoatRoughness: 0.12,
    metalness: 0.06,
  },
  respiratory: {
    color: '#DB7093', // Distinct soft rose for Lungs & Airways
    opacity: 1.0,
    emissive: '#500724',
    emissiveIntensity: 0.06,
    roughness: 0.3,
    clearcoat: 0.65,
    clearcoatRoughness: 0.12,
    metalness: 0.05,
  },
  endocrine: {
    color: '#C5A09A', // Pancreas / glands
    opacity: 1.0,
    emissive: '#3B0764',
    emissiveIntensity: 0.05,
    roughness: 0.28,
    clearcoat: 0.7,
    clearcoatRoughness: 0.12,
    metalness: 0.06,
  },
  digestive: {
    color: '#C4683C', // Warm terracotta for stomach, liver, intestines
    opacity: 1.0,
    emissive: '#431407',
    emissiveIntensity: 0.06,
    roughness: 0.25,
    clearcoat: 0.8,
    clearcoatRoughness: 0.12,
    metalness: 0.06,
  },
  urinary: {
    color: '#D97706', // Amber gold for kidneys & bladder
    opacity: 1.0,
    emissive: '#451A03',
    emissiveIntensity: 0.05,
    roughness: 0.25,
    clearcoat: 0.75,
    clearcoatRoughness: 0.12,
    metalness: 0.06,
  },
  lymphatic: {
    color: '#879F7C', // Soft sage green for lymph nodes
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
    if (hoveredSystem) return new Set<SystemId>([hoveredSystem]);
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
