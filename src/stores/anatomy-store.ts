import { create } from 'zustand';
import { CATEGORIES_DATA } from '../data/conditions-data';

export type RegionFilter = 'all' | 'us' | 'uae';

interface AnatomyState {
  hoveredRegion: string | null;
  hoveredSystem: string | null;
  pointerPos: { x: number; y: number } | null;
  selectedCategoryId: string | null;
  regionFilter: RegionFilter;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  is3dLoaded: boolean;
  
  // Actions
  setHoveredRegion: (region: string | null) => void;
  setHoveredSystem: (system: string | null) => void;
  setPointerPos: (pos: { x: number; y: number } | null) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setRegionFilter: (filter: RegionFilter) => void;
  setCamera: (position: [number, number, number], target: [number, number, number]) => void;
  setIs3dLoaded: (loaded: boolean) => void;
  resetCamera: () => void;
}

const DEFAULT_CAMERA_POS: [number, number, number] = [0.4, 1.05, 3.05];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 0.85, 0];

export const useAnatomyStore = create<AnatomyState>((set) => ({
  hoveredRegion: null,
  hoveredSystem: null,
  pointerPos: null,
  selectedCategoryId: null,
  regionFilter: 'all',
  cameraPosition: DEFAULT_CAMERA_POS,
  cameraTarget: DEFAULT_CAMERA_TARGET,
  is3dLoaded: false,

  setHoveredRegion: (region) => set({ hoveredRegion: region }),
  setHoveredSystem: (system) => set({ hoveredSystem: system }),
  setPointerPos: (pos) => set({ pointerPos: pos }),

  setSelectedCategory: (categoryId) => {
    if (!categoryId) {
      set({
        selectedCategoryId: null,
        cameraPosition: DEFAULT_CAMERA_POS,
        cameraTarget: DEFAULT_CAMERA_TARGET,
      });
      return;
    }

    const category = CATEGORIES_DATA.find((c) => c.id === categoryId);
    if (category) {
      set({
        selectedCategoryId: categoryId,
        cameraPosition: category.cameraPosition,
        cameraTarget: category.cameraTarget,
      });
    } else {
      set({ selectedCategoryId: categoryId });
    }
  },

  setRegionFilter: (filter) => set({ regionFilter: filter }),

  setCamera: (position, target) => set({ cameraPosition: position, cameraTarget: target }),

  setIs3dLoaded: (loaded) => set({ is3dLoaded: loaded }),

  resetCamera: () =>
    set({
      cameraPosition: DEFAULT_CAMERA_POS,
      cameraTarget: DEFAULT_CAMERA_TARGET,
      selectedCategoryId: null,
    }),
}));
