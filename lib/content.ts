/**
 * Toate datele site-ului într-un singur loc.
 * Valorile marcate cu TODO trebuie completate sau confirmate de Dr. Panfiloiu
 * înainte de publicare.
 */

export const doctor = {
  name: "Dr. Aida Gabriela Panfiloiu",
  shortName: "Dr. Aida Panfiloiu",
  title: "Medic specialist chirurgie generală",
  city: "București",
  quote:
    "Chirurgia modernă înseamnă rigoare chirurgicală și tehnologii minim invazive, dar mai ales respect și timp acordat fiecărui pacient pentru a lua decizii în deplină siguranță.",
};

// TODO: numerele și emailul oficiale, confirmate de doamna doctor.
export const contact = {
  phoneDisplay: "07xx xxx xxx",
  phoneHref: "tel:+40700000000",
  whatsappDisplay: "07xx xxx xxx",
  whatsappHref: "https://wa.me/40700000000",
  email: "email@de-completat.ro",
  languages: "Răspund în română, engleză și spaniolă.",
};

export const nav = [
  { href: "/", label: "Acasă" },
  { href: "/despre", label: "Despre mine" },
  { href: "/servicii", label: "Servicii" },
  { href: "/contact", label: "Contact" },
] as const;

// Imagini: exportă-le din Google Stitch și pune-le în /public/images cu numele de mai jos.
// Imaginile site-ului, în /public/images (exportate din Google Stitch + fotografia doamnei doctor).
export const images = {
  doctor: "/images/dr-aida-panfiloiu.webp",
  // Fotografia din CV (250 × 250 px). TODO: varianta originală, la rezoluție mai mare.
  doctorCv: "/images/dr-aida-panfiloiu-cv.png",
  laparoscopic: "/images/laparoscopic.jpg",
  laparoscopicDevices: "/images/instrument-tray.jpg",
  scalpel: "/images/forceps.jpg",
  suture: "/images/suture.jpg",
  consultationRoom: "/images/consultation-room.jpg",
  conditionHernia: "/images/laparoscopic.jpg",
  conditionGallbladder: "/images/instrument-tray.jpg",
  conditionHemorrhoids: "/images/consultation-room.jpg",
};

export type Location = {
  id: string;
  name: string;
  area: string;
  services: string;
  tag: string;
  operates: boolean;
};

export const locations: Location[] = [
  {
    id: "victoria",
    name: "Clinica Victoria",
    area: "Bd. Regina Elisabeta",
    services: "Consultații de chirurgie generală, cu bilet de trimitere.",
    tag: "Bilet de trimitere",
    operates: false,
  },
  {
    id: "titan",
    name: "MedLife Titan",
    area: "București",
    services: "Consultații de chirurgie și proctologie, intervenții chirurgicale.",
    tag: "Consultații și intervenții",
    operates: true,
  },
  {
    id: "grivita",
    name: "MedLife Grivița",
    area: "București",
    services: "Consultații de chirurgie și proctologie, intervenții chirurgicale.",
    tag: "Consultații și intervenții",
    operates: true,
  },
  {
    id: "royal",
    name: "Royal Hospital",
    area: "București",
    services: "Consultații de chirurgie și proctologie, intervenții chirurgicale.",
    tag: "Consultații și intervenții",
    operates: true,
  },
  {
    id: "plaga",
    name: "Clinica Dr. Plagă",
    area: "Enayati Băneasa",
    services: "Tratamentul plăgilor acute, postoperatorii și greu vindecabile.",
    tag: "Doar plăgi",
    operates: false,
  },
];

export const surgeryNote = "Intervențiile chirurgicale se fac la MedLife și Royal Hospital.";

export type Condition = {
  id: string;
  name: string;
  short: string;
  treatment: string;
  places: string[];
  image: string;
};

