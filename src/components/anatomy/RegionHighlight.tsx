import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnatomyStore } from '../../stores/anatomy-store';
import { CATEGORIES_DATA } from '../../data/conditions-data';
import { categoryForSystem } from '../../lib/atlas/region-map';
import type { SystemId } from '../../lib/atlas/types';

const SYSTEM_NAMES: Record<string, string> = {
  skeletal: 'Skeletal System (Bones & Joints)',
  muscular: 'Muscular System',
  cardiac: 'Cardiovascular System (Heart)',
  nervous: 'Nervous System (Brain & Nerves)',
  respiratory: 'Respiratory System (Lungs & Airways)',
  digestive: 'Digestive System (GI Tract)',
  urinary: 'Urinary System (Kidneys & Bladder)',
  lymphatic: 'Lymphatic & Immune System',
  endocrine: 'Endocrine System (Glands & Hormones)',
  sensory: 'Sensory Organs (Eyes & Ears)',
};

export const RegionHighlight: React.FC = () => {
  const { hoveredSystem, pointerPos } = useAnatomyStore();

  const mapping = hoveredSystem ? categoryForSystem(hoveredSystem as SystemId) : undefined;
  const activeCategory = mapping ? CATEGORIES_DATA.find((c) => c.id === mapping.categoryId) : undefined;
  const systemLabel = hoveredSystem ? SYSTEM_NAMES[hoveredSystem] ?? hoveredSystem : null;

  return (
    <>
      {/* Floating 3D Hover Tooltip closer to the image */}
      <AnimatePresence>
        {pointerPos && systemLabel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: pointerPos.x,
              top: pointerPos.y,
              pointerEvents: 'none',
              zIndex: 50,
            }}
            className="part-hover flex items-center gap-2 shadow-xl"
          >
            {activeCategory && (
              <span
                className="w-2 h-2 rounded-full shrink-0 shadow-sm animate-pulse"
                style={{ backgroundColor: activeCategory.accentColor }}
              />
            )}
            <span className="font-semibold text-white tracking-wide">{systemLabel}</span>
            <span className="text-[10px] text-slate-300 font-mono opacity-80">· Click to inspect</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

