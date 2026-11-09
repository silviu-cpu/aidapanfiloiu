"use client";

import { useTranslation } from "@/components/LocaleProvider";

import { AppointmentLink } from "./AppointmentModal";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { serviceGroups, services, type ServiceGroup } from "@/lib/content";

const groupTile: Record<ServiceGroup, string> = {
  consultatii: "bg-mist-bg",
  interventii: "bg-secondary-container/40",
  ingrijire: "bg-surface-low",
};

/** Serviciile afișate ca un tabel periodic. Click pe o plăcuță schimbă plăcuța mare. */
export default function ServicesTable() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(3);
  const s = services[selected];

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div
          key={s.symbol}
          className="flex h-full min-h-[420px] flex-col justify-between rounded-[2rem] border border-outline-variant/60 bg-secondary-container/20 p-6 shadow-sm animate-[fadeIn_.35s_ease]"
          aria-live="polite"
        >
          <div>
            <div className="flex items-start justify-between">
              <span className="text-sm font-bold text-secondary">{t(s.num)}</span>
              <span className="rounded-full bg-secondary-container px-2.5 py-0.5 text-xs font-semibold text-primary">
                {t(serviceGroups[s.group])}
              </span>
            </div>
            <div className="my-4 text-center font-heading text-[96px] leading-none text-primary md:text-[120px]">
              {t(s.symbol)}
            </div>
            <h3 className="mb-2 font-sans text-2xl font-medium text-primary">{t(s.name)}</h3>
            <div className="flex flex-col gap-1 text-[17px] leading-relaxed text-on-surface-variant">
              <p>{t(s.description)}</p>
              <p className="mt-1 text-on-surface">
                <strong>{t("Pentru:")}</strong> {t(s.forWhat)}.
              </p>
              <p className="text-on-surface">
                <strong>{t("Unde:")}</strong> {t(s.where)}.
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-outline-variant/40 pt-4">
            <AppointmentLink href="/contact" className="group inline-flex items-center gap-1 font-semibold text-primary">
              {t("Programează o consultație")}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </AppointmentLink>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 lg:col-span-7">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {services.map((item, i) => {
            const active = i === selected;
            return (
              <button
                key={item.symbol}
                type="button"
                onClick={() => setSelected(i)}
                aria-pressed={active}
                aria-label={item.name}
                className={`flex aspect-square flex-col justify-between rounded-2xl p-3 text-left transition-all ${
                  active
                    ? "-translate-y-0.5 border-2 border-primary bg-secondary-container/50 shadow-md ring-2 ring-primary/20"
                    : `border border-outline-variant/50 hover:border-primary/50 ${groupTile[item.group]}`
                }`}
              >
                <span className="flex items-center justify-between text-[10px] font-bold text-secondary">
                  {t(item.num)}
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </span>
                <span
                  className={`text-center font-heading text-3xl leading-none text-primary md:text-[40px] ${
                    active ? "font-semibold" : ""
                  }`}
                >
                  {t(item.symbol)}
                </span>
                <span
                  className={`text-center text-[11px] leading-tight md:text-[13px] ${
                    active ? "font-semibold text-primary" : "font-medium text-on-surface-variant"
                  }`}
                >
                  {t(item.name)}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-4 border-t border-outline-variant/30 pt-4">
          {(Object.keys(serviceGroups) as ServiceGroup[]).map((g) => (
            <span key={g} className="flex items-center gap-2 text-sm text-on-surface-variant">
              <span className={`h-3.5 w-3.5 rounded-sm border border-outline-variant/50 ${groupTile[g]}`} />
              {t(serviceGroups[g])}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