// TODO: textele medicale trebuie aprobate de doamna doctor.
export const conditions: Condition[] = [
  {
    id: "hernii",
    name: "Hernii inghinale și ombilicale",
    short: "Umflătură în zona inghinală sau la ombilic, care apare mai ales la efort.",
    treatment: "De regulă intervenție laparoscopică, cu plasă de întărire.",
    places: ["Clinica Victoria", "MedLife", "Royal Hospital"],
    image: images.conditionHernia,
  },
  {
    id: "colecist",
    name: "Colecist (litiază biliară)",
    short: "Calculi în vezica biliară, care pot provoca dureri și inflamație.",
    treatment: "Colecistectomie laparoscopică.",
    places: ["Clinica Victoria", "MedLife", "Royal Hospital"],
    image: images.conditionGallbladder,
  },
  {
    id: "hemoroizi",
    name: "Hemoroizi",
    short: "Sângerare la scaun, disconfort sau mâncărime în zona anală.",
    treatment: "De la tratament conservator la intervenție, în funcție de stadiu.",
    places: ["MedLife Titan", "MedLife Grivița", "Royal Hospital"],
    image: images.conditionHemorrhoids,
  },
  {
    id: "fisuri",
    name: "Fisuri anale",
    short: "O mică ruptură a mucoasei anale, cu durere intensă la scaun.",
    treatment: "Inițial tratament conservator, intervenție dacă fisura nu se vindecă.",
    places: ["MedLife Titan", "MedLife Grivița", "Royal Hospital"],
    image: images.scalpel,
  },
  {
    id: "fistule",
    name: "Fistule perianale și pilonidale",
    short: "Traiecte anormale sub piele, apărute de obicei după o infecție sau un abces.",
    treatment: "Intervenție chirurgicală adaptată fiecărui caz.",
    places: ["MedLife Titan", "MedLife Grivița", "Royal Hospital"],
    image: images.laparoscopicDevices,
  },
  {
    id: "plagi",
    name: "Plăgi de orice tip",
    short: "Plăgi acute, postoperatorii sau greu vindecabile.",
    treatment: "Curățare, pansamente moderne și monitorizare până la vindecare.",
    places: ["Clinica Dr. Plagă"],
    image: images.suture,
  },
];

export type ServiceGroup = "consultatii" | "interventii" | "ingrijire";

export type Service = {
  num: string;
  symbol: string;
  name: string;
  group: ServiceGroup;
  description: string;
  forWhat: string;
  where: string;
};

// TODO: de confirmat cu doamna doctor mica chirurgie, chirurgia oncologică și a doua opinie.
export const services: Service[] = [
  {
    num: "01",
    symbol: "Cg",
    name: "Consultație de chirurgie generală",
    group: "consultatii",
    description: "Evaluare, diagnostic și plan de tratament.",
    forWhat: "hernii, colecist, afecțiuni abdominale",
    where: "Clinica Victoria, MedLife, Royal Hospital",
  },
  {
    num: "02",
    symbol: "Cp",
    name: "Consultație de proctologie",
    group: "consultatii",
    description: "Examen proctologic și anuscopie.",
    forWhat: "hemoroizi, fisuri, fistule",
    where: "MedLife Titan, MedLife Grivița, Royal Hospital",
  },
  {
    num: "03",
    symbol: "Ao",
    name: "A doua opinie",
    group: "consultatii",
    description: "Analiza unui diagnostic sau a unei recomandări de operație.",
    forWhat: "orice afecțiune chirurgicală",
    where: "toate locațiile",
  },
  {
    num: "04",
    symbol: "Lp",
    name: "Chirurgie laparoscopică",
    group: "interventii",
    description: "Intervenții prin câteva incizii mici, cu revenire mai rapidă.",
    forWhat: "hernii, colecist",
    where: "MedLife, Royal Hospital",
  },
  {
    num: "05",
    symbol: "Cc",
    name: "Chirurgie clasică",
    group: "interventii",
    description: "Atunci când situația o cere.",
    forWhat: "cazuri complexe",
    where: "MedLife, Royal Hospital",
  },
  {
    num: "06",
    symbol: "Pc",
    name: "Proctologie chirurgicală",
    group: "interventii",
    description: "Tratament chirurgical adaptat stadiului bolii.",
    forWhat: "hemoroizi, fisuri, fistule",
    where: "MedLife, Royal Hospital",
  },
  {
    num: "07",
    symbol: "Co",
    name: "Chirurgie oncologică",
    group: "interventii",
    description: "Evaluare și tratament, cu decizie luată în echipă.",
    forWhat: "formațiuni abdominale",
    where: "MedLife, Royal Hospital",
  },
  {
    num: "08",
    symbol: "Mc",
    name: "Mică chirurgie",
    group: "interventii",
    description: "Intervenții scurte, ambulatorii.",
    forWhat: "chisturi, lipoame, abcese, unghie încarnată",
    where: "de confirmat la programare",
  },
  {
    num: "09",
    symbol: "Tp",
    name: "Tratamentul plăgilor",
    group: "ingrijire",
    description: "Curățare, pansamente moderne și monitorizare.",
    forWhat: "plăgi acute, postoperatorii, greu vindecabile",
    where: "Clinica Dr. Plagă",
  },
  {
    num: "10",
    symbol: "Up",
    name: "Urmărire postoperatorie",
    group: "ingrijire",
    description: "Controale și îngrijire până la vindecare.",
    forWhat: "după orice intervenție",
    where: "locația unde ai fost operat",
  },
];

