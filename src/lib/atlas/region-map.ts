import type { SystemId } from './types';

export type AnatomyRegionId =
  | 'cranium'
  | 'thorax'
  | 'thorax-left'
  | 'thorax-right'
  | 'abdomen'
  | 'abdomen-lower'
  | 'skeleton';

export const CONTEXT_SYSTEMS: SystemId[] = ['skeletal', 'muscular'];

/** Systems we upload to the GPU. Vessels, skin, reproductive, and connective are omitted. */
export const MESH_SYSTEMS = new Set<SystemId>([
  'skeletal',
  'muscular',
  'nervous',
  'sensory',
  'lymphatic',
  'cardiac',
  'respiratory',
  'endocrine',
  'digestive',
  'urinary',
]);

/** Systems that participate in pointer picking (organs and bones take priority). */
export const PICK_SYSTEMS = new Set<SystemId>([
  'nervous',
  'sensory',
  'lymphatic',
  'cardiac',
  'respiratory',
  'endocrine',
  'digestive',
  'urinary',
  'skeletal',
  'muscular',
]);

export const ORGAN_SYSTEMS = new Set<SystemId>([
  'nervous',
  'sensory',
  'lymphatic',
  'cardiac',
  'respiratory',
  'endocrine',
  'digestive',
  'urinary',
]);

export const SYSTEM_TO_CATEGORY: Partial<Record<SystemId, { regionId: AnatomyRegionId; categoryId: string }>> = {
  nervous: { regionId: 'cranium', categoryId: 'neurology' },
  sensory: { regionId: 'cranium', categoryId: 'neurology' },
  lymphatic: { regionId: 'thorax', categoryId: 'oncology' },
  cardiac: { regionId: 'thorax-left', categoryId: 'cardiology' },
  respiratory: { regionId: 'thorax-right', categoryId: 'respiratory' },
  endocrine: { regionId: 'abdomen', categoryId: 'endocrine' },
  digestive: { regionId: 'abdomen-lower', categoryId: 'gastroenterology' },
  urinary: { regionId: 'abdomen-lower', categoryId: 'gastroenterology' },
  skeletal: { regionId: 'skeleton', categoryId: 'musculoskeletal' },
  muscular: { regionId: 'skeleton', categoryId: 'musculoskeletal' },
};

export const REGION_TO_SYSTEMS: Record<AnatomyRegionId, SystemId[]> = {
  cranium: ['nervous', 'sensory'],
  thorax: ['lymphatic'],
  'thorax-left': ['cardiac'],
  'thorax-right': ['respiratory'],
  abdomen: ['endocrine'],
  'abdomen-lower': ['digestive', 'urinary'],
  skeleton: ['skeletal', 'muscular'],
};

export function systemsForRegion(regionId: string | null): Set<SystemId> {
  if (!regionId || !(regionId in REGION_TO_SYSTEMS)) return new Set();
  return new Set(REGION_TO_SYSTEMS[regionId as AnatomyRegionId]);
}

export function categoryForSystem(system: SystemId): { regionId: AnatomyRegionId; categoryId: string } | undefined {
  return SYSTEM_TO_CATEGORY[system];
}
