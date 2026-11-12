import type { Locale } from "./i18n";

/**
 * Informare provizorie despre cum funcționează site-ul acum (formularul trimite prin EmailJS).
 * Trebuie înlocuită cu politica finală aprobată de operator (vezi ultima secțiune).
 */
export const privacyNotice = {
  ro: {
    title: "Confidențialitate și date personale",
    provisional: "Informare provizorie",
    intro: "Acest text explică modul în care funcționează în prezent formularul. Nu reprezintă politica finală a cabinetului; aceasta va fi completată cu datele operatorului.",
    sections: [
      {
        title: "Ce date poți introduce",
        text: "Formularul include numele, telefonul, emailul opțional, motivul consultației, preferința de programare și opțiunile selectate. Dacă alegi «Altceva», poți adăuga o descriere. Informațiile despre simptome pot constitui date privind sănătatea. Nu introduce CNP-ul, copii ale actelor de identitate sau dosare medicale în câmpul liber.",
      },
      {
        title: "Cum este trimisă solicitarea",
        text: "Când apeși «Sună-mă», datele din formular (numele, telefonul, emailul dacă l-ai completat, motivul consultației, preferința de programare, opțiunile selectate și descrierea) sunt trimise prin serviciul EmailJS către adresa de email a doamnei doctor, împreună cu limba și pagina de pe care ai trimis și data trimiterii. Ele sunt folosite pentru a te contacta telefonic în vederea programării. Trimiterea nu confirmă o programare; aceasta se stabilește telefonic. Până la trimitere, selecțiile și descrierea sunt păstrate doar temporar în memoria paginii, ca să fie aceleași în toate formularele, și nu sunt salvate în stocarea persistentă a browserului.",
      },
      {
        title: "Scopul formularului și alegerea ta",
        text: "Formularul este destinat solicitării unei consultații și contactării pacientului pentru stabilirea programării. Câmpurile opționale pot rămâne necompletate. Deschiderea acestei informări nu exprimă consimțământul; bifa de acord se selectează separat, prin propria ta acțiune.",
      },
      {
        title: "Servicii externe",
        text: "Solicitările din formular sunt transmise prin EmailJS, un serviciu de trimitere a emailurilor. Harta este furnizată de Google Maps. Butoanele WhatsApp deschid serviciul WhatsApp și pot pregăti un mesaj cu opțiunile selectate și descrierea introdusă; poți verifica și modifica mesajul înainte de a-l trimite. Aceste servicii pot prelucra date conform propriilor politici. Simptomele completate nu sunt incluse în adresele hărților.",
      },
      {
        title: "Drepturile tale",
        text: "În condițiile GDPR, poți avea dreptul la informare, acces, rectificare, ștergere, restricționarea prelucrării, portabilitate și opoziție, în funcție de temeiul și circumstanțele prelucrării. Când prelucrarea se bazează pe consimțământ, îl poți retrage fără a afecta prelucrarea anterioară retragerii. Poți depune o plângere la ANSPDCP.",
      },
      {
        title: "Ce va conține politica finală",
        text: "Politica finală va preciza identitatea și datele de contact ale operatorului, temeiurile prelucrării inclusiv pentru datele privind sănătatea, destinatarii, eventualele transferuri internaționale, termenele ori criteriile de păstrare și modalitatea de exercitare a drepturilor.",
      },
    ],
    regulation: "Citește regulamentul GDPR oficial",
    authority: "Autoritatea pentru protecția datelor — ANSPDCP",
    close: "Închide informarea",
  },
  en: {
    title: "Privacy and personal data",
    provisional: "Provisional notice",
    intro: "This notice explains how the form currently works. It is not the practice's final privacy policy; the controller's details will be added.",
    sections: [
      {
        title: "Information you can enter",
        text: "The form includes your name, phone number, optional email, consultation reason, appointment preference and selected concerns. If you choose Other, you can add a description. Information about symptoms may constitute health data. Do not enter national identification numbers, identity document copies or medical records in the free-text field.",
      },
      {
        title: "How your request is sent",
        text: "When you press Call me back, the form details (your name, phone number, email if provided, consultation reason, appointment preference, selected concerns and description) are sent through the EmailJS service to the doctor's email address, together with the language and page you sent it from and the date. They are used to call you and arrange an appointment. Sending the form does not confirm an appointment; it is arranged by phone. Until you send it, your selections and description are held only temporarily in page memory, so they stay the same across the forms, and are not saved in persistent browser storage.",
      },
      {
        title: "Purpose of the form and your choice",
        text: "The form is intended for requesting a consultation and contacting patients to arrange an appointment. Optional fields may be left blank. Opening this notice does not give consent; the consent checkbox is selected separately, through your own action.",
      },
      {
        title: "External services",
        text: "Form requests are sent through EmailJS, an email delivery service. The map is provided by Google Maps. WhatsApp buttons open WhatsApp and may prepare a message containing your selected concerns and description; you can review and edit it before sending. These services may process data under their own policies. Symptoms entered in the form are not included in map URLs.",
      },
      {
        title: "Your rights",
        text: "Under the GDPR, you may have rights to information, access, rectification, erasure, restriction, portability and objection, depending on the legal basis and circumstances. Where processing relies on consent, you may withdraw it without affecting the lawfulness of earlier processing. You can lodge a complaint with the Romanian supervisory authority, ANSPDCP.",
      },
      {
        title: "What the final policy will include",
        text: "The final policy will identify the controller and contact details, the legal bases including for health data, recipients, any international transfers, retention periods or criteria and how to exercise your rights.",
      },
    ],
    regulation: "Read the official GDPR regulation",
    authority: "Romanian data protection authority — ANSPDCP",
    close: "Close notice",
  },
} satisfies Record<Locale, { title: string; provisional: string; intro: string; sections: { title: string; text: string }[]; regulation: string; authority: string; close: string }>;
