"use client";

import { useTranslation } from "@/components/LocaleProvider";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Mail, MessageCircle, Phone, X } from "lucide-react";
import CallbackForm from "./CallbackForm";
import { contact } from "@/lib/content";

const AppointmentContext = createContext<(() => void) | null>(null);

/** Celelalte feluri de a lua legătura, afișate în panoul din stânga al ferestrei. */
const contactRows = [
  { href: contact.phoneHref, label: contact.phoneDisplay, icon: <Phone size={16} />, external: false },
  { href: contact.whatsappHref, label: "WhatsApp", icon: <MessageCircle size={16} />, external: true },
  { href: `mailto:${contact.email}`, label: contact.email, icon: <Mail size={16} />, external: false },
];

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
        className="fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-4xl overflow-y-auto overscroll-contain rounded-[2rem] border-0 bg-surface p-0 text-on-surface shadow-2xl backdrop:bg-[#082629]/70 backdrop:backdrop-blur-sm"
      >
        {/* Două panouri: în stânga cum mai poți lua legătura, în dreapta formularul. */}
        <div className="relative grid md:grid-cols-[19rem_minmax(0,1fr)]">
          <button
            type="button"
            autoFocus
            aria-label={t("Închide formularul")}
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-primary-fixed md:text-primary md:hover:bg-secondary-container md:focus-visible:outline-primary"
          >
            <X size={20} />
          </button>

          <aside className="relative overflow-hidden bg-gradient-to-br from-nav via-deep-2 to-primary-container px-6 pb-5 pt-7 text-white md:px-8 md:py-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-primary-fixed/15 blur-3xl" />
            <div className="relative">
              <h2 id="appointment-title" className="pr-10 font-heading text-2xl leading-tight md:pr-0 md:text-3xl">{t("Programează o consultație")}</h2>
              <p id="appointment-description" className="mt-3 text-sm leading-relaxed text-white/75">
                {t("Lasă-mi numele și numărul de telefon, te sun pentru a stabili programarea.")}
              </p>

              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm md:mt-6 md:flex-col md:gap-2">
                {contactRows.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-2 rounded-full py-1 transition-colors hover:text-primary-fixed md:gap-3 md:pr-3"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20 md:size-9">
                        {item.icon}
                      </span>
                      <span className="min-w-0 break-all">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-6 hidden border-t border-white/15 pt-5 text-xs leading-relaxed text-white/60 md:block">
                {t("Răspund în română, engleză și spaniolă.")}
              </p>
            </div>
          </aside>

          <div className="min-w-0">{open && <CallbackForm compact />}</div>
        </div>
      </dialog>
    </AppointmentContext.Provider>
  );
}

export function AppointmentLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const open = useContext(AppointmentContext);
  const { path } = useTranslation();

  // În afara providerului rămâne un link obișnuit spre pagina de contact.
  if (!open) return <Link href={path(href)} className={className}>{children}</Link>;

  return <button type="button" onClick={open} aria-haspopup="dialog" className={className}>{children}</button>;
}
