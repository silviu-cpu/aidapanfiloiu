import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ScrollReveal";
import SectionFade from "@/components/site/SectionFade";
import { HomeHero, type HeroCopy } from "@/components/home/HomeHero";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/site/Footer";
import HomeSections from "@/components/site/HomeSections";
import { common, getLang, localePath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const hero: Record<Locale, HeroCopy> = {
  ro: {
    titleA: "Chirurgie generală.",
    titleB: "Expertiză, precizie și grijă pentru pacient.",
    lead: "Consultații de chirurgie generală și proctologie în București. Evaluare individualizată, opțiuni moderne de tratament și abordări chirurgicale minim invazive, laparoscopice și robotice, în cadrul echipelor multidisciplinare.",
    ctaPrimary: "Programează o consultație",
    ctaSecondary: "Vezi afecțiunile",
    doctorName: "Dr. Aida Gabriela Panfiloiu",
    doctorNote: "Peste 10 ani de practică în chirurgie generală",
    doctorPhoto: "/images/dr-aida-panfiloiu-cv.png",
    pills: ["Chirurgie generală", "Chirurgie minim invazivă", "Proctologie"],
    scroll: "Scroll",
    s2Eyebrow: "Chirurgie minim invazivă",
    s2Title: "Tehnici chirurgicale moderne. Abordare individualizată.",
    s2Text: "Chirurgie laparoscopică și participare la intervenții asistate robotic, în cadrul echipelor multidisciplinare. Fiecare abordare este aleasă în funcție de diagnostic, complexitatea cazului și particularitățile pacientului, cu atenție la siguranța și calitatea actului medical.",
    loading: "Se încarcă pagina",
  },
  en: {
    titleA: "General surgery.",
    titleB: "Expertise, precision and care for every patient.",
    lead: "General surgery and proctology consultations in Bucharest. Individualised assessment, modern treatment options and minimally invasive laparoscopic and robotic surgical approaches, within multidisciplinary teams.",
    ctaPrimary: "Book a consultation",
    ctaSecondary: "See conditions",
    doctorName: "Dr. Aida Gabriela Panfiloiu",
    doctorNote: "Over 10 years of practice in general surgery",
    doctorPhoto: "/images/dr-aida-panfiloiu-cv.png",
    pills: ["General surgery", "Minimally invasive surgery", "Proctology"],
    scroll: "Scroll",
    s2Eyebrow: "Minimally invasive surgery",
    s2Title: "Modern surgical techniques. An individualised approach.",
    s2Text: "Laparoscopic surgery and participation in robot-assisted procedures, within multidisciplinary teams. Each approach is chosen according to the diagnosis, the complexity of the case and the patient's particular circumstances, with attention to safety and the quality of care.",
    loading: "Loading page",
  },
};

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = await getLang(params);
  return pageMetadata({
    lang,
    path: "/",
    title: `${site.name} | ${common[lang].specialty}`,
    description: common[lang].description,
    absoluteTitle: true,
  });
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

      <SectionFade from="hero" to="surface-lowest" />
      <div className="site-page">
        <HomeSections lang={lang} />
      </div>
      {/* Apariția lină a secțiunilor; rulează după ce pagina e hidratată. */}
      <ScrollReveal />
      <Footer lang={lang} />
    </>
  );
}
