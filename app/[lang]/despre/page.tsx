import { translator } from "@/lib/translate";
import { ScrollReveal } from "@/components/ScrollReveal";
import SectionFade from "@/components/site/SectionFade";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/site/Footer";
import { alternates, getLang, localePath, type Locale } from "@/lib/i18n";
import Photo from "@/components/site/Photo";
import ExperienceTimeline, { type ExperienceItem } from "@/components/site/ExperienceTimeline";
import HeroBackdrop, { heroSectionClass } from "@/components/site/HeroBackdrop";
import { ButtonLink } from "@/components/site/ui";
import { contact, doctor, featuredArticle, images } from "@/lib/content";

const experience: ExperienceItem[] = [
  { years: "2025 - prezent", title: "Prim asistent în chirurgia robotică Da Vinci, Intuitive, Viena" },
  {
    years: "2025 - prezent",
    title: "Medic specialist, MedLife (București, Brăila, Galați)",
    detail: "Consultații de chirurgie generală și proctologie, intervenții chirurgicale",
  },
  {
    years: "2025 - prezent",
    title: "Medic specialist, Victoria Medical Center",
    detail: "Consultații de chirurgie generală și proctologie",
  },
  { years: "2024 - prezent", title: "Medic specialist, Royal Hospital și M Hospital" },
  { years: "2024 - 2025", title: "Medic specialist, Spitalul Hipocrat 2000 Rahova" },
  { years: "2023 - 2025", title: "Medic specialist, Spitalul Universitar de Urgență București" },
  { years: "2016 - 2023", title: "Medic rezident, Spitalul Universitar de Urgență București" },
];

const education: { years?: string; title: string; institution?: string }[] = [
  { years: "2009–2015", title: "Facultatea de Medicină", institution: "Universitatea Titu Maiorescu, București" },
  { years: "2025", title: "Competență în chirurgie oncologică" },
  { title: "Competență în chirurgie laparoscopică nivel II – tehnici avansate" },
];

const conferences = [
  { name: "Congresul Național de Coloproctologie", year: "2019 și 2024" },
  { name: "Conferința Colegiului Medicilor București", year: "2024" },
  { name: "Conferința Națională de Chirurgie", year: "2023" },
  { name: "Tendințe și perspective în Gastroenterologie", year: "2023" },
  { name: "Conferința Națională ARCPA", year: "2017" },
];

export async function generateMetadata({ params }: PageProps<"/[lang]/despre">): Promise<Metadata> {
  const lang = await getLang(params);
  const t = translator(lang);
  return {
    title: t("Despre mine"),
    description: t("Dr. Aida Gabriela Panfiloiu, medic specialist chirurgie generală în București. Experiență în chirurgia clasică, laparoscopică și robotică."),
    alternates: alternates(lang, "/despre"),
  };
}

