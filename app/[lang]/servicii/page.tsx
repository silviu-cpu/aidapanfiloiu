import { translator } from "@/lib/translate";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/site/Footer";
import { alternates, getLang, localePath, type Locale } from "@/lib/i18n";
import Photo from "@/components/site/Photo";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import ConditionsGallery from "@/components/site/ConditionsGallery";
import HeroBackdrop, { heroSectionClass } from "@/components/site/HeroBackdrop";
import InvestigationsFile from "@/components/site/InvestigationsFile";
import ServicesTable from "@/components/site/ServicesTable";
import { ButtonLink, SectionTitle } from "@/components/site/ui";
import { contact, disclaimer, doctor, images, locations, surgeryNote } from "@/lib/content";

const laparoscopyBenefits = [
  "Câteva incizii mici",
  "Durere după operație de obicei mai redusă",
  "Internare de obicei scurtă",
  "Revenire mai rapidă la activitățile obișnuite",
  "Cicatrici discrete",
];

const before = [
  { title: "Analizele preoperatorii", text: "Analize de sânge, coagulare și investigațiile imagistice recomandate." },
  { title: "Consultul anestezic", text: "Evaluarea necesară pentru alegerea tipului de anestezie." },
  { title: "Lista medicamentelor", text: "Toate medicamentele pe care le iei, mai ales anticoagulantele sau antiagregantele." },
  { title: "Dosarul medical", text: "Documentele, biletele de ieșire anterioare și ecografiile recente." },
];

const after = [
  { title: "Mobilizare devreme", text: "Ridicarea din pat cât mai devreme, la recomandarea medicului." },
  { title: "Alimentație adaptată", text: "Reluarea treptată a alimentației, după indicațiile de la externare." },
  { title: "Îngrijirea plăgii", text: "Pansament curat și uscat, schimbat la intervalele stabilite." },
  { title: "Controlul programat", text: "Verificarea vindecării și, la nevoie, scoaterea firelor." },
];

const emergencies = [
  "O hernie dureroasă care nu mai intră la loc",
  "Durere abdominală puternică, cu febră sau îngălbenirea pielii",
  "Sângerare abundentă din zona anală",
  "O umflătură dureroasă cu febră în zona anală",
];

export async function generateMetadata({ params }: PageProps<"/[lang]/servicii">): Promise<Metadata> {
  const lang = await getLang(params);
  const t = translator(lang);
  return {
    title: t("Servicii"),
    description: t("Consultații de chirurgie generală și proctologie, chirurgie laparoscopică, tratamentul plăgilor și urmărire postoperatorie în București."),
    alternates: alternates(lang, "/servicii"),
  };
}

