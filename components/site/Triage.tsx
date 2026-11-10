"use client";

import { useTranslation } from "@/components/LocaleProvider";
import Photo from "@/components/site/Photo";
import { MessageCircle, Phone } from "lucide-react";
import { contact, images, triage } from "@/lib/content";
import { symptoms } from "@/lib/symptoms";
import { OtherConcernField, useSymptoms } from "./SymptomPicker";

/** Original category buttons and card, with independently selectable options. */
export default function Triage() {
  const { t } = useTranslation();
  const { selected, toggle, otherDetails } = useSymptoms();
  const options = triage.filter((entry) => selected.some((id) => id === entry.id));
  const message = [
    t("Bună ziua! Aș dori să stabilesc o consultație."),
    ...(options.length ? [t("Aș vrea să discut despre:"), ...options.map((option) => t(option.title))] : []),
    ...(selected.includes("altceva") && otherDetails.trim() ? [otherDetails.trim()] : []),
  ].join("\n");

  return (
    <>
      <div className="mb-10 flex w-full flex-wrap items-center justify-center gap-2" role="group" aria-label={t("Alege problema")}>
        {symptoms.map((entry) => {
          const active = selected.includes(entry.id);
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => toggle(entry.id)}
              aria-pressed={active}
              className={`rounded-full px-6 py-3 text-[15px] font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed ${
                active
                  ? "bg-primary-fixed text-primary shadow-md ring-2 ring-primary-fixed"
                  : "bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
              }`}
            >
              {t(entry.label)}
            </button>
          );
        })}
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-[2rem] bg-surface-lowest shadow-2xl md:grid-cols-12">
        <div className="relative h-56 bg-nav md:col-span-5 md:h-auto">
          <Photo src={images.patientSupport} alt={t("Gest de sprijin și grijă față de pacient")} sizes="(min-width: 768px) 360px, 100vw" className="object-cover object-bottom" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
        </div>
        <div className="flex flex-col justify-between gap-6 p-6 md:col-span-7 md:p-10">
          <div>
            {options.length ? (
              <>
                <h2 className="mb-5 font-heading text-2xl leading-tight text-primary">{t("Despre ce vrei să discutăm")}</h2>
                <div className="divide-y divide-outline-variant/40">
                  {options.map((option) => (
                    <div key={option.id} className="py-4 first:pt-0 last:pb-0">
                      <h3 className="mb-1.5 font-sans text-[15px] font-semibold text-primary">{t(option.label)}</h3>
                      <p className="text-sm leading-relaxed text-on-surface-variant">{t(option.description)}</p>
                      {option.id === "altceva" && <OtherConcernField />}
                    </div>
                  ))}
                </div>
                <p className="mt-6 border-t border-outline-variant/40 pt-5 text-sm leading-relaxed text-on-surface-variant">
                  {t("Spune-mi de când au apărut simptomele, când se accentuează și ce investigații ai făcut.")}
                </p>
              </>
            ) : (
              <p className="leading-relaxed text-on-surface-variant">{t("Selectează una sau mai multe opțiuni de mai sus pentru a vedea ce putem discuta la consultație.")}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a href={contact.phoneHref} aria-label={t("Sună pentru programare")} className="inline-flex min-h-12 min-w-0 items-center justify-center rounded-full bg-primary-container px-4 py-3 text-sm font-semibold leading-5 text-white transition-colors hover:bg-primary">
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                <Phone size={16} className="shrink-0" />
                <span>{t("Sună acum")}</span>
              </span>
            </a>
            <a href={`${contact.whatsappHref}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" aria-label={t("Scrie-mi pe WhatsApp")} className="inline-flex min-h-12 min-w-0 items-center justify-center rounded-full bg-secondary-container/60 px-4 py-3 text-sm font-semibold leading-5 text-primary transition-colors hover:bg-secondary-container">
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                <MessageCircle size={16} className="shrink-0" />
                <span>WhatsApp</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
