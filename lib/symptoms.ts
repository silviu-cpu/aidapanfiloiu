/** The same patient-selected topics are used in the category buttons and forms. */
export const symptoms = [
  { id: "hernie", label: "Hernie", group: "general" },
  { id: "colecist", label: "Colecist", group: "general" },
  { id: "procto", label: "Hemoroizi, fisuri, fistule", group: "proctology" },
  { id: "plagi", label: "Plăgi", group: "wounds" },
  { id: "altceva", label: "Altceva", group: "general" },
] as const;

export type SymptomId = (typeof symptoms)[number]["id"];
export type SymptomGroup = (typeof symptoms)[number]["group"];

export function toggleSymptom(selected: SymptomId[], id: SymptomId): SymptomId[] {
  return selected.includes(id) ? selected.filter((entry) => entry !== id) : [...selected, id];
}

export function selectedSymptoms(selected: SymptomId[]) {
  return symptoms.filter((symptom) => selected.includes(symptom.id));
}
