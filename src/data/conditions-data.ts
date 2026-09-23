import { CATEGORIES_CATALOG } from './categories-catalog';
import { generateConditionDetail, slugify } from './conditions-generator';
import type { AnatomyRegionId } from '../lib/atlas/region-map';

export interface SymptomBar {
  name: string;
  percentage: number; // 0 to 100
  description: string;
}

export interface TreatmentOption {
  title: string;
  type: 'First-Line' | 'Targeted' | 'Surgical' | 'Lifestyle' | 'Experimental';
  description: string;
}

export interface PipelineStage {
  drugName: string;
  mechanism: string;
  phase: 'Phase I' | 'Phase II' | 'Phase IIb' | 'Phase III' | 'FDA Review';
  sponsor: string;
  completionYear: string;
}

export interface PAGResource {
  name: string;
  logoUrl?: string;
  website: string;
  description: string;
  supportPhone?: string;
}

export interface PatientStory {
  author: string;
  age: number;
  location: string;
  quote: string;
  storyText: string;
  trialName: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FallbackTrial {
  nctId: string;
  title: string;
  phase: string;
  status: 'RECRUITING' | 'ACTIVE_NOT_RECRUITING' | 'ENROLLING_BY_INVITATION';
  locationsCount: number;
  hasRemoteOption: boolean;
  sponsor: string;
  summary: string;
  matchScore: number;
}

export interface ConditionDetail {
  id: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  anatomicalRegion: string;
  prevalence: string;
  whatIsText: string;
  symptomBars: SymptomBar[];
  treatmentOptions: TreatmentOption[];
  pipeline: PipelineStage[];
  pags: PAGResource[];
  stories: PatientStory[];
  faqs: FAQItem[];
  fallbackTrials: FallbackTrial[];
}

export interface CategoryData {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  icd11Block: string;
  regionId: AnatomyRegionId;
  regionBadge: string;
  iconName: string;
  accentColor: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  description: string;
  conditionsCount: number;
  activeTrialsCount: number;
  hotspot: { x: number; y: number; label: string };
  videoSrc: string;
  conditions: ConditionDetail[];
}

// Build the full 23 categories dataset with all ~260 conditions
export const CATEGORIES_DATA: CategoryData[] = CATEGORIES_CATALOG.map((catDef) => {
  const conditions = catDef.conditionNames.map((name) =>
    generateConditionDetail(catDef, name)
  );
  return {
    id: catDef.id,
    number: catDef.number,
    name: catDef.name,
    subtitle: catDef.subtitle,
    icd11Block: catDef.icd11Block,
    regionId: catDef.regionId,
    regionBadge: catDef.regionBadge,
    iconName: catDef.iconName,
    accentColor: catDef.accentColor,
    cameraPosition: catDef.cameraPosition,
    cameraTarget: catDef.cameraTarget,
    description: catDef.description,
    conditionsCount: conditions.length,
    activeTrialsCount: catDef.activeTrialsCount,
    hotspot: catDef.hotspot,
    videoSrc: catDef.videoSrc,
    conditions,
  };
});

// Backward compatibility map for legacy category IDs
const LEGACY_CATEGORY_ALIAS: Record<string, string> = {
  neurology: 'neurological',
  oncology: 'cancer',
  cardiology: 'cardiovascular',
  endocrine: 'endocrine-metabolic',
  gastroenterology: 'digestive-liver',
};

// Helper functions
export function getCategoryById(id: string): CategoryData | undefined {
  const normalizedId = LEGACY_CATEGORY_ALIAS[id] || id;
  return (
    CATEGORIES_DATA.find((cat) => cat.id === normalizedId) ||
    CATEGORIES_DATA.find(
      (cat) => cat.name.toLowerCase() === id.toLowerCase() || slugify(cat.name) === id
    )
  );
}

export function getConditionById(
  categoryId: string,
  conditionId: string
): ConditionDetail | undefined {
  const cat = getCategoryById(categoryId);
  if (!cat) return undefined;

  const targetSlug = slugify(conditionId);

  return (
    cat.conditions.find((cond) => cond.id === conditionId) ||
    cat.conditions.find((cond) => slugify(cond.id) === targetSlug) ||
    cat.conditions.find((cond) => slugify(cond.name) === targetSlug) ||
    cat.conditions.find(
      (cond) =>
        cond.id.includes(targetSlug) ||
        targetSlug.includes(cond.id) ||
        cond.name.toLowerCase().includes(conditionId.toLowerCase())
    )
  );
}

export function getAllConditions(): { category: CategoryData; condition: ConditionDetail }[] {
  const result: { category: CategoryData; condition: ConditionDetail }[] = [];
  CATEGORIES_DATA.forEach((category) => {
    category.conditions.forEach((condition) => {
      result.push({ category, condition });
    });
  });
  return result;
}

export function searchConditions(
  query: string
): { category: CategoryData; condition: ConditionDetail }[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const all = getAllConditions();
  return all.filter(
    ({ category, condition }) =>
      condition.name.toLowerCase().includes(clean) ||
      condition.shortDescription.toLowerCase().includes(clean) ||
      category.name.toLowerCase().includes(clean) ||
      condition.anatomicalRegion.toLowerCase().includes(clean)
  );
}
