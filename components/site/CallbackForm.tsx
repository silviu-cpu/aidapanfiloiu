"use client";

import { useTranslation } from "@/components/LocaleProvider";

import { useId, useState, type FocusEvent, type FormEvent } from "react";
import { ChevronDown, CircleCheck } from "lucide-react";
import emailjs from "@emailjs/browser";
import SymptomPicker, { OtherConcernField, useSymptoms } from "./SymptomPicker";
import { PrivacyLink } from "./PrivacyModal";
import { contact } from "@/lib/content";
import { selectedSymptoms } from "@/lib/symptoms";

/*
 * Trimiterea prin EmailJS, direct din browser. Cele trei valori vin din variabilele de mediu
 * (vezi .env.example). Prefixul NEXT_PUBLIC_ e necesar ca Next să le includă în pagină;
 * cheia publică EmailJS e făcută să fie vizibilă, nu e o parolă.
 */
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

/** Motivul consultației, în română, așa cum îl citește doamna doctor în email. */
const REASONS: Record<string, string> = {
  general: "Consultație de chirurgie generală",
  proctology: "Consultație de proctologie",
  "wound-care": "Tratamentul plăgilor",
  "follow-up": "Control după o intervenție",
  "second-opinion": "A doua opinie",
  unsure: "Nu știu încă, aș vrea o evaluare",
};

const inputClass =
  "h-12 w-full rounded-xl border border-outline-variant/40 bg-surface-lowest px-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary aria-[invalid=true]:border-red-600 aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-600";

/*
 * Validarea câmpurilor. Eroarea apare când pacientul iese din câmp (blur); după aceea se
 * actualizează pe măsură ce scrie, ca să dispară imediat ce câmpul e corect.
 * Mesajele sunt în română; traducerea lor e în lib/en.json.
 */
type Field = "nume" | "telefon" | "email" | "motiv" | "gdpr";
const FIELDS: Field[] = ["nume", "telefon", "email", "motiv", "gdpr"];

