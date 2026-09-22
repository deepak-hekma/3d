export type SystemId =
  | 'skeletal'
  | 'muscular'
  | 'arterial'
  | 'venous'
  | 'nervous'
  | 'digestive'
  | 'respiratory'
  | 'urinary'
  | 'reproductive'
  | 'lymphatic'
  | 'endocrine'
  | 'integumentary'
  | 'connective'
  | 'sensory'
  | 'cardiac';

export const KNOWN_SYSTEMS = new Set<SystemId>([
  'skeletal',
  'muscular',
  'arterial',
  'venous',
  'nervous',
  'digestive',
  'respiratory',
  'urinary',
  'reproductive',
  'lymphatic',
  'endocrine',
  'integumentary',
  'connective',
  'sensory',
  'cardiac',
]);

export interface Part {
  id: string;
  name: string;
  conceptId: string;
  system: SystemId;
  chunk: number;
  positions: number;
  normals: number;
  indices: number;
  vertexCount: number;
  indexCount: number;
  bounds: [number[], number[]];
}

export interface Concept {
  id: string;
  name: string;
  elements: string[];
}

export interface AtlasChunk {
  url: string;
  bytes: number;
  gzip?: string;
  gzipBytes?: number;
}

export interface Atlas {
  version: string;
  sex?: 'male';
  source?: string;
  scope?: string;
  parts: Part[];
  concepts: Concept[];
  chunks: AtlasChunk[];
  triangles: number;
}

export function isSystemId(value: string): value is SystemId {
  return KNOWN_SYSTEMS.has(value as SystemId);
}
