# Palm Springs by Nakheel — Landing Page (Dubai Rapid Properties)

A single-file lead-generation landing page (`index.html`) for the Palm Springs pre-launch campaign. It has no build step or dependencies.

## Configuration
Edit the `CONFIG` block at the bottom of `index.html`:

| Key | What it does |
|---|---|
| `whatsapp` | WhatsApp number, digits only (currently `971585273791`) |
| `phone` | Office telephone (currently `+971 4 529 4904`) |
| `email` / `office` | Contact email and office address shown in the contact section |
| `agency` | Brokerage name in the footer |
| `formEndpoint` | Optional URL that receives leads as JSON POST (Formspree, Make, Zapier, Google Apps Script) |
| `openWhatsAppOnSubmit` | Also opens WhatsApp with the lead details after submit |

Add your RERA / ORN number to the footer if required, plus Meta Pixel / Google Tag snippets in `<head>`. The form already fires `fbq('track','Lead')` and `gtag('event','generate_lead')` if those are present.

UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) are captured into the form automatically.

## Deploy
Upload `index.html` to any static host (GitHub Pages, Netlify, Vercel, cPanel).

## Images
`images/` holds every image the page uses.
- `ps-*.webp`: representative Palm Springs renders, supplied by a partner (dnkre.com).
- `lounge.webp`, `bedroom.webp`: Unsplash photos (Unsplash License).
- `drp-logo-white.png`, `drp-logo-dark.png`, `favicon.png`: Dubai Rapid Properties branding.

When Nakheel releases official renders, replace these files and keep the same names. The page already labels all imagery as representative.
