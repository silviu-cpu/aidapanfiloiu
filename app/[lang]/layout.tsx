import { LocaleProvider } from "@/components/LocaleProvider";
import { SymptomProvider } from "@/components/site/SymptomPicker";
import { PrivacyProvider } from "@/components/site/PrivacyModal";
import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { common, hasLocale, locales, ogLocale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { shareImage } from "@/lib/seo";
import { structuredDataJson } from "@/lib/structured-data";
import { AppointmentProvider } from "@/components/site/AppointmentModal";
import { ScrollToTop } from "@/components/ScrollToTop";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
});

// Fontul serif al site-ului (titluri). Înlocuiește Playfair, ca să existe un singur serif.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = common[lang];
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} | ${t.specialty}`,
      template: `%s | ${site.name}`,
    },
    description: t.description,
    icons: {
      icon: [
        { url: "/brand/logo.svg", type: "image/svg+xml", sizes: "any" },
        { url: "/brand/icon-96.png", type: "image/png", sizes: "96x96" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      type: "website",
      locale: ogLocale[lang],
      siteName: site.name,
      title: `${site.name} | ${t.specialty}`,
      description: t.description,
      images: [shareImage(lang)],
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} | ${t.specialty}`,
      description: t.description,
      images: [shareImage(lang).url],
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = common[lang];

  return (
    // data-scroll-behavior: din Next 16, fără el scroll-ul lin ar păstra poziția paginii vechi la navigare.
    <html lang={lang} data-scroll-behavior="smooth" className={`${jakarta.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#continut"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          {t.skip}
        </a>
        <ScrollToTop />
        {/* Date structurate (schema.org) pentru Google și asistenții AI: medic, servicii, locații, programare. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredDataJson(lang) }} />
        <main id="continut" className="w-full flex-1">
          <LocaleProvider lang={lang}>
            <SymptomProvider>
              <PrivacyProvider>
                <AppointmentProvider>{children}</AppointmentProvider>
              </PrivacyProvider>
            </SymptomProvider>
          </LocaleProvider>
        </main>
      </body>
    </html>
  );
}
