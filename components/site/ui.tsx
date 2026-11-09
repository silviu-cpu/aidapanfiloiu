"use client";

import { useTranslation } from "@/components/LocaleProvider";
import Link from "next/link";
import type { ReactNode } from "react";
import { AppointmentLink } from "./AppointmentModal";

type Variant = "light" | "ghost-dark" | "primary" | "soft";

const variants: Record<Variant, string> = {
  light:
    "bg-surface-lowest text-primary hover:bg-secondary-fixed shadow-[0_12px_32px_-8px_rgba(18,78,81,0.25)]",
  "ghost-dark": "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md",
  primary: "bg-primary text-white hover:bg-primary-container shadow-md",
  soft: "bg-secondary-container text-primary hover:bg-secondary-fixed-dim",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
  appointment = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
  appointment?: boolean;
}) {
  const { path } = useTranslation();
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-all ${variants[variant]} ${className}`;

  if (appointment) return <AppointmentLink href={href} className={classes}>{children}</AppointmentLink>;

  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={path(href)} className={classes}>
      {children}
    </Link>
  );
}

export function SectionTitle({
  title,
  intro,
  center = false,
  light = false,
}: {
  title: string;
  intro?: string;
  center?: boolean;
  light?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className={`flex max-w-2xl flex-col gap-3 ${center ? "mx-auto items-center text-center" : ""}`}>
      <h2
        className={`text-4xl leading-tight md:text-5xl ${light ? "text-white" : "text-primary"}`}
      >
        {t(title)}
      </h2>
      {intro && (
        <p className={`text-lg leading-relaxed ${light ? "text-mist" : "text-on-surface-variant"}`}>
          {t(intro)}
        </p>
      )}
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <details
          key={item.q}
          open={i === 0}
          className="group rounded-2xl bg-surface-low p-5 transition-colors open:bg-secondary-container/40"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-on-surface [&::-webkit-details-marker]:hidden">
            <span>{t(item.q)}</span>
            <span className="text-xl leading-none text-primary transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 leading-relaxed text-on-surface-variant">{t(item.a)}</p>
        </details>
      ))}
    </div>
  );
}
