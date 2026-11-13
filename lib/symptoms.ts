/** The same patient-selected topics are used in the category buttons and forms. */
export const symptoms = [
  { id: "hernie", label: "Hernii abdominale și inghinale", group: "general" },
  { id: "colecist", label: "Colecist și litiază biliară", group: "general" },
  { id: "procto", label: "Hemoroizi, fisuri și fistule anale", group: "proctology" },
  { id: "plagi", label: "Plăgi și probleme de vindecare", group: "wounds" },
  { id: "altceva", label: "Alte afecțiuni sau simptome", group: "general" },
] as const;

export type SymptomId = (typeof symptoms)[number]["id"];
export type SymptomGroup = (typeof symptoms)[number]["group"];

export function toggleSymptom(selected: SymptomId[], id: SymptomId): SymptomId[] {
  return selected.includes(id) ? selected.filter((entry) => entry !== id) : [...selected, id];
}

export function selectedSymptoms(selected: SymptomId[]) {
  return symptoms.filter((symptom) => selected.includes(symptom.id));
}
