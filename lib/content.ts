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

// Date de contact furnizate de utilizator din CV-ul doamnei doctor.
export const contact = {
  phoneDisplay: "+40 746 051 990",
  phoneHref: "tel:+40746051990",
  whatsappDisplay: "+40 746 051 990",
  whatsappHref: "https://wa.me/40746051990",
  email: "aida.panfiloiu@yahoo.com",
  languages: "Răspund în română, engleză și spaniolă.",
};

export const nav = [
  { href: "/", label: "Acasă" },
  { href: "/despre", label: "Despre mine" },
  { href: "/servicii", label: "Servicii" },
  { href: "/contact", label: "Contact" },
] as const;

// Fotografii reale ale doamnei doctor + imagini de context. Surse: docs/image-sources.md.
export const images = {
  doctor: "/images/dr-aida-panfiloiu.webp",
  doctorAbout: "/images/dr-aida-panfiloiu-about-sage.webp",
  // Fotografia din CV (250 × 250 px). TODO: varianta originală, la rezoluție mai mare.
  doctorCv: "/images/dr-aida-panfiloiu-cv.png",
  consultation: "/images/consultation.webp",
  operatingRoom: "/images/operating-room.webp",
  ultrasound: "/images/ultrasound.webp",
  patientSupport: "/images/patient-support.webp",
  medicalResearch: "/images/medical-research.webp",
  woundCare: "/images/wound-care.webp",
  hernia: "/images/hernia-abdominal-discomfort.webp",
  // Diagramă OpenStax (CC BY 4.0): trebuie menționată sursa pe site. Vezi docs/image-sources.md.
  gallbladderDiagram: "/images/gallbladder-diagram.png",
  // Diagramă primită de la proprietarul site-ului; sursa și licența trebuie confirmate.
  hemorrhoidsDiagram: "/images/hemorrhoids-diagram.webp",
  // Diagramă primită de la proprietarul site-ului; sursa și licența trebuie confirmate.
  analCanalDiagram: "/images/anal-canal-diagram.webp",
  // Imagine CT primită de la proprietarul site-ului; sursa, licența și conținutul trebuie confirmate.
  pelvisCt: "/images/pelvis-ct-scan.webp",
  // Ilustrație 3D a straturilor pielii, primită de la proprietarul site-ului; sursa și licența trebuie confirmate.
  skinLayers: "/images/skin-layers.webp",
};

export const featuredArticle = {
  url: "https://voceaendometriozei.ro/blogs/endopedia/hemoroizii-%C8%99i-endometrioza-cand-simptomele-se-suprapun-%C8%99i-de-ce-diagnosticul-corect-conteaza",
  title: "Hemoroizii și endometrioza: când simptomele se suprapun și de ce diagnosticul corect contează",
  description: "Cum se pot suprapune simptomele digestive și proctologice și de ce o evaluare atentă ajută la stabilirea diagnosticului corect.",
  image: "/images/endopedia-hemoroizi-endometrioza.jpg",
  imageAlt: "Ilustrație medicală despre hemoroizi și endometrioză",
};

export type Location = {
  id: string;
  name: string;
  area: string;
  services: string;
  tag: string;
  operates: boolean;
  address: string;
  mapQuery: string;
  openingHours: {
    label: string;
    rows: { days: string; hours: string }[];
    note?: string;
    sourceUrl: string;
    phone: string;
    phoneDisplay: string;
  };
};