export const serviceGroups: Record<ServiceGroup, string> = {
  consultatii: "Consultații",
  interventii: "Intervenții",
  ingrijire: "Îngrijire",
};

export type TriageOption = {
  id: string;
  label: string;
  title: string;
  consult: string;
  surgery: string;
};

export const triage: TriageOption[] = [
  {
    id: "hernie",
    label: "Hernie",
    title: "Hernie",
    consult: "Clinica Victoria, MedLife, Royal Hospital",
    surgery: "MedLife, Royal Hospital",
  },
  {
    id: "colecist",
    label: "Colecist",
    title: "Colecist (litiază biliară)",
    consult: "Clinica Victoria, MedLife, Royal Hospital",
    surgery: "MedLife, Royal Hospital",
  },
  {
    id: "procto",
    label: "Hemoroizi, fisuri, fistule",
    title: "Hemoroizi, fisuri, fistule",
    consult: "MedLife Titan, MedLife Grivița, Royal Hospital",
    surgery: "MedLife, Royal Hospital",
  },
  {
    id: "plagi",
    label: "Plăgi",
    title: "Tratamentul plăgilor",
    consult: "Clinica Dr. Plagă, Enayati Băneasa",
    surgery: "Clinica Dr. Plagă",
  },
  {
    id: "altceva",
    label: "Altceva",
    title: "Alte simptome sau a doua opinie",
    consult: "Clinica Victoria, MedLife, Royal Hospital",
    surgery: "Se stabilește la consultație",
  },
];

export const disclaimer = "Informațiile au rol informativ și nu înlocuiesc consultația medicală.";

export type Investigation = {
  name: string;
  shows: string;
  when: string;
  prep: string;
};

// TODO: coloana „Cum te pregătești” trebuie confirmată de doamna doctor.
export const investigations: Investigation[] = [
  {
    name: "Ecografie abdominală",
    shows: "Ficatul, vezica biliară, rinichii și alte organe abdominale.",
    when: "La suspiciune de calculi biliari sau dureri abdominale.",
    prep: "De regulă, vii nemâncat cu câteva ore înainte.",
  },
  {
    name: "Ecografie de perete abdominal",
    shows: "Peretele abdominal și eventualele hernii.",
    when: "La suspiciune de hernie inghinală sau ombilicală.",
    prep: "De obicei nu e nevoie de pregătire specială.",
  },
  {
    name: "Analize de sânge",
    shows: "Starea generală, inflamația și funcția ficatului.",
    when: "Înaintea oricărei intervenții și la evaluarea inițială.",
    prep: "De regulă dimineața, nemâncat.",
  },
  {
    name: "Examen proctologic",
    shows: "Zona anală și rectul.",
    when: "La hemoroizi, fisuri sau fistule.",
    prep: "Primești indicațiile la programare.",
  },
  {
    name: "Anuscopie",
    shows: "Interiorul canalului anal.",
    when: "La sângerare, durere sau disconfort anal.",
    prep: "Primești indicațiile la programare.",
  },
  {
    name: "Colonoscopie",
    shows: "Interiorul colonului.",
    when: "La sângerare sau modificări de tranzit, la recomandare.",
    prep: "Dietă și pregătire intestinală, după indicațiile medicului.",
  },
  {
    name: "CT sau RMN",
    shows: "Imagini detaliate, în cazurile complexe.",
    when: "La fistule complexe sau formațiuni abdominale.",
    prep: "După indicațiile centrului de imagistică.",
  },
];

// TODO: recenzie DE EXEMPLU din designul Stitch. Înainte de publicare trebuie înlocuită cu o
// recenzie reală, folosită cu acordul pacientului. O recenzie inventată pe site-ul unui medic
// poate fi considerată publicitate înșelătoare.
export const testimonial = {
  text: "Am venit cu frică de operație și am plecat de la prima consultație liniștit. Doamna doctor mi-a explicat totul pe înțeles, mi-a arătat opțiunile și nu m-a grăbit deloc. Intervenția a fost laparoscopică și după câteva zile eram din nou pe picioare.",
  author: "Mihaela D.",
  role: "Pacientă",
};
