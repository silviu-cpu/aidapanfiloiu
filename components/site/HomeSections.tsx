import { translator } from "@/lib/translate";

import SectionFade from "@/components/site/SectionFade";
import { localePath, type Locale } from "@/lib/i18n";
import Link from "next/link";
import Photo from "@/components/site/Photo";
import {
  Activity,
  ArrowRight,
  Bandage,
  Building2,
  Clock,
  CircleCheck,
  ClipboardCheck,
  Droplets,
  Ear,
  Eye,
  GitMerge,
  HeartPulse,
  Hospital,
  Layers,
  MessageCircle,
  Microscope,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { ButtonLink, Faq } from "@/components/site/ui";
import { doctor, images, surgeryNote, testimonials } from "@/lib/content";
import TestimonialCarousel from "@/components/site/TestimonialCarousel";

// Textele din documentul primit de la doamna doctor (AidaPanfi.docx).
const highlights = [
  { value: "10+ ani de experiență", label: "Chirurgie generală", detail: "Abordări chirurgicale clasice și minim invazive" },
  { value: "Chirurgie laparoscopică și robotică", label: "Tehnici chirurgicale moderne", detail: "Intervenții asistate robotic în echipe multidisciplinare" },
  { value: "Proctologie", label: "Evaluare și diagnostic", detail: "Tratament individualizat al afecțiunilor anorectale" },
  { value: "Îngrijirea plăgilor", label: "Plăgi acute, cronice și postoperatorii", detail: "Pansamente și monitorizarea vindecării" },
];

const steps = [
  {
    num: "01",
    icon: MessageCircle,
    title: "Discuția inițială și istoricul medical",
    text: ["Consultația începe cu o discuție despre simptome, momentul apariției acestora, evoluția lor și antecedentele medicale personale și familiale relevante. Fiecare informație contribuie la înțelegerea particularităților cazului."],
    note: "Anamneză și evaluare individualizată",
  },
  {
    num: "02",
    icon: Microscope,
    title: "Examinarea clinică și analiza investigațiilor",
    text: ["Examinarea clinică este completată, atunci când este necesar, de analiza investigațiilor existente, precum ecografii, analize de laborator, CT, RMN sau colonoscopii. În funcție de rezultatele evaluării, pot fi recomandate investigații suplimentare."],
    note: "Corelarea datelor clinice și paraclinice",
  },
  {
    num: "03",
    icon: ClipboardCheck,
    title: "Stabilirea conduitei terapeutice",
    text: [
      "Pe baza evaluării, sunt discutate diagnosticul sau suspiciunea diagnostică și opțiunile de tratament disponibile, de la monitorizare și tratament conservator până la proceduri ambulatorii sau intervenții chirurgicale, atunci când există indicație.",
      "Pacientului îi sunt explicate beneficiile, riscurile și alternativele relevante, pentru a putea participa informat la decizia terapeutică.",
    ],
    note: "Decizie medicală individualizată și informată",
  },
];

const homeConditions = [
  {
    icon: Layers,
    title: "Hernii inghinale și ombilicale",
    text: "Evaluarea și tratamentul herniilor peretelui abdominal, prin tehnici chirurgicale clasice sau minim invazive, în funcție de particularitățile fiecărui caz.",
    link: "Chirurgia peretelui abdominal",
  },
  {
    icon: Droplets,
    title: "Litiază biliară și afecțiuni ale colecistului",
    text: "Evaluarea afecțiunilor vezicii biliare și tratamentul chirurgical atunci când există indicație, inclusiv prin colecistectomie laparoscopică.",
    link: "Chirurgie laparoscopică",
  },
  {
    icon: Activity,
    title: "Hemoroizi",
    text: "Diagnostic și tratament individualizat al bolii hemoroidale, de la măsuri conservatoare și proceduri ambulatorii până la intervenții chirurgicale, în funcție de severitate și simptomatologie.",
    link: "Proctologie",
  },
  {
    icon: HeartPulse,
    title: "Fisuri anale",
    text: "Evaluarea și tratamentul fisurilor anale prin măsuri conservatoare, tratament medicamentos sau intervenție chirurgicală, în cazurile în care aceasta este indicată.",
    link: "Tratament individualizat",
  },
  {
    icon: GitMerge,
    title: "Fistule perianale și boală pilonidală",
    text: "Diagnostic și tratament chirurgical adaptat localizării și complexității afecțiunii, cu monitorizarea evoluției postoperatorii.",
    link: "Chirurgie proctologică",
  },
  {
    icon: Bandage,
    title: "Plăgi acute, cronice și postoperatorii",
    text: "Evaluarea și tratamentul plăgilor, prin curățare, debridare atunci când este indicată, pansamente adaptate tipului de plagă și monitorizarea procesului de vindecare.",
    link: "Îngrijirea și tratamentul plăgilor",
  },
];

const homeLocations = [
  {
    icon: Building2,
    name: "Clinica Victoria",
    area: "Bd. Regina Elisabeta",
    text: "Consultații de chirurgie generală, cu bilet de trimitere.",
  },
  {
    icon: Hospital,
    name: "Clinica Dr. Plagă",
    area: "Enayati Băneasa",
    text: "Tratamente dedicate pentru plăgi complexe și pansamente avansate.",
  },
  {
    icon: Stethoscope,
    name: "Spitalul MedLife",
    area: "Titan și Grivița",
    text: "Consultații de chirurgie și proctologie, intervenții laparoscopice și chirurgia herniilor.",
  },
  {
    icon: ShieldCheck,
    name: "Royal Hospital",
    area: "Spital multidisciplinar",
    text: "Consultații de chirurgie și proctologie, intervenții chirurgicale.",
  },
];

const faq = [
  {
    q: "Cum mă pregătesc pentru prima consultație de chirurgie generală?",
    a: "Nu este necesară o pregătire specială, cu excepția situațiilor în care ți s-a recomandat expres repaus alimentar. Îți recomand să porți haine comode și să aduci toate documentele medicale anterioare.",
  },
  {
    q: "Ce documente și investigații aduc la prima vizită?",
    a: "Adu actul de identitate, analizele de sânge recente (dacă există), ecografiile abdominale, rezultatele CT sau RMN, biletele de ieșire din spital și lista cu medicația pe care o urmezi.",
  },
  {
    q: "Când este recomandată intervenția laparoscopică?",
    a: "Chirurgia laparoscopică (minim invazivă) este standardul pentru litiaza biliară (pietre la fiere) și pentru majoritatea herniilor abdominale și inghinale, reducând semnificativ durerea și timpul de spitalizare.",
  },
  {
    q: "Cum decurge recuperarea după operație?",
    a: "Datorită tehnicilor minim invazive, mobilizarea are loc de obicei la câteva ore după operație. Durata spitalizării și recuperării variază în funcție de intervenție și evoluția postoperatorie.",
  },
];

/** Secțiunile de pe Acasă, de sub hero-ul cu animația 3D. */
export default function HomeSections({ lang }: { lang: Locale }) {
  const t = translator(lang);
  return (
    <>
      {/* HIGHLIGHTS */}
      <section className="bg-surface-lowest py-10">
        {/* Pe telefon câte un card pe rând: titlurile lungi („Laparoscopie”) nu încap pe jumătate de ecran. */}
        <div className="container-x grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.value} className="flex flex-col rounded-3xl bg-surface-low/60 p-5">
              <span className="font-heading text-2xl leading-tight text-primary md:text-3xl">{t(h.value)}</span>
              <span className="mt-2 text-[15px] font-semibold text-on-surface">{t(h.label)}</span>
              <span className="mt-0.5 text-sm text-on-surface-variant">{t(h.detail)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* DESPRE */}
      <section className="bg-surface-lowest py-16 md:py-20">
        <div className="container-x grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Fotografia doamnei doctor (520 × 520 px), servită fără recomprimare ca să rămână clară. */}
          <div className="flex justify-center lg:col-span-4">
            <div className="relative aspect-[4/5] w-full max-w-[380px] overflow-hidden rounded-[2rem] bg-surface-low shadow-xl">
              <Photo
                src={images.doctor}
                alt={`${doctor.name}, ${t(doctor.title)}`}
                sizes="380px"
                unoptimized
                className="object-cover object-top"
              />
            </div>
          </div>
          <div className="flex flex-col gap-8 lg:col-span-8">
            <h2 className="text-3xl leading-tight text-on-surface md:text-[44px]">
              {t("O îngrijire medicală corectă începe cu o evaluare atentă.")}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <p className="leading-relaxed text-on-surface-variant">
                {t("Sunt Dr. Aida Gabriela Panfiloiu, medic specialist în chirurgie generală. Consider că actul medical nu se limitează la intervenția chirurgicală, ci începe cu o evaluare atentă, înțelegerea istoricului medical și o comunicare deschisă cu fiecare pacient.")}</p>
              <p className="leading-relaxed text-on-surface-variant">
                {t("Activitatea mea include chirurgia generală, proctologia, evaluarea și tratamentul plăgilor, precum și abordările chirurgicale clasice și minim invazive. Practic chirurgia laparoscopică și particip la intervenții asistate robotic, în cadrul echipelor multidisciplinare, în care colaborarea dintre specialități este esențială pentru gestionarea cazurilor complexe.")}</p>
              <p className="leading-relaxed text-on-surface-variant md:col-span-2">
                {t("Fiecare recomandare terapeutică are la bază particularitățile pacientului, dovezile științifice actuale și alegerea unei conduite medicale adaptate diagnosticului.")}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: Ear, label: "Evaluare individualizată" },
                { icon: Stethoscope, label: "Chirurgie modernă" },
                { icon: Eye, label: "Decizii medicale informate" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-3xl bg-surface-low p-4">
                  <Icon className="text-primary" size={22} />
                  <span className="text-[15px] font-semibold text-on-surface">{t(label)}</span>
                </div>
              ))}
            </div>
            <Link
              href={localePath(lang, "/despre")}
              className="inline-flex max-w-max items-center gap-2 font-semibold text-primary hover:underline"
            >
              {t("Citește mai mult despre mine")}{" "}<ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ETAPE */}
      <section className="bg-surface-low/60 py-16 md:py-20">
        <div className="container-x">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="text-3xl text-on-surface md:text-[44px]">
              {t("Cum decurge consultația chirurgicală?")}</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {steps.map(({ num, icon: Icon, title, text, note }) => (
              <div
                key={num}
                className="flex flex-col rounded-[2rem] bg-surface-lowest p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-heading text-2xl text-primary">{t(num)}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-primary">
                    <Icon size={18} />
                  </span>
                </div>
                <h3 className="mb-2 font-sans text-lg font-semibold text-on-surface">{t(title)}</h3>
                <div className="flex flex-col gap-3 leading-relaxed text-on-surface-variant">
                  {text.map((paragraph) => (
                    <p key={paragraph}>{t(paragraph)}</p>
                  ))}
                </div>
                <div className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
                  <CircleCheck size={16} />
                  {t(note)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AFECȚIUNI */}
      <section className="overflow-hidden bg-gradient-to-b from-surface via-secondary-container to-deep-2 py-16 md:py-24">
        <div className="container-x">
          <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-3 text-center">
            <h2 className="text-3xl text-primary md:text-[44px]">{t("Afecțiuni evaluate și tratate")}</h2>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {homeConditions.map(({ icon: Icon, title, text, link }) => (
              <Link
                key={title}
                href={localePath(lang, "/servicii")}
                className="group flex min-h-[260px] flex-col rounded-[1.75rem] bg-surface-lowest p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-container/60 text-primary">
                  <Icon size={20} />
                </span>
                <h3 className="mb-3 font-sans text-lg font-semibold text-on-surface">{t(title)}</h3>
                <p className="text-[15px] leading-relaxed text-on-surface-variant">{t(text)}</p>
                <span className="mt-auto flex items-center justify-between pt-6 text-sm font-semibold text-primary">
                  {t(link)}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <ButtonLink href={localePath(lang, "/contact")} variant="light" appointment>
              {t("Programează o consultație")}{" "}<ArrowRight size={16} />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* RECENZII: se schimbă singure, cu animație. TODO: înlocuite cu recenzii reale, cu acordul pacienților. */}
      <section className="relative overflow-hidden bg-deep-2 py-20">
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <TestimonialCarousel
            items={testimonials.map((item) => ({ text: t(item.text), author: t(item.author), role: t(item.role) }))}
            labels={{
              region: t("Recenziile pacienților"),
              review: t("Recenzia"),
              pause: t("Oprește derularea recenziilor"),
              play: t("Pornește derularea recenziilor"),
              stars: t("5 din 5 stele"),
            }}
          />
        </div>
      </section>

      {/* LOCAȚII */}
      <section className="bg-deep-2 pb-20 pt-4" id="locatii">
        <div className="container-x">
          <div className="rounded-[2.5rem] bg-surface-lowest p-6 shadow-2xl md:p-10">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="flex flex-col gap-4 lg:col-span-5">
                <h2 className="text-3xl leading-tight text-on-surface md:text-[40px]">
                  {t("Centre de consultații și spitale partenere")}</h2>
                <p className="leading-relaxed text-on-surface-variant">
                  {t("Activitatea chirurgicală este împărțită între cabinete pentru consultații și diagnostic și spitale dotate cu bloc operator complet pentru intervenții.")}{" "}{t(surgeryNote)}
                </p>
                <ButtonLink href={localePath(lang, "/contact#locatii")} className="max-w-max">
                  {t("Vezi programul disponibil")}{" "}<Clock size={16} />
                </ButtonLink>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
                {homeLocations.map(({ icon: Icon, name, area, text }) => (
                  <div
                    key={name}
                    className="flex flex-col rounded-3xl bg-surface-low/70 p-5 transition-colors hover:bg-surface-low"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-semibold text-primary">{t(name)}</span>
                      <Icon className="text-primary" size={20} />
                    </div>
                    <span className="text-xs font-semibold text-secondary">{t(area)}</span>
                    <p className="mt-2 text-sm text-on-surface-variant">{t(text)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionFade from="deep-2" to="surface-lowest" />
      {/* FAQ */}
      <section className="bg-surface-lowest py-16 md:py-20" id="intrebari">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6">
          <h2 className="text-center text-3xl text-on-surface md:text-[44px]">
            {t("Tot ce trebuie să știi înainte de consultație")}</h2>
          <Faq items={faq} />
          <div className="flex justify-center pt-2">
            <ButtonLink href={localePath(lang, "/contact")} appointment>{t("Solicită o programare")}</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
