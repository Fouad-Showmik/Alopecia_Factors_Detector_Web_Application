/* factors */
export const FEATURE_NAMES = [
  "Hair_washing",
  "Nutritional Deficiencies",
  "Smoking",
  "Job_role",
  "Genetics",
  "Stress",
  "Libido",
  "Salary",
  "Medications & Treatments",
  "Stay_up_late",
  "Weight Loss",
  "Hair_grease",
  "Province"
];


export const FACTORS = [
  {
    id: "Hair_washing",
    group: "Hair & scalp",
    name: "Hair Cleansing Practices",
    hint: "Unusual or infrequent hair washing"
  },
  {
    id: "Hair_grease",
    group: "Hair & scalp",
    name: "Scalp Damage",
    hint: "Excessive scalp or hair greasiness"
  },
  {
    id: "Nutritional Deficiencies",
    group: "Health & lifestyle",
    name: "Nutritional Deficiencies",
    hint: "Known or suspected nutritional deficiencies"
  },
  {
    id: "Smoking",
    group: "Health & lifestyle",
    name: "Tobacco Consumption",
    hint: "Regular smoking or tobacco use"
  },
  {
    id: "Stress",
    group: "Health & lifestyle",
    name: "Psychological Stress",
    hint: "Frequent or prolonged stress"
  },
  {
    id: "Stay_up_late",
    group: "Health & lifestyle",
    name: "Sleeping Issues",
    hint: "Frequently staying awake late at night"
  },
  {
    id: "Weight Loss",
    group: "Health & lifestyle",
    name: "Weight Fluctuations",
    hint: "Recent or significant weight loss"
  },
  {
    id: "Genetics",
    group: "Personal factors",
    name: "Genetic Predisposition",
    hint: "Family history or genetic factors"
  },
  {
    id: "Medications & Treatments",
    group: "Personal factors",
    name: "Medication Issues",
    hint: "Current medications or treatments"
  },
  {
    id: "Libido",
    group: "Personal factors",
    name: "Hormonal Imbalances",
    hint: "Changes in libido or related symptoms"
  },
  {
    id: "Salary",
    group: "Background",
    name: "Financial Issues",
    hint: "Lower or financially stressful income level"
  },
  {
    id: "Job_role",
    group: "Background",
    name: "Occupational Stress",
    hint: "Work-related role or job conditions"
  },
  {
    id: "Province",
    group: "Background",
    name: "Environmental Factors",
    hint: "Province or geographic location"
  }
];

export const BY_ID = Object.fromEntries(
  FACTORS.map(factor => [factor.id, factor])
);
