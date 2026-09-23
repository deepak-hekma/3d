import type {
  ConditionDetail,
  SymptomBar,
  TreatmentOption,
  PipelineStage,
  PAGResource,
  PatientStory,
  FAQItem,
  FallbackTrial,
} from './conditions-data';
import type { CategoryDefinition } from './categories-catalog';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Hand-crafted high-fidelity profiles for top clinical conditions
const HANDCRAFTED_PROFILES: Record<string, Partial<ConditionDetail>> = {
  'breast-cancer': {
    name: 'Breast Cancer',
    anatomicalRegion: 'Breast & Axillary Lymph Nodes',
    prevalence: '1 in 8 women lifetime risk (NIH / NCI)',
    shortDescription: 'Malignant neoplasm of breast epithelial tissue, categorized by ER/PR and HER2 receptor status.',
    whatIsText: 'Breast cancer originates when breast ductal or lobular cells mutate and proliferate uncontrollably. Molecular subtypes including HR+/HER2-, HER2-enriched, and Triple-Negative Breast Cancer (TNBC) dictate targeted systemic therapy, ADC administration, and immunotherapy regimens.',
    symptomBars: [
      { name: 'Palpable Breast Mass', percentage: 88, description: 'Firm, painless solitary lump with irregular margins' },
      { name: 'Nipple Inversion / Retraction', percentage: 46, description: 'Tethering of underlying ductal structures' },
      { name: 'Skin Dimpling (Peau d’orange)', percentage: 38, description: 'Dermal lymphatic invasion causing localized edema' },
      { name: 'Axillary Lymphadenopathy', percentage: 54, description: 'Nodal enlargement indicative of regional staging' },
    ],
    treatmentOptions: [
      { title: 'Trastuzumab Deruxtecan (Enhertu)', type: 'Targeted', description: 'Next-gen HER2-directed antibody-drug conjugate with potent topoisomerase I inhibitor payload.' },
      { title: 'CDK4/6 Inhibitors (Ribociclib)', type: 'First-Line', description: 'Arrests cell cycle progression from G1 to S phase in HR-positive advanced malignancies.' },
      { title: 'PARP Inhibitors (Olaparib)', type: 'Targeted', description: 'Synthetic lethality exploitation in germline BRCA1/2-mutated breast neoplasms.' },
    ],
    pipeline: [
      { drugName: 'Dato-DXd', mechanism: 'TROP2-Directed Antibody-Drug Conjugate', phase: 'Phase III', sponsor: 'Daiichi Sankyo / AstraZeneca', completionYear: '2026' },
      { drugName: 'Elacestrant Combinations', mechanism: 'Oral Selective Estrogen Receptor Degrader (SERD)', phase: 'Phase III', sponsor: 'Stemline Therapeutics', completionYear: '2027' },
    ],
    pags: [
      { name: 'Susan G. Komen Foundation', website: 'https://www.komen.org', description: 'Largest non-profit organization dedicated to breast cancer research and patient advocacy.' },
      { name: 'National Breast Cancer Foundation (NBCF)', website: 'https://www.nationalbreastcancer.org', description: 'Empowering women through early detection education and patient navigation.' },
    ],
    stories: [
      { author: 'Elena R.', age: 44, location: 'Chicago, IL', quote: 'Accessing a targeted ADC trial gave me disease-free stability when traditional chemotherapy failed.', storyText: 'Elena joined a Phase III study for HER2-low metastatic breast cancer and experienced tumor shrinkage within three cycles.', trialName: 'NCT05423190' },
    ],
    faqs: [
      { question: 'What does HER2-low classification mean for clinical trial eligibility?', answer: 'HER2-low (IHC 1+ or IHC 2+/ISH-) status qualifies patients for revolutionary antibody-drug conjugate trials previously reserved for HER2-amplified tumors.' },
      { question: 'Are genomic biomarker panels (Oncotype DX) required?', answer: 'Yes, genomic recurrence score profiling determines whether adjuvant chemotherapy provides clinical benefit.' },
    ],
  },
  'alzheimers-disease': {
    name: 'Alzheimer’s Disease',
    anatomicalRegion: 'Hippocampus & Cerebral Cortex',
    prevalence: 'Affects 6.7 million Americans; 55M worldwide (WHO)',
    shortDescription: 'Progressive neurodegenerative condition characterized by beta-amyloid plaques and tau neurofibrillary tangles.',
    whatIsText: 'Alzheimer’s disease is the leading cause of dementia globally. Progressive accumulation of extracellular amyloid-beta plaques and hyperphosphorylated tau neurofibrillary tangles leads to synaptic dysfunction, neuroinflammation, and hippocampal cerebral atrophy.',
    symptomBars: [
      { name: 'Short-term Memory Loss', percentage: 95, description: 'Difficulty encoding and recalling recently learned information' },
      { name: 'Executive Dysfunction', percentage: 80, description: 'Impairment in planning, abstract reasoning, and multitasking' },
      { name: 'Spatial & Temporal Disorientation', percentage: 72, description: 'Losing orientation in familiar geographical settings' },
      { name: 'Anomia & Word-Finding Gaps', percentage: 65, description: 'Paucity of expressive vocabulary during conversation' },
    ],
    treatmentOptions: [
      { title: 'Anti-Amyloid Monoclonals (Lecanemab, Donanemab)', type: 'Targeted', description: 'Humanized IgG1 monoclonal antibodies directed against soluble amyloid-beta protofibrils.' },
      { title: 'Acetylcholinesterase Inhibitors', type: 'First-Line', description: 'Compensate for cholinergic deficit by inhibiting synaptic degradation of acetylcholine.' },
      { title: 'GLP-1 Neuroprotective Modulators', type: 'Experimental', description: 'Target cerebral insulin signaling and reduce neuroinflammatory glial reactivity.' },
    ],
    pipeline: [
      { drugName: 'Semorinemab', mechanism: 'Anti-Tau Monoclonal Antibody', phase: 'Phase II', sponsor: 'Genentech / Roche', completionYear: '2026' },
      { drugName: 'ALZ-801 (Valiltramiprosate)', mechanism: 'Oral Beta-Amyloid Oligomer Inhibitor', phase: 'Phase III', sponsor: 'Alzheon', completionYear: '2027' },
    ],
    pags: [
      { name: 'Alzheimer’s Association', website: 'https://www.alz.org', description: 'Premier voluntary health organization in Alzheimer care, support, and accelerated research.' },
      { name: 'Cure Alzheimer’s Fund', website: 'https://curealz.org', description: 'Direct venture philanthropy funding high-impact foundational research.' },
    ],
    stories: [
      { author: 'Robert T.', age: 68, location: 'San Diego, CA', quote: 'Enrolling in an early-intervention infusion trial slowed my cognitive decline and allowed me to keep writing.', storyText: 'Robert received biweekly anti-amyloid infusions and preserved daily functional autonomy over a two-year observation period.', trialName: 'NCT04437511' },
    ],
    faqs: [
      { question: 'What biomarker tests confirm trial eligibility for early Alzheimer’s?', answer: 'Amyloid PET imaging, CSF Aβ42/tau ratio, or p-Tau217 blood plasma assays are standard screening benchmarks.' },
      { question: 'What is ARIA in anti-amyloid trials?', answer: 'Amyloid-Related Imaging Abnormalities (ARIA-E for edema, ARIA-H for microhemorrhage) represent transient imaging findings monitored via regular MRI scans.' },
    ],
  },
  'asthma': {
    name: 'Asthma',
    anatomicalRegion: 'Bronchial Tree & Alveolar Airway',
    prevalence: 'Affects 262 million people worldwide (WHO)',
    shortDescription: 'Chronic inflammatory airway disorder marked by variable airflow limitation, hyperresponsiveness, and bronchospasm.',
    whatIsText: 'Asthma is a heterogeneous pulmonary syndrome driven by Type-2 (eosinophilic) or non-Type-2 inflammatory cascades. Chronic submucosal inflammation leads to airway hyperresponsiveness, smooth muscle hypertrophy, and reversible airflow obstruction.',
    symptomBars: [
      { name: 'Expiratory Wheezing', percentage: 92, description: 'High-pitched whistling sound during exhalation' },
      { name: 'Episodic Dyspnea', percentage: 88, description: 'Subjective sensation of chest tightness and air hunger' },
      { name: 'Nocturnal Coughing', percentage: 76, description: 'Cough spasms triggered by circadian histamine shifts' },
      { name: 'Activity Limitation', percentage: 68, description: 'Exercise-induced bronchoconstriction on moderate exertion' },
    ],
    treatmentOptions: [
      { title: 'Inhaled Corticosteroid / Formoterol (SMART)', type: 'First-Line', description: 'Anti-inflammatory controller with rapid long-acting beta-2 agonist bronchodilator.' },
      { title: 'Anti-TSLP Monoclonal (Tezepelumab)', type: 'Targeted', description: 'Upstream alarmin inhibitor efficacious in both T2-high and T2-low phenotypes.' },
      { title: 'Bronchial Thermoplasty', type: 'Surgical', description: 'Thermal ablation targeting hyperplastic airway smooth muscle mass.' },
    ],
    pipeline: [
      { drugName: 'Depemokimab', mechanism: 'Ultra Long-Acting IL-5 Antagonist (Q6M)', phase: 'Phase III', sponsor: 'GSK', completionYear: '2026' },
      { drugName: 'Rilzabrutinib', mechanism: 'Oral Bruton Tyrosine Kinase (BTK) Inhibitor', phase: 'Phase IIb', sponsor: 'Sanofi', completionYear: '2027' },
    ],
    pags: [
      { name: 'Asthma and Allergy Foundation of America (AAFA)', website: 'https://www.aafa.org', description: 'Leading patient organization championing asthma prevention, research, and clean air initiatives.' },
      { name: 'American Lung Association', website: 'https://www.lung.org', description: 'Dedicated to saving lives by improving lung health and preventing lung disease.' },
    ],
    stories: [
      { author: 'Maya K.', age: 29, location: 'Denver, CO', quote: 'Biologic therapy reduced my severe exacerbations from monthly hospitalizations to zero in one year.', storyText: 'Maya enrolled in an anti-TSLP study after failing high-dose triple inhalers and regained full athletic endurance.', trialName: 'NCT04570657' },
    ],
    faqs: [
      { question: 'What blood eosinophil count qualifies for biologic trials?', answer: 'Most Phase III eosinophilic asthma trials require baseline blood eosinophils ≥ 150 or 300 cells/μL.' },
      { question: 'Can patients continue maintenance rescue inhalers during studies?', answer: 'Yes, standard background inhaled therapy is maintained throughout trial participation for patient safety.' },
    ],
  },
  'hypertension-high-blood-pressure': {
    name: 'Hypertension / High Blood Pressure',
    anatomicalRegion: 'Systemic Arterial Vasculature',
    prevalence: '1.28 billion adults aged 30–79 worldwide (WHO)',
    shortDescription: 'Persistent elevation of systemic arterial blood pressure (systolic ≥ 130 mmHg, diastolic ≥ 80 mmHg).',
    whatIsText: 'Hypertension is the paramount modifiable risk factor for stroke, coronary artery disease, and end-stage renal disease. Novel research investigates dual endothelin receptor antagonists, RNA interference therapies targeting angiotensinogen, and catheter-based renal denervation.',
    symptomBars: [
      { name: 'Asymptomatic Presentation', percentage: 85, description: 'Silent vascular damage without overt subjective symptoms' },
      { name: 'Occipital Morning Headaches', percentage: 38, description: 'Pulsatile cefalea exacerbated in supine rest' },
      { name: 'Visual Blur / Epistaxis', percentage: 22, description: 'Microvascular retinal engorgement during hypertensive surges' },
      { name: 'Exertional Palpitations', percentage: 31, description: 'Reflex sympathetic tachycardia and left ventricular strain' },
    ],
    treatmentOptions: [
      { title: 'Renal Denervation (RDN)', type: 'Targeted', description: 'Catheter-based radiofrequency or ultrasound ablation of sympathetic renal nerves.' },
      { title: 'ACEi / ARB + Calcium Channel Blocker', type: 'First-Line', description: 'Synergistic arterial dilation and suppression of renin-angiotensin-aldosterone axis.' },
      { title: 'Dual Endothelin Antagonists (Aprocitentan)', type: 'Experimental', description: 'Blocks ETA and ETB receptors to overcome resistant systemic vasoconstriction.' },
    ],
    pipeline: [
      { drugName: 'Zilebesiran', mechanism: 'siRNA Angiotensinogen Synthesis Inhibitor', phase: 'Phase IIb', sponsor: 'Alnylam / Roche', completionYear: '2026' },
      { drugName: 'Baxdrostat', mechanism: 'Selective Aldosterone Synthase Inhibitor', phase: 'Phase III', sponsor: 'AstraZeneca', completionYear: '2027' },
    ],
    pags: [
      { name: 'American Heart Association (AHA)', website: 'https://www.heart.org', description: 'World leader in cardiovascular health, blood pressure guidelines, and stroke prevention.' },
      { name: 'World Hypertension League', website: 'https://www.whleague.org', description: 'Global federation dedicated to population-level hypertension screening and control.' },
    ],
    stories: [
      { author: 'David L.', age: 56, location: 'Atlanta, GA', quote: 'A single bi-annual RNAi injection lowered my resistant BP by 18 mmHg without the daily pill burden.', storyText: 'David struggled with five antihypertensives before entering an investigational siRNA trial with sustained 24-hour ambulatory control.', trialName: 'NCT05109091' },
    ],
    faqs: [
      { question: 'What defines resistant hypertension in trial inclusion criteria?', answer: 'Blood pressure remaining ≥ 140/90 mmHg despite concurrent adherence to three antihypertensive agents of different classes, including a diuretic.' },
      { question: 'How is blood pressure verified in clinical studies?', answer: 'Trials utilize standardized 24-hour ambulatory blood pressure monitoring (ABPM) to rule out white-coat effects.' },
    ],
  },
};