export const locations: Location[] = [
  {
    id: "victoria",
    openingHours: {
      label: "Program clinică",
      rows: [
        { days: "Luni–Vineri", hours: "07:00–21:00" },
        { days: "Sâmbătă", hours: "08:00–13:00" },
        { days: "Duminică", hours: "Închis" },
      ],
      sourceUrl: "https://www.reteauamedicalavictoria.ro/contact/",
      phone: "tel:0219232", phoneDisplay: "021 9232",
    },
    address: "Bd. Regina Elisabeta nr. 57, Sector 5, București",
    mapQuery: "Victoria Medical Center, Bulevardul Regina Elisabeta 57, București",
    name: "Clinica Victoria",
    area: "Bd. Regina Elisabeta",
    services: "Consultații de chirurgie generală, cu bilet de trimitere.",
    tag: "Bilet de trimitere",
    operates: false,
  },
  {
    id: "titan",
    openingHours: {
      label: "Program clinică",
      rows: [{ days: "Luni–Vineri", hours: "07:00–21:00" }, { days: "Sâmbătă–Duminică", hours: "Închis" }],
      sourceUrl: "https://www.medlife.ro/imagistica-medlife/centre",
      phone: "tel:0213718117", phoneDisplay: "021 371 81 17",
    },
    address: "Bd. Liviu Rebreanu nr. 8, Sector 3, București",
    mapQuery: "Spitalul MedLife Titan, Bulevardul Liviu Rebreanu 8, București",
    name: "MedLife Titan",
    area: "București",
    services: "Consultații de chirurgie și proctologie, intervenții chirurgicale.",
    tag: "Consultații și intervenții",
    operates: true,
  },
  {
    id: "grivita",
    openingHours: {
      label: "Program clinică",
      rows: [{ days: "Luni–Vineri", hours: "07:00–21:00" }, { days: "Sâmbătă", hours: "07:00–14:00" }, { days: "Duminică", hours: "Închis" }],
      sourceUrl: "https://www.medlife.ro/imagistica-medlife/centre",
      phone: "tel:0219646", phoneDisplay: "021 9646",
    },
    address: "Calea Griviței nr. 359, Sector 1, București",
    mapQuery: "Hyperclinica MedLife Medical Park, Calea Griviței 359, București",
    name: "MedLife Grivița",
    area: "București",
    services: "Consultații de chirurgie și proctologie, intervenții chirurgicale.",
    tag: "Consultații și intervenții",
    operates: true,
  },
  {
    id: "royal",
    openingHours: {
      label: "Program ambulatoriu",
      rows: [{ days: "Luni–Vineri", hours: "08:00–20:00" }],
      note: "Consultațiile se fac pe bază de programare.",
      sourceUrl: "https://www.royalhospital.ro/contact/",
      phone: "tel:0219095", phoneDisplay: "021 9095",
    },
    address: "Splaiul Unirii nr. 313A, Sector 3, București",
    mapQuery: "Royal Hospital, Splaiul Unirii 313A, București",
    name: "Royal Hospital",
    area: "București",
    services: "Consultații de chirurgie și proctologie, intervenții chirurgicale.",
    tag: "Consultații și intervenții",
    operates: true,
  },
  {
    id: "plaga",
    openingHours: {
      label: "Program Policlinica Enayati Băneasa",
      rows: [{ days: "Luni–Vineri", hours: "08:00–20:00" }],
      note: "Cu excepția sărbătorilor legale. Programul cabinetului Doctor Plagă se confirmă la recepție.",
      sourceUrl: "https://enayatimedicalcity.ro/policlinica-baneasa/",
      phone: "tel:0374498197", phoneDisplay: "0374 498 197",
    },
    address: "Str. Ion Ionescu de la Brad nr. 5B, București",
    mapQuery: "Policlinica Enayati Băneasa, Ion Ionescu de la Brad 5B, București",
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
  symptoms: string;
  assessment: string;
  treatment: string;
  image: string;
  imageAlt: string;
  imageClassName?: string;
};

// TODO: textele medicale trebuie aprobate de doamna doctor.
export const conditions: Condition[] = [
  {
    id: "hernii",
    name: "Hernii inghinale și ombilicale",
    short: "O hernie apare când țesutul din abdomen trece printr-o zonă slăbită a peretelui abdominal, în regiunea inghinală sau în jurul ombilicului.",
    symptoms: "Poți observa o umflătură care devine mai evidentă la tuse sau efort, însoțită uneori de presiune, jenă ori durere. Dimensiunea ei se poate modifica atunci când stai întins.",
    assessment: "Consultația urmărește localizarea herniei, simptomele și impactul asupra activităților tale. Examenul clinic este de obicei esențial; dacă diagnosticul nu este clar, poate fi recomandată o ecografie.",
    treatment: "În funcție de tipul herniei și de simptome, discutăm monitorizarea sau repararea chirurgicală. Intervenția poate fi clasică ori laparoscopică, uneori cu plasă de întărire. Alegerea ține cont și de starea generală și de eventualele operații anterioare.",
    image: images.hernia,
    imageAlt: "Persoană care își ține mâinile pe abdomen, în dreptul ombilicului",
  },
  {
    id: "colecist",
    name: "Colecist (litiază biliară)",
    short: "Litiaza biliară înseamnă formarea unor calculi în vezica biliară. Aceștia pot fi descoperiți întâmplător sau pot provoca episoade dureroase și complicații.",
    symptoms: "Durerea apare frecvent sub coaste, în dreapta, sau în partea superioară a abdomenului și poate fi însoțită de greață ori vărsături. Unele episoade apar după masă și pot dura câteva ore.",
    assessment: "Discutăm despre episoadele de durere, investigațiile existente și bolile asociate. Ecografia abdominală și analizele de sânge ajută la identificarea calculilor și a eventualelor semne de inflamație sau blocaj biliar.",
    treatment: "Calculii fără simptome nu necesită întotdeauna operație. Când produc manifestări sau complicații, poate fi indicată îndepărtarea vezicii biliare, de obicei laparoscopic. Dacă există suspiciunea unor calculi pe căile biliare, pot fi necesare investigații și proceduri suplimentare.",
    image: images.gallbladderDiagram,
    imageAlt: "Diagramă anatomică a colecistului sub ficat, cu canalele biliare: cistic, hepatic comun și coledoc",
    // Diagrama are etichete pe margini: se afișează întreagă, pe fundal alb, fără decupare.
    imageClassName: "object-contain! bg-white p-2",
  },
  {
    id: "hemoroizi",
    name: "Hemoroizi",
    short: "Țesutul hemoroidal face parte din anatomia normală. Vorbim despre boală hemoroidală atunci când se mărește, prolabează sau provoacă simptome care îți afectează confortul.",
    symptoms: "Pot apărea sânge roșu la scaun, mâncărime, iritație sau o umflătură în zona anală. Durerea puternică poate avea și alte cauze; sângerarea nu trebuie atribuită automat hemoroizilor.",
    assessment: "Consultația proctologică include discuția despre simptome și tranzitul intestinal, examinarea locală și, dacă este indicată, anuscopia. În funcție de context, recomandăm investigații suplimentare pentru a exclude alte cauze ale sângerării.",
    treatment: "Planul poate începe cu reglarea tranzitului, adaptarea aportului de fibre și lichide și tratament pentru simptome. În funcție de stadiu și de răspuns, discutăm proceduri de cabinet sau intervenție chirurgicală. Operația nu este necesară în toate cazurile.",
    image: images.hemorrhoidsDiagram,
    imageAlt: "Diagramă în secțiune a canalului anal, cu hemoroizi interni, externi și prolabați",
    // Diagrama are etichete pe margini: se afișează întreagă, pe fundal alb, fără decupare.
    imageClassName: "object-contain! bg-white p-2",
  },
  {
    id: "fisuri",
    name: "Fisuri anale",
    short: "Fisura anală este o mică leziune la nivelul canalului anal, care poate apărea după eliminarea unui scaun tare sau după episoade repetate de diaree.",
    symptoms: "Se manifestă adesea prin durere ascuțită în timpul scaunului, care poate continua ulterior ca o arsură. Poți observa și o cantitate mică de sânge roșu pe hârtia igienică.",
    assessment: "Examinarea urmărește aspectul leziunii, durata simptomelor și posibilele cauze ale constipației sau diareei. Dacă fisura persistă, reapare ori are un aspect neobișnuit, pot fi necesare evaluări suplimentare.",
    treatment: "De obicei începem cu măsuri pentru un scaun mai ușor de eliminat și tratament local prescris. Dacă vindecarea întârzie, discutăm alte opțiuni, inclusiv proceduri sau chirurgie, după evaluarea beneficiilor și a riscurilor pentru controlul scaunului.",
    image: images.analCanalDiagram,
    imageAlt: "Diagramă anatomică a canalului anal, cu linia dentată și mușchii sfincterieni intern și extern",
    // Diagrama are etichete pe margini: se afișează întreagă, pe fundal alb, fără decupare.
    imageClassName: "object-contain! bg-white p-2",
  },
  {
    id: "fistule",
    name: "Fistule perianale și boală pilonidală",
    short: "Fistula perianală este un traiect între canalul anal și pielea din jur. Boala pilonidală este o afecțiune diferită, situată de obicei în șanțul dintre fese, spre coccis.",
    symptoms: "Pot apărea secreții repetate, iritație, durere sau o umflătură care revine. Un abces poate provoca durere intensă, roșeață și febră și necesită evaluare rapidă.",
    assessment: "Examinarea stabilește localizarea și orificiile de drenaj. Pentru o fistulă complexă pot fi indicate investigații imagistice, precum RMN-ul, pentru a înțelege relația traiectului cu mușchii care asigură continența.",
    treatment: "Un abces poate necesita drenaj. Fistulele perianale au frecvent indicație chirurgicală, cu tehnica aleasă pentru protejarea continenței. În boala pilonidală, tratamentul depinde de infecție și recidive; unele forme fără simptome pot fi urmărite.",
    image: images.pelvisCt,
    imageAlt: "Imagine CT în secțiune sagitală a pelvisului",
    // Imaginea e aproape pătrată: se afișează întreagă, pe fundal negru, fără decupare.
    imageClassName: "object-contain! bg-black",
  },
  {
    id: "plagi",
    name: "Plăgi de orice tip",
    short: "Îngrijirea unei plăgi pornește de la cauza ei: un traumatism, o intervenție sau o problemă care împiedică vindecarea. Pansamentul se alege în funcție de aspectul rănii și de evoluție.",
    symptoms: "O rană care rămâne deschisă, umezește repetat pansamentul sau devine mai dureroasă trebuie evaluată. Roșeața în extindere, umflarea, puroiul ori febra pot indica o infecție.",
    assessment: "Evaluăm dimensiunea și profunzimea plăgii, secrețiile și pielea din jur. În rănile persistente, căutăm și cauza vindecării lente; pot fi necesare investigații suplimentare și colaborarea cu alte specialități.",
    treatment: "Planul poate include curățarea rănii, îndepărtarea țesutului neviabil când este indicată, pansamente adaptate și controale regulate. Antibioticele nu sunt necesare pentru orice plagă. Primești indicații pentru îngrijirea acasă și pentru situațiile în care trebuie să revii mai repede.",
    image: images.skinLayers,
    imageAlt: "Ilustrație 3D a straturilor pielii: epiderm, derm și hipoderm",
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
  description: string;
  consult: string;
  surgery: string;
};

export const triage: TriageOption[] = [
  {
    id: "hernie",
    label: "Hernie",
    title: "Hernie",
    description: "Umflătură în zona inghinală sau la ombilic, care apare mai ales la efort.",
    consult: "Clinica Victoria, MedLife, Royal Hospital",
    surgery: "MedLife, Royal Hospital",
  },
  {
    id: "colecist",
    label: "Colecist",
    title: "Colecist (litiază biliară)",
    description: "Discutăm simptomele abdominale, investigațiile făcute și recomandările primite pentru vezica biliară.",
    consult: "Clinica Victoria, MedLife, Royal Hospital",
    surgery: "MedLife, Royal Hospital",
  },
  {
    id: "procto",
    label: "Hemoroizi, fisuri, fistule",
    title: "Hemoroizi, fisuri, fistule",
    description: "Durere la scaun, urme de sânge, mâncărime sau secreții în zona anală.",
    consult: "MedLife Titan, MedLife Grivița, Royal Hospital",
    surgery: "MedLife, Royal Hospital",
  },
  {
    id: "plagi",
    label: "Plăgi",
    title: "Tratamentul plăgilor",
    description: "Plăgi acute, postoperatorii sau greu vindecabile.",
    consult: "Clinica Dr. Plagă, Enayati Băneasa",
    surgery: "Clinica Dr. Plagă",
  },
  {
    id: "altceva",
    label: "Altceva",
    title: "Alte simptome sau a doua opinie",
    description: "Un simptom care nu apare în listă, un control după intervenție sau o a doua opinie.",
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

// TODO: recenzii DE EXEMPLU (placeholder). Înainte de publicare trebuie înlocuite cu recenzii
// reale, folosite cu acordul pacienților. Recenziile inventate pe site-ul unui medic pot fi
// considerate publicitate înșelătoare.
export const testimonials = [
  {
    text: "Am venit cu frică de operație și am plecat de la prima consultație liniștit. Doamna doctor mi-a explicat totul pe înțeles, mi-a arătat opțiunile și nu m-a grăbit deloc. Intervenția a fost laparoscopică și după câteva zile eram din nou pe picioare.",
    author: "Mihaela D.",
    role: "Pacientă",
  },
  {
    text: "Am amânat ani de zile consultul pentru o problemă proctologică, de rușine. Totul a fost discret și firesc, iar tratamentul a funcționat mai bine decât speram.",
    author: "Andrei P.",
    role: "Pacient",
  },
  {
    text: "Pentru hernie mi se spusese că recuperarea durează mult. Am fost operată dimineața, seara mergeam pe hol, iar după o săptămână mă întorsesem la birou.",
    author: "Elena M.",
    role: "Pacientă",
  },
  {
    text: "Mi-a plăcut că a avut răbdare cu toate întrebările mele, chiar și cu cele repetate. Am primit un plan clar, pe hârtie, și un număr la care să sun dacă apare ceva.",
    author: "Cristian V.",
    role: "Pacient",
  },
  {
    text: "Plaga mamei nu se vindeca de luni de zile. Cu pansamentele potrivite și controale regulate, s-a închis în câteva săptămâni. Le suntem recunoscători.",
    author: "Ioana R.",
    role: "Aparținătoare",
  },
];
