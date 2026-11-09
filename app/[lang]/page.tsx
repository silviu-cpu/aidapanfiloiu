import type { Metadata } from "next";
import { HomeHero, type HeroCopy } from "@/components/home/HomeHero";
import { SiteHeader } from "@/components/SiteHeader";
import { alternates, common, getLang, localePath, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

const hero: Record<Locale, HeroCopy> = {
  ro: {
    eyebrow: "Cabinet chirurgical București",
    titleA: "Chirurgie generală.",
    titleB: "Cu atenție pentru tine.",
    lead: "Consultații de chirurgie generală și proctologie în București. Evaluare atentă, diagnostic de precizie și explicații clare despre toate opțiunile tale de tratament.",
    ctaPrimary: "Programează o consultație",
    ctaSecondary: "Vezi afecțiunile",
    doctorName: "Dr. Aida Gabriela Panfiloiu",
    doctorNote: "Peste 12 ani de practică chirurgicală dedicată",
    pills: ["Chirurgie generală", "Laparoscopie", "Proctologie"],
    scroll: "Scroll",
    s2Eyebrow: "Chirurgie minim-invazivă",
    s2Title: "Fiecare intervenție, pregătită la milimetru.",
    s2Text: "Instrumentar steril, tehnici laparoscopice moderne și un plan clar, explicat pe înțelesul tău înainte de operație.",
    loading: "Se încarcă pagina",
  },
  en: {
    eyebrow: "Surgical practice in Bucharest",
    titleA: "General surgery.",
    titleB: "With care for you.",
    lead: "General surgery and proctology consultations in Bucharest. Careful assessment, precise diagnosis and clear explanations of all your treatment options.",
    ctaPrimary: "Book a consultation",
    ctaSecondary: "See conditions",
    doctorName: "Dr. Aida Gabriela Panfiloiu",
    doctorNote: "Over 12 years of dedicated surgical practice",
    pills: ["General surgery", "Laparoscopy", "Proctology"],
    scroll: "Scroll",
    s2Eyebrow: "Minimally invasive surgery",
    s2Title: "Every procedure, prepared to the millimetre.",
    s2Text: "Sterile instruments, modern laparoscopic techniques and a clear plan, explained in plain words before surgery.",
    loading: "Loading page",
  },
};

// Cifrele din machetă. Se verifică împreună cu dr. Panfiloiu înainte de lansare.
const stats: Record<Locale, { value: string; title: string; text: string }[]> = {
  ro: [
    { value: "12+ ani", title: "Chirurgie generală", text: "Abord minim-invaziv și clasic" },
    { value: "98%", title: "Laparoscopie", text: "Tehnici chirurgicale de precizie" },
    { value: "4.9★", title: "Proctologie", text: "Diagnostic atent & tratament adaptat" },
    { value: "100%", title: "Îngrijirea plăgilor", text: "Protocoale avansate de vindecare" },
  ],
  en: [
    { value: "12+ yrs", title: "General surgery", text: "Minimally invasive and open approach" },
    { value: "98%", title: "Laparoscopy", text: "Precise surgical techniques" },
    { value: "4.9★", title: "Proctology", text: "Careful diagnosis & tailored treatment" },
    { value: "100%", title: "Wound care", text: "Advanced healing protocols" },
  ],
};

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = await getLang(params);
  return {
    title: { absolute: `${site.name} — ${common[lang].tagline}` },
    alternates: alternates(lang, "/"),
  };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = await getLang(params);

  return (
    <>
      <SiteHeader lang={lang} current="/" />
      <HomeHero
        copy={hero[lang]}
        contactHref={localePath(lang, "/contact")}
        conditionsHref={localePath(lang, "/afectiuni")}
      />

      <section className="relative bg-cream px-5 pb-24 pt-16 sm:px-8">
        <ul className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats[lang].map((s) => (
            <li key={s.title} className="rounded-3xl border border-line bg-white/70 p-6 shadow-sm">
              <p className="text-3xl font-bold tracking-tight text-ink">{s.value}</p>
              <p className="mt-2 text-sm font-semibold text-primary">{s.title}</p>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
