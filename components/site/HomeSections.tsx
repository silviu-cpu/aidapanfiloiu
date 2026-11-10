import { translator } from "@/lib/translate";
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

// Categoriile din Stitch, fără cifrele inventate (98%, 4.9 stele, 100%).
// TODO: „10+ ani” (rezidențiat din 2016) de confirmat cu doamna doctor.
const highlights = [
  { value: "10+ ani", label: "Chirurgie generală", detail: "Abord minim invaziv și clasic" },
  { value: "Laparoscopie", label: "Chirurgie minim invazivă", detail: "Tehnici chirurgicale de precizie" },
  { value: "Proctologie", label: "Diagnostic atent", detail: "Tratament adaptat fiecărui caz" },
  { value: "Plăgi", label: "Îngrijirea plăgilor", detail: "Pansamente moderne și monitorizare" },
];

const steps = [
  {
    num: "01",
    icon: MessageCircle,
    title: "Consultația și ascultarea",
    text: "Discuție detaliată despre debutul simptomelor, intensitatea durerii și istoricul medical familial și personal, într-un mediu calm și confidențial.",
    note: "Timp alocat fără grabă",
  },
  {
    num: "02",
    icon: Microscope,
    title: "Evaluarea clinică și imagistică",
    text: "Examinare clinică atentă și analiza documentelor medicale preexistente (ecografii abdominale, analize uzuale, examinări CT/RMN sau colonoscopii).",
    note: "Corelarea datelor imagistice",
  },
  {
    num: "03",
    icon: ClipboardCheck,
    title: "Planul de tratament personalizat",
    text: "Stabilirea diagnosticului chirurgical și prezentarea clară a opțiunilor: tratament conservator, manevre ambulatorii sau intervenție chirurgicală programată.",
    note: "Decizie comună informată",
  },
];

const homeConditions = [
  {
    icon: Layers,
    title: "Hernii inghinale și ombilicale",
    text: "Intervenții de regulă laparoscopice, cu plasă de întărire, pentru o recuperare mai rapidă.",
    link: "Abord laparoscopic",
  },
  {
    icon: Droplets,
    title: "Colecist și litiază biliară",
    text: "Colecistectomie laparoscopică, cu incizii mici și internare de obicei scurtă.",
    link: "Chirurgie minim invazivă",
  },
  {
    icon: Activity,
    title: "Hemoroizi",
    text: "Diagnostic discret și tratament adaptat stadiului, de la conservator la minim invaziv.",
    link: "Proctologie",
  },
  {
    icon: HeartPulse,
    title: "Fisuri anale",
    text: "Tratament inițial conservator și intervenție atunci când fisura nu se vindecă.",
    link: "Tratament adaptat",
  },
  {
    icon: GitMerge,
    title: "Fistule perianale și pilonidale",
    text: "Intervenții chirurgicale adaptate fiecărui caz, cu urmărire până la vindecare.",
    link: "Evaluare clinică",
  },
  {
    icon: Bandage,
    title: "Plăgi de orice tip",
    text: "Curățare, pansamente moderne și monitorizare atentă a vindecării.",
    link: "Tratamentul plăgilor",
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
    // TODO: duratele de confirmat cu doamna doctor.
    a: "Datorită tehnicilor minim invazive, mobilizarea are loc de obicei la câteva ore după operație. Majoritatea pacienților sunt externați în 24 până la 48 de ore și își reiau activitățile ușoare în decurs de o săptămână.",
  },
];

/** Secțiunile de pe Acasă, de sub hero-ul cu animația 3D. */
export default function HomeSections({ lang }: { lang: Locale }) {
  const t = translator(lang);
  return (
    <>
      {/* HIGHLIGHTS */}
      <section className="bg-surface-lowest py-10">
        <div className="container-x grid grid-cols-2 gap-4 md:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.value} className="flex flex-col rounded-3xl bg-surface-low/60 p-5">
              <span className="font-heading text-3xl text-primary md:text-4xl">{t(h.value)}</span>
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
              {t("Un plan de tratament începe cu o evaluare atentă și o discuție clară.")}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <p className="leading-relaxed text-on-surface-variant">
                {t("Sunt")}{" "}{t(doctor.name)}{t(", medic specialist chirurgie generală. Cred cu tărie că actul medical chirurgical nu se rezumă la sala de operație, ci începe prin ascultarea fără grabă a pacientului și înțelegerea fiecărui detaliu al suferinței sale.")}</p>
              <p className="leading-relaxed text-on-surface-variant">
                {t("Practica mea pune accentul pe procedurile laparoscopice moderne, cu traumă tisulară minimă, recuperare rapidă și reintegrare ușoară în viața de zi cu zi. În proctologie și patologia parietală aleg întotdeauna abordarea optimă, ghidată de ghidurile europene actuale.")}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: Ear, label: "Ascultare autentică" },
                { icon: Stethoscope, label: "Minim invaziv" },
                { icon: Eye, label: "Claritate decizională" },
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
              {t("Etapele clare ale consultației chirurgicale")}</h2>
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
                <p className="leading-relaxed text-on-surface-variant">{t(text)}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
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
            <h2 className="text-3xl text-primary md:text-[44px]">{t("Ghidul afecțiunilor chirurgicale")}</h2>
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
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-15" />
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
