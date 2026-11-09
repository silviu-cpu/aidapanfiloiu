"use client";

import { useTranslation } from "@/components/LocaleProvider";

import { useState, type FormEvent } from "react";
import { CircleCheck } from "lucide-react";

const inputClass =
  "h-12 w-full rounded-full bg-surface-lowest px-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary";

/**
 * Formular „Vrei să te sun eu?”.
 * TODO: trimiterea efectivă (API route + email sau un serviciu de formulare) nu este încă legată.
 */
export default function CallbackForm() {
  const { t } = useTranslation();
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
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-[2rem] bg-surface p-6 shadow-sm md:p-10">
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
          {t("Pe scurt, ce te deranjează")}{" "}<span className="font-normal text-on-surface-variant">{t("(opțional)")}</span>
        </span>
        <input className={inputClass} name="mesaj" placeholder={t("Ex: durere inghinală la efort")} />
      </label>
      <label className="flex items-center gap-3 pt-1">
        <input type="checkbox" name="gdpr" required className="h-4 w-4 accent-primary" />
        <span className="text-sm text-on-surface-variant">{t("Sunt de acord cu prelucrarea datelor personale.")}</span>
      </label>
      <button
        type="submit"
        className="mt-2 w-full rounded-full bg-primary px-10 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-container sm:w-auto sm:self-start"
      >
        {t("Sună-mă")}</button>
    </form>
  );
}
