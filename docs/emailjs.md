# Formularul de programare (EmailJS)

Formularul „Vrei să te sun eu?” (`components/site/CallbackForm.tsx`) trimite cererea direct din browser, prin [EmailJS](https://www.emailjs.com/).

## Variabile de mediu

Aceleași trei variabile, cu exact aceste nume, în `.env.local` (local) și în setările de producție (de exemplu Vercel → Project → Settings → Environment Variables):

| Variabilă | De unde o iei din EmailJS |
| --- | --- |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Email Services → ID-ul serviciului (ex. `service_abc123`) |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Email Templates → ID-ul șablonului (ex. `template_abc123`) |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Account → General → Public Key |

Variabilele `NEXT_PUBLIC_` sunt incluse în pagină la build, deci după ce le adaugi sau le schimbi în producție trebuie refăcut deploy-ul. Cheia publică EmailJS e gândită să fie vizibilă; nu pune aici Private Key.

Dacă lipsește oricare dintre ele, formularul nu trimite nimic și îi arată pacientului numărul de telefon.

## Șablonul de email

Formularul trimite acești parametri; în șablon se folosesc ca `{{dr_aida_nume}}`, `{{dr_aida_telefon}}` etc. Prefixul `dr_aida_` le deosebește de variabilele altor site-uri din același cont EmailJS:

| Parametru | Conținut |
| --- | --- |
| `dr_aida_nume` | Numele complet |
| `dr_aida_telefon` | Numărul de telefon |
| `dr_aida_email` | Emailul pacientului sau „—” |
| `dr_aida_reply_to` | Emailul pacientului (gol dacă nu l-a dat) — pune `{{dr_aida_reply_to}}` la Reply To |
| `dr_aida_motiv` | Tipul consultației, în română |
| `dr_aida_preferinta` | Ziua sau intervalul preferat, sau „—” |
| `dr_aida_afectiuni` | Afecțiunile bifate (ex. „Hernie, Colecist”), sau „—” |
| `dr_aida_mesaj` | Textul de la „Altceva”, sau „—” |
| `dr_aida_limba` | `ro` sau `en` — versiunea site-ului |
| `dr_aida_pagina` | Adresa paginii de pe care s-a trimis |
| `dr_aida_data` | Data și ora trimiterii (ora României) |

Exemplu de conținut pentru șablon:

```
Cerere nouă de programare

Nume: {{dr_aida_nume}}
Telefon: {{dr_aida_telefon}}
Email: {{dr_aida_email}}
Motiv: {{dr_aida_motiv}}
Afecțiuni: {{dr_aida_afectiuni}}
Detalii: {{dr_aida_mesaj}}
Preferință: {{dr_aida_preferinta}}

Trimis pe {{dr_aida_data}} de pe {{dr_aida_pagina}} ({{dr_aida_limba}})
```

Subiect sugerat: `Programare: {{dr_aida_nume}} – {{dr_aida_motiv}}`.

## Securitate

Cheia publică se vede în pagină. Ca să nu poată fi folosită de pe alt site, verifică în EmailJS → Account → Security dacă poți limita trimiterea la domeniul site-ului, și pune o limită de trimiteri (rate limit) dacă e disponibilă.