function validate(name: Field, value: string, checked = false): string | undefined {
  const v = value.trim();
  switch (name) {
    case "nume":
      if (!v) return "Numele nu a fost completat.";
      if (v.length < 3) return "Numele trebuie să aibă minim 3 caractere.";
      if (!/^[\p{L}\s.'’-]+$/u.test(v)) return "Numele poate conține doar litere, spații și cratimă.";
      return;
    case "telefon": {
      if (!v) return "Numărul de telefon nu a fost completat.";
      const digits = v.replace(/[\s().-]/g, "");
      // Număr românesc (07xx xxx xxx, 02x/03x…, cu sau fără +40) sau internațional cu prefix.
      const romanian = /^(\+40|0040|0)[237]\d{8}$/.test(digits);
      const international = /^(\+|00)[1-9]\d{7,14}$/.test(digits);
      if (!romanian && !international) return "Numărul de telefon nu este valid. Exemplu: 0712 345 678.";
      return;
    }
    case "email":
      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Adresa de email nu este validă. Exemplu: nume@exemplu.ro.";
      return;
    case "motiv":
      if (!v) return "Alege tipul consultației.";
      return;
    case "gdpr":
      if (!checked) return "Ca să te pot suna, e nevoie de acordul tău pentru prelucrarea datelor.";
      return;
  }
}

function FieldError({ id, message }: { id: string; message?: string }) {
  const { t } = useTranslation();
  return (
    <p id={id} aria-live="polite" className={message ? "text-sm font-medium text-red-700" : "sr-only"}>
      {message ? t(message) : ""}
    </p>
  );
}

/** Formular „Vrei să te sun eu?”: cererea ajunge pe email prin EmailJS. */
export default function CallbackForm({ twoColumns = false }: { twoColumns?: boolean }) {
  const { t, lang } = useTranslation();
  const { selected } = useSymptoms();
  const consentId = useId();
  const uid = useId();
  const errId = (name: Field) => `${uid}-${name}-error`;
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "unconfigured">("idle");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});

  const check = (el: HTMLInputElement | HTMLSelectElement) => {
    const name = el.name as Field;
    const checked = el instanceof HTMLInputElement && el.checked;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, el.value, checked) }));
  };
  // La ieșirea din câmp arătăm eroarea.
  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => check(e.currentTarget);
  // Cât timp scrie într-un câmp deja verificat, eroarea se actualizează și dispare când e corect.
  // Lista și bifa se verifică imediat, la alegere.
  const onChange = (e: { currentTarget: HTMLInputElement | HTMLSelectElement }) => {
    const el = e.currentTarget;
    if (touched[el.name as Field] || el.tagName === "SELECT" || (el as HTMLInputElement).type === "checkbox") check(el);
  };
  const fieldProps = (name: Field) => ({
    onBlur,
    onChange,
    "aria-invalid": touched[name] && errors[name] ? true : undefined,
    "aria-describedby": errId(name),
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    // La trimitere verificăm tot, arătăm toate erorile și ducem cursorul la prima.
    const form = e.currentTarget;
    const next: Partial<Record<Field, string>> = {};
    for (const name of FIELDS) {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
      if (el) next[name] = validate(name, el.value, el instanceof HTMLInputElement && el.checked);
    }
    setErrors(next);
    setTouched({ nume: true, telefon: true, email: true, motiv: true, gdpr: true });
    const firstInvalid = FIELDS.find((name) => next[name]);
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setStatus("unconfigured");
      return;
    }
    const data = new FormData(e.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    // Numele parametrilor trebuie să fie identice cu {{variabilele}} din șablonul EmailJS.
    const params = {
      nume: field("nume"),
      telefon: field("telefon"),
      email: field("email") || "—",
      reply_to: field("email"),
      motiv: REASONS[field("motiv")] ?? field("motiv"),
      preferinta: field("preferinta") || "—",
      afectiuni: selectedSymptoms(selected).map((s) => s.label).join(", ") || "—",
      mesaj: field("mesaj") || "—",
      limba: lang, // "ro" sau "en": versiunea site-ului de pe care a venit cererea
      pagina: window.location.href,
      data: new Date().toLocaleString("ro-RO", { timeZone: "Europe/Bucharest" }),
    };
    setStatus("sending");
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, { publicKey: EMAILJS_PUBLIC_KEY });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[2rem] bg-surface p-10 text-center shadow-sm" role="status">
        <CircleCheck className="text-primary" size={40} />
        <p className="text-xl font-semibold text-primary">{t("Mulțumesc!")}</p>
        <p className="text-on-surface-variant">{t("Te sun în cel mai scurt timp pentru a stabili programarea.")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6 rounded-[2rem] bg-surface p-6 shadow-sm md:p-10">
      <div className={twoColumns ? "grid gap-8 lg:grid-cols-2 lg:gap-12" : "flex flex-col gap-6"}>
      <div className="flex min-w-0 flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="font-semibold text-on-surface">{t("Nume complet")}</span>
        <input className={inputClass} name="nume" placeholder={t("Ex: Maria Popescu")} required minLength={3} autoComplete="name" {...fieldProps("nume")} />
        <FieldError id={errId("nume")} message={touched.nume ? errors.nume : undefined} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-semibold text-on-surface">{t("Număr de telefon")}</span>
        <input className={inputClass} name="telefon" type="tel" inputMode="tel" placeholder={t("Ex: 07xx xxx xxx")} required autoComplete="tel" {...fieldProps("telefon")} />
        <FieldError id={errId("telefon")} message={touched.telefon ? errors.telefon : undefined} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-semibold text-on-surface">
          {t("Email pentru corespondență")} <span className="font-normal text-on-surface-variant">{t("(opțional)")}</span>
        </span>
        <input className={inputClass} name="email" type="email" placeholder={t("Ex.: nume@exemplu.ro")} autoComplete="email" {...fieldProps("email")} />
        <FieldError id={errId("email")} message={touched.email ? errors.email : undefined} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-semibold text-on-surface">{t("Pentru ce ai nevoie de consultație?")}</span>
        {/* Săgeata nativă a browserului e ascunsă (appearance-none); în locul ei, o săgeată din setul de iconițe al site-ului. */}
        <span className="relative block">
        <select className={`${inputClass} cursor-pointer appearance-none pr-12`} name="motiv" required defaultValue="" {...fieldProps("motiv")}>
          <option value="" disabled>{t("Alege tipul consultației")}</option>
          <option value="general">{t("Consultație de chirurgie generală")}</option>
          <option value="proctology">{t("Consultație de proctologie")}</option>
          <option value="wound-care">{t("Tratamentul plăgilor")}</option>
          <option value="follow-up">{t("Control după o intervenție")}</option>
          <option value="second-opinion">{t("A doua opinie")}</option>
          <option value="unsure">{t("Nu știu încă, aș vrea o evaluare")}</option>
        </select>
          <ChevronDown aria-hidden="true" size={20} strokeWidth={2} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary" />
        </span>
        <FieldError id={errId("motiv")} message={touched.motiv ? errors.motiv : undefined} />
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
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-start gap-3">
          <input id={consentId} type="checkbox" name="gdpr" required className="mt-1 h-4 w-4 shrink-0 accent-primary" {...fieldProps("gdpr")} />
          <div className="text-sm leading-relaxed text-on-surface-variant">
            <label htmlFor={consentId}>{t("Sunt de acord cu prelucrarea datelor personale.")}</label>{" "}
            <PrivacyLink>{t("Politica de confidențialitate")}</PrivacyLink>
          </div>
        </div>
        <FieldError id={errId("gdpr")} message={touched.gdpr ? errors.gdpr : undefined} />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        aria-busy={status === "sending"}
        className="mt-2 w-full rounded-full bg-primary px-10 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-container disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:self-start"
      >
        {status === "sending" ? t("Se trimite…") : t("Sună-mă")}</button>
      {(status === "error" || status === "unconfigured") && (
        <p role="alert" className="text-sm leading-relaxed text-red-700">
          {t(
            status === "error"
              ? "Nu am putut trimite cererea. Te rog încearcă din nou sau sună-mă la"
              : "Formularul nu este disponibil momentan. Te rog sună-mă la",
          )}{" "}
          <a href={contact.phoneHref} className="font-semibold underline underline-offset-4">
            {contact.phoneDisplay}
          </a>
          .
        </p>
      )}
      </div>
    </form>
  );
}