export default async function DesprePage({ params }: PageProps<"/[lang]/despre">) {
  const lang = await getLang(params);
  const t = translator(lang);
  return (
    <>
      <SiteHeader lang={lang} current="/despre" />
      <div className="site-page">
      {/* HERO */}
      <section className={`${heroSectionClass} pb-20 pt-36 md:pt-40`}>
        <HeroBackdrop />
        <div className="container-x relative">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="z-10 flex flex-col items-start gap-6 lg:col-span-7">
              <h1 className="text-5xl leading-tight text-white md:text-6xl">{t(doctor.name)}</h1>
              <p className="text-lg font-semibold text-mint">
                {t(doctor.title)}, {t(doctor.city)}
              </p>
              <p className="max-w-xl text-lg leading-relaxed text-white/90">
                {t("Mă preocupă în mod special situațiile în care simptomele digestive, colorectale și ginecologice se suprapun, cum se întâmplă uneori în endometrioză. Acolo, diagnosticul corect se construiește în echipă, iar rolul meu este să privesc dincolo de primul simptom.")}</p>
              <ButtonLink href={localePath(lang, "/contact")} variant="light" appointment>
                {t("Programează o consultație")}</ButtonLink>
            </div>

            <div className="relative flex min-h-[460px] items-center justify-center lg:col-span-5">
              <figure className="relative z-10 w-full max-w-[360px]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/20 bg-secondary-container">
                  <Photo
                    src={images.doctorAbout}
                    alt={`${doctor.name}, ${t(doctor.title)}`}
                    preload
                    sizes="(min-width: 1024px) 360px, 90vw"
                    className="object-cover object-top"
                  />
                </div>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* PREZENTARE PROFESIONALĂ */}
      <section className="bg-surface-lowest px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-3xl leading-snug text-on-surface md:text-[40px]">
            {t("Chirurgie generală, cu accent pe laparoscopie și proctologie")}
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-on-surface-variant md:text-lg">
            {t("Proctologia ocupă un loc important în practica mea. Evaluez și tratez hemoroizi, fisuri și fistule anale, abcese perianale și boala pilonidală. Pun accent pe discreție și pe explicarea diagnosticului, a opțiunilor de tratament și a pașilor următori.")}
          </p>
        </div>
      </section>

      <SectionFade from="surface-lowest" to="forest" />
      {/* EXPERIENȚĂ */}
      <ExperienceTimeline items={experience} />

      <SectionFade from="forest" to="surface-lowest" />
      {/* EDUCAȚIE */}
      <section className="bg-surface-lowest px-6 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-3xl leading-tight text-on-surface md:text-[40px]">{t("Studii și competențe")}</h2>
          <ul className="divide-y divide-surface-high/70 border-y border-surface-high/70">
            {education.map((e) => (
              <li key={e.title} className="grid gap-2 py-6 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
                <span className="pt-0.5 text-sm font-medium tabular-nums text-secondary">{e.years && t(e.years)}</span>
                <div>
                  <p className="text-lg font-medium leading-relaxed text-on-surface">{t(e.title)}</p>
                  {e.institution && <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{t(e.institution)}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CONGRESE ȘI CONFERINȚE */}
      <section className="bg-surface px-6 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-3xl leading-tight text-on-surface md:text-[40px]">{t("Congrese și conferințe")}</h2>
          <ul className="divide-y divide-surface-high/70 border-y border-surface-high/70">
            {conferences.map((c) => (
              <li key={c.name} className="grid gap-2 py-6 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
                <span className="pt-0.5 text-sm font-medium tabular-nums text-secondary">{t(c.year)}</span>
                <span className="text-base leading-relaxed text-on-surface">{t(c.name)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* EDUCAȚIE MEDICALĂ */}
      <section className="bg-gradient-to-b from-surface-lowest via-secondary-container to-deep-2 px-6 py-16 md:py-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-nav via-deep-2 to-primary-container text-white shadow-2xl">
          <div className="relative grid grid-cols-1 lg:grid-cols-12">
            <div className="flex flex-col justify-center gap-6 p-8 sm:p-12 lg:col-span-6 lg:p-16">
              <h2 className="text-4xl leading-tight md:text-5xl">{t("Dincolo de sala de operație")}</h2>
              <p className="text-lg leading-relaxed text-secondary-fixed-dim">
                {t("Sunt autor în cadrul ENDOpedia, platforma Asociației Vocea Endometriozei. Abordez teme de chirurgie generală, proctologie și sănătate digestivă, pentru a ajuta pacientele să înțeleagă mai bine informațiile medicale.")}</p>
              <a
                href="https://voceaendometriozei.ro/pages/autori/dr-aida-gabriela-panfiloiu"
                target="_blank"
                rel="noopener noreferrer"
                className="self-start text-base font-semibold text-mint underline decoration-mint/40 underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint"
              >
                {t("Vezi profilul pe ENDOpedia")}
              </a>
            </div>
            <article className="bg-mist-bg text-primary lg:col-span-6">
              <a
                href={featuredArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-labelledby="endopedia-article-title"
                className="group flex h-full flex-col focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Photo
                    src={featuredArticle.image}
                    alt={t(featuredArticle.imageAlt)}
                    sizes="(min-width: 1152px) 576px, (min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col items-start gap-4 p-7 sm:p-8">
                  <p className="text-xs font-semibold tracking-wide text-secondary">
                    {t("Articol publicat pe ENDOpedia")}
                  </p>
                  <h3 id="endopedia-article-title" className="text-2xl leading-snug sm:text-[28px]">
                    {t(featuredArticle.title)}
                  </h3>
                  <p className="text-base leading-relaxed text-on-surface-variant">
                    {t(featuredArticle.description)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold underline decoration-primary/30 underline-offset-4 transition-colors group-hover:text-primary-hover group-hover:decoration-primary">
                    {t("Citește articolul")}
                    <ExternalLink size={15} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
                  </span>
                </div>
              </a>
            </article>
          </div>
        </div>
      </section>

      <SectionFade from="deep-2" to="surface" />
      {/* CTA */}
      <section className="bg-gradient-to-b from-surface via-secondary-container/30 to-surface-low/60 px-6 py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
          <h2 className="text-4xl text-primary md:text-6xl">{t("Hai să vorbim despre ce te deranjează.")}</h2>
          <p className="max-w-xl text-lg leading-relaxed text-secondary">
            {t("O consultație îți poate aduce claritate și o direcție de tratament sigură, cu răspunsuri la toate întrebările tale.")}</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ButtonLink href={localePath(lang, "/contact")} appointment>{t("Programează o consultație")}</ButtonLink>
            <ButtonLink href={contact.whatsappHref} variant="light">
              {t("Scrie-mi pe WhatsApp")}</ButtonLink>
          </div>
        </div>
      </section>
      </div>
      {/* Apariția lină a secțiunilor; rulează după ce pagina e hidratată. */}
      <ScrollReveal />
      <Footer lang={lang} />
    </>
  );
}
