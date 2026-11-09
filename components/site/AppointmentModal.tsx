"use client";

import { useTranslation } from "@/components/LocaleProvider";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import CallbackForm from "./CallbackForm";

const AppointmentContext = createContext<(() => void) | null>(null);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, [open]);

  // Închide și la navigarea prin istoricul browserului.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <AppointmentContext.Provider value={() => setOpen(true)}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="appointment-title"
        aria-describedby="appointment-description"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setOpen(false);
        }}
        data-lenis-prevent
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto overscroll-contain rounded-[2rem] border-0 bg-surface p-0 text-on-surface shadow-2xl backdrop:bg-[#082629]/70 backdrop:backdrop-blur-sm"
      >
        <div className="relative px-6 pt-8 md:px-10">
          <button
            type="button"
            autoFocus
            aria-label={t("Închide formularul")}
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-secondary-container focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X size={20} />
          </button>
          <h2 id="appointment-title" className="pr-10 font-heading text-3xl text-primary">{t("Programează o consultație")}</h2>
          <p id="appointment-description" className="mt-3 text-on-surface-variant">{t("Lasă-mi numele și numărul de telefon, te sun pentru a stabili programarea.")}</p>
        </div>
        {open && <CallbackForm />}
      </dialog>
    </AppointmentContext.Provider>
  );
}

export function AppointmentLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const open = useContext(AppointmentContext);
  const pathname = usePathname();
  const { path } = useTranslation();
  const onContact = /\/contact\/?$/.test(pathname);

  if (onContact || !open) return <Link href={path(href)} className={className}>{children}</Link>;

  return <button type="button" onClick={open} aria-haspopup="dialog" className={className}>{children}</button>;
}
