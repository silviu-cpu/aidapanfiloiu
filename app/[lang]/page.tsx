import type { Metadata } from "next";
import { HomeHero, type HeroCopy } from "@/components/home/HomeHero";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/site/Footer";
import HomeSections from "@/components/site/HomeSections";
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
    doctorNote: "Peste 10 ani de practică în chirurgie generală",
    doctorPhoto: "/images/dr-aida-panfiloiu-cv.png",
    pills: ["Chirurgie generală", "Laparoscopie", "Proctologie"],
    stampLines: ["Medic specialist", "Chirurgie generală"],
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
    doctorNote: "Over 10 years of practice in general surgery",
    doctorPhoto: "/images/dr-aida-panfiloiu-cv.png",
    pills: ["General surgery", "Laparoscopy", "Proctology"],
    stampLines: ["Specialist doctor", "General surgery"],
    scroll: "Scroll",
    s2Eyebrow: "Minimally invasive surgery",
    s2Title: "Every procedure, prepared to the millimetre.",
    s2Text: "Sterile instruments, modern laparoscopic techniques and a clear plan, explained in plain words before surgery.",
    loading: "Loading page",
  },
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
        conditionsHref={localePath(lang, "/servicii")}
      />

      <div className="site-page">
        <HomeSections />
      </div>
      <Footer />
    </>
  );
}
