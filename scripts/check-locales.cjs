const assert = require('node:assert/strict');
const fs = require('node:fs');
const english = require('../lib/en.json');

const pages = [
  ['', 'General surgery.', 'Chirurgie generală.'],
  ['/despre', 'Education and qualifications', 'Studii și competențe'],
  ['/servicii', 'Conditions treated', 'Afecțiuni tratate'],
  ['/contact', 'Full name', 'Nume complet'],
];

for (const lang of ['ro', 'en']) {
  for (const [route, en, ro] of pages) {
    const html = fs.readFileSync(`.next/server/app/${lang}${route}.html`, 'utf8');
    // Ignore RSC payloads: they may contain Romanian source data for client components.
    const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
    const text = markup.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    assert(html.includes(`<html lang="${lang}"`), `${lang}${route}: document language`);
    assert(text.includes(lang === 'en' ? en : ro), `${lang}${route}: translated page content`);
    assert(text.includes(lang === 'en' ? 'Book a consultation' : 'Programează o consultație'), `${lang}${route}: modal title`);
    if (lang === 'en') {
      for (const [source, translation] of Object.entries(english)) {
        if (source.length >= 14 && source !== translation && /[ăâîșț]/.test(source)) {
          assert(!text.includes(source), `en${route}: untranslated copy: ${source}`);
        }
      }
      for (const match of markup.matchAll(/<a\b([^>]*)>/g)) {
        const attrs = match[1];
        const href = attrs.match(/href="([^"]*)"/)?.[1];
        if (href?.startsWith('/') && !attrs.includes('lang="ro"')) {
          assert(/^\/en(?:\/|$)/.test(href), `en${route}: link leaves English: ${href}`);
        }
      }
    }
    console.log(`PASS ${lang}${route || '/'}: copy, language${lang === 'en' ? ', internal links' : ''}`);
  }
}
