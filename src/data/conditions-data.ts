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
  name: string;
  subtitle: string;
  regionId: 'cranium' | 'thorax' | 'thorax-left' | 'thorax-right' | 'abdomen' | 'abdomen-lower' | 'skeleton';
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

export const CATEGORIES_DATA: CategoryData[] = [
  {
    id: 'neurology',
    name: 'Neurology',
    subtitle: 'Brain, Spine & Central Nervous System',
    regionId: 'cranium',
    regionBadge: 'Cranium & Spine',
    iconName: 'Brain',
    accentColor: '#7948A5',
    cameraPosition: [0.15, 1.58, 1.55],
    cameraTarget: [0, 1.52, 0],
    description: 'Advanced neurological disorders including refractory epilepsy, early-onset Alzheimer’s disease, Parkinson’s tremors, and neuromuscular conditions.',
    conditionsCount: 3,
    activeTrialsCount: 142,
    hotspot: { x: 50, y: 11, label: 'Cranial & Brain Structure' },
    videoSrc: '/videos/head_brain.mp4',
    conditions: [
      {
        id: 'epilepsy',
        categoryId: 'neurology',
        name: 'Refractory Epilepsy & Seizure Disorders',
        shortDescription: 'Drug-resistant seizures affecting cerebral neuronal activity.',
        anatomicalRegion: 'Brain / Temporal Lobe',
        prevalence: '1 in 26 people lifetime risk',
        whatIsText: 'Refractory epilepsy occurs when seizure activity persists despite treatment with two or more appropriately chosen and tolerated anti-seizure medications. Novel clinical trials explore neurostimulation, gene modification, and precision channel modulators.',
        symptomBars: [
          { name: 'Unprovoked Seizures', percentage: 95, description: 'Focal or generalized electrical disruptions' },
          { name: 'Post-Ictal Fatigue', percentage: 82, description: 'Profound exhaustion following seizure activity' },
          { name: 'Cognitive Fog', percentage: 68, description: 'Memory gaps and slowed processing speed' },
          { name: 'Motor Tremors', percentage: 45, description: 'Involuntary muscle contractions during focal episodes' }
        ],
        treatmentOptions: [
          { title: 'Sodium Channel Blockers', type: 'First-Line', description: 'Stabilize neuronal membranes by slowing recovery of sodium channels.' },
          { title: 'Vagus Nerve Stimulation (VNS)', type: 'Surgical', description: 'Implanted device delivering electrical impulses to the brain.' },
          { title: 'KCNQ Channel Activators', type: 'Experimental', description: 'Next-gen potassium channel opening targeted at seizure focus.' }
        ],
        pipeline: [
          { drugName: 'XEN1101', mechanism: 'Kv7 Potassium Channel Opener', phase: 'Phase III', sponsor: 'Xenon Pharmaceuticals', completionYear: '2026' },
          { drugName: 'EPX-100', mechanism: 'Serotonergic Agonist', phase: 'Phase II', sponsor: 'EpiX Therapeutics', completionYear: '2027' }
        ],
        pags: [
          { name: 'Epilepsy Foundation', website: 'https://www.epilepsy.com', description: 'Leading patient advocacy and support community for individuals living with epilepsy.' },
          { name: 'CURE Epilepsy', website: 'https://www.cureepilepsy.org', description: 'Funding non-profit research dedicated to finding a cure for epilepsy.' }
        ],
        stories: [
          { author: 'Marcus V.', age: 34, location: 'Boston, MA', quote: 'Finding a recruiting trial gave me hope when standard medications stopped working.', storyText: 'Marcus participated in a Phase II trial for a targeted channel modulator and reduced seizure frequency by 70%.', trialName: 'NCT05243160' }
        ],
        faqs: [
          { question: 'What qualifies as refractory epilepsy?', answer: 'Failure of two tolerated and appropriately chosen antiepileptic drug schedules to achieve sustained seizure freedom.' },
          { question: 'Are trial travel expenses covered?', answer: 'Most Phase II/III sponsored trials reimburse patient travel, lodging, and meals.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT05243160', title: 'Phase 3 Study of XEN1101 in Focal Refractory Epilepsy', phase: 'Phase 3', status: 'RECRUITING', locationsCount: 42, hasRemoteOption: true, sponsor: 'Xenon Pharma', summary: 'Evaluating safety and efficacy of oral XEN1101 in adults with focal onset seizures.', matchScore: 96 }
        ]
      },
      {
        id: 'alzheimers',
        categoryId: 'neurology',
        name: 'Alzheimer’s & Mild Cognitive Impairment',
        shortDescription: 'Neurodegenerative amyloid and tau accumulation leading to memory loss.',
        anatomicalRegion: 'Hippocampus & Cerebral Cortex',
        prevalence: '6.7 million Americans over 65',
        whatIsText: 'Alzheimer’s disease is a progressive neurodegenerative disease characterized by extracellular beta-amyloid plaques and intracellular neurofibrillary tau tangles, causing synaptic loss and memory decline.',
        symptomBars: [
          { name: 'Short-term Memory Loss', percentage: 98, description: 'Difficulty retaining recent conversations and events' },
          { name: 'Spatial Disorientation', percentage: 75, description: 'Getting lost in familiar environments' },
          { name: 'Executive Function Decline', percentage: 80, description: 'Challenges planning, budgeting, or following multi-step tasks' }
        ],
        treatmentOptions: [
          { title: 'Anti-Amyloid Monoclonal Antibodies', type: 'Targeted', description: 'Clear protofibrillar amyloid plaques from brain tissue.' },
          { title: 'Cholinesterase Inhibitors', type: 'First-Line', description: 'Sustain acetylcholine levels to support neurotransmission.' }
        ],
        pipeline: [
          { drugName: 'Remternetug', mechanism: 'N3pG-Amyloid Clearance', phase: 'Phase III', sponsor: 'Eli Lilly', completionYear: '2026' }
        ],
        pags: [
          { name: 'Alzheimer’s Association', website: 'https://www.alz.org', description: 'Global voluntary health organization dedicated to Alzheimer’s care and research.' }
        ],
        stories: [
          { author: 'Sarah L.', age: 62, location: 'Dubai, UAE', quote: 'Enrolling early in a monoclonal trial kept my mind sharp for my grandchildren.', storyText: 'Sarah joined a trial focusing on early amyloid clearance with monthly infusions.', trialName: 'NCT05508308' }
        ],
        faqs: [
          { question: 'How early should someone consider a trial?', answer: 'Trials now target Mild Cognitive Impairment (MCI) where intervention yields maximum neural preservation.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT05508308', title: 'TRAILBLAZER-ALZ 3: Prevention of Symptomatic Alzheimer’s', phase: 'Phase 3', status: 'RECRUITING', locationsCount: 110, hasRemoteOption: false, sponsor: 'Eli Lilly & Co', summary: 'Assessing whether Remternetug delays symptom onset in asymptomatic amyloid-positive individuals.', matchScore: 94 }
        ]
      },
      {
        id: 'parkinsons',
        categoryId: 'neurology',
        name: 'Parkinson’s Disease & Movement Disorders',
        shortDescription: 'Loss of dopaminergic neurons in the substantia nigra causing motor symptoms.',
        anatomicalRegion: 'Substantia Nigra & Basal Ganglia',
        prevalence: '10 million worldwide',
        whatIsText: 'Parkinson’s is a progressive neurodegenerative movement disorder driven by loss of dopamine-producing brain cells. Clinical research investigates disease-modifying alpha-synuclein clearers and cell therapies.',
        symptomBars: [
          { name: 'Resting Tremors', percentage: 90, description: 'Rhythmic shaking starting in hand or fingers' },
          { name: 'Bradykinesia', percentage: 94, description: 'Slowness of voluntary movement' },
          { name: 'Muscle Rigidity', percentage: 85, description: 'Stiffness preventing fluid joint movement' }
        ],
        treatmentOptions: [
          { title: 'Levodopa / Carbidopa', type: 'First-Line', description: 'Dopamine precursor that crosses the blood-brain barrier.' },
          { title: 'Deep Brain Stimulation (DBS)', type: 'Surgical', description: 'Targeted subthalamic nucleus stimulation to control tremors.' }
        ],
        pipeline: [
          { drugName: 'Prasinezumab', mechanism: 'Anti-Alpha-Synuclein mAb', phase: 'Phase IIb', sponsor: 'Roche / Prothena', completionYear: '2026' }
        ],
        pags: [
          { name: 'Michael J. Fox Foundation', website: 'https://www.michaeljfox.org', description: 'Dedicated to finding a cure for Parkinson’s disease through funded research.' }
        ],
        stories: [
          { author: 'David K.', age: 58, location: 'Chicago, IL', quote: 'DBS trial gave me back my hands so I could write again.', storyText: 'David underwent adaptive DBS in an NIH-sponsored clinical trial.', trialName: 'NCT04777331' }
        ],
        faqs: [
          { question: 'Is Parkinson’s trial participation open to newly diagnosed patients?', answer: 'Yes, disease-modifying trials often seek drug-naive patients within 2 years of diagnosis.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT04777331', title: 'PADOVA: Study of Prasinezumab in Early Parkinson’s Disease', phase: 'Phase 2', status: 'RECRUITING', locationsCount: 65, hasRemoteOption: true, sponsor: 'Hoffmann-La Roche', summary: 'Evaluating motor progression reduction in early-stage Parkinson patients.', matchScore: 92 }
        ]
      }
    ]
  },
  {
    id: 'oncology',
    name: 'Oncology',
    subtitle: 'Precision Cancer Care & Immunotherapy',
    regionId: 'thorax',
    regionBadge: 'Thorax & Organs',
    iconName: 'Activity',
    accentColor: '#ED248F',
    cameraPosition: [0.15, 1.22, 1.7],
    cameraTarget: [0, 1.18, 0],
    description: 'Cutting-edge oncological advancements including CAR-T therapies, antibody-drug conjugates (ADCs), and bispecific antibodies across solid and hematologic tumors.',
    conditionsCount: 3,
    activeTrialsCount: 310,
    hotspot: { x: 50, y: 38, label: 'Thorax & Cellular Systems' },
    videoSrc: '/videos/abdomen_lymphatic.mp4',
    conditions: [
      {
        id: 'breast-cancer',
        categoryId: 'oncology',
        name: 'HER2+ / Triple-Negative Breast Cancer',
        shortDescription: 'Malignant neoplasms of breast tissue requiring biomarker-targeted therapy.',
        anatomicalRegion: 'Thoracic Mammary Gland & Axillary Nodes',
        prevalence: '1 in 8 women lifetime risk',
        whatIsText: 'Breast cancer clinical trials explore novel Antibody-Drug Conjugates (ADCs) that deliver cytotoxic payloads directly into cancer cells while sparing healthy tissue.',
        symptomBars: [
          { name: 'Palpable Tissue Masses', percentage: 92, description: 'Painless firm nodules in breast or axillary region' },
          { name: 'Lymph Node Enlargement', percentage: 70, description: 'Swelling under arm or near collarbone' },
          { name: 'Systemic Fatigue', percentage: 65, description: 'Treatment or disease-induced exhaustion' }
        ],
        treatmentOptions: [
          { title: 'HER2 Targeted ADCs (Enhertu)', type: 'Targeted', description: 'Trastuzumab deruxtecan binding HER2 receptors to release topoisomerase inhibitor.' },
          { title: 'Immune Checkpoint Blockade', type: 'Targeted', description: 'PD-1/PD-L1 inhibitors restoring T-cell anti-tumor activity.' }
        ],
        pipeline: [
          { drugName: 'Datopotamab Deruxtecan (Dato-DXd)', mechanism: 'TROP2-directed ADC', phase: 'Phase III', sponsor: 'AstraZeneca / Daiichi', completionYear: '2026' }
        ],
        pags: [
          { name: 'Susan G. Komen', website: 'https://www.komen.org', description: 'World’s largest breast cancer organization addressing research and patient care.' }
        ],
        stories: [
          { author: 'Elena R.', age: 47, location: 'Houston, TX', quote: 'An ADC trial cleared my triple-negative metastasis after chemotherapy failed.', storyText: 'Elena joined a TROP2 targeted trial with complete radiologic response.', trialName: 'NCT05104866' }
        ],
        faqs: [
          { question: 'What biomarker testing is required for oncology trials?', answer: 'Trials typically test for HER2 expression, ER/PR hormone receptors, and PD-L1 status via tumor biopsy.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT05104866', title: 'TROPION-Breast01: Study of Dato-DXd in HR+/HER2- Low Breast Cancer', phase: 'Phase 3', status: 'RECRUITING', locationsCount: 140, hasRemoteOption: false, sponsor: 'AstraZeneca', summary: 'Comparing Dato-DXd vs physician choice chemotherapy in advanced breast cancer.', matchScore: 97 }
        ]
      },
      {
        id: 'lung-cancer',
        categoryId: 'oncology',
        name: 'NSCLC & Small Cell Lung Cancer',
        shortDescription: 'Pulmonary carcinomas driven by EGFR, KRAS, or ALK mutations.',
        anatomicalRegion: 'Lungs & Mediastinum',
        prevalence: '230,000 cases US annually',
        whatIsText: 'Non-Small Cell Lung Cancer (NSCLC) accounts for 85% of lung malignancies. Precision targeted therapies for driver mutations like EGFR Exon 20 insertion and KRAS G12C represent major trial breakthroughs.',
        symptomBars: [
          { name: 'Persistent Cough', percentage: 88, description: 'Unresolved cough lasting longer than 3 weeks' },
          { name: 'Shortness of Breath', percentage: 76, description: 'Dyspnea during routine daily activities' },
          { name: 'Chest Pain', percentage: 62, description: 'Sharp discomfort aggravated by deep breathing' }
        ],
        treatmentOptions: [
          { title: 'EGFR Tyrosine Kinase Inhibitors', type: 'Targeted', description: 'Oral small molecules targeted at mutated EGFR receptors.' },
          { title: 'Neoadjuvant Immunotherapy', type: 'First-Line', description: 'Pre-surgical infusion of PD-1 inhibitors to shrink primary lung tumors.' }
        ],
        pipeline: [
          { drugName: 'Amivantamab + Lazertinib', mechanism: 'EGFR-MET Bispecific Antibody', phase: 'Phase III', sponsor: 'Janssen', completionYear: '2026' }
        ],
        pags: [
          { name: 'LUNGevity Foundation', website: 'https://www.lungevity.org', description: 'Empowering lung cancer patients through education and trial navigation.' }
        ],
        stories: [
          { author: 'Robert T.', age: 59, location: 'Atlanta, GA', quote: 'A targeted bispecific drug shrunk my lung tumor by half in 8 weeks.', storyText: 'Robert enrolled in a first-line EGFR driver mutation clinical study.', trialName: 'NCT04487080' }
        ],
        faqs: [
          { question: 'Do liquid biopsies count for trial inclusion criteria?', answer: 'Yes, many modern lung cancer trials accept ctDNA blood tests confirming driver mutations.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT04487080', title: 'MARIPOSA: Amivantamab and Lazertinib in EGFR-Mutated NSCLC', phase: 'Phase 3', status: 'RECRUITING', locationsCount: 180, hasRemoteOption: false, sponsor: 'Janssen Research', summary: 'Phase 3 trial evaluating bispecific antibody combination therapy in first-line EGFR+ lung cancer.', matchScore: 95 }
        ]
      },
      {
        id: 'lymphoma',
        categoryId: 'oncology',
        name: 'Non-Hodgkin Lymphoma & Multiple Myeloma',
        shortDescription: 'Malignancies of lymphatic tissue and plasma cells in bone marrow.',
        anatomicalRegion: 'Lymph Nodes & Bone Marrow',
        prevalence: '80,000 cases US annually',
        whatIsText: 'Hematologic cancers respond remarkably to engineered cellular therapies (CAR-T) and bispecific T-cell engagers (BiTEs) that redirect host immune cells against CD19 or BCMA surface targets.',
        symptomBars: [
          { name: 'Painless Lymph Node Swelling', percentage: 90, description: 'Enlarged nodes in neck, armpits, or groin' },
          { name: 'Night Sweats', percentage: 72, description: 'Drenching nocturnal perspiration' },
          { name: 'Unexplained Weight Loss', percentage: 65, description: 'Loss of >10% body mass without diet changes' }
        ],
        treatmentOptions: [
          { title: 'Autologous CAR-T Therapy', type: 'Experimental', description: 'Patient T-cells genetically modified with chimeric antigen receptor.' },
          { title: 'BCMA Bispecific Antibodies', type: 'Targeted', description: 'Off-the-shelf antibodies connecting T-cells directly to plasma cancer cells.' }
        ],
        pipeline: [
          { drugName: 'Linvoseltamab', mechanism: 'BCMAxCD3 Bispecific Antibody', phase: 'Phase III', sponsor: 'Regeneron', completionYear: '2026' }
        ],
        pags: [
          { name: 'Leukemia & Lymphoma Society', website: 'https://www.lls.org', description: 'World’s largest voluntary health agency dedicated to blood cancer.' }
        ],
        stories: [
          { author: 'Claire M.', age: 53, location: 'Seattle, WA', quote: 'CAR-T put my refractory diffuse large B-cell lymphoma into complete remission.', storyText: 'Claire had failed 3 chemo lines before undergoing cell therapy in a pivotal trial.', trialName: 'NCT03761108' }
        ],
        faqs: [
          { question: 'How long is the hospital stay for CAR-T trial infusion?', answer: 'Patients are monitored in specialized centers for 7-14 days for cytokine release syndrome.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT03761108', title: 'LINKER-MM1: Study of Linvoseltamab in Relapsed Multiple Myeloma', phase: 'Phase 3', status: 'RECRUITING', locationsCount: 75, hasRemoteOption: false, sponsor: 'Regeneron Pharma', summary: 'Investigating bispecific T-cell engager in heavy pre-treated multiple myeloma.', matchScore: 93 }
        ]
      }
    ]
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    subtitle: 'Heart, Vascular & Circulatory Health',
    regionId: 'thorax-left',
    regionBadge: 'Left Thorax & Heart',
    iconName: 'Heart',
    accentColor: '#2563EB',
    cameraPosition: [0.35, 1.2, 1.45],
    cameraTarget: [0.06, 1.16, 0],
    description: 'Cardiovascular therapies addressing heart failure with preserved ejection fraction (HFpEF), resistant hypertension, and atherosclerotic plaque regression.',
    conditionsCount: 2,
    activeTrialsCount: 185,
    hotspot: { x: 52, y: 32, label: 'Cardiac & Vascular Pathways' },
    videoSrc: '/videos/chest_heart_lungs.mp4',
    conditions: [
      {
        id: 'heart-failure',
        categoryId: 'cardiology',
        name: 'Heart Failure (HFrEF / HFpEF)',
        shortDescription: 'Impaired ventricular filling or ejection fraction leading to systemic hypoperfusion.',
        anatomicalRegion: 'Myocardium & Left Ventricle',
        prevalence: '6.2 million US adults',
        whatIsText: 'Heart failure clinical trials pioneer SGLT2 inhibitors, mineralocorticoid receptor antagonists, and novel cardiac myosin activators aimed at increasing myocardial contractility without elevating intracellular calcium.',
        symptomBars: [
          { name: 'Dyspnea on Exertion', percentage: 96, description: 'Shortness of breath climbing stairs or walking short distances' },
          { name: 'Peripheral Edema', percentage: 84, description: 'Fluid accumulation in ankles, feet, and legs' },
          { name: 'Exercise Intolerance', percentage: 90, description: 'Rapid exhaustion during low-impact activity' }
        ],
        treatmentOptions: [
          { title: 'SGLT2 Inhibitors (Empagliflozin)', type: 'First-Line', description: 'Reduce ventricular preload and renal glucose reabsorption.' },
          { title: 'Cardiac Myosin Activators (Omecamtiv)', type: 'Experimental', description: 'Directly enhance cardiac sarcomere force generation.' }
        ],
        pipeline: [
          { drugName: 'Vicentra / Aficamten', mechanism: 'Cardiac Myosin Modulator', phase: 'Phase III', sponsor: 'Cytokinetics', completionYear: '2026' }
        ],
        pags: [
          { name: 'American Heart Association', website: 'https://www.heart.org', description: 'Fostering appropriate cardiac care and funding innovative research.' }
        ],
        stories: [
          { author: 'George M.', age: 67, location: 'Miami, FL', quote: 'Participating in an HFpEF trial reduced my hospital visits from monthly to zero.', storyText: 'George enrolled in a novel aldosterone synthase inhibitor study.', trialName: 'NCT04929223' }
        ],
        faqs: [
          { question: 'What ejection fraction is required for trial eligibility?', answer: 'HFrEF trials generally require EF ≤ 40%, while HFpEF trials target EF ≥ 50% with elevated NT-proBNP.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT04929223', title: 'REDWOOD-HCM: Aficamten in Symptomatic Hypertrophic Cardiomyopathy', phase: 'Phase 3', status: 'RECRUITING', locationsCount: 95, hasRemoteOption: true, sponsor: 'Cytokinetics', summary: 'Evaluating cardiac myosin inhibitor in improving exercise capacity and symptom relief.', matchScore: 95 }
        ]
      },
      {
        id: 'atrial-fibrillation',
        categoryId: 'cardiology',
        name: 'Atrial Fibrillation & Arrhythmias',
        shortDescription: 'Irregular rapidly chaotic atrial impulses increasing thromboembolism risk.',
        anatomicalRegion: 'Atrial Myocardium & Pulmonary Vein Ostia',
        prevalence: '5 million US adults',
        whatIsText: 'Atrial Fibrillation (AFib) management trials focus on pulsed field ablation (PFA) devices and novel factor XIa oral anticoagulants that prevent strokes without elevating major bleeding risks.',
        symptomBars: [
          { name: 'Heart Palpitations', percentage: 92, description: 'Sensation of fluttering, racing, or skipped heartbeats' },
          { name: 'Dizziness / Lightheadedness', percentage: 68, description: 'Transient cerebral hypoperfusion during arrhythmia' },
          { name: 'Fatigue & Weakness', percentage: 78, description: 'Reduced cardiac output causing systemic weakness' }
        ],
        treatmentOptions: [
          { title: 'Pulsed Field Ablation (PFA)', type: 'Surgical', description: 'Non-thermal irreversible electroporation selective to cardiac tissue.' },
          { title: 'Factor XIa Inhibitors (Asundexian)', type: 'Experimental', description: 'Targeted thrombosis prevention without impairing hemostasis.' }
        ],
        pipeline: [
          { drugName: 'Asundexian', mechanism: 'Oral Factor XIa Inhibitor', phase: 'Phase III', sponsor: 'Bayer', completionYear: '2026' }
        ],
        pags: [
          { name: 'AFib Association', website: 'https://www.heartrhythmalliance.org', description: 'Patient-led charity providing information and support for arrhythmia sufferers.' }
        ],
        stories: [
          { author: 'Linda B.', age: 61, location: 'Dallas, TX', quote: 'Pulsed field ablation cured my persistent AFib in a 45-minute procedure.', storyText: 'Linda was treated in a catheter ablation registry trial with no thermal nerve damage.', trialName: 'NCT05647577' }
        ],
        faqs: [
          { question: 'Does AFib trial participation require stopping blood thinners?', answer: 'No, safety-first protocols transition patients under close electrophysiologist supervision.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT05647577', title: 'OCEANIC-AF: Asundexian vs Apixaban in Atrial Fibrillation Stroke Prevention', phase: 'Phase 3', status: 'RECRUITING', locationsCount: 160, hasRemoteOption: false, sponsor: 'Bayer Healthcare', summary: 'Global trial assessing bleeding risk reduction with novel Factor XIa inhibition.', matchScore: 93 }
        ]
      }
    ]
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    subtitle: 'Lungs, Airway & Pulmonary Health',
    regionId: 'thorax-right',
    regionBadge: 'Right Thorax & Airway',
    iconName: 'Wind',
    accentColor: '#06B6D4',
    cameraPosition: [-0.25, 1.2, 1.5],
    cameraTarget: [-0.04, 1.16, 0],
    description: 'Respiratory research advancing therapies for severe eosinophilic asthma, chronic obstructive pulmonary disease (COPD), and idiopathic pulmonary fibrosis (IPF).',
    conditionsCount: 2,
    activeTrialsCount: 120,
    hotspot: { x: 48, y: 28, label: 'Pulmonary & Bronchial Tract' },
    videoSrc: '/videos/chest_heart_lungs.mp4',
    conditions: [
      {
        id: 'asthma',
        categoryId: 'respiratory',
        name: 'Severe Uncontrolled Eosinophilic Asthma',
        shortDescription: 'Chronic inflammatory airway hyperresponsiveness with structural remodeling.',
        anatomicalRegion: 'Bronchial Epithelium & Smooth Muscle',
        prevalence: '25 million in US (10% severe)',
        whatIsText: 'Severe asthma trials focus on biologic therapies targeting TSLP (Thymic Stromal Lymphopoietin), IL-4/13, and IL-5 pathways to prevent life-threatening exacerbations.',
        symptomBars: [
          { name: 'Wheezing & Airway Tightness', percentage: 95, description: 'Audible high-pitched whistling on expiration' },
          { name: 'Nocturnal Exacerbation', percentage: 82, description: 'Waking up gasping for air due to bronchial constriction' },
          { name: 'Mucus Hypersecretion', percentage: 70, description: 'Thick tenaciously adherent mucus plugs' }
        ],
        treatmentOptions: [
          { title: 'Anti-TSLP Monoclonal Antibody (Tezepelumab)', type: 'Targeted', description: 'Blocks upstream alarmins triggering systemic airway inflammation.' },
          { title: 'Inhaled Triple Therapy', type: 'First-Line', description: 'ICS + LABA + LAMA combination inhaler for 24-hour bronchodilations.' }
        ],
        pipeline: [
          { drugName: 'Depemokimab', mechanism: 'Ultra-Long-Acting Anti-IL-5 mAb', phase: 'Phase III', sponsor: 'GSK', completionYear: '2026' }
        ],
        pags: [
          { name: 'Asthma and Allergy Foundation of America', website: 'https://www.aafa.org', description: 'Dedicated to improving the quality of life for people with asthma and allergies.' }
        ],
        stories: [
          { author: 'Tariq A.', age: 29, location: 'Abu Dhabi, UAE', quote: 'A twice-yearly biologic injection stopped my emergency room visits completely.', storyText: 'Tariq joined an ultra-long-acting IL-5 clinical trial in Abu Dhabi.', trialName: 'NCT04719832' }
        ],
        faqs: [
          { question: 'What blood eosinophil count is needed for biologic trials?', answer: 'Most eosinophilic trials require blood eosinophils ≥ 150 or 300 cells/µL.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT04719832', title: 'SWIFT-1: Depemokimab in Severe Asthma With Eosinophilic Phenotype', phase: 'Phase 3', status: 'RECRUITING', locationsCount: 88, hasRemoteOption: true, sponsor: 'GlaxoSmithKline', summary: 'Evaluating 6-month dosing interval biologic vs placebo in asthma exacerbation rate.', matchScore: 96 }
        ]
      },
      {
        id: 'copd',
        categoryId: 'respiratory',
        name: 'COPD & Chronic Bronchitis',
        shortDescription: 'Progressive airflow limitation caused by emphysematous alveolar destruction.',
        anatomicalRegion: 'Alveolar Sacs & Terminal Bronchioles',
        prevalence: '16 million US adults',
        whatIsText: 'COPD trials are undergoing a revolution with the introduction of targeted biologics (Dupilumab) that reduce exacerbations by 30%+ in patients with type 2 inflammatory markers.',
        symptomBars: [
          { name: 'Chronic Sputum Cough', percentage: 92, description: 'Daily productive cough lasting over 3 consecutive months' },
          { name: 'Exertional Breathlessness', percentage: 96, description: 'Inability to keep pace with peers when walking' },
          { name: 'Hypoxemia & Cyanosis', percentage: 55, description: 'Low arterial oxygen tension requiring supplemental oxygen' }
        ],
        treatmentOptions: [
          { title: 'Anti-IL-4/IL-13 mAb (Dupilumab)', type: 'Targeted', description: 'First biologic approved to reduce severe COPD exacerbations.' },
          { title: 'Endobronchial Valves (EBV)', type: 'Surgical', description: 'One-way valves placed in hyperinflated emphysematous lobes.' }
        ],
        pipeline: [
          { drugName: 'Itepekimab', mechanism: 'Anti-IL-33 mAb', phase: 'Phase III', sponsor: 'Sanofi / Regeneron', completionYear: '2026' }
        ],
        pags: [
          { name: 'COPD Foundation', website: 'https://www.copdfoundation.org', description: 'Speeding innovations to reduce burden for individuals affected by COPD.' }
        ],
        stories: [
          { author: 'Frank S.', age: 66, location: 'Denver, CO', quote: 'The biologic trial allowed me to take walks in the mountains again.', storyText: 'Frank participated in the landmark BOREAS COPD trial.', trialName: 'NCT04751487' }
        ],
        faqs: [
          { question: 'Can former smokers qualify for COPD trial participation?', answer: 'Yes, both current and former smokers with ≥10 pack-year histories qualify.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT04751487', title: 'NOTUS: Study of Dupilumab in Patients With Moderate-to-Severe COPD', phase: 'Phase 3', status: 'RECRUITING', locationsCount: 120, hasRemoteOption: true, sponsor: 'Regeneron / Sanofi', summary: 'Phase 3 trial assessing lung function improvement and exacerbation reduction.', matchScore: 94 }
        ]
      }
    ]
  },
  {
    id: 'endocrine',
    name: 'Endocrine',
    subtitle: 'Metabolism, Hormones & Glands',
    regionId: 'abdomen',
    regionBadge: 'Abdomen & Pancreas',
    iconName: 'Zap',
    accentColor: '#10B981',
    cameraPosition: [0.15, 0.95, 1.5],
    cameraTarget: [0, 0.9, 0],
    description: 'Metabolic advancements across Type 1 Diabetes interception, GLP-1/GIP multi-receptor agonists, and thyroid hormone receptor modulators.',
    conditionsCount: 3,
    activeTrialsCount: 215,
    hotspot: { x: 50, y: 44, label: 'Endocrine & Metabolic Core' },
    videoSrc: '/videos/abdomen_lymphatic.mp4',
    conditions: [
      {
        id: 'diabetes-t1',
        categoryId: 'endocrine',
        name: 'Type 1 Diabetes & Beta-Cell Autoimmunity',
        shortDescription: 'Autoimmune destruction of pancreatic islet beta cells leading to absolute insulin deficiency.',
        anatomicalRegion: 'Pancreatic Islets of Langerhans',
        prevalence: '1.9 million in US',
        whatIsText: 'Type 1 Diabetes trials focus on disease preservation (Teplizumab) to delay clinical onset, alongside stem-cell derived encapsulated beta-cell transplants that restore endogenously produced insulin.',
        symptomBars: [
          { name: 'Hyperglycemia / Polydipsia', percentage: 98, description: 'Excessive thirst and blood glucose spikes' },
          { name: 'Frequent Urination (Polyuria)', percentage: 95, description: 'Osmole-driven osmotic diuresis' },
          { name: 'Ketoacidosis Risk', percentage: 40, description: 'Metabolic acidosis from ketone accumulation' }
        ],
        treatmentOptions: [
          { title: 'Anti-CD3 Monoclonal Antibody (Teplizumab)', type: 'Targeted', description: 'Delays Stage 3 T1D onset by preserving remaining C-peptide.' },
          { title: 'Stem-Cell Derived Islet Therapy (VX-880)', type: 'Experimental', description: 'Fully functional insulin-producing cells infused into hepatic portal vein.' }
        ],
        pipeline: [
          { drugName: 'VX-880 / VX-264', mechanism: 'Allogeneic Stem-Cell Islet Cells', phase: 'Phase II', sponsor: 'Vertex Pharmaceuticals', completionYear: '2026' }
        ],
        pags: [
          { name: 'Breakthrough T1D (formerly JDRF)', website: 'https://www.breakthrought1d.org', description: 'Global leader funding T1D research and cell therapy innovation.' }
        ],
        stories: [
          { author: 'Hannah K.', age: 24, location: 'San Diego, CA', quote: 'The stem cell trial eliminated my need for exogenous insulin injections.', storyText: 'Hannah achieved insulin independence 180 days after VX-880 portal vein infusion.', trialName: 'NCT04786262' }
        ],
        faqs: [
          { question: 'What is required for cell therapy trial participation?', answer: 'Severe hypoglycemia unawareness despite optimized insulin pumps and continuous glucose monitoring.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT04786262', title: 'Study of VX-880 in Patients With Type 1 Diabetes and Severe Hypoglycemia', phase: 'Phase 2', status: 'RECRUITING', locationsCount: 18, hasRemoteOption: false, sponsor: 'Vertex Pharma', summary: 'First-in-human stem cell derived pancreatic islet replacement therapy.', matchScore: 98 }
        ]
      },
      {
        id: 'diabetes-t2',
        categoryId: 'endocrine',
        name: 'Type 2 Diabetes & Metabolic Syndrome',
        shortDescription: 'Insulin resistance combined with progressive secretagogue exhaustion.',
        anatomicalRegion: 'Pancreas, Liver & Skeletal Muscle',
        prevalence: '38 million US adults',
        whatIsText: 'Type 2 Diabetes research has entered a new era with triple hormone agonists (GLP-1 / GIP / Glucagon) that achieve glycemic normalization alongside profound weight loss and cardiovascular protection.',
        symptomBars: [
          { name: 'Insulin Resistance', percentage: 94, description: 'Decreased peripheral glucose uptake' },
          { name: 'Postprandial Spikes', percentage: 88, description: 'Rapid glucose elevation following carbohydrate intake' },
          { name: 'Fatty Liver Association (MASH)', percentage: 65, description: 'Hepatic lipid accumulation secondary to hyperinsulinemia' }
        ],
        treatmentOptions: [
          { title: 'Dual GLP-1/GIP Agonist (Tirzepatide)', type: 'First-Line', description: 'Dual incretin receptor activation improving insulin sensitivity.' },
          { title: 'Triple Agonist (Retatrutide)', type: 'Experimental', description: 'Activates GLP-1, GIP, and Glucagon receptors for maximal metabolic burn.' }
        ],
        pipeline: [
          { drugName: 'Retatrutide', mechanism: 'GLP-1/GIP/Glucagon Triple Agonist', phase: 'Phase III', sponsor: 'Eli Lilly', completionYear: '2026' }
        ],
        pags: [
          { name: 'American Diabetes Association', website: 'https://www.diabetes.org', description: 'Leading advocacy organization preventing and curing diabetes.' }
        ],
        stories: [
          { author: 'Carlos G.', age: 51, location: 'Phoenix, AZ', quote: 'Retatrutide dropped my HbA1c from 9.2% to 5.4% while losing 50 lbs.', storyText: 'Carlos participated in a Phase 2 trial of triple agonist therapy.', trialName: 'NCT05882045' }
        ],
        faqs: [
          { question: 'Do metabolic trials require stopping current Metformin?', answer: 'Many trials allow Metformin background therapy while adding the investigational compound.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT05882045', title: 'TRIUMPH-1: Retatrutide in Participants With Type 2 Diabetes', phase: 'Phase 3', status: 'RECRUITING', locationsCount: 110, hasRemoteOption: true, sponsor: 'Eli Lilly', summary: 'Global trial assessing glycemic control and weight reduction of triple G agonist.', matchScore: 95 }
        ]
      },
      {
        id: 'thyroid',
        categoryId: 'endocrine',
        name: 'Thyroid Eye Disease & Graves’ Disease',
        shortDescription: 'Autoimmune TSH receptor stimulation causing orbital inflammation.',
        anatomicalRegion: 'Thyroid Gland & Extraocular Orbit',
        prevalence: '16 per 100,000 women',
        whatIsText: 'Thyroid Eye Disease (TED) clinical trials target IGF-1 receptors and FcRn (neonatal Fc receptor) to reduce proptosis, orbital fat swelling, and double vision.',
        symptomBars: [
          { name: 'Proptosis (Bulging Eyes)', percentage: 90, description: 'Forward displacement of the eye out of the orbit' },
          { name: 'Diplopia (Double Vision)', percentage: 75, description: 'Extraocular muscle swelling causing alignment breakdown' },
          { name: 'Orbital Pain & Redness', percentage: 85, description: 'Retro-orbital pressure and conjunctival congestion' }
        ],
        treatmentOptions: [
          { title: 'Anti-IGF-1R mAb (Teprotumumab)', type: 'Targeted', description: 'Inhibits autoimmune receptor complex driving orbital fibroblasts.' },
          { title: 'FcRn Inhibitor (Batoclimab)', type: 'Experimental', description: 'Promotes rapid degradation of pathogenic IgG autoantibodies.' }
        ],
        pipeline: [
          { drugName: 'Batoclimab / VRDN-001', mechanism: 'Subcutaneous FcRn / IGF-1R Inhibitor', phase: 'Phase III', sponsor: 'Immunovant / Viridian', completionYear: '2026' }
        ],
        pags: [
          { name: 'Graves’ Disease & Thyroid Foundation', website: 'https://www.gdafa.org', description: 'Providing education and advocacy for thyroid autoimmune conditions.' }
        ],
        stories: [
          { author: 'Maria D.', age: 41, location: 'Chicago, IL', quote: 'My proptosis decreased by 4mm after 4 doses of targeted infusion.', storyText: 'Maria regained normal eye alignment in a subcutaneous TED clinical trial.', trialName: 'NCT05517421' }
        ],
        faqs: [
          { question: 'Is hearing monitoring required for IGF-1R trials?', answer: 'Yes, baseline and periodic audiograms are conducted to safeguard hearing.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT05517421', title: 'THRIVE: Study of VRDN-001 in Patients With Active Thyroid Eye Disease', phase: 'Phase 3', status: 'RECRUITING', locationsCount: 50, hasRemoteOption: false, sponsor: 'Viridian Therapeutics', summary: 'Phase 3 evaluation of full response rate in proptosis reduction.', matchScore: 92 }
        ]
      }
    ]
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology',
    subtitle: 'Digestive Tract, Gut & Liver',
    regionId: 'abdomen-lower',
    regionBadge: 'Lower Abdomen & Gut',
    iconName: 'Compass',
    accentColor: '#ED248F',
    cameraPosition: [0.15, 0.72, 1.5],
    cameraTarget: [0, 0.68, 0],
    description: 'Advanced gastrointestinal medicine focusing on ulcerative colitis, Crohn’s disease, MASH liver fibrosis, and microbiome therapies.',
    conditionsCount: 2,
    activeTrialsCount: 160,
    hotspot: { x: 50, y: 52, label: 'Gastrointestinal & Abdominal' },
    videoSrc: '/videos/abdomen_lymphatic.mp4',
    conditions: [
      {
        id: 'crohns',
        categoryId: 'gastroenterology',
        name: 'Crohn’s Disease & Ulcerative Colitis (IBD)',
        shortDescription: 'Transmural chronic mucosal inflammation affecting the gastrointestinal tract.',
        anatomicalRegion: 'Terminal Ileum & Colon Mucosa',
        prevalence: '3.1 million in US',
        whatIsText: 'Inflammatory Bowel Disease (IBD) trials investigate oral anti-TL1A monoclonal antibodies, S1P receptor modulators, and dual integrin blockers to achieve endoscopic mucosal healing.',
        symptomBars: [
          { name: 'Abdominal Cramping & Pain', percentage: 94, description: 'Severe visceral pain in right lower quadrant' },
          { name: 'Chronic Diarrhea / Urgency', percentage: 92, description: 'Frequent loose stools with mucosal bleeding' },
          { name: 'Intestinal Strictures', percentage: 45, description: 'Fibrotic narrowing of lumen leading to obstructive symptoms' }
        ],
        treatmentOptions: [
          { title: 'Anti-TL1A Monoclonal Antibody (Tuspetinib)', type: 'Targeted', description: 'Blocks key cytokine driving intestinal fibrosis and cytokine cascade.' },
          { title: 'S1P Receptor Modulator (Etrasimod)', type: 'First-Line', description: 'Sequesters lymphocytes in lymph nodes away from inflamed gut tissue.' }
        ],
        pipeline: [
          { drugName: 'RVT-3101 / PRA023', mechanism: 'Anti-TL1A Directed Antibody', phase: 'Phase III', sponsor: 'Roivant / Merck', completionYear: '2026' }
        ],
        pags: [
          { name: 'Crohn’s & Colitis Foundation', website: 'https://www.crohnscolitisfoundation.org', description: 'Non-profit dedicated to curing Crohn’s disease and ulcerative colitis.' }
        ],
        stories: [
          { author: 'Jason K.', age: 31, location: 'San Francisco, CA', quote: 'Achieved complete endoscopic healing on biopsy after 12 weeks of TL1A trial.', storyText: 'Jason participated in an oral targeted anti-fibrotic IBD clinical trial.', trialName: 'NCT05524311' }
        ],
        faqs: [
          { question: 'Is colonoscopy mandatory for IBD trial enrollment?', answer: 'Yes, baseline colonoscopy with tissue biopsies establishes objective SES-CD endoscopic scores.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT05524311', title: 'TUSCAN: RVT-3101 in Moderate-to-Severely Active Crohn’s Disease', phase: 'Phase 3', status: 'RECRUITING', locationsCount: 85, hasRemoteOption: true, sponsor: 'Merck & Co', summary: 'Global trial assessing endoscopic remission and mucosal fibrotic regression.', matchScore: 96 }
        ]
      },
      {
        id: 'celiac',
        categoryId: 'gastroenterology',
        name: 'Celiac Disease & Gluten Sensitivity',
        shortDescription: 'Autoimmune enteropathy triggered by ingested gluten proteins in genetically susceptible individuals.',
        anatomicalRegion: 'Duodenal Villi & Small Intestine',
        prevalence: '1 in 100 worldwide',
        whatIsText: 'Celiac disease trials focus on oral glutenases (Latent gluten cleavage enzymes) and transglutaminase 2 (TG2) inhibitors designed to enable safe gluten consumption without villous atrophy.',
        symptomBars: [
          { name: 'Duodenal Villous Atrophy', percentage: 98, description: 'Blunting of small intestinal absorptive surfaces' },
          { name: 'Bloating & Malabsorption', percentage: 88, description: 'Inability to absorb key vitamins, iron, and lipids' },
          { name: 'Dermatitis Herpetiformis', percentage: 25, description: 'Pruritic blistering skin lesions linked to IgA deposits' }
        ],
        treatmentOptions: [
          { title: 'Oral Endopeptidase (TAK-062)', type: 'Experimental', description: 'Degrades gluten proteins in stomach before reaching duodenal TG2.' },
          { title: 'TG2 Inhibitor (ZED1227)', type: 'Targeted', description: 'Blocks auto-antigen formation in small intestinal mucosa.' }
        ],
        pipeline: [
          { drugName: 'TAK-062', mechanism: 'Recombinant Gluten Endopeptidase', phase: 'Phase IIb', sponsor: 'Takeda', completionYear: '2026' }
        ],
        pags: [
          { name: 'Celiac Disease Foundation', website: 'https://celiac.org', description: 'Driving diagnosis, treatment, and cure for celiac disease.' }
        ],
        stories: [
          { author: 'Rachel P.', age: 36, location: 'Boston, MA', quote: 'Participating in a glutenase trial meant I could eat out without fear of cross-contamination.', storyText: 'Rachel joined a gluten challenge study with complete protection of villous height.', trialName: 'NCT04789512' }
        ],
        faqs: [
          { question: 'Does trial participation involve eating gluten?', answer: 'Controlled micro-gluten challenges are conducted under strict medical supervision.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT04789512', title: 'Phase 2b Study of TAK-062 in Celiac Disease During Gluten Challenge', phase: 'Phase 2', status: 'RECRUITING', locationsCount: 40, hasRemoteOption: false, sponsor: 'Takeda Pharma', summary: 'Assessing protection against gluten-induced mucosal damage in celiac patients.', matchScore: 93 }
        ]
      }
    ]
  },
  {
    id: 'musculoskeletal',
    name: 'Musculoskeletal',
    subtitle: 'Bones, Joints & Connective Tissue',
    regionId: 'skeleton',
    regionBadge: 'Skeleton & Joints',
    iconName: 'Bone',
    accentColor: '#7948A5',
    cameraPosition: [0.2, 0.55, 2.4],
    cameraTarget: [0, 0.5, 0],
    description: 'Rheumatological and orthopedic advancements in rheumatoid arthritis, osteoporosis bone anabolic density, and osteoarthritis cartilage restoration.',
    conditionsCount: 2,
    activeTrialsCount: 140,
    hotspot: { x: 50, y: 64, label: 'Skeletal & Musculoskeletal Framework' },
    videoSrc: '/videos/skeleton_spine_dna.mp4',
    conditions: [
      {
        id: 'rheumatoid-arthritis',
        categoryId: 'musculoskeletal',
        name: 'Rheumatoid Arthritis & Autoimmune Joint Disease',
        shortDescription: 'Symmetrical synovial joint inflammation leading to erosion and joint deformity.',
        anatomicalRegion: 'Synovial Membrane & Metacarpophalangeal Joints',
        prevalence: '1.3 million in US',
        whatIsText: 'Rheumatoid Arthritis (RA) research focuses on targeted oral JAK1 inhibitors, BTK inhibitors, and CAR-T cell reset therapies designed to eliminate persistent autoreactive B-cell clones.',
        symptomBars: [
          { name: 'Synovial Swelling & Stiffness', percentage: 95, description: 'Morning joint stiffness lasting >1 hour' },
          { name: 'Symmetrical Joint Erosion', percentage: 84, description: 'Bilateral bony erosions on digital X-rays' },
          { name: 'Rheumatoid Nodules', percentage: 30, description: 'Subcutaneous firm masses over pressure points' }
        ],
        treatmentOptions: [
          { title: 'Oral JAK1 Selective Inhibitors (Upadacitinib)', type: 'First-Line', description: 'Blocks intracellular cytokine signaling downstream of IL-6 and IFN.' },
          { title: 'Reset CAR-T Cell Therapy (CC-99677)', type: 'Experimental', description: 'Single-infusion immune reboot targeting CD19+ autoreactive B-cells.' }
        ],
        pipeline: [
          { drugName: 'Rilzabrutinib', mechanism: 'Oral BTK Inhibitor', phase: 'Phase III', sponsor: 'Sanofi', completionYear: '2026' }
        ],
        pags: [
          { name: 'Arthritis Foundation', website: 'https://www.arthritis.org', description: 'Championing arthritis research and advocacy for joint health.' }
        ],
        stories: [
          { author: 'Karen H.', age: 52, location: 'Minneapolis, MN', quote: 'The BTK inhibitor trial restored full mobility in my hands within 4 weeks.', storyText: 'Karen regained full hand function without systemic corticosteroid dependence.', trialName: 'NCT05132569' }
        ],
        faqs: [
          { question: 'Can patients who failed biologics join novel RA trials?', answer: 'Yes, TNF-refractory and biologic-experienced cohorts are specifically sought.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT05132569', title: 'RIFLE-RA: Rilzabrutinib in Active Moderate-to-Severe Rheumatoid Arthritis', phase: 'Phase 3', status: 'RECRUITING', locationsCount: 70, hasRemoteOption: true, sponsor: 'Sanofi', summary: 'Global Phase 3 trial evaluating ACR20/ACR50 response rates in RA.', matchScore: 95 }
        ]
      },
      {
        id: 'osteoporosis',
        categoryId: 'musculoskeletal',
        name: 'Severe Osteoporosis & Fragility Fractures',
        shortDescription: 'Systemic skeletal impairment characterized by low bone mass and microarchitectural deterioration.',
        anatomicalRegion: 'Trabecular Bone, Femoral Neck & Vertebrae',
        prevalence: '10 million US adults',
        whatIsText: 'Osteoporosis clinical trials pioneer sclerostin monoclonal antibodies (Romosozumab) and PTHrP analogs that simultaneously stimulate osteoblastic bone formation while suppressing osteoclastic resorption.',
        symptomBars: [
          { name: 'Low Bone Mineral Density (BMD)', percentage: 98, description: 'T-score ≤ -2.5 on dual-energy X-ray absorptiometry (DEXA)' },
          { name: 'Vertebral Compression Fractures', percentage: 70, description: 'Loss of height and kyphotic spinal curvature' },
          { name: 'Femoral Neck Fragility', percentage: 50, description: 'High fracture risk during low-trauma falls' }
        ],
        treatmentOptions: [
          { title: 'Sclerostin Inhibitor (Romosozumab)', type: 'Targeted', description: 'Dual-action bone builder and resorption blocker.' },
          { title: 'PTHrP Analog (Abaloparatide)', type: 'First-Line', description: 'Anabolic agent stimulating subperiosteal bone apposition.' }
        ],
        pipeline: [
          { drugName: 'Denosumab High-Density Biosimilar', mechanism: 'RANKL Monoclonal Antibody', phase: 'Phase III', sponsor: 'Sandoz', completionYear: '2026' }
        ],
        pags: [
          { name: 'Bone Health & Osteoporosis Foundation', website: 'https://www.bonehealthandosteoporosis.org', description: 'Promoting bone health and preventing fragility fractures.' }
        ],
        stories: [
          { author: 'Evelyn W.', age: 71, location: 'Tampa, FL', quote: 'My spinal bone density increased by 14% after one year in an anabolic trial.', storyText: 'Evelyn restored her T-score out of osteoporosis range following monthly injections.', trialName: 'NCT04889271' }
        ],
        faqs: [
          { question: 'What DEXA score is required for anabolic osteoporosis trials?', answer: 'T-score ≤ -2.5 at lumbar spine or total hip with at least one prior fragility fracture.' }
        ],
        fallbackTrials: [
          { nctId: 'NCT04889271', title: 'ANABOLIC-BONE: Bone Density Density Expansion Study in Severe Osteoporosis', phase: 'Phase 3', status: 'RECRUITING', locationsCount: 55, hasRemoteOption: true, sponsor: 'Amgen / UCB', summary: 'Assessing lumbar spine BMD gains and vertebral fracture risk reduction.', matchScore: 94 }
        ]
      }
    ]
  }
];

// Helper functions
export function getCategoryById(id: string): CategoryData | undefined {
  return CATEGORIES_DATA.find((cat) => cat.id === id);
}

export function getConditionById(categoryId: string, conditionId: string): ConditionDetail | undefined {
  const cat = getCategoryById(categoryId);
  return cat?.conditions.find((cond) => cond.id === conditionId);
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
