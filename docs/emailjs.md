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

Formularul trimite acești parametri; în șablon se folosesc ca `{{nume}}`, `{{telefon}}` etc.:

| Parametru | Conținut |
| --- | --- |
| `nume` | Numele complet |
| `telefon` | Numărul de telefon |
| `email` | Emailul pacientului sau „—” |
| `reply_to` | Emailul pacientului (gol dacă nu l-a dat) — pune `{{reply_to}}` la Reply To |
| `motiv` | Tipul consultației, în română |
| `preferinta` | Ziua sau intervalul preferat, sau „—” |
| `afectiuni` | Afecțiunile bifate (ex. „Hernie, Colecist”), sau „—” |
| `mesaj` | Textul de la „Altceva”, sau „—” |
| `limba` | `ro` sau `en` — versiunea site-ului |
| `pagina` | Adresa paginii de pe care s-a trimis |
| `data` | Data și ora trimiterii (ora României) |

Exemplu de conținut pentru șablon:

```
Cerere nouă de programare

Nume: {{nume}}
Telefon: {{telefon}}
Email: {{email}}
Motiv: {{motiv}}
Afecțiuni: {{afectiuni}}
Detalii: {{mesaj}}
Preferință: {{preferinta}}

Trimis pe {{data}} de pe {{pagina}} ({{limba}})
```

Subiect sugerat: `Programare: {{nume}} – {{motiv}}`.

## Securitate

Cheia publică se vede în pagină. Ca să nu poată fi folosită de pe alt site, verifică în EmailJS → Account → Security dacă poți limita trimiterea la domeniul site-ului, și pune o limită de trimiteri (rate limit) dacă e disponibilă.
