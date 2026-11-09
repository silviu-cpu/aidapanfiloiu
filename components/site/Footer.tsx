import { translator } from "@/lib/translate";
import { localePath, type Locale } from "@/lib/i18n";
import Link from "next/link";
import { contact, disclaimer, doctor } from "@/lib/content";

// Structura footer-ului din designul Stitch, fără afirmațiile neverificate (aviz CMR, cod parafă).
const specialties = [
  "Chirurgie laparoscopică",
  "Patologie parietală și hernii",
  "Proctologie",
  "Chirurgie oncologică",
  "Tratamentul plăgilor",
];

const navigation = [
  { href: "/despre", label: "Despre mine" },
  { href: "/servicii", label: "Ghidul afecțiunilor" },
  { href: "/servicii", label: "Tipuri de consultații" },
  { href: "/contact", label: "Locații și spitale partenere" },
  { href: "/contact", label: "Contact și programări" },
];

export default function Footer({ lang }: { lang: Locale }) {
  const t = translator(lang);
  return (
    <footer className="w-full border-t border-surface-high bg-surface-lowest">
      <div className="container-x pb-8 pt-14">
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <span className="text-lg font-semibold text-on-surface">{t(doctor.name)}</span>
            <p className="max-w-sm text-sm leading-relaxed text-on-surface-variant">
              {t(doctor.title)}{t(". Diagnostic chirurgical minim invaziv, protocoale clinice moderne și recuperare optimizată la standarde europene.")}</p>
            <ul className="flex flex-col gap-1 text-sm text-on-surface-variant">
              <li>
                <a href={contact.phoneHref} className="hover:text-primary">
                  {t("Telefon:")}{" "}{t(contact.phoneDisplay)}
                </a>
              </li>
              <li>
                <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  {t("WhatsApp:")}{" "}{t(contact.whatsappDisplay)}
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-3">
            <span className="text-sm font-semibold text-on-surface">{t("Specialitate")}</span>
            <ul className="flex flex-col gap-2">
              {specialties.map((s) => (
                <li key={s} className="text-sm text-on-surface-variant">
                  {t(s)}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-3">
            <span className="text-sm font-semibold text-on-surface">{t("Navigare și cabinet")}</span>
            <ul className="flex flex-col gap-2">
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link href={localePath(lang, item.href)} className="text-sm text-on-surface-variant transition-colors hover:text-primary">
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-2">
            <span className="text-sm font-semibold text-on-surface">{t("Legal")}</span>
            {/* TODO: pagini reale pentru termeni și politica de confidențialitate (GDPR). */}
            <ul className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <li>
                <Link href={localePath(lang, "/contact")} className="hover:text-primary">
                  {t("Termeni și condiții")}</Link>
              </li>
              <li>
                <Link href={localePath(lang, "/contact")} className="hover:text-primary">
                  {t("Confidențialitate (GDPR)")}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-surface-low/60 px-4 py-3 text-xs text-on-surface-variant md:flex-row md:items-center">
          <span>© 2026 {t(doctor.name)}{t(". Toate drepturile rezervate.")}</span>
          <span>{t(disclaimer)}</span>
        </div>
      </div>
    </footer>
  );
}
