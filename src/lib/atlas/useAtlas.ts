import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { decodeModelResponse } from './model-download';
import { MESH_SYSTEMS } from './region-map';
import { isSystemId, type Atlas, type Part, type SystemId } from './types';

export interface AtlasSystemMesh {
  system: SystemId;
  geometry: THREE.BufferGeometry;
}

export interface UseAtlasResult {
  status: 'loading' | 'ready' | 'error';
  progress: number;
  error: string | null;
  meshes: AtlasSystemMesh[];
}

function partFitsBuffer(part: Part, byteLength: number): boolean {
  if (part.vertexCount <= 0 || part.indexCount <= 0) return false;
  if (part.positions % 4 !== 0 || part.normals % 2 !== 0 || part.indices % 4 !== 0) return false;
  const positionsEnd = part.positions + part.vertexCount * 3 * 4;
  const normalsEnd = part.normals + part.vertexCount * 3 * 2;
  const indicesEnd = part.indices + part.indexCount * 4;
  return positionsEnd <= byteLength && normalsEnd <= byteLength && indicesEnd <= byteLength;
}

function geometryFromPart(buffer: ArrayBuffer, part: Part): THREE.BufferGeometry | null {
  if (!partFitsBuffer(part, buffer.byteLength)) return null;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buffer, part.positions, part.vertexCount * 3), 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(new Int16Array(buffer, part.normals, part.vertexCount * 3), 3, true));
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(buffer, part.indices, part.indexCount), 1));
  return geometry;
}

export function useAtlas(retry = 0): UseAtlasResult {
  const [status, setStatus] = useState<UseAtlasResult['status']>('loading');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [meshes, setMeshes] = useState<AtlasSystemMesh[]>([]);

  useEffect(() => {
    const abort = new AbortController();
    const partGeometries: THREE.BufferGeometry[] = [];
    const merged: THREE.BufferGeometry[] = [];
    let handedOff = false;

    const disposeParts = () => {
      partGeometries.forEach((geometry) => geometry.dispose());
      partGeometries.length = 0;
    };

    const disposeMerged = () => {
      merged.forEach((geometry) => geometry.dispose());
      merged.length = 0;
    };

    setStatus('loading');
    setProgress(0);
    setError(null);
    setMeshes([]);

    (async () => {
      try {
        const atlasResponse = await fetch('/models/atlas.json', { signal: abort.signal });
        if (!atlasResponse.ok) throw new Error('The anatomy catalogue could not be loaded.');
        const atlas = (await atlasResponse.json()) as Atlas;
        if (!atlas?.chunks?.length || !Array.isArray(atlas.parts)) {
          throw new Error('The anatomy catalogue could not be loaded.');
        }

        const groups = new Map<SystemId, THREE.BufferGeometry[]>();
        let loaded = 0;

        const loadChunk = async (index: number) => {
          const chunk = atlas.chunks[index];
          const compressed = !!chunk.gzip && typeof DecompressionStream !== 'undefined';
          const response = await fetch(compressed ? chunk.gzip! : chunk.url, { signal: abort.signal });
          const buffer = await decodeModelResponse(response, chunk.bytes, compressed);
          if (abort.signal.aborted) return;

          for (const part of atlas.parts) {
            if (part.chunk !== index) continue;
            if (!isSystemId(part.system) || !MESH_SYSTEMS.has(part.system)) continue;
            const geometry = geometryFromPart(buffer, part);
            if (!geometry) continue;
            partGeometries.push(geometry);
            const list = groups.get(part.system) ?? [];
            list.push(geometry);
            groups.set(part.system, list);
          }

          loaded += 1;
          if (!abort.signal.aborted) setProgress(Math.round((loaded / atlas.chunks.length) * 100));
        };

        let cursor = 0;
        await Promise.all(
          Array.from({ length: 3 }, async () => {
            while (cursor < atlas.chunks.length) {
              const index = cursor++;
              await loadChunk(index);
            }
          }),
        );

        if (abort.signal.aborted) {
          disposeParts();
          disposeMerged();
          return;
        }

        const nextMeshes: AtlasSystemMesh[] = [];
        groups.forEach((geometries, system) => {
          const geometry = mergeGeometries(geometries, false);
          if (!geometry) throw new Error('Could not assemble anatomy geometry.');
          geometry.computeBoundingBox();
          geometry.computeBoundingSphere();
          merged.push(geometry);
          nextMeshes.push({ system, geometry });
        });

        disposeParts();
        handedOff = true;
        setMeshes(nextMeshes);
        setStatus('ready');
        setProgress(100);
      } catch (cause) {
        disposeParts();
        if (!handedOff) disposeMerged();
        if (abort.signal.aborted) return;
        const message = cause instanceof Error ? cause.message : 'Could not load the anatomy.';
        setError(message);
        setStatus('error');
        setMeshes([]);
      }
    })();

    return () => {
      abort.abort();
      disposeParts();
      if (!handedOff) disposeMerged();
    };
  }, [retry]);

  useEffect(() => {
    return () => {
      meshes.forEach(({ geometry }) => geometry.dispose());
    };
  }, [meshes]);

  return { status, progress, error, meshes };
}
