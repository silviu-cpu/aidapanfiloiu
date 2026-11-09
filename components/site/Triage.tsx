"use client";

import Photo from "@/components/site/Photo";
import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { contact, images, triage } from "@/lib/content";

/** „Cu ce te pot ajuta?”: pacientul alege problema și vede unde se poate programa. */
export default function Triage() {
  const [selectedId, setSelectedId] = useState(triage[0].id);
  const option = triage.find((t) => t.id === selectedId) ?? triage[0];

  return (
    <>
      <div className="mb-10 flex w-full flex-wrap items-center justify-center gap-2" role="group" aria-label="Alege problema">
        {triage.map((t) => {
          const active = t.id === selectedId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              aria-pressed={active}
              className={`rounded-full px-6 py-3 text-[15px] font-semibold transition-all duration-200 ${
                active
                  ? "bg-primary-fixed text-primary shadow-md ring-2 ring-primary-fixed"
                  : "bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-[2rem] bg-surface-lowest shadow-2xl md:grid-cols-12">
        <div className="relative h-56 bg-nav md:col-span-5 md:h-auto">
          <Photo src={images.laparoscopic} alt="" sizes="(min-width: 768px) 360px, 100vw" className="object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-4 text-xs font-semibold text-primary-fixed">
            Chirurgie minim invazivă
          </span>
        </div>
        <div className="flex flex-col justify-between gap-6 p-6 md:col-span-7 md:p-10" aria-live="polite">
          <div key={option.id} className="flex flex-col gap-4 animate-[fadeIn_.3s_ease]">
            <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
              <span className="h-2 w-2 rounded-full bg-primary-container" />
              {option.title}
            </span>
            <div className="rounded-2xl bg-secondary-container/30 p-4">
              <span className="mb-1 block text-xs font-semibold text-secondary">Consultație</span>
              <p className="font-semibold text-primary">{option.consult}</p>
            </div>
            <div className="rounded-2xl bg-surface-low p-4">
              <span className="mb-1 block text-xs font-semibold text-secondary">Intervenție</span>
              <p className="font-semibold text-on-surface">{option.surgery}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={contact.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-3 font-semibold text-white shadow-md hover:bg-primary"
            >
              <Phone size={18} /> Sună pentru programare
            </a>
            <a
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary-container/60 px-6 py-3 font-semibold text-primary hover:bg-secondary-container"
            >
              <MessageCircle size={18} /> Scrie-mi pe WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
