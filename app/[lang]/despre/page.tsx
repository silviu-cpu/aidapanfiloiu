import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/site/Footer";
import { alternates, getLang } from "@/lib/i18n";
import Photo from "@/components/site/Photo";
import ExperienceTimeline, { type ExperienceItem } from "@/components/site/ExperienceTimeline";
import HeroBackdrop, { heroSectionClass } from "@/components/site/HeroBackdrop";
import { ButtonLink } from "@/components/site/ui";
import { contact, doctor, images } from "@/lib/content";

const experience: ExperienceItem[] = [
  { years: "2025 - prezent", title: "Prim asistent în chirurgia robotică Da Vinci, Intuitive, Viena" },
  {
    years: "2025 - prezent",
    title: "Medic specialist, MedLife (București, Brăila, Galați)",
    detail: "Consultații de chirurgie generală și proctologie, intervenții chirurgicale",
  },
  {
    years: "2025 - prezent",
    title: "Medic specialist, Clinica Victoria",
    detail: "Consultații de chirurgie generală și proctologie",
  },
  { years: "2024 - prezent", title: "Medic specialist, Royal Hospital și M Hospital" },
  { years: "2024 - 2025", title: "Medic specialist, Spitalul Hipocrat 2000 Rahova" },
  { years: "2023 - 2025", title: "Medic specialist, Spitalul Universitar de Urgență București" },
  { years: "2016 - 2023", title: "Medic rezident, Spitalul Universitar de Urgență București" },
];

const education = [
  { years: "2009 - 2015", title: "Universitatea Titu Maiorescu, Facultatea de Medicină" },
  { years: "2025", title: "Competență în chirurgie oncologică" },
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
  return {
    title: "Despre mine",
    description:
      "Dr. Aida Gabriela Panfiloiu, medic specialist chirurgie generală în București. Experiență în chirurgia clasică, laparoscopică și robotică.",
    alternates: alternates(lang, "/despre"),
  };
}

export default async function DesprePage({ params }: PageProps<"/[lang]/despre">) {
  const lang = await getLang(params);
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
              <h1 className="text-5xl leading-tight text-white md:text-6xl">{doctor.name}</h1>
              <p className="text-lg font-semibold text-mint">
                {doctor.title}, {doctor.city}
              </p>
              <p className="max-w-xl text-lg leading-relaxed text-white/90">
                Sunt medic specialist în chirurgie generală, cu experiență în chirurgia clasică și
                laparoscopică, dobândită în Spitalul Universitar de Urgență București, atât în chirurgia
                programată, cât și în cea de urgență.
              </p>
              <ButtonLink href="/contact" variant="light">
                Programează o consultație
              </ButtonLink>
            </div>

            <div className="relative flex min-h-[460px] items-center justify-center lg:col-span-5">
              <div className="absolute h-[440px] w-[440px] rounded-full bg-gradient-to-tr from-secondary-container/40 via-surface-lowest/60 to-transparent blur-2xl" />
              <figure className="relative z-10 w-full max-w-[360px]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/20 bg-white/15 shadow-2xl">
                  <Photo
                    src={images.doctor}
                    alt={`${doctor.name}, ${doctor.title}`}
                    preload
                    sizes="(min-width: 1024px) 360px, 90vw"
                    className="object-cover object-top"
                  />
                </div>
                <figcaption className="absolute -bottom-5 left-1/2 w-max -translate-x-1/2 rounded-full bg-white/90 px-5 py-2 text-center text-sm font-semibold text-primary shadow-lg backdrop-blur-md">
                  {doctor.name}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="bg-surface-lowest px-6 py-20">
        <blockquote className="mx-auto max-w-4xl text-center font-heading text-3xl leading-snug text-on-surface md:text-[40px]">
          „Ce mă definește cel mai mult este dorința de a trata corect cât mai mulți pacienți și de a
          fi mereu la curent cu noile tratamente.”
        </blockquote>
      </section>

      {/* EXPERIENȚĂ */}
      <section className="relative overflow-hidden bg-forest px-6 py-24 text-white">
        <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
        <div className="relative mx-auto max-w-4xl">
          <h2 className="mb-3 text-4xl text-white md:text-5xl">Experiență profesională</h2>
          <p className="mb-14 text-lg text-mist">Parcursul meu, de la rezidențiat până azi.</p>
          <ExperienceTimeline items={experience} />
        </div>
      </section>

      {/* EDUCAȚIE */}
      <section className="bg-surface-lowest px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-4xl text-on-surface md:text-5xl">Educație</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {education.map((e) => (
              <div key={e.title} className="flex flex-col gap-1 rounded-3xl bg-surface-low p-6">
                <span className="text-sm font-semibold text-primary">{e.years}</span>
                <p className="text-on-surface">{e.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONGRESE ȘI CONFERINȚE */}
      <section className="bg-surface px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-4xl text-on-surface md:text-5xl">Congrese și conferințe</h2>
          <ul className="divide-y divide-surface-high">
            {conferences.map((c) => (
              <li key={c.name} className="flex items-center justify-between gap-4 py-4">
                <span className="text-on-surface">{c.name}</span>
                <span className="shrink-0 text-sm font-semibold text-secondary">{c.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* NOTĂ PERSONALĂ */}
      <section className="bg-gradient-to-b from-surface-lowest via-secondary-container to-deep-2 px-6 py-16 md:py-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-nav via-deep-2 to-primary-container text-white shadow-2xl">
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-15" />
          <div className="relative grid grid-cols-1 lg:grid-cols-12">
            <div className="flex flex-col justify-center gap-6 p-8 sm:p-12 lg:col-span-6 lg:p-16">
              <h2 className="text-4xl leading-tight md:text-5xl">Dincolo de sala de operație</h2>
              <p className="text-lg leading-relaxed text-secondary-fixed-dim">
                Sunt o persoană responsabilă, punctuală și comunicativă. Îmi place ordinea și cred că
                fiecare pacient merită să plece de la consultație știind exact ce urmează.
              </p>
            </div>
            <div className="relative min-h-[300px] lg:col-span-6">
              <Photo
                src={images.suture}
                alt="Instrument chirurgical cu fir de sutură"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-surface via-secondary-container/30 to-surface-low/60 px-6 py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
          <h2 className="text-4xl text-primary md:text-6xl">Hai să vorbim despre ce te deranjează.</h2>
          <p className="max-w-xl text-lg leading-relaxed text-secondary">
            O consultație îți poate aduce claritate și o direcție de tratament sigură, cu răspunsuri la
            toate întrebările tale.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ButtonLink href="/contact">Programează o consultație</ButtonLink>
            <ButtonLink href={contact.whatsappHref} variant="light">
              Scrie-mi pe WhatsApp
            </ButtonLink>
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </>
  );
}
