import { conditions, contact, doctor, images, locations, services } from "./content";
import { localePath, type Locale } from "./i18n";
import { site } from "./site";
import { translate } from "./translate";

/** Profilul de autor de pe ENDOpedia, legat și de pe pagina Despre mine. */
export const endopediaProfile = "https://voceaendometriozei.ro/pages/autori/dr-aida-gabriela-panfiloiu";

const abs = (path: string) => `${site.url}${path}`;

/**
 * Datele structurate (schema.org) ale site-ului: cine e medicul, ce servicii oferă, unde
 * consultă și cum se face programarea. Le citesc Google și asistenții AI care navighează
 * pe site, fără să depindă de așezarea vizuală a paginii.
 * Toate valorile vin din conținutul site-ului (lib/content.ts), nu sunt scrise separat.
 */
export function structuredData(lang: Locale) {
  const t = (text: string) => translate(lang, text);
  const physicianId = abs("/#medic");

  const clinics = locations.map((l) => ({
    "@type": l.operates ? "Hospital" : "MedicalClinic",
    name: l.name,
    address: { "@type": "PostalAddress", streetAddress: l.address, addressLocality: "București", addressCountry: "RO" },
    telephone: l.openingHours.phoneDisplay,
    description: t(l.services),
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": abs("/#site"),
        url: abs(localePath(lang, "/")),
        name: site.name,
        inLanguage: lang,
        publisher: { "@id": physicianId },
      },
      {
        "@type": "Physician",
        "@id": physicianId,
        name: doctor.name,
        url: abs(localePath(lang, "/despre")),
        image: abs(images.doctorAbout),
        description: t(doctor.title),
        medicalSpecialty: "https://schema.org/Surgical",
        telephone: contact.phoneDisplay,
        email: contact.email,
        areaServed: { "@type": "City", name: t(doctor.city) },
        sameAs: [endopediaProfile],
        hospitalAffiliation: clinics.filter((c) => c["@type"] === "Hospital"),
        location: clinics,
        availableService: services.map((s) => ({
          "@type": "MedicalProcedure",
          name: t(s.name),
          description: t(s.description),
        })),
        knowsAbout: conditions.map((c) => t(c.name)),
        potentialAction: {
          "@type": "ReserveAction",
          target: abs(localePath(lang, "/contact")),
          name: t("Programează o consultație"),
        },
      },
    ],
  };
}

/** JSON-ul de mai sus, sigur de pus într-un <script> (fără „</script>” în texte). */
export function structuredDataJson(lang: Locale) {
  return JSON.stringify(structuredData(lang)).replace(/</g, "\\u003c");
}
