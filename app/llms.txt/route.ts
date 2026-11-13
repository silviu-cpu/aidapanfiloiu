import { conditions, contact, disclaimer, doctor, locations, services, surgeryNote } from "@/lib/content";
import { localePath } from "@/lib/i18n";
import { site } from "@/lib/site";
import { endopediaProfile } from "@/lib/structured-data";

/*
 * /llms.txt: rezumatul site-ului pentru asistenții AI (formatul propus pe llmstxt.org).
 * E construit din același conținut ca paginile, deci rămâne la zi singur.
 * Nu folosește nimic dinamic, așa că Next.js îl generează o singură dată, la build.
 */
const url = (path: string, lang: "ro" | "en" = "ro") => `${site.url}${localePath(lang, path)}`;

export function GET() {
  const lines = [
    `# ${doctor.name}`,
    "",
    `> ${doctor.title}, ${doctor.city}. Consultații de chirurgie generală și proctologie, chirurgie laparoscopică și clasică, participare la intervenții asistate robotic în echipe multidisciplinare și îngrijirea plăgilor acute, cronice și postoperatorii.`,
    "",
    "Site-ul este în limba română; versiunea în engleză are prefixul /en.",
    "",
    "## Pagini",
    "",
    `- [Acasă](${url("/")}): prezentare, cum decurge consultația, afecțiuni tratate, recenzii, întrebări frecvente`,
    `- [Despre mine](${url("/despre")}): pregătire, experiență profesională, studii, congrese`,
    `- [Servicii](${url("/servicii")}): serviciile oferite, afecțiuni, investigații, pregătirea pentru operație`,
    `- [Contact](${url("/contact")}): locații, program, formular de programare`,
    `- [English version](${url("/", "en")})`,
    "",
    "## Programare",
    "",
    `- Telefon: ${contact.phoneDisplay}`,
    `- WhatsApp: ${contact.whatsappHref}`,
    `- Email: ${contact.email}`,
    `- Formular online („Programează o consultație”): ${url("/contact")}. Cererea ajunge pe email, iar programarea se confirmă telefonic.`,
    "",
    "## Servicii",
    "",
    ...services.map((s) => `- ${s.name}: ${s.description} Pentru: ${s.forWhat}. Unde: ${s.where}.`),
    "",
    "## Afecțiuni evaluate și tratate",
    "",
    ...conditions.map((c) => `- ${c.name}`),
    "",
    "## Locații",
    "",
    surgeryNote,
    "",
    ...locations.map((l) => {
      const hours = l.openingHours.rows.map((r) => `${r.days} ${r.hours}`).join(", ");
      return `- ${l.name}, ${l.address}. ${l.services} ${l.openingHours.label}: ${hours}. Telefon: ${l.openingHours.phoneDisplay}.${l.openingHours.note ? ` ${l.openingHours.note}` : ""}`;
    }),
    "",
    "## Opțional",
    "",
    `- [Profil de autor ENDOpedia](${endopediaProfile})`,
    "",
    `Notă: ${disclaimer} În caz de urgență medicală sunați la 112.`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
