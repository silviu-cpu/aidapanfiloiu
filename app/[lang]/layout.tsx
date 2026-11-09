import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { common, hasLocale, locales, ogLocale } from "@/lib/i18n";
import { site } from "@/lib/site";
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
      default: `${site.name} — ${t.tagline}`,
      template: `%s | ${site.name}`,
    },
    description: t.description,
    openGraph: {
      type: "website",
      locale: ogLocale[lang],
      siteName: site.name,
      title: site.name,
      description: t.description,
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
        <main id="continut" className="w-full flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
