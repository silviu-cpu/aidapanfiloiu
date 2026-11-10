"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { useTranslation } from "@/components/LocaleProvider";
import { locations, surgeryNote } from "@/lib/content";

export default function LocationsMap() {
  const { t, lang } = useTranslation();
  const [selectedId, setSelectedId] = useState(locations[0].id);
  const selected = locations.find((location) => location.id === selectedId) ?? locations[0];
  const query = encodeURIComponent(selected.mapQuery);

  return (
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
      <div className="flex flex-col rounded-[2rem] bg-surface-low p-6 lg:sticky lg:top-24 lg:col-span-6">
        <div id="clinic-map" className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-lowest">
          <iframe
            key={selected.id}
            src={`https://www.google.com/maps?q=${query}&output=embed&hl=${lang}`}
            title={`${t("Hartă Google Maps pentru")} ${t(selected.name)}`}
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="mt-4" aria-live="polite" aria-atomic="true">
          <p className="text-sm font-semibold text-primary">{t(selected.name)}</p>
          <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{t(selected.address)}</p>
        </div>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-11 items-center self-start text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {t("Vezi traseul în Google Maps")}
        </a>
      </div>

      <div className="flex flex-col lg:col-span-6">
        <ul className="divide-y divide-surface-mid">
          {locations.map((location) => {
            const active = location.id === selected.id;
            return (
              <li key={location.id} className="py-1">
                <button
                  type="button"
                  onClick={() => setSelectedId(location.id)}
                  aria-pressed={active}
                  aria-controls="clinic-map"
                  className={`flex w-full items-start gap-3 rounded-xl px-4 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${active ? "bg-secondary-container/40" : "hover:bg-surface-low"}`}
                >
                  <span aria-hidden="true" className={`mt-2 size-2.5 shrink-0 rounded-full ${active ? "bg-primary" : "border border-primary/40"}`} />
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold text-on-surface">{t(location.name)}</span>
                    </span>
                    <span className="mt-2 block leading-relaxed text-on-surface-variant">{t(location.services)}</span>
                  </span>
                </button>
                {active && (
                  <div className="mx-4 mb-4 mt-1 border-t border-outline-variant/40 pt-4" role="region" aria-label={t("Programul clinicii")}>
                    <h3 className="mb-3 font-heading text-xl leading-tight text-primary">{t(location.openingHours.label)}</h3>
                    <dl className="space-y-2 text-sm">
                      {location.openingHours.rows.map((row) => (
                        <div key={row.days} className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                          <dt className="text-on-surface-variant">{t(row.days)}</dt>
                          <dd className="font-medium tabular-nums text-on-surface">{t(row.hours)}</dd>
                        </div>
                      ))}
                    </dl>
                    {location.openingHours.note && <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">{t(location.openingHours.note)}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                      <a href={location.openingHours.phone} className="font-medium text-primary hover:underline">{location.openingHours.phoneDisplay}</a>
                      <a href={location.openingHours.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary">{t("Verifică programul pe site-ul clinicii")}</a>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-secondary-container/40 p-4">
          <Info className="shrink-0 text-primary" size={20} />
          <p className="font-semibold text-primary">{t(surgeryNote)}</p>
        </div>
      </div>
    </div>
  );
}