export default async function ServiciiPage({ params }: PageProps<"/[lang]/servicii">) {
  const lang = await getLang(params);
  const t = translator(lang);
  return (
    <>
      <SiteHeader lang={lang} current="/servicii" />
      <div className="site-page">
      {/* HERO */}
      <section className={`${heroSectionClass} pb-20 pt-36 text-white md:pt-40`}>
        <HeroBackdrop glow />
        <div className="container-x relative grid min-h-[440px] grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="flex flex-col items-start gap-5 lg:col-span-7">
            <h1 className="text-5xl text-white md:text-6xl">{t("Servicii")}</h1>
            <p className="max-w-xl text-lg text-surface-high">
              {t("Consultații, investigații și tratament chirurgical pentru afecțiunile abdominale, proctologice și plăgi, în București.")}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <ButtonLink href={localePath(lang, "/contact")} variant="light" appointment>
                {t("Programează o consultație")}</ButtonLink>
              <ButtonLink href="#locatii" variant="ghost-dark">
                {t("Unde mă găsești?")}</ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-5">
            {/* Cadru pătrat, ca poza (520 × 520) să apară întreagă, fără tăieturi. */}
            <div className="relative mx-auto aspect-square w-full max-w-[480px] overflow-hidden rounded-[2rem] bg-primary-container/40 shadow-xl lg:mr-0">
              {/* Fotografia doamnei doctor (520 × 520 px), servită fără recomprimare ca să rămână clară. */}
              <Photo
                src={images.doctor}
                alt={`${doctor.name}, ${t(doctor.title)}`}
                preload
                unoptimized
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* TABEL PERIODIC */}
      <section className="bg-surface py-16 md:py-20">
        <div className="container-x">
          <div className="mb-8">
            <SectionTitle title={t("Ce ofer")} intro={t("Alege un serviciu ca să vezi detaliile.")} />
          </div>
          <ServicesTable />
        </div>
      </section>

      {/* AFECȚIUNI: GALERIE LA SCROLL */}
      <ConditionsGallery />

      {/* INVESTIGAȚII: CARTOTECĂ */}
      <section className="overflow-hidden bg-mist-bg py-16 md:py-20">
        <div className="container-x">
          <SectionTitle
            center
            title={t("Investigații")}
            intro={t("Ce investigații s-ar putea să-ți recomand și cum te pregătești pentru ele.")}
          />
          <div className="mt-10 md:mt-0">
            <InvestigationsFile />
          </div>
        </div>
      </section>

      {/* CLASIC VS LAPAROSCOPIE */}
      <section className="bg-mist-bg py-16 md:py-20">
        <div className="container-x grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <SectionTitle
              title={t("Chirurgie clasică sau laparoscopie?")}
              intro={t("Laparoscopia pune accent pe confort și pe o recuperare mai rapidă, cu aceeași eficiență a intervenției.")}
            />
            <div className="flex flex-col gap-3 rounded-[2rem] bg-surface p-6">
              <span className="text-lg font-semibold text-primary">{t("Avantajele laparoscopiei")}</span>
              <ul className="flex flex-col gap-2 text-on-surface-variant">
                {laparoscopyBenefits.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {t(b)}
                  </li>
                ))}
              </ul>
              <p className="rounded-xl bg-surface-low p-3 text-sm text-on-surface-variant">
                {t("Alegerea tipului de intervenție se face la consultație, în funcție de fiecare caz.")}</p>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-primary/20 shadow-lg">
              <Photo
                src={images.operatingRoom}
                alt={t("Sală de operație luminoasă, pregătită înaintea unei intervenții")}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* URGENȚE */}
      <section className="bg-surface py-16 md:py-20">
        <div className="container-x">
          <div className="grid gap-8 border-y border-outline-variant/50 py-8 md:gap-12 md:py-10 lg:grid-cols-[1fr_2fr]">
            <div className="flex flex-col items-start gap-5">
              <h2 className="max-w-xs font-heading text-3xl leading-tight text-on-surface">{t("Mergi la urgență dacă ai:")}</h2>
              <a
                href="tel:112"
                className="inline-flex min-h-11 items-center text-base font-semibold text-alert underline decoration-alert/40 underline-offset-4 transition-colors hover:decoration-alert focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-alert"
              >
                {t("Sună la 112")}
              </a>
            </div>
            <ul className="divide-y divide-outline-variant/40 text-base leading-relaxed text-on-surface-variant">
              {emergencies.map((e) => (
                <li key={e} className="py-4 first:pt-0 last:pb-0">
                  {t(e)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ÎNAINTE ȘI DUPĂ */}
      <section className="bg-gradient-to-b from-surface via-secondary-container to-deep pb-24 pt-16 md:pb-32 md:pt-24">
        <div className="container-x">
          <div className="mb-10">
            <SectionTitle
              title={t("Ce trebuie să știi dacă ai nevoie de operație")}
              intro={t("O intervenție reușită înseamnă și o pregătire atentă, și o recuperare făcută corect.")}
            />
          </div>
          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
            <StepList lang={lang} title={t("Înainte de operație")} items={before} tone="dark" />
            {/* Săgeata de trecere dintre etape */}
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 z-10 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-surface bg-primary text-white shadow-lg md:flex"
            >
              <ArrowRight size={22} />
            </span>
            <span aria-hidden className="-my-3 flex justify-center md:hidden">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                <ArrowDown size={20} />
              </span>
            </span>
            <StepList lang={lang} title={t("După operație")} items={after} tone="light" />
          </div>
        </div>
      </section>

      {/* LOCAȚII */}
      <section className="bg-deep py-16 text-white md:py-20" id="locatii">
        <div className="container-x">
          <div className="mb-8">
            <SectionTitle
              light
              title={t("Unde mă găsești")}
              intro={t("Consultațiile și intervențiile se fac în clinici și spitale din București.")}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {locations.map((l) => (
              <div key={l.id} className="flex min-h-[160px] flex-col rounded-2xl bg-primary-container/60 p-5">
                <h3 className="font-sans font-semibold text-white">{t(l.name)}</h3>
                <p className="mt-4 text-sm leading-relaxed text-surface-high">{t(l.services)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-nav p-4">
            <span className="font-medium">
              {t(surgeryNote)}
            </span>
            <Link
              href={localePath(lang, "/contact#locatii")}
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-full border border-primary-fixed/25 bg-primary-fixed/5 px-5 py-2.5 text-sm font-semibold text-primary-fixed transition-colors hover:border-primary-fixed/50 hover:bg-primary-fixed/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed sm:w-auto"
            >
              {t("Vezi adresele și programul")}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 text-center">
          <h2 className="text-4xl text-primary md:text-5xl">{t("Nu ești sigur de ce ai nevoie?")}</h2>
          <p className="max-w-xl text-lg text-on-surface-variant">
            {t("Descrie-mi simptomele la consultație și găsim împreună răspunsul.")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href={localePath(lang, "/contact")} appointment>
              {t("Programează o consultație")}{" "}<ArrowRight size={16} />
            </ButtonLink>
            <ButtonLink href={contact.whatsappHref} variant="soft">
              {t("Scrie-mi pe WhatsApp")}</ButtonLink>
          </div>
          <p className="mt-4 text-xs text-on-surface-variant/70">{t(disclaimer)}</p>
        </div>
      </section>
      </div>
      <Footer lang={lang} />
    </>
  );
}

function StepList({
  lang,
  title,
  items,
  tone,
}: {
  title: string;
  items: { title: string; text: string }[];
  tone: "dark" | "light";
  lang: Locale;
}) {
  const t = translator(lang);
  const dark = tone === "dark";
  return (
    <div
      className={`flex flex-col gap-4 rounded-[2rem] p-6 md:p-8 ${
        dark ? "bg-primary-container text-white" : "bg-secondary-container text-primary"
      }`}
    >
      <h3 className={`text-2xl md:text-3xl ${dark ? "text-white" : "text-primary"}`}>{t(title)}</h3>
      <div className="flex flex-col gap-2">
        {items.map((it) => (
          <div key={it.title} className={`rounded-2xl p-4 ${dark ? "bg-white/10" : "bg-surface-lowest"}`}>
            <strong className={`block font-semibold ${dark ? "text-white" : "text-on-surface"}`}>{t(it.title)}</strong>
            <span className={dark ? "text-secondary-fixed-dim" : "text-on-surface-variant"}>{t(it.text)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
