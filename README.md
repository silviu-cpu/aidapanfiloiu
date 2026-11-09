# aidapanfiloiu

Site Next.js 16 + React 19 + TypeScript + Tailwind CSS 4, bilingv (română fără prefix, engleză sub `/en`).

## Pornire

```bash
npm install
npm run dev
```

Site-ul pornește la http://localhost:3000. Pentru varianta de producție: `npm run build`, apoi `npm start`.

## Structură

- `app/[lang]/` – paginile, câte una pentru fiecare limbă
- `proxy.ts` – servește româna fără prefix și engleza sub `/en`
- `lib/i18n.ts` – limbile și textele comune
- `lib/site.ts` – numele și adresa site-ului
- `app/globals.css` – culorile și fonturile (Tailwind 4, fără PostCSS)
