import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/site/Footer";
import { alternates, getLang } from "@/lib/i18n";
import Photo from "@/components/site/Photo";
import { Info } from "lucide-react";
import CallbackForm from "@/components/site/CallbackForm";
import Triage from "@/components/site/Triage";
import HeroBackdrop, { heroSectionClass } from "@/components/site/HeroBackdrop";
import { Faq, SectionTitle } from "@/components/site/ui";
import { contact, disclaimer, images, locations, surgeryNote } from "@/lib/content";

// Poziții schematice pe hartă (nu sunt coordonate reale).
const pins = [
  { id: "grivita", label: "MedLife Grivița", x: 150, y: 120 },
  { id: "plaga", label: "Clinica Dr. Plagă", x: 260, y: 55 },
  { id: "victoria", label: "Clinica Victoria", x: 215, y: 175, main: true },
  { id: "royal", label: "Royal Hospital", x: 310, y: 185 },
  { id: "titan", label: "MedLife Titan", x: 370, y: 235 },
];

const channels = [
  { label: "WhatsApp", value: contact.whatsappDisplay, href: contact.whatsappHref },
  { label: "Telefon", value: contact.phoneDisplay, href: contact.phoneHref },
  { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
];

// TODO: răspunsurile marcate trebuie confirmate de doamna doctor.
const faq = [
  {
    q: "Am nevoie de bilet de trimitere?",
    a: "Pentru Clinica Victoria, da. Pentru celelalte locații, află detaliile la programare.",
  },
  {
    q: "Ce documente aduc?",
    a: "Actul de identitate, investigațiile și analizele recente, scrisorile medicale anterioare și lista medicamentelor pe care le iei.",
  },
  {
    q: "Cât durează o consultație?",
    a: "Durata depinde de problemă și de investigațiile necesare. Îți spunem la programare cât să îți rezervi.",
  },
  {
    q: "Pot veni însoțit?",
    a: "Da, poți veni cu o persoană apropiată la consultație și la discuția despre planul de tratament.",
  },
];

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const lang = await getLang(params);
  return {
    title: "Contact",
    description:
      "Programări la Dr. Aida Gabriela Panfiloiu: Clinica Victoria, MedLife Titan și Grivița, Royal Hospital și Clinica Dr. Plagă, București.",
    alternates: alternates(lang, "/contact"),
  };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const lang = await getLang(params);
  return (
    <>
      <SiteHeader lang={lang} current="/contact" />
      <div className="site-page">
      {/* HERO: TRIAJ */}
      <section className={`${heroSectionClass} px-6 pb-24 pt-36 md:pt-40`}>
        <HeroBackdrop />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center">
          <h1 className="mb-3 max-w-3xl text-center text-5xl text-white md:text-6xl">Cu ce te pot ajuta?</h1>
          <p className="mb-10 max-w-xl text-center text-lg text-secondary-fixed">
            Alege ce te deranjează și îți arăt unde te poți programa.
          </p>
          <Triage />
        </div>
      </section>

      {/* UNDE MĂ GĂSEȘTI */}
      <section className="bg-surface-lowest py-16 md:py-20">
        <div className="container-x">
          <div className="mb-10">
            <SectionTitle title="Unde mă găsești" />
          </div>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="flex flex-col rounded-[2rem] bg-surface-low p-6 lg:col-span-6">
              <div className="flex items-center justify-between pb-4">
                <span className="text-sm font-semibold text-secondary">Locațiile mele în București</span>
                <span className="rounded-full bg-surface-mid px-2.5 py-0.5 text-xs text-on-surface-variant">
                  {locations.length} locații
                </span>
              </div>
              <div className="aspect-[4/3] w-full rounded-2xl bg-surface-lowest/80 p-2 shadow-inner">
                <svg viewBox="0 0 460 340" className="h-full w-full" role="img" aria-label="Hartă schematică a locațiilor">
                  <path d="M 10 70 Q 120 85 240 60 T 450 50" stroke="#d1e7de" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <path d="M 20 280 Q 180 230 250 170 T 440 140" stroke="#d1e7de" strokeWidth="7" strokeLinecap="round" fill="none" />
                  <circle cx="230" cy="170" r="110" stroke="#e1e3e2" strokeDasharray="3 3" strokeWidth="1.5" fill="none" />
                  <circle cx="230" cy="170" r="60" stroke="#e1e3e2" strokeWidth="1" fill="none" />
                  <path d="M 40 40 L 420 300 M 40 260 L 420 80 M 230 20 L 230 320 M 20 170 L 440 170" stroke="#eceeed" strokeWidth="2" />
                  {pins.map((p) => (
                    <g key={p.id}>
                      <circle cx={p.x} cy={p.y} r={p.main ? 18 : 16} fill="#124e51" fillOpacity={p.main ? 0.2 : 0.12} />
                      <circle cx={p.x} cy={p.y} r={p.main ? 8 : 7} fill={p.main ? "#003639" : "#124e51"} />
                      <circle cx={p.x} cy={p.y} r="3" fill="#ffffff" />
                      <text
                        x={p.x}
                        y={p.y > 150 ? p.y + 26 : p.y - 16}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight={p.main ? 700 : 600}
                        fill="#124e51"
                        fontFamily="var(--font-jakarta), sans-serif"
                      >
                        {p.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              <p className="mt-3 text-xs text-on-surface-variant">Hartă schematică, nu la scară.</p>
            </div>

            <div className="flex flex-col lg:col-span-6">
              <ul className="flex flex-col divide-y divide-surface-mid">
                {locations.map((l) => (
                  <li key={l.id} className="flex items-start gap-3 py-4">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-sans text-lg font-semibold text-on-surface">{l.name}</h3>
                        <span className="rounded-full bg-secondary-container px-2 py-0.5 text-xs text-secondary">{l.area}</span>
                      </div>
                      <p className="mt-1 text-on-surface-variant">{l.services}</p>
                      {/* TODO: programul pentru fiecare locație. */}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-secondary-container/40 p-4">
                <Info className="shrink-0 text-primary" size={20} />
                <p className="font-semibold text-primary">{surgeryNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CANALE DIRECTE */}
      <section className="bg-mist-bg px-6 py-16 md:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <h2 className="mb-10 text-center text-4xl text-primary">Contact direct</h2>
          <div className="grid w-full grid-cols-1 divide-y divide-outline-variant/40 md:grid-cols-3 md:divide-x md:divide-y-0">
            {channels.map((c) => (
              <div key={c.label} className="flex flex-col items-center px-4 py-5 text-center md:py-0">
                <span className="mb-2 text-lg font-semibold text-primary">{c.label}</span>
                <a
                  href={c.href}
                  className="text-on-surface transition-colors hover:text-primary"
                  {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {c.value}
                </a>
              </div>
            ))}
          </div>
          <p className="pt-8 text-center text-secondary">{contact.languages}</p>
        </div>
      </section>

      {/* VREI SĂ TE SUN EU */}
      <section className="bg-surface-lowest py-16 md:py-20">
        <div className="container-x grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <SectionTitle
              title="Vrei să te sun eu?"
              intro="Lasă-mi numele și numărul de telefon, te sun pentru a stabili programarea."
            />
            <div className="relative h-56 overflow-hidden rounded-[2rem] bg-primary-container shadow-md">
              <Photo src={images.scalpel} alt="Instrumente chirurgicale de precizie" sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <CallbackForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gradient-to-b from-mist-bg via-secondary-container to-primary px-6 pb-28 pt-16 md:pb-32 md:pt-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-4xl text-primary md:text-5xl">Întrebări frecvente</h2>
          <Faq items={faq} />
        </div>
      </section>

      {/* URGENȚE */}
      <section className="bg-primary px-6 py-3.5 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 text-center">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <span className="text-[15px] font-semibold">
            Pentru urgențe medicale sună la <a href="tel:112" className="underline">112</a>.
          </span>
        </div>
      </section>
      <section className="bg-surface-mid px-6 py-4">
        <p className="text-center text-xs text-on-surface-variant">{disclaimer}</p>
      </section>
      </div>
      <Footer />
    </>
  );
}
