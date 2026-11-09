import type { MetadataRoute } from "next";
import { localePath } from "@/lib/i18n";
import { site } from "@/lib/site";

// Se adaugă aici fiecare pagină nouă (fără prefix de limbă).
const pages = ["/", "/despre", "/servicii", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: `${site.url}${localePath("ro", path)}`,
    alternates: {
      languages: {
        ro: `${site.url}${localePath("ro", path)}`,
        en: `${site.url}${localePath("en", path)}`,
      },
    },
  }));
}
