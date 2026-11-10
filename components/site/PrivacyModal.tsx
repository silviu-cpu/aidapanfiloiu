"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useTranslation } from "@/components/LocaleProvider";
import { privacyNotice } from "@/lib/privacy";

const PrivacyContext = createContext<(() => void) | null>(null);

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const { lang } = useTranslation();
  const copy = privacyNotice[lang];
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    // A second native dialog sits above the appointment dialog and restores focus on close.
    const alreadyLocked = [...document.querySelectorAll("dialog[open]")].some((element) => element !== dialog);
    const previousOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    if (!alreadyLocked) document.documentElement.style.overflow = "hidden";
    return () => {
      dialog.close();
      if (!alreadyLocked) document.documentElement.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <PrivacyContext.Provider value={() => setOpen(true)}>
      {children}
      <dialog
        ref={dialogRef}
        id="privacy-dialog"
        aria-labelledby="privacy-title"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setOpen(false);
        }}
        data-lenis-prevent
        className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto overscroll-contain rounded-[2rem] border-0 bg-surface-lowest p-0 text-on-surface shadow-2xl backdrop:bg-[#082629]/70 backdrop:backdrop-blur-sm"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-outline-variant/40 bg-surface-lowest px-6 py-5 sm:px-8">
          <h2 id="privacy-title" className="font-heading text-2xl leading-tight text-primary sm:text-3xl">{copy.title}</h2>
          <button type="button" autoFocus onClick={() => setOpen(false)} aria-label={copy.close} className="flex size-10 shrink-0 items-center justify-center rounded-full text-primary hover:bg-surface-low focus-visible:outline-2 focus-visible:outline-primary">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-6 px-6 py-6 text-sm leading-relaxed sm:px-8 sm:py-8">
          <div className="border-l-2 border-primary/30 pl-4">
            <p className="font-semibold text-primary">{copy.provisional}</p>
            <p className="mt-2 text-on-surface-variant">{copy.intro}</p>
          </div>
          {copy.sections.map((section) => (
            <section key={section.title}>
              <h3 className="mb-2 font-sans text-base font-semibold text-primary">{section.title}</h3>
              <p className="text-on-surface-variant">{section.text}</p>
            </section>
          ))}
          <div className="flex flex-col items-start gap-3 border-t border-outline-variant/40 pt-5">
            <a href={`https://eur-lex.europa.eu/eli/reg/2016/679/oj/${lang === "ro" ? "ron" : "eng"}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4">{copy.regulation}</a>
            <a href="https://www.dataprotection.ro/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4">{copy.authority}</a>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-container">{copy.close}</button>
        </div>
      </dialog>
    </PrivacyContext.Provider>
  );
}

export function PrivacyLink({ children }: { children: ReactNode }) {
  const open = useContext(PrivacyContext);
  return <button type="button" onClick={open ?? undefined} aria-haspopup="dialog" aria-controls="privacy-dialog" className="text-left font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{children}</button>;
}