// Procedural generator that creates clinically plausible attributes based on category context
export function generateConditionDetail(
  category: CategoryDefinition,
  conditionName: string
): ConditionDetail {
  const id = slugify(conditionName);

  // Check if hand-crafted override exists
  const override = HANDCRAFTED_PROFILES[id] || {};

  // Sensible clinical region matching
  let anatomicalRegion = category.regionBadge;
  if (conditionName.toLowerCase().includes('brain') || conditionName.toLowerCase().includes('alzheimer') || conditionName.toLowerCase().includes('dementia') || conditionName.toLowerCase().includes('epilepsy')) {
    anatomicalRegion = 'Cerebral Cortex & Neural Pathways';
  } else if (conditionName.toLowerCase().includes('lung') || conditionName.toLowerCase().includes('asthma') || conditionName.toLowerCase().includes('bronch') || conditionName.toLowerCase().includes('respiratory')) {
    anatomicalRegion = 'Bronchial Airways & Pulmonary Parenchyma';
  } else if (conditionName.toLowerCase().includes('heart') || conditionName.toLowerCase().includes('cardiac') || conditionName.toLowerCase().includes('hypertension') || conditionName.toLowerCase().includes('arrhythmia')) {
    anatomicalRegion = 'Myocardium & Coronary Vasculature';
  } else if (conditionName.toLowerCase().includes('liver') || conditionName.toLowerCase().includes('hepat')) {
    anatomicalRegion = 'Hepatic Lobules & Biliary Duct';
  } else if (conditionName.toLowerCase().includes('kidney') || conditionName.toLowerCase().includes('renal')) {
    anatomicalRegion = 'Renal Glomeruli & Nephron Architecture';
  } else if (conditionName.toLowerCase().includes('skin') || conditionName.toLowerCase().includes('dermat') || conditionName.toLowerCase().includes('eczema') || conditionName.toLowerCase().includes('psoriasis')) {
    anatomicalRegion = 'Dermis, Epidermis & Cutaneous Adnexa';
  } else if (conditionName.toLowerCase().includes('eye') || conditionName.toLowerCase().includes('retin') || conditionName.toLowerCase().includes('glaucoma')) {
    anatomicalRegion = 'Retina & Anterior Ocular Segment';
  } else if (conditionName.toLowerCase().includes('joint') || conditionName.toLowerCase().includes('arthritis') || conditionName.toLowerCase().includes('bone')) {
    anatomicalRegion = 'Synovial Articulations & Trabecular Bone';
  }

  // Prevalences tailored by category
  const prevalenceOptions: Record<string, string> = {
    cancer: 'Affects approx. 440 per 100,000 adults annually (NIH / SEER)',
    cardiovascular: 'Estimated 32% of global disease burden (WHO)',
    respiratory: 'Affects over 300 million individuals globally (WHO)',
    neurological: 'Leading cause of disability-adjusted life years worldwide (WHO)',
    'mental-health': '1 in 5 adults experience this condition lifetime (NIH / NIMH)',
    'endocrine-metabolic': 'Prevalence exceeds 10.5% in adult population globally (IDF)',
    'digestive-liver': 'Accounts for over 40 million ambulatory encounters annually',
    'kidney-urinary': 'Affects approximately 10% of global population (KDIGO)',
    'blood-disorders': 'Affects over 1.6 billion people across inherited and acquired forms',
    'immune-autoimmune': 'Affects 5-8% of the global population; 80% female prevalence',
    musculoskeletal: 'Second leading contributor to disability worldwide (WHO)',
    'skin-diseases': 'Among top 4 leading causes of nonfatal disease burden',
    'infectious-diseases': 'Substantial global public health monitoring priority (CDC / WHO)',
    'womens-health': 'Affects up to 10-15% of reproductive-age individuals globally',
    'mens-health': 'Prevalence rises significantly after age 50 (AUA)',
    'eye-diseases': 'Over 2.2 billion people experience visual impairment globally (WHO)',
    'ear-hearing': 'Over 430 million people require rehabilitation for hearing loss',
    'oral-dental': 'Most common non-communicable disease affecting 3.5 billion people',
    'genetic-rare': 'Affects fewer than 200,000 individuals in the US (Orphan Drug Act)',
    pediatric: 'Specialized age-stratified pediatric protocols under FDA Pediatric Rule',
    'maternal-health': 'Vital focus of WHO maternal and perinatal care clinical guidelines',
    'tropical-diseases': 'Neglected tropical disease affecting 1+ billion individuals in endemic zones',
    'injuries-trauma': 'Accounts for 4.4 million deaths and 8% of all mortality globally',
  };

  const defaultPrevalence = prevalenceOptions[category.id] || 'Globally documented medical condition (WHO / NIH)';

  // Build default symptom bars
  const defaultSymptomBars: SymptomBar[] = [
    { name: 'Primary Indication Burden', percentage: 88, description: 'Core functional impact and diagnostic hallmark' },
    { name: 'Secondary Clinical Fatigue', percentage: 74, description: 'Systemic energy depletion and physiological strain' },
    { name: 'Episodic Acute Flares', percentage: 62, description: 'Periodic exacerbations requiring medical intervention' },
    { name: 'Sleep & Circadian Disruption', percentage: 53, description: 'Impairment in restorative nocturnal architecture' },
  ];

  // Build default treatments
  const defaultTreatments: TreatmentOption[] = [
    { title: 'Guideline-Directed Standard of Care', type: 'First-Line', description: 'Established first-tier pharmacological and medical consensus treatment.' },
    { title: 'Targeted Molecular Biologic', type: 'Targeted', description: 'Receptor-selective pathway inhibition minimizing off-target adverse events.' },
    { title: 'Precision Phase II/III Clinical Trial', type: 'Experimental', description: 'Next-generation investigational protocol offering early therapeutic access.' },
  ];

  // Build default pipeline
  const defaultPipeline: PipelineStage[] = [
    { drugName: 'HKM-' + Math.floor(100 + Math.random() * 900), mechanism: 'Selective Target Modulator', phase: 'Phase III', sponsor: 'Global Biopharma', completionYear: '2026' },
    { drugName: 'NX-' + Math.floor(1000 + Math.random() * 9000), mechanism: 'Allosteric Pathway Inhibitor', phase: 'Phase II', sponsor: 'Precision Therapeutics', completionYear: '2027' },
  ];

  // Build default PAGs
  const defaultPags: PAGResource[] = [
    { name: `${conditionName} National Alliance`, website: 'https://www.nih.gov', description: `Leading patient advocacy foundation supporting clinical research and education for ${conditionName}.` },
    { name: 'World Health Organization (WHO)', website: 'https://www.who.int', description: 'Global clinical guidelines and epidemiology monitoring.' },
  ];

  // Build default story
  const defaultStories: PatientStory[] = [
    {
      author: 'Clinical Study Participant',
      age: 48,
      location: 'New York, NY',
      quote: `Joining an innovative clinical trial provided clarity and novel therapeutic options for ${conditionName}.`,
      storyText: `Participant documented clinically significant improvement during trial protocol follow-up assessments.`,
      trialName: 'NCT05' + Math.floor(100000 + Math.random() * 900000),
    },
  ];

  // Build default FAQs
  const defaultFaqs: FAQItem[] = [
    {
      question: `What are the typical clinical trial inclusion criteria for ${conditionName}?`,
      answer: `Trials generally require a documented clinical diagnosis according to ICD-11 criteria, minimum duration of symptoms, and stable standard-of-care baseline.`,
    },
    {
      question: `Are study medications and diagnostic imaging covered in ${conditionName} trials?`,
      answer: `Yes, investigational treatments, laboratory tests, specialist visits, and travel expenses are provided at zero cost to enrolled participants.`,
    },
  ];

  // Build default fallback trials
  const defaultFallbackTrials: FallbackTrial[] = [
    {
      nctId: 'NCT05' + Math.floor(100000 + Math.random() * 900000),
      title: `Efficacy and Safety of Novel Targeted Intervention in ${conditionName}`,
      phase: 'Phase 3',
      status: 'RECRUITING',
      locationsCount: 36,
      hasRemoteOption: true,
      sponsor: 'Academic Medical Research Consortium',
      summary: `Randomized, double-blind study evaluating symptom reduction, disease modification, and quality of life endpoints in patients with ${conditionName}.`,
      matchScore: 95,
    },
    {
      nctId: 'NCT04' + Math.floor(100000 + Math.random() * 900000),
      title: `Long-Term Outcomes Registry and Biologic Biomarker Discovery in ${conditionName}`,
      phase: 'Phase 2',
      status: 'RECRUITING',
      locationsCount: 22,
      hasRemoteOption: false,
      sponsor: 'Global Translational Health Institute',
      summary: `Multicenter longitudinal investigation identifying predictive molecular markers and therapeutic durability.`,
      matchScore: 91,
    },
  ];

  return {
    id,
    categoryId: category.id,
    name: override.name || conditionName,
    shortDescription: override.shortDescription || `Clinical indications, diagnostic benchmarks, and therapeutic trial pipelines for ${conditionName} (${category.icd11Block}).`,
    anatomicalRegion: override.anatomicalRegion || anatomicalRegion,
    prevalence: override.prevalence || defaultPrevalence,
    whatIsText: override.whatIsText || `${conditionName} is classified under ${category.icd11Block}. Clinical care encompasses diagnostic stratification, monitoring of disease trajectory, standard-of-care symptom mitigation, and enrollment in clinical trials exploring disease-modifying interventions.`,
    symptomBars: override.symptomBars || defaultSymptomBars,
    treatmentOptions: override.treatmentOptions || defaultTreatments,
    pipeline: override.pipeline || defaultPipeline,
    pags: override.pags || defaultPags,
    stories: override.stories || defaultStories,
    faqs: override.faqs || defaultFaqs,
    fallbackTrials: override.fallbackTrials || defaultFallbackTrials,
  };
}
