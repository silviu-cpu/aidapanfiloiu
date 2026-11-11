"use client";

import { createContext, useContext, useId, useState, type ReactNode } from "react";
import { useTranslation } from "@/components/LocaleProvider";
import { symptoms, toggleSymptom, type SymptomId } from "@/lib/symptoms";

const SymptomContext = createContext<{
  selected: SymptomId[];
  toggle: (id: SymptomId) => void;
  otherDetails: string;
  setOtherDetails: (value: string) => void;
} | null>(null);

export function SymptomProvider({ children }: { children: ReactNode }) {
  // Keep the selection in memory only; do not store medical details in the browser.
  const [selected, setSelected] = useState<SymptomId[]>([]);
  const [otherDetails, setOtherDetails] = useState("");
  return (
    <SymptomContext.Provider value={{ selected, toggle: (id) => setSelected((previous) => toggleSymptom(previous, id)), otherDetails, setOtherDetails }}>
      {children}
    </SymptomContext.Provider>
  );
}

export function useSymptoms() {
  const context = useContext(SymptomContext);
  if (!context) throw new Error("SymptomProvider is required");
  return context;
}

export function OtherConcernField({ name = "alte_detalii" }: { name?: string } = {}) {
  const { t } = useTranslation();
  const { otherDetails, setOtherDetails } = useSymptoms();
  return (
    <label className="mt-3 flex flex-col gap-2">
      <span className="text-sm font-medium text-primary">{t("Descrie ce te deranjează")} <span className="font-normal text-on-surface-variant">{t("(opțional)")}</span></span>
      <textarea
        name={name}
        value={otherDetails}
        onChange={(event) => setOtherDetails(event.target.value)}
        rows={3}
        maxLength={2000}
        placeholder={t("Scrie pe scurt ce ai observat sau ce ai vrea să discutăm.")}
        className="min-h-28 w-full resize-y rounded-xl border border-outline-variant/60 bg-surface/60 px-4 py-3 text-sm leading-relaxed text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}

/** `chips`: variantele apar ca etichete pe un rând, în loc de listă cu bife (ocupă mai puțin pe înălțime). */
export default function SymptomPicker({
  dark = false,
  showOtherField = true,
  chips = false,
}: {
  dark?: boolean;
  showOtherField?: boolean;
  chips?: boolean;
}) {
  const { t } = useTranslation();
  const { selected, toggle } = useSymptoms();
  const id = useId();
  return (
    <fieldset aria-describedby={`${id}-hint`} className="min-w-0">
      <legend className={`mb-2 font-semibold ${dark ? "text-white" : "text-on-surface"}`}>
        {t("Ce simptome ai observat?")}
      </legend>
      <p id={`${id}-hint`} className={`mb-3 text-sm leading-relaxed ${dark ? "text-white/75" : "text-on-surface-variant"}`}>
        {t("Poți bifa mai multe variante sau poți descrie situația în propriile cuvinte mai jos.")}
      </p>
      {chips ? (
        <div className="flex flex-wrap gap-2">
          {symptoms.map((symptom) => (
            <label key={symptom.id} className="cursor-pointer">
              <input
                type="checkbox"
                name="simptome"
                value={symptom.id}
                checked={selected.includes(symptom.id)}
                onChange={() => toggle(symptom.id)}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-10 items-center rounded-full border border-outline-variant/60 bg-surface-lowest px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:border-primary/60 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                {t(symptom.label)}
              </span>
            </label>
          ))}
        </div>
      ) : (
      <div className={`grid gap-x-8 ${dark ? "sm:grid-cols-2" : "grid-cols-1"}`}>
        {symptoms.map((symptom) => (
          <label
            key={symptom.id}
            className={`flex min-h-12 cursor-pointer items-start gap-3 border-b py-3 text-sm leading-relaxed ${dark ? "border-white/15 text-white" : "border-outline-variant/40 text-on-surface"}`}
          >
            <input
              type="checkbox"
              name="simptome"
              value={symptom.id}
              checked={selected.includes(symptom.id)}
              onChange={() => toggle(symptom.id)}
              className={`mt-1 size-4 shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 ${dark ? "accent-primary-fixed focus-visible:outline-primary-fixed" : "accent-primary focus-visible:outline-primary"}`}
            />
            <span>{t(symptom.label)}</span>
          </label>
        ))}
      </div>
      )}
      {showOtherField && selected.includes("altceva") && <OtherConcernField />}
    </fieldset>
  );
}
