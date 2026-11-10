# Conditions gallery

Expanded on 10 November 2026. The six condition cards explain the condition, symptoms, assessment and possible treatment in Romanian and English. Content is paraphrased for patients. Treatments are conditional; no named medication, dose, guaranteed outcome or recovery deadline is given. Clinic lists have been removed from these cards.

| Card | Primary patient-information sources |
| --- | --- |
| Inguinal and umbilical hernias | [NHS: hernia](https://www.nhs.uk/conditions/hernia/), [NHS: inguinal hernia repair](https://www.nhs.uk/tests-and-treatments/inguinal-hernia-repair/), [NIDDK: inguinal hernia](https://www.niddk.nih.gov/health-information/digestive-diseases/inguinal-hernia) |
| Gallstones | [NHS: gallstones](https://www.nhs.uk/conditions/gallstones/), [NIDDK: gallstones](https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones) |
| Haemorrhoids | [NHS: piles](https://www.nhs.uk/conditions/piles-haemorrhoids/), [ASCRS: haemorrhoids expanded information](https://fascrs.org/Web/Patients/Diseases-and-Conditions/A-Z/Hemorrhoids-Expanded-Information.aspx) |
| Anal fissures | [NHS: anal fissure](https://www.nhs.uk/conditions/anal-fissure/), [ASCRS: anal fissure expanded information](https://fascrs.org/Web/Patients/Diseases-and-Conditions/A-Z/Anal-Fissure-Expanded-Information.aspx) |
| Perianal fistulas and pilonidal disease | [NHS: anal fistula](https://www.nhs.uk/conditions/anal-fistula/), [NHS: pilonidal sinus](https://www.nhs.uk/conditions/pilonidal-sinus/), [ASCRS: abscess and fistula](https://fascrs.org/Web/Patients/Diseases-and-Conditions/A-Z/Abscess-and-Fistula-Expanded-Information.aspx) |
| Wounds | [NHS: cuts and grazes](https://www.nhs.uk/conditions/cuts-and-grazes/), [NHS: venous leg ulcer diagnosis](https://www.nhs.uk/conditions/leg-ulcer/diagnosis/), [NHS: venous leg ulcer treatment](https://www.nhs.uk/conditions/leg-ulcer/treatment/) |

Perianal fistulas and pilonidal disease are explicitly distinguished. Rectal bleeding is not automatically attributed to haemorrhoids. Conservative management and observation are described where appropriate, alongside possible procedures. The existing separate emergency section remains available on the Services page.

## Layout and navigation

Cards grow naturally with their translated content, with a minimum height of 860px. The horizontal scroll effect is pinned only when the measured heading and tallest card fit inside the viewport with room for the navbar. Otherwise the page scrolls normally in the vertical direction and the cards remain horizontally browsable with touch, scrollbar or navigation buttons. Reduced motion disables pinning and animated navigation. Booking buttons continue to use the shared appointment modal.

The existing Tailwind loader is also applied to `app/globals.css` in Webpack builds, so that the production verification uses the same compiled utilities as the site's default Turbopack pipeline. `scripts/check-conditions-browser.cjs` checks actual browser layout at desktop, mobile and tall viewport sizes, reduced motion, navigation and the booking modal. Use localhost for this local verification; requests to 127.0.0.1 can be rewritten to localhost by Next and cause a local redirect loop.
