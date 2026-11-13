import { translator } from "@/lib/translate";


import { ScrollReveal } from "@/components/ScrollReveal";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/site/Footer";
import { getLang, localePath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import Photo from "@/components/site/Photo";
import ExperienceTimeline, { type ExperienceItem } from "@/components/site/ExperienceTimeline";
import HeroBackdrop, { heroSectionClass } from "@/components/site/HeroBackdrop";
import { ButtonLink } from "@/components/site/ui";
import { contact, doctor, featuredArticle, images } from "@/lib/content";

// Textele din documentul primit de la doamna doctor (AidaPanfi.docx).
/** Câte paragrafe din „Despre mine” încap sus, lângă poză; restul continuă imediat dedesubt. */
const HERO_PARAGRAPHS = 2;

const practiceText = [
  "În activitatea mea medicală, urmăresc ca fiecare pacient să beneficieze de o evaluare atentă, de explicații clare și de recomandări fundamentate pe dovezi științifice actuale.",
  "Evaluez și tratez afecțiuni chirurgicale abdominale și ale peretelui abdominal, precum herniile și patologia vezicii biliare, dar și afecțiuni proctologice, inclusiv boala hemoroidală, fisurile și fistulele anale, abcesele perianale și boala pilonidală.",
  "O altă componentă importantă a practicii mele este evaluarea și tratamentul plăgilor acute, cronice și postoperatorii, prin îngrijire locală, pansamente adaptate și monitorizarea procesului de vindecare.",
  "Practic chirurgia laparoscopică și particip la intervenții chirurgicale asistate robotic în calitate de prim asistent, în cadrul echipelor multidisciplinare. Această colaborare este deosebit de importantă în cazurile complexe, inclusiv atunci când afecțiunile digestive, colorectale și ginecologice necesită o abordare comună.",
  "Consider că o decizie medicală corectă presupune nu doar stabilirea diagnosticului, ci și înțelegerea nevoilor pacientului, discutarea alternativelor terapeutice și explicarea beneficiilor și riscurilor fiecărei opțiuni.",
];

const aboutText = [
  "Sunt Dr. Aida Gabriela Panfiloiu, medic specialist în chirurgie generală, cu activitate în diagnosticul și tratamentul afecțiunilor chirurgicale, atât prin tehnici convenționale, cât și minim invazive.",
  "În practica mea medicală, acord o importanță deosebită evaluării individualizate, stabilirii unei indicații chirurgicale corecte și comunicării deschise cu fiecare pacient. Consider că un tratament adecvat începe cu înțelegerea diagnosticului, a istoricului medical și a particularităților fiecărui caz.",
  "Activitatea mea include consultații de chirurgie generală și proctologie, evaluarea și tratamentul afecțiunilor abdominale și ale peretelui abdominal, precum și îngrijirea plăgilor acute, cronice și postoperatorii. Aceasta presupune evaluarea procesului de vindecare, tratamentul local al plăgilor și monitorizarea evoluției, în funcție de necesitățile fiecărui pacient.",
  "Practic chirurgia laparoscopică și particip la intervenții chirurgicale asistate robotic, în calitate de prim asistent, în cadrul echipelor multidisciplinare. Colaborarea dintre specialități are un rol important în abordarea cazurilor complexe și în stabilirea unei conduite terapeutice individualizate.",
  "Cred într-o medicină bazată pe dovezi științifice, în care experiența profesională și tehnologiile moderne sunt completate de responsabilitate, empatie și respect față de pacient.",
  "Îmi doresc ca fiecare pacient să înțeleagă diagnosticul, opțiunile de tratament și etapele recuperării, pentru a putea lua decizii informate privind propria sănătate.",
];

const educationText = [
  "Cred că accesul la informații medicale corecte și ușor de înțeles contribuie la recunoașterea simptomelor, prezentarea la timp la medic și luarea unor decizii informate.",
  "Sunt autor în cadrul ENDOpedia, platforma educațională a Asociației Vocea Endometriozei, unde abordez subiecte de chirurgie generală, proctologie și sănătate digestivă.",
  "Un interes aparte îl reprezintă situațiile în care simptomele digestive și proctologice se suprapun cu manifestările unor afecțiuni ginecologice, precum endometrioza. În aceste cazuri, evaluarea corectă și colaborarea dintre specialități pot avea un rol important în stabilirea diagnosticului și a conduitei terapeutice.",
];

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
  return pageMetadata({
    lang,
    path: "/despre",
    title: t("Despre mine"),
    description: t("Dr. Aida Gabriela Panfiloiu, medic specialist chirurgie generală în București. Experiență în chirurgia clasică, laparoscopică și robotică."),
  });
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
                {t(doctor.title)} | {t(doctor.city)}
              </p>
              <div className="flex max-w-xl flex-col gap-4 text-lg leading-relaxed text-white/90">
                {aboutText.slice(0, HERO_PARAGRAPHS).map((paragraph) => (
                  <p key={paragraph}>{t(paragraph)}</p>
                ))}
              </div>
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

      {/* DESPRE MINE (continuarea textului de sus) ȘI PREZENTARE PROFESIONALĂ */}
      {/* Două chenare albe, unul sub altul, pe gradientul care coboară spre verdele de dedesubt. */}
      <section className="flex flex-col gap-8 bg-gradient-to-b from-surface-lowest via-secondary-container to-forest px-6 py-16 md:gap-10 md:py-24">
        <div className="mx-auto w-full max-w-4xl rounded-[2.5rem] bg-surface-lowest px-6 py-12 text-center shadow-xl md:px-16 md:py-16">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 text-base leading-relaxed text-on-surface-variant md:text-lg">
            {aboutText.slice(HERO_PARAGRAPHS).map((paragraph) => (
              <p key={paragraph}>{t(paragraph)}</p>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl rounded-[2.5rem] bg-surface-lowest px-6 py-12 text-center shadow-xl md:px-16 md:py-16">
          <h2 className="font-heading text-3xl leading-snug text-on-surface md:text-[40px]">
            {t("Chirurgie generală, proctologie și abordări minim invazive")}
          </h2>
          <div className="mx-auto mt-6 flex max-w-3xl flex-col gap-4 text-base leading-relaxed text-on-surface-variant md:text-lg">
            {practiceText.map((paragraph) => (
              <p key={paragraph}>{t(paragraph)}</p>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENȚĂ */}
      <ExperienceTimeline items={experience} />

      {/* EDUCAȚIE */}
      {/* Pornește din verdele secțiunii de sus și se deschide în spatele cardului cu lista. */}
      <section className="bg-gradient-to-b from-forest via-secondary-container to-surface-lowest px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-3xl leading-tight text-white md:text-[40px]">{t("Studii, competențe și pregătire profesională")}</h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-white/85">
            {t("Pregătirea continuă reprezintă o componentă esențială a practicii mele medicale, contribuind la actualizarea cunoștințelor și integrarea tehnicilor chirurgicale moderne în îngrijirea pacienților.")}
          </p>
          <ul className="divide-y divide-surface-high/70 rounded-[2rem] bg-surface-lowest px-6 shadow-xl md:px-10">
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
      <section className="bg-surface-lowest px-6 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-3xl leading-tight text-on-surface md:text-[40px]">{t("Participare la congrese și evenimente științifice")}</h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-on-surface-variant">
            {t("Participarea la congrese și conferințe medicale îmi oferă oportunitatea de a urmări evoluția practicilor chirurgicale, de a aprofunda teme de interes profesional și de a integra informații științifice actuale în activitatea clinică.")}
          </p>
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
      <section className="bg-gradient-to-b from-surface-lowest via-secondary-container to-surface px-6 py-16 md:py-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-nav via-deep-2 to-primary-container text-white shadow-2xl">
          <div className="relative grid grid-cols-1 lg:grid-cols-12">
            <div className="flex flex-col justify-center gap-6 p-8 sm:p-12 lg:col-span-6 lg:p-16">
              <h2 className="text-4xl leading-tight md:text-5xl">{t("Educație medicală și informarea pacienților")}</h2>
              <div className="flex flex-col gap-4 text-lg leading-relaxed text-secondary-fixed-dim">
                {educationText.map((paragraph) => (
                  <p key={paragraph}>{t(paragraph)}</p>
                ))}
              </div>
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

      {/* CTA */}
      <section className="bg-gradient-to-b from-surface via-secondary-container/30 to-surface-low/60 px-6 py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
          <h2 className="text-4xl text-primary md:text-5xl">{t("Primul pas către tratamentul potrivit începe cu o evaluare medicală.")}</h2>
          <p className="max-w-2xl text-lg leading-relaxed text-secondary">
            {t("Fie că te confrunți cu simptome proctologice, o afecțiune chirurgicală sau ai nevoie de evaluarea și îngrijirea unei plăgi, consultația este momentul în care discutăm istoricul medical, simptomele și opțiunile de investigație sau tratament.")}</p>
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
