"use client";

import { useTranslation } from "@/components/LocaleProvider";

import { useId, useState, type FormEvent } from "react";
import { CircleCheck } from "lucide-react";
import SymptomPicker, { OtherConcernField, useSymptoms } from "./SymptomPicker";
import { PrivacyLink } from "./PrivacyModal";

const inputClass =
  "h-12 w-full rounded-xl border border-outline-variant/40 bg-surface-lowest px-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary";

/**
 * Formular „Vrei să te sun eu?”.
 * TODO: trimiterea efectivă (API route + email sau un serviciu de formulare) nu este încă legată.
 */
export default function CallbackForm({ twoColumns = false }: { twoColumns?: boolean }) {
  const { t } = useTranslation();
  const { selected } = useSymptoms();
  const consentId = useId();
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[2rem] bg-surface p-10 text-center shadow-sm" role="status">
        <CircleCheck className="text-primary" size={40} />
        <p className="text-xl font-semibold text-primary">{t("Mulțumesc!")}</p>
        <p className="text-on-surface-variant">{t("Te sun în cel mai scurt timp pentru a stabili programarea.")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 rounded-[2rem] bg-surface p-6 shadow-sm md:p-10">
      <div className={twoColumns ? "grid gap-8 lg:grid-cols-2 lg:gap-12" : "flex flex-col gap-6"}>
      <div className="flex min-w-0 flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="font-semibold text-on-surface">{t("Nume complet")}</span>
        <input className={inputClass} name="nume" placeholder={t("Ex: Maria Popescu")} required autoComplete="name" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-semibold text-on-surface">{t("Număr de telefon")}</span>
        <input className={inputClass} name="telefon" type="tel" placeholder={t("Ex: 07xx xxx xxx")} required autoComplete="tel" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-semibold text-on-surface">
          {t("Email pentru corespondență")} <span className="font-normal text-on-surface-variant">{t("(opțional)")}</span>
        </span>
        <input className={inputClass} name="email" type="email" placeholder={t("Ex.: nume@exemplu.ro")} autoComplete="email" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-semibold text-on-surface">{t("Pentru ce ai nevoie de consultație?")}</span>
        <select className={inputClass} name="motiv" required defaultValue="">
          <option value="" disabled>{t("Alege tipul consultației")}</option>
          <option value="general">{t("Consultație de chirurgie generală")}</option>
          <option value="proctology">{t("Consultație de proctologie")}</option>
          <option value="wound-care">{t("Tratamentul plăgilor")}</option>
          <option value="follow-up">{t("Control după o intervenție")}</option>
          <option value="second-opinion">{t("A doua opinie")}</option>
          <option value="unsure">{t("Nu știu încă, aș vrea o evaluare")}</option>
        </select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-semibold text-on-surface">
          {t("Zi sau interval preferat")} <span className="font-normal text-on-surface-variant">{t("(opțional)")}</span>
        </span>
        <input className={inputClass} name="preferinta" placeholder={t("Ex.: marți după-amiază sau prima zi liberă")} />
        <span className="text-xs leading-relaxed text-on-surface-variant">{t("Preferința este orientativă; programarea se confirmă telefonic.")}</span>
      </label>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
      <SymptomPicker showOtherField={false} />
      {selected.includes("altceva") && <OtherConcernField name="mesaj" />}
      </div>
      </div>
      <div className="flex flex-col items-start gap-4 border-t border-outline-variant/40 pt-6">
      <div className="flex items-start gap-3 pt-1">
        <input id={consentId} type="checkbox" name="gdpr" required className="mt-1 h-4 w-4 shrink-0 accent-primary" />
        <div className="text-sm leading-relaxed text-on-surface-variant">
          <label htmlFor={consentId}>{t("Sunt de acord cu prelucrarea datelor personale.")}</label>{" "}
          <PrivacyLink>{t("Politica de confidențialitate")}</PrivacyLink>
        </div>
      </div>
      <button
        type="submit"
        className="mt-2 w-full rounded-full bg-primary px-10 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-container sm:w-auto sm:self-start"
      >
        {t("Sună-mă")}</button>
      </div>
    </form>
  );
}
