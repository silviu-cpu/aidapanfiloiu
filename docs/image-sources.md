# Site photography

Selected and visually reviewed on 9 November 2026. These stock photographs illustrate care, assessment and medical equipment. They do not depict Dr. Panfiloiu, her patients or her practice locations. The existing genuine portraits of Dr. Panfiloiu are retained.

All six stock photographs are from Pexels. [Pexels License](https://www.pexels.com/legal-pages/license/) permits website use and modification; attribution is appreciated but not required. Preserve this provenance when replacing or re-exporting the files.

| Local file | Photographer | Original source | Use |
| --- | --- | --- | --- |
| `public/images/consultation.webp` | MART PRODUCTION | [Doctor Conducts Medical Consultation with Patient](https://www.pexels.com/photo/hands-doctor-health-anonymous-7088834/) | Services introduction, consultation card and callback section |
| `public/images/operating-room.webp` | Marlon Castor | [Modern Operating Room](https://www.pexels.com/photo/modern-operating-room-18112241/) | Laparoscopy section and gallbladder surgery card |
| `public/images/ultrasound.webp` | MART PRODUCTION | [Modern Ultrasound Machine in a Clinical Room](https://www.pexels.com/photo/technology-computer-health-hospital-7089029/) | Hernia assessment card |
| `public/images/patient-support.webp` | Towfiqu barbhuiya | [Person holding a Senior Adult](https://www.pexels.com/photo/person-holding-a-senior-adult-11030158/) | Patient support card and contact introduction |
| `public/images/medical-research.webp` | Thirdman | [A Medical Person Using a Laptop for Research](https://www.pexels.com/photo/a-medical-person-using-a-laptop-for-research-5327916/) | About page and treatment planning card |
| `public/images/wound-care.webp` | cottonbro studio | [A Person Getting his Hand Bandaged](https://www.pexels.com/photo/a-person-getting-his-hand-bandaged-5721552/) | Wound care card |

Downloaded from each photo's Pexels image CDN at 1600px width, encoded locally as WebP at quality 84. No generated imagery, visible wounds, blood, anatomical close-ups or recognisable staff faces are used. Contextual photos describe the consultation or care, rather than purporting to show a specific diagnosis. Alt text is supplied in Romanian and English.

`node scripts/fetch-site-photos.cjs` downloads missing selected files; existing files are preserved. It requires network access. The earlier placeholder JPEGs remain on disk but are no longer referenced by the site.
