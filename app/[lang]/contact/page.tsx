import { translator } from "@/lib/translate";

import { ScrollReveal } from "@/components/ScrollReveal";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/site/Footer";
import { alternates, getLang } from "@/lib/i18n";
import LocationsMap from "@/components/site/LocationsMap";
import CallbackForm from "@/components/site/CallbackForm";
import Triage from "@/components/site/Triage";
import HeroBackdrop, { heroSectionClass } from "@/components/site/HeroBackdrop";
import { Faq, SectionTitle } from "@/components/site/ui";
import { contact, disclaimer } from "@/lib/content";

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
  const t = translator(lang);
  return {
    title: t("Contact"),
    description: t("Programări la Dr. Aida Gabriela Panfiloiu: Clinica Victoria, MedLife Titan și Grivița, Royal Hospital și Clinica Dr. Plagă, București."),
    alternates: alternates(lang, "/contact"),
  };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const lang = await getLang(params);
  const t = translator(lang);
  return (
    <>
      <SiteHeader lang={lang} current="/contact" />
      <div className="site-page">
      {/* HERO: TRIAJ */}
      <section className={`${heroSectionClass} px-6 pb-24 pt-36 md:pt-40`}>
        <HeroBackdrop />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center">
          <h1 className="mb-3 max-w-3xl text-center text-5xl text-white md:text-6xl">{t("Cum te pot ajuta?")}</h1>
          <p className="mb-10 max-w-2xl text-center text-lg text-secondary-fixed">
            {t("Selectează afecțiunea sau simptomele pentru care îți dorești o evaluare medicală. Poți alege mai multe variante, iar în cadrul consultației vom discuta istoricul medical, investigațiile efectuate și opțiunile de tratament.")}</p>
          <Triage />
        </div>
      </section>

      {/* UNDE MĂ GĂSEȘTI */}
      <section id="locatii" className="scroll-mt-24 bg-surface-lowest py-16 md:py-20">
        <div className="container-x">
          <div className="mb-10">
            <SectionTitle title={t("Unde mă găsești")} />
          </div>
          <LocationsMap />
        </div>
      </section>
      {/* CANALE DIRECTE */}
      <section className="bg-mist-bg px-6 py-16 md:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <h2 className="mb-10 text-center text-4xl text-primary">{t("Contact direct")}</h2>
          <div className="grid w-full grid-cols-1 divide-y divide-outline-variant/40 md:grid-cols-3 md:divide-x md:divide-y-0">
            {channels.map((c) => (
              <div key={c.label} className="flex flex-col items-center px-4 py-5 text-center md:py-0">
                <span className="mb-2 text-lg font-semibold text-primary">{t(c.label)}</span>
                <a
                  href={c.href}
                  className="text-on-surface transition-colors hover:text-primary"
                  {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {t(c.value)}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VREI SĂ TE SUN EU */}
      <section id="formular-programare" className="scroll-mt-24 bg-surface-lowest py-16 md:py-20">
        <div className="container-x">
          <div className="mb-10">
            <SectionTitle
              title={t("Vrei să te sun eu?")}
              intro={t("Lasă-mi numele și numărul de telefon, te sun pentru a stabili programarea.")}
            />
          </div>
          <CallbackForm twoColumns />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gradient-to-b from-mist-bg via-secondary-container to-surface-mid px-6 pb-28 pt-16 md:pb-32 md:pt-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-4xl text-primary md:text-5xl">{t("Întrebări frecvente")}</h2>
          <Faq items={faq} />
        </div>
      </section>

      {/* URGENȚE + MENȚIUNE: pe fundalul deschis de la final */}
      <section className="flex flex-col items-center gap-2 bg-surface-mid px-6 py-5">
        <p className="flex items-center justify-center gap-3 text-center text-[15px] font-semibold text-primary">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <span>
            {t("Pentru urgențe medicale sună la")}{" "}<a href="tel:112" className="underline underline-offset-2">112</a>.
          </span>
        </p>
        <p className="text-center text-xs text-on-surface-variant">{t(disclaimer)}</p>
      </section>
      </div>
      {/* Apariția lină a secțiunilor; rulează după ce pagina e hidratată. */}
      <ScrollReveal />
      <Footer lang={lang} />
    </>
  );
}

