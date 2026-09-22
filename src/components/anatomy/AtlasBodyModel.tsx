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

const NATURAL_PALETTE: Record<
  string,
  {
    color: string;
    opacity: number;
    emissive: string;
    emissiveIntensity: number;
    roughness: number;
  }
> = {
  skeletal: { color: '#E2D9BA', opacity: 0.98, emissive: '#4A4036', emissiveIntensity: 0.04, roughness: 0.52 },
  muscular: { color: '#A85B50', opacity: 0.22, emissive: '#3A1E1A', emissiveIntensity: 0.03, roughness: 0.40 },
  cardiac: { color: '#B96760', opacity: 0.98, emissive: '#3D1C19', emissiveIntensity: 0.06, roughness: 0.42 },
  sensory: { color: '#B0C8CE', opacity: 0.92, emissive: '#263D45', emissiveIntensity: 0.05, roughness: 0.38 },
  nervous: { color: '#D8B565', opacity: 0.96, emissive: '#4A3B18', emissiveIntensity: 0.05, roughness: 0.45 },
  respiratory: { color: '#B98991', opacity: 0.94, emissive: '#3D2228', emissiveIntensity: 0.05, roughness: 0.45 },
  endocrine: { color: '#C5A09A', opacity: 0.95, emissive: '#3E2A27', emissiveIntensity: 0.05, roughness: 0.45 },
  digestive: { color: '#B8916B', opacity: 0.95, emissive: '#3D2A18', emissiveIntensity: 0.05, roughness: 0.45 },
  urinary: { color: '#B47961', opacity: 0.95, emissive: '#3D2018', emissiveIntensity: 0.05, roughness: 0.45 },
  lymphatic: { color: '#879F7C', opacity: 0.95, emissive: '#22301E', emissiveIntensity: 0.05, roughness: 0.45 },
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
    hoveredRegion,
    setHoveredRegion,
    setHoveredSystem,
    setPointerPos,
    selectedCategoryId,
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
        metalness: 0.08,
        transparent: true,
        opacity: natural.opacity,
        transmission: system === 'muscular' ? 0.35 : 0,
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
    const fromHover = systemsForRegion(hoveredRegion);
    if (fromHover.size) return fromHover;
    const category = CATEGORIES_DATA.find((entry) => entry.id === selectedCategoryId);
    return systemsForRegion(category?.regionId ?? null);
  }, [hoveredRegion, selectedCategoryId]);

  useEffect(() => {
    const hasHighlight = highlighted.size > 0;

    materials.forEach((material, system) => {
      const natural = NATURAL_PALETTE[system] ?? NATURAL_PALETTE.skeletal;
      const isOn = highlighted.has(system);

      if (hasHighlight) {
        if (isOn) {
          if (system === 'muscular') {
            material.color.set('#A85B50');
            material.emissive.set('#38BDF8');
            material.emissiveIntensity = 0.12;
            material.opacity = 0.18;
          } else if (system === 'skeletal') {
            material.color.set('#F4EFE6');
            material.emissive.set('#5EEAD4');
            material.emissiveIntensity = 0.28;
            material.opacity = 1.0;
          } else {
            material.color.set(natural.color);
            material.emissive.set('#38BDF8');
            material.emissiveIntensity = 0.35;
            material.opacity = 1.0;
          }
        } else {
          // Dim background systems to create clear focal depth
          material.color.set(natural.color);
          material.emissive.set(natural.emissive);
          material.emissiveIntensity = 0.01;
          material.opacity = system === 'muscular' ? 0.08 : 0.25;
        }
      } else {
        // Natural resting state
        material.color.set(natural.color);
        material.emissive.set(natural.emissive);
        material.emissiveIntensity = natural.emissiveIntensity;
        material.opacity = natural.opacity;
      }
    });
  }, [highlighted, materials]);

  const handlePointerMove = (event: any) => {
    const system = pickFromIntersections(event.intersections);
    if (!system) return;
    event.stopPropagation();
    const mapping = categoryForSystem(system);
    if (mapping) {
      setHoveredRegion(mapping.regionId);
      setHoveredSystem(system);
    }
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
    setHoveredRegion(null);
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

  return (
    <group onPointerMove={handlePointerMove} onPointerOut={handlePointerOut} onClick={handleClick}>
      {meshes.map(({ system, geometry }) => (
        <mesh
          key={system}
          geometry={geometry}
          material={materials.get(system)}
          userData={{ system }}
          frustumCulled={false}
          raycast={PICK_SYSTEMS.has(system) ? undefined : () => {}}
        />
      ))}
    </group>
  );
};
